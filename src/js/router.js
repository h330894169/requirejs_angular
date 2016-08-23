define(['app'],function(app){
	app.config(['cfpLoadingBarProvider',function(cfpLoadingBarProvider) {
	    // true is the default, but I left this here as an example:
	    cfpLoadingBarProvider.includeSpinner = false;
	    //cfpLoadingBarProvider.start()
	 }]);
	
	var lazyDeferred;
	function resovleDep(param,tpl,module){
        var resolves = {
            loadMyCtrl: ['$ocLazyLoad', '$templateCache', '$q', function($ocLazyLoad,$templateCache,$q) {
                lazyDeferred = $q.defer();
                return $ocLazyLoad.load({
                    name : module,
                    cache: true,
                    files: param.files
                }).then(function() {
                	console.log($templateCache.get(tpl));
                    lazyDeferred.resolve($templateCache.get(tpl));
                });
            }]
        };
        return resolves;
    };
	
	
	return app.run([
	        '$rootScope',
	        '$state',
	        '$stateParams',
	        function ($rootScope, $state, $stateParams) {
	            $rootScope.$state = $state;
	            $rootScope.$stateParams = $stateParams;
	        }
	     ]).config(['$ocLazyLoadProvider',function($ocLazyLoadProvider){
        $ocLazyLoadProvider.config({
            loadedModules: ['webapp'],//主模块名,和ng.bootstrap(document, [‘monitorApp‘])相同
            jsLoader: requirejs, //使用requirejs去加载文件
            debug: true
        });
   }]).config(["$stateProvider", "$urlRouterProvider", "$locationProvider", "$uiViewScrollProvider",function($stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider){
	    //用于改变state时跳至顶部
	    $uiViewScrollProvider.useAnchorScroll();
        $locationProvider.html5Mode({
            enabled:false,
            requireBase:false
        });

	    // 默认进入先重定向
	    $urlRouterProvider.otherwise('/home');
	    $stateProvider
	    .state('home',{
	        //abstract: true,
	        url:'/home',
	        views: {
	            '': {
	            	templateUrl:"html/demo1.html",
	            	//lazyModule:"controller1",
	                templateProvider: function() {console.log(lazyDeferred.promise); return lazyDeferred.promise; },
	        		controller:"controller1"
	        	}
	        },
			resolve:resovleDep({files:['controllers/controller1']}, 'index2.html', 'webapp.controllers')
	    })
	    .state('contacts', {
		     url: "/contacts",
		     abstract: true
		})
	    .state('contacts.list',{
	        //abstract: true,
	        url:'/list',
	        views: {
	            '@': {
	            	templateUrl:"html/index2.html",
	            	//lazyModule:"controller1",
	                templateProvider: function() {console.log(lazyDeferred.promise); return lazyDeferred.promise; },
	        		controller:"controller2"
	        	}
	        },
			resolve:resovleDep({files:['controllers/controller2']}, 'index2.html', 'webapp.controllers')
	    });
    }]);                     
});