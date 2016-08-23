define(["modules",'../lib/hyxt'],function(modules){
	var config = ["$httpProvider", function ($httpProvider) {
	    $httpProvider.defaults.cache = false;
	    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	    /**
	    $httpProvider.defaults.transformResponse.push(function (data,header,state) {
	    	debugger
	    	if(state == 200 && data.hasOwnProperty("result") && !hyxt.commonErrorHandler(data)){
	    		return null;
	    	}else if(state != 200){
	    		alert("网络有问题，请稍后再试...");
	    	}
	    	return data;
	    });
	    **/
	  var interceptor = ['$q', '$cacheFactory', '$timeout', '$rootScope', '$log','$location', function ($q, $cacheFactory, $timeout, $rootScope, $log,$location) {


      return {
        'request': function(config) {
           return config;
        },

        'response': function(response) {
        	var ret = response.data;
            //angular请求的html页面
            if (typeof ret == "string")
                return response;
            //后台返回的json
            //1登录成功，返回信息--101没有登录，需要登录
            if (ret.result == 101) {
                $location.path('/login');
                return $q.reject(response);
            } else if (ret.result == 100) {
                hyxt.error(ret.msg || '系统异常，请联系管理员喔');
                //alert(ret.msg || '系统异常，请联系管理员喔');
                return response;
            } else {
                return response;
            }
        },

        'responseError': function(rejection) {
            hyxt.error('网络有问题，请稍后再试.');
        	//alert("网络有问题，请稍后再试.");
          return $q.reject(rejection);
        }
      };
    }];
    
    $httpProvider.interceptors.push(interceptor);
	}];
	

	modules.config(config);
	modules.service('xxService',['$http','$httpParamSerializerJQLike',function($http,$httpParamSerializerJQLike){
		this.getAddressList = function(){
			$http.post("xx1",$httpParamSerializerJQLike({a:1}));
		};
	}]);
   return modules;
});
