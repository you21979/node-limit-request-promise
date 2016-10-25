var assert = require("assert");
var LimitRequestPromise = require('..');

describe("simple", function() {
    it("test", function(done) {
        var lr = new LimitRequestPromise(1, 1);
        lr.req('http://www.yahoo.co.jp').then(function(res){
            return lr.req('http://www.yahoo.co.jp').then(function(res){
                done()
            })
        }).catch(function(e){
            done(e)
        })
    });
});
