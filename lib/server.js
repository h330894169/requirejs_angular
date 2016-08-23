/**
 *server 服务
 * @author lihua 
 *
 */
module.exports = plugin;
var browserSync = require('browser-sync').create();
var httpProxy = require('http-proxy');  
var proxy = httpProxy.createProxyServer({}); 
var node_path = require('path');
var url = require('url');
var utils = require('./utils');
function plugin(options) {
	
var isReady = false;
var startPath = "/index.html";
var proxyUrl = options.dataSource?"http://m.seeapp.com/index.php/":"http://see-devcdn.seecsee.com/";
var cookie = {};
var timer = null;
// 捕获异常  
proxy.on('error', function (err, req, res) {  
  res.writeHead(500, {  
    'Content-Type': 'text/plain'  
  });  
  res.end('Something went wrong. And we are reporting a custom error message.');  
}); 

proxy.on('proxyReq', function(proxyReq, req, res, options) {
	//console.log(res.getHeader["set-cookie"]);  
	if(cookie){
	  //proxyReq.setHeader('cookie', cookie[res.getHeader["set-cookie"]]);
	  proxyReq.setHeader('cookie', cookie);
	}
});

proxy.on('proxyRes', function(proxyRes, req, res, options) {
	var proxyCookie = proxyRes.headers["set-cookie"];
	if(proxyCookie){
		
		//cookie[req.headers["cookie"]] = proxyCookie;
		cookie  = proxyCookie;
		//console.log(req)
	}
	//res.setHeader("Set-Cookie", [proxyRes.headers["set-cookie"]]);
});

var path = {
	dev:["src/**"],
	svn:[".svn/**","../static/.svn"]
}
console.log("server watch path is:" + path.dev)


browserSync.init({
     server: {
        baseDir: [options.is_dev?"./src":"./",'bower_components'],
        routes: {
	        "/": "",
	        "/bower_components": "bower_components"
	    },
	    middleware: function (req, res, next) {
            next();
            /**
	        if(url.parse(req.url).pathname.indexOf(".")==-1){
	        	 proxy.web(req, res, { target: proxyUrl });  
	        }else{
		        next();
	        }**/
	    }
    },
    open: "external",
    files:path.dev,
    browser:"chrome",
    startPath: startPath
});
browserSync.watch(path.dev).on("ready",function(){
	isReady = true;
	console.log("server is ready........")
})
browserSync.watch(path.dev).on("change",function(path){
	if(isReady){
		if(options.watchCallBack){
			options.watchCallBack(path);
		}
	}
})
browserSync.watch(path.dev).on("add",function(path){
	if(isReady){
		if(options.watchCallBack){
			options.watchCallBack(path);
		}
		browserSync.reload();
	}
})
var svnChange = function(file_path){
}
browserSync.watch(path.svn).on("change",svnChange)
browserSync.watch(path.svn).on("add",svnChange)

}





/**
var connect = require('connect')
var http = require('http')

var app = connect()

// store session state in browser cookie
var cookieSession = require('cookie-session')
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
 
app.use(function (req, res, next) {
  // Update views 
  req.session.views = (req.session.views || 0) + 1
 
  // Write response 
  res.end(req.session.views + ' views')
})
// respond to all requests
app.use(function(req, res){
  res.end('Hello from Connect!\n');
})
//create node.js http server and listen on port
http.createServer(app).listen(3001)
**/

