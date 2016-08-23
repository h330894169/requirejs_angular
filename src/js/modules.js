define(function(){
    'use strict';
    var tempApp = angular.module('webapp.modules', ['cfp.loadingBar'])
	.config(["$provide", "$compileProvider", "$controllerProvider", "$filterProvider",
	function($provide, $compileProvider, $controllerProvider, $filterProvider) {
		tempApp.controller = $controllerProvider.register;
		tempApp.directive = $compileProvider.register;
		tempApp.filter = $filterProvider.register;
		tempApp.factory = $provide.factory;
		tempApp.service = $provide.service;
		tempApp.constant = $provide.constant;
		
	}]);
	return tempApp;
});