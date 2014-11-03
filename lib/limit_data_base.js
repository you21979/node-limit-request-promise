"use strict";
var createLimitter = require('request-limitter');
var url = require('url');

var getHostname = function(urlstr){
    var p = url.parse(urlstr);
    return p.hostname;
}

var LimitDataBase = module.exports = function(){
    this.hosts = {};
    this.default = {
        max: 0,
        sec: 0,
        check: function(){return true;},
    };
}

LimitDataBase.prototype.update = function(url, max, waittime){
    this.hosts[ getHostname(url) ] = {
        max : max,
        sec : waittime,
        check : createLimitter(max, waittime),
    };
}

LimitDataBase.prototype.isLookup = function(url){
    var name = getHostname(url);
    if(name in this.hosts) return true;
    return false;
}

LimitDataBase.prototype.lookup = function(url){
    var name = getHostname(url);
    if(name in this.hosts) return this.hosts[name];
    return this.default;
}

