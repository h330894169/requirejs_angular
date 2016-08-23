define(['gritter'],function(){
	var hyxt = window.hyxt || {};
    var classMap = {
        "warn":"growl-warning",
        "error":"growl-danger",
        "info":"growl-info",
        "success":"growl-success",
        "primary":"growl-primary",
        "black":""
    };
	hyxt.commonErrorHandler = function(data){
		if(data.result != 1){
            alert(data.msg);
            return false;
        }
        return true;
	};
	hyxt.tips = function(title,msg,type){
		if(arguments.length >0){
			jQuery.gritter.add({
				title: title||'',
				text: msg||"",
				sticky: false,
                class_name: type?classMap[arguments[2]]:'',
				time: ''
			 });
		}
	};

    $.map(classMap,function(value,key){
        hyxt[key] = function(){hyxt.tips.call(null,arguments[0],arguments[1],key)}
    })
	window.hyxt = hyxt;
});
