$(document).ready(function() {
	var $bg = $('.bg-front');
	var $wHeight = $(window).height();
	$bg.height($wHeight); 
	$bg.addClass('full-screen');
	var $src = $('.bg-front img').attr('src');
	$bg.css({'background-image': 'url(' + $src + ')'})

	$(window).on('resize', function (){
		$wHeight = $(window).height();
		$bg.height($wHeight);
	});

    // Select all links with hashes
    $('a[href*="#"]')
  // Remove links that don't actually link to anything
  	.not('[href="#"]')
	.not('[href="#0"]')
	.not('[href="#msg"]')
    .not($('#donation-info a'))
	.click(function(event) {
    // On-page links
		if (
	    	location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
	    	&& 
	    	location.hostname == this.hostname
	    	) {
	      // Figure out element to scroll to
		  	var target = $(this.hash);
		  	target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
		      // Does a scroll target exist?
		    if (target.length) {
		        // Only prevent default if animation is actually gonna happen
		        event.preventDefault();
		        $('html, body').animate({
		        	scrollTop: target.offset().top
		        }, 1000, function() {
			        // Callback after animation
			        // Must change focus!
			        var $target = $(target);
			        $target.focus();
			        if ($target.is(":focus")) { // Checking if the target was focused
		          		return false;
		        	} else {
			            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
			            $target.focus(); // Set focus again
		        	};
		    	});
	    	}
		}
	});
	// var msg = $('[data-remodal-id=success], [data-remodal-id=error]');
	// if (msg.length != 0) {
	// 	msg.remodal({}).open();
	// }

	var width, height, canvas, ctx, points, target, animateHeader = true;

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        canvas = document.getElementById('main-canvas');
        // ignore if no canvas
        if (canvas === null) return;

        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var pvx = Math.round( Math.random() * 2) - 1.5;
				var pvy = Math.round( Math.random() * 2) - 1.5;
                var p = {x: px, originX: px, y: py, originY: py, vx: pvx, vy: pvy};
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }

        initAnimation();
        addListeners();
    }

    function mouseMove(e) {
    	console.log("mousemove");
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
    	console.log("scroll");
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
    	console.log("resize");
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
        	$(window).on('mousemove', mouseMove);
            // window.addEventListener('mousemove', mouseMove);
        }
        $(window).on('scroll', scrollCheck);
        $(window).on('resize', resize);
        // window.addEventListener('scroll', scrollCheck);
        // window.addEventListener('resize', resize);
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 2000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 3000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
    	setTimeout(function() {
	    	p.x += p.vx;
	    	p.y += p.vy;
	    	if (p.x > width) p.vx = -p.vx;
	    	if (p.x < 0) p.vx = -p.vx;
	    	if (p.y > height) p.vy = -p.vy;
	    	if (p.y < 0) p.vy = -p.vy;
            // update close
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if (!placed) {
                            if (p.closest[k] == p2) placed = true;
                        }
                    }
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p, p2) < getDistance(p, p.closest[k])) {
                                p.closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            // updated
	    	shiftPoint(p);
    	}, 0);
        // TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
        //     y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
        //     onComplete: function() {
        //         shiftPoint(p);
        //     }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

    // Main
    initHeader();
});