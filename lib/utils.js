'use strict';
var colors = require('colors');
var http = require('http');
var node_url = require('url');
colors.setTheme({  
    silly: 'rainbow',  
    input: 'grey',  
    verbose: 'cyan',  
    prompt: 'red',  
    info: 'green',  
    data: 'blue',  
    help: 'cyan',  
    warn: 'yellow',  
    debug: 'magenta',  
    error: 'red'  
});  
var sendHttp = function(url,param,type){
	var $url = node_url.parse(url);
	var p_str = "";
	if(param){
		for(var key in param){
			p_str = key + "=" + param[key] + "&";
		}
		p_str = p_str.substring(0,p_str.length -1);
	}
	var options = {  
	    hostname: $url.hostname,  
	    port: $url.port,  
	    path: $url.pathname + "?" + p_str,  
	    method: type?type:'GET'  
	};  
	  
	var req = http.request(options, function (res) {  
	    //console.log(url,'-->HEADERS: ' + JSON.stringify(res.headers));  
	    res.setEncoding('utf8');  
	    res.on('data', function (chunk) {  
	        console.log(url + '-->BODY: ' + chunk);  
	    });  
	}); 
	req.on('error', function (e) {  
	    console.log('problem with request: ' + e.message);  
	}); 
	req.end(); 
}
module.exports = {
  colors: colors,
  sendHttp:sendHttp
};
