define(["modules"],function(controllers){
	var c =  controllers.controller('controller1',['$scope','xxService',function($scope,xxService){
        //控制器的具体js代码
        $scope.title= "111"

        $scope.click = function(){
        	xxService.getAddressList();
        	//$http.get("index.html?v="+new Date().getTime());
        }
        console.log($scope)
   }]);
   return c;
});
