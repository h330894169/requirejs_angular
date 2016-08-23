(function(window){
	var console = console || {};
	console.log = console.log || function(){}

	if (!Function.prototype.bind) {
		Function.prototype.bind = function(oThis) {
			if ( typeof this !== "function") {
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}
			var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
			}, fBound = function() {
				return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
			};
			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();
			return fBound;
		};
	}
})(this.window)

// seajs 的简单配置
var prefix = "%requireUrl%"?"../../":"../";
require.config({
	baseUrl:"js",
    paths:{
        //一些库文件
        'jquery': prefix+'bower_components/jquery/dist/jquery',
        'angular': prefix+'bower_components/angular/angular.min',
        'uiRoute': prefix+'bower_components/angular-ui-router/release/angular-ui-router',
        'domReady': prefix+'bower_components/domReady/domReady',
        'ocLazyLoad': prefix+'bower_components/oclazyload/dist/ocLazyLoad.require',
        'bootstrap': prefix+'bower_components/bootstrap/dist/js/bootstrap.min',
        'ngAnimate': prefix+'bower_components/angular-animate/angular-animate.min',
        'loadingBar': prefix+'bower_components/angular-loading-bar/build/loading-bar',
        'gritter': prefix+'bower_components/jquery.gritter/js/jquery.gritter.min',
        'UIBootstrap': prefix+'bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
        'angularTouch': prefix+'bower_components/angular-touch/angular-touch.min',
        //js文件
        'app': "app",
        'router': "router"
    },
    map: {
      '*': {
        'css': prefix+'bower_components/require-css/css.min'
      } 
    },
    shim:{
    	'gritter':{
            deps:['jquery'/**,'css!'+prefix+'bower_components/jquery.gritter/css/jquery.gritter.css'**/]
        },
        'UIBootstrap':{
            deps:['bootstrap','angular','css!'+prefix+'bower_components/angular-bootstrap/ui-bootstrap-csp.css']
        },
        'angular':{
            exports:'angular'
        },
        ocLazyLoad:{
        	deps:['angular']
        },
        bootstrap:{
        	deps:['jquery']
        },
        loadingBar:{
        	deps:['angular']
        },
        layout:{
        	deps:['jquery']
        },
        'ngAnimate':{
        	deps:['angular']
        },
        'uiRoute':{
            deps:['angular','ngAnimate']
        }
    },
    deps:['jquery','angular'],
    urlArgs: "v=" + 2 //防止读取缓存，调试用
});

define("main",['jquery','layout','bootstrap','lib/hyxt','ocLazyLoad','loadingBar',
        'angular',
        'uiRoute',
        'jquery',
        'UIBootstrap'
       ],function(){
            'use strict';
            require(['domReady!','app','router'],function(document){
            	console.log(2)
                angular.bootstrap(document,['webapp']);
            });
        });
