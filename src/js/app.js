define(["angular",
        'modules','ocLazyLoad','uiRoute','ngAnimate','loadingBar','UIBootstrap','directives/directive','filters/filter','service/service'
       ],function(angular,modules){ 
    return angular.module("webapp",['oc.lazyLoad','ngAnimate','angular-loading-bar','ui.router','webapp.modules','ui.bootstrap']);
});