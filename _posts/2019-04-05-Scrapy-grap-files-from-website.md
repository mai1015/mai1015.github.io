---
layout: post
title: Scrapy grap files from website
category: Notes
tags: [Crawler, Scrapy]
comments: true
---
I am trying to download some material from my course website. However, there are a lot of files in the server. I do not want to download file one by one. So, I try to write a script that can help me download all the files at once.

I found [scrapy](https://scrapy.org/). It is a crawler framework that can extract data from website.

First of all, install `scrapy` from source. In my case, I use `conda` instead of `pip`. It is simlar fo pip but I can setup different envirnment with `conda`. Installtion command is `conda install -c conda-forge scrapy`.

After install we can follow this [guide](http://doc.scrapy.org/en/latest/intro/install.html). First, I create the project with `scrapy startproject yorku` that creates an sample configurated scrapy project.
It looks like
```
scrapy/
   ├── yorku/
   │    ├── __init__.py
   │    ├── items.py
   │    ├── middlewares.py
   │    ├── pipelines.py
   │    ├── settings.py
   │    └── spiders/
   │        └── __init__.py
   └── scrapy.cfg
```

It contains only basic file for setting up `spider`, we can generate `spider` with command `scrapy genspider <name> <domain name>`. I typed in `scrapy genspider wikieecs wiki.eecs.yorku.ca` that generates the spider that starts like this.

```py
import scrapy
import re
import os
from scrapy.utils.python import to_native_str

class WikieecsSpider(scrapy.Spider):

    name = 'wikieecs'
    allowed_domains = ['wiki.eecs.yorku.ca']
    start_urls = ['http://wiki.eecs.yorku.ca/']

    def parse(self, response):
        pass
```

We can write logic to seek the links to the file. So, it will start access the `starts_urls`. When it finish loading the page, it will pass the page in the `response` object to parse function. So, we can extract the link of the files from the page. It can be done easily with build in `css seceltor` or `xpath`.

```py
response.css('a::attr(href)') # select all the link with url.
```

It returns an array of object. Then we can use loop to see all the links and select the files.

```py
for url in response.css('a::attr(href)'):
    link = url.extract() # get the link from element
    if link.endswith(".pdf"): # if it is an pdf
        yield response.follow(link, self.save_file) # instrcut scrapy to download the file
```

So this function will generate a new array that conatains all the function. If you want to download multiple file with different ext. i.e. docx, pptx. You can type all stuff in to an array like this.

```py
ext = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.txt', '.v', '.c', '.tar', '.tar.gz', '.zip']
link.endswith(tuple(ext)) # if it ends with any of the ext
```

So you can download specified list of files. Then we need to generate a new callback `save_file` to save the file.

```py
def save_file(self, response):
    filename = response.url.split("/")[-1] # assume the last path of url is the name
    with open(filename, 'wb') as f: # open a new file
        f.write(response.body)      # write content downloaded
    self.logger.info('Save file %s', filename) # display the file downloaded
```

However, our school website require us to login in order to download. And it uses [basic access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication). So we need to generate a new header `Authorization` if it require us to login. Scrapy support this with `HttpAuthMiddleware` by defaut, we just need to spcify this with `http_user` and `http_pass` in the spider.

```py
# improt omitted
class WikieecsSpider(scrapy.Spider):
    http_user = 'xxxx'
    http_pass = 'xxxx'

    # other definition and functions
```

Then you will have a working spider. The final code will look like.

```py
import scrapy
import re
import os
from scrapy.utils.python import to_native_str

class WikieecsSpider(scrapy.Spider):
    http_user = 'xxxx'
    http_pass = 'xxxx'

    name = 'wikieecs'
    allowed_domains = ['wiki.eecs.yorku.ca', 'www.eecs.yorku.ca']
    start_urls = ['https://wiki.eecs.yorku.ca/course_archive/2018-19/W/2011/assignments:start']
    
    ext = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.txt', '.v', '.c', '.tar', '.tar.gz', '.zip']

    def parse(self, response):
        for url in response.css('a::attr(href)'):
            link = url.extract()

            if link.endswith(tuple(self.ext)):
                yield response.follow(link, self.save_file)
    
    def save_file(self, response):
        filename = response.url.split("/")[-1]
        with open(filename, 'wb') as f:
            f.write(response.body)
        self.logger.info('Save file %s', filename)
```

We just need put all the url in to the `start_urls` and it will start to scan the files and try to download it.