"use strict";
var rp = require('request-promise');
var sleep = require('@you21979/promise-sleep');
var LimitDataBase = require('./limit_data_base');

var isUndefined = function(p){
    if(p === undefined || p === null) return true;
    return false;
}

var nextReq = function(self, limit, param){
    self.waitcount++;
    return sleep(limit.sec * 1000).
        then(function(){
            self.waitcount--;
            if(self.stop) throw new Error('stop flag is true');
            return self.req(param)
        });
}

var requestParameterGetUrl = function(param){
    var url = '';
    switch(typeof param){
    case 'string': url = param; break;
    case 'object': url = param.url ? param.url : param.uri ? param.uri : '' ; break;
    }
    return url;
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

LimitRequestPromise.prototype.lookup = function(url){
    if(!this.database.isLookup(url)){
        this.database.update(url, this.default.max, this.default.sec);
    }
    return this.database.lookup(url);
}

LimitRequestPromise.prototype.req = function(param){
    var limit = this.lookup(requestParameterGetUrl(param))
    if( limit.check() ){
        return rp(param)
    }else{
        return nextReq(this, limit, param)
    }
}

