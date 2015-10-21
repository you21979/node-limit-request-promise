"use strict";
var LimitDataBase = require('./limit_data_base');
var rp = require('request-promise');
var Promise = require('bluebird');

var isUndefined = function(p){
    if(p === undefined || p === null) return true;
    return false;
}

var LimitRequestPromise = module.exports = function(max, sec){
    this.database = new LimitDataBase();
    this.waitcount = 0;
    this.stop = false;
    this.default = {
        max: isUndefined(max) ? 10 : max,
        sec: isUndefined(sec) ? 1 : sec,
    }
}
LimitRequestPromise.prototype.setup = function(lists){
    var self = this;
    lists.forEach(function(w){
        self.database.update(w.host, w.max, w.sec);
    });
}
LimitRequestPromise.prototype.req = function(param){
    var url = '';
    switch(typeof param){
    case 'string': url = param; break;
    case 'object': url = param.url ? param.url : param.uri ? param.uri : '' ; break;
    }
    if(!this.database.isLookup(url)){
        this.database.update(url, this.default.max, this.default.sec);
    }
    var w = this.database.lookup(url);
    if(w.check()){
        return rp(param).promise();
    }else{
        this.waitcount++;
        var self = this;
        return Promise.
            delay(w.sec * 1000).
            then(function(){
                self.waitcount--;
                if(self.stop) throw new Error('stop flag is true');
                return self.req(param)
            });
    }
}
