define(["modules"],function(e){return e.directive("fileUpload",["$rootScope","$http",function(e,t){return function(e,i,n){i.bind("change",function(r){var a=n.fileUpload,o=r.target.files[0],f=$(i).data("url");if(void 0==o||!f)return!1;var p=new FormData;p.append("image",o),p.append("type",1),t.post(f,p,{headers:{"Content-Type":void 0}}).success(function(t){e[a](t,i)})})}}]),e.directive("finishRepeat",["$timeout",function(e){return{restrict:"A",link:function(t,i,n){t.$last===!0&&e(function(){if(t.$emit("finishRepeated"),t.$par){var e=t.$par[n.finishRepeat];e&&e()}})}}}]),e});