'use strict';

module.exports = plugin;

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var url = require('url');
var colors = require('colors');
colors.setTheme({  
    silly: 'rainbow',  
    input: 'grey',  
    verbose: 'cyan',  
    prompt: 'red',  
    info: 'green',  
    data: 'blue',  
    help: 'cyan',  
    warn: 'yellow',  
    debug: 'magenta',  
    error: 'red'  
});  
function plugin(options) {
  options = options || {};

  var cache = [],renames = [];
  options.prefix = options.prefix || "";
  options.replaceInExtensions = options.replaceInExtensions || [".js"]
  
  return through.obj(function collectRevs(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-rev-replace', 'Streaming not supported'));
      return cb();
    }
    if (options.replaceInExtensions.indexOf(path.extname(file.path)) > -1) {
      // file should be searched for replaces
      cache.push(file);
    } else {
      // nothing to do with this file
      this.push(file);
    }

    cb();
  }, function replaceInFiles(cb) {
  		var stream = this;
        replaceContents();
	    //替换内容
	    function replaceContents(){
	    	cache.forEach(function replaceInFile(file,index) {
	    		var contents = file.contents.toString();
		        //var s = (contents.match(/\(.+\.(png|jpg|gif|svg|bmp)\)/g))
		        var s = contents.match(/see\.getUrlPrefix\(\) *\+ *('|").+\.(png|jpg|gif|svg|bmp)('|")/g)
		        if(s){
		        	s.forEach(function(str){
		        		var p = str.match(/('|").+\.(png|jpg|gif|svg|bmp)('|")/g);
		        		if(p[0]){
		        			var array = path.resolve(path.resolve(path.dirname(file.path), p[0].replace(/("|')+/g,""))).split(path.sep);
			        		if(options.base){
				        		array = array.slice(array.indexOf(path.basename(options.base))+1)
			        		}
			        		var realPath = p[0].indexOf("..")==-1 && array.shift() ? (options.domain + array.join("/")) : (options.domain + options.prefix + array.join("/")) ;
			        		if(!realPath.startsWith("/") && options.domain==""){
			        			realPath = "/" + realPath;
			        		}
		        			contents = contents.replace(str, "\"" + realPath +"\"")
		        			console.log("buliding file:",file.path.red)
		        		}
		        	})
		        	//console.log(s,file.path)
		        }
		        //console.log(process.cwd()  )
		        //console.log(process.cwd() + path.sep + (options.dist=="."?'':options.dist))
		        //console.log(path.resolve(options.dist=="."?'':options.dist,path.dirname(file.path)))
		        file.contents = new Buffer(contents);
		        stream.push(file);
	    	});
	        cb()
	    }
  });

}
