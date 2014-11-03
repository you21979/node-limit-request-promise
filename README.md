node-limit-request-promise
==========================
http request for web scraping

note
----
This library implements based on request-promise

example
-------

```
var LimitRequestPromise = require('limit-request-promise');
var lp = new LimitRequestPromise(1,1); // option = default limit
// register database
lr.setup([
{
    host:'http://www.example.com',max:1000,sec:60
}
]);
lp.req('http://www.yahoo.co.jp').then(console.log); // immediately
lp.req('http://www.yahoo.co.jp').then(console.log); // next timing
lp.req({url:'http://www.google.com'}).then(console.log); // immediately 
lp.req({url:'http://www.google.com'}).then(console.log); // next timing
```

license
-------
MIT

