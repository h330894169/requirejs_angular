define(["modules"],function(modules){
	modules.filter('dateFormat',function(){
	   return function(str){
	   	 if(!str){return "";}
	   	 str = parseInt(str);
	   	 return see.format_date(new Date(str),"yyyy年MM月dd hh:mm:ss"); 
	  };
	});
	return modules;
});
