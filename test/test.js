var LimitRequestPromise = require('..');
var lr = new LimitRequestPromise(2,5);
//var lr = new LimitRequestPromise();
lr.setup([
{
    host:'http://www.example.com',max:1,sec:1
}
]);
var done = function(w){return function(){console.log(w,'done',lr.waitcount)}}
var list = ['http://www.yahoo.co.jp', 'http://www.google.co.jp'];
list.forEach(function(v){
    lr.req(v).then(done(v));
    lr.req(v).then(done(v));
    lr.req(v).then(done(v));
    lr.req(v).then(done(v));
    lr.req(v).then(done(v));
})

