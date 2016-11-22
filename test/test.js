var assert = require("assert");
var task =require('promise-util-task');
var LimitRequestPromise = require('..');

describe("simple", function() {
    it("test", function(done) {
        this.timeout(5000);
        var lr = new LimitRequestPromise(1, 1);
        var urls = [
            'http://www.yahoo.co.jp',
            'http://www.yahoo.co.jp',
            'http://www.yahoo.co.jp',
            'http://www.yahoo.co.jp'
        ]
        var tasklist = urls.map(function(v){ return function(){ return lr.req(v) } })
        task.all(tasklist).then(function(){
            done()
        }).catch(function(e){
            done(e)
        })
    });
});
