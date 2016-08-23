

define(["modules"],function(controllers){
	console.log(controllers)
	//controllers =  angular.module('webapp.controllersx', []);
	var c =  controllers.controller('controller2',['$scope',function($scope){
        //控制器的具体js代码
        $scope.title= "222"
        console.log($scope);
        $scope.alerts = [
            { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
            { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
        ];

        $scope.addAlert = function() {
            $scope.alerts.push({msg: 'Another alert!'});
        };

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
   }]);
   console.log(c);
   return c;
});
/**
var controllers = angular.module('webapp.controllers', []);
 controllers.controller('controller1',function($scope){
    //控制器的具体js代码
    $scope.title= "111"
    console.log($scope)
})
**/