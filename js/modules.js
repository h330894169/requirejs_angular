define(function(){"use strict";var r=angular.module("webapp.modules",["cfp.loadingBar"]).config(["$provide","$compileProvider","$controllerProvider","$filterProvider",function(e,i,o,t){r.controller=o.register,r.directive=i.register,r.filter=t.register,r.factory=e.factory,r.service=e.service,r.constant=e.constant}]);return r});