define(["modules"],function(directives){
	directives.directive('fileUpload', ['$rootScope', '$http', function ($rootScope, $http) {
	    return function (scope, ele, attr) {
	        ele.bind('change', function (e) {
	            //上传
	            var fn = attr.fileUpload;//回调方法，本例为$scope中的upload()方法
	            var file = e.target.files[0];
	            var url = $(ele).data("url");
	            if (file == undefined || !url) {//没选择文件
	                return false;
	            }
	            var form = new FormData();
	            form.append("image", file);
	            form.append("type", 1);
	            $http.post(url, form, {
	                headers: {
	                    'Content-Type': undefined//如果不设置Content-Type,默认为application/json,七牛会报错
	                    // 'Content-Type': 'application/json'
	                }
	            }).success(function (data) {
	                scope[fn](data,ele);//上传回调，将url传到upload方法中
	            });
	        });
	    };
	}]);
	
	
	directives.directive('finishRepeat', ['$timeout',function ($timeout) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attr) {
	            if (scope.$last === true) {
	                $timeout(function() {
	                	scope.$emit('finishRepeated');
	                	if(scope.$par){
		                    var fun = scope.$par[attr.finishRepeat];
		                    if(fun) {
		                        fun();
		                    }
	                	}
	                });
	            }
	        }
	    };
	}]);
	return directives;
});
