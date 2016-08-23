'use strict';

module.exports = plugin;

var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var url = require('url');
var utils = require('./utils');  
function plugin(options) {
  options = options || {};

  var cache = [],renames = [];
  options.prefix = options.prefix || "";
  options.replaceInExtensions = options.replaceInExtensions || [".css"]
  
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
		if (options.manifest) {
	      // Read manifest file for the list of renames.
	      options.manifest.on('data', function (file) {
	        var manifest = JSON.parse(file.contents.toString());
	        Object.keys(manifest).forEach(function (srcFile) {
	          renames.push({
	            unreved: canonicalizeUri(srcFile),
	            reved: canonicalizeUri(manifest[srcFile])
	          });
	        });
	      });
	      options.manifest.on('end', replaceContents);
	    }
	    else {
	      replaceContents();
	    }
        //replaceContents();
	    //替换内容
	    function replaceContents(){
			var getRevedName = function(oldPath){
		        var temp = null;
		        renames.forEach(function replaceOnce(rename) {
			          var unreved = options.modifyUnreved ? options.modifyUnreved(rename.unreved,file.path) : rename.unreved;
			          var reved = options.modifyReved ? options.modifyReved(rename.reved,file.path) : rename.reved;
			          if(oldPath == unreved){
 			            temp = reved 
			          	return false;
			          }
		        });
	            return temp;
	    	}
	    	cache.forEach(function replaceInFile(file) {
	    		var contents = file.contents.toString();
		        //var s = (contents.match(/\(.+\.(png|jpg|gif|svg|bmp)\)/g))
		        var s = contents.match(/@import *('|").+\.css('|")/g)
		        if(s){
		        	s.forEach(function(str){
		        		var p = str.match(/('|").+\.css('|")/g);
		        		if(p[0]){
		        			var array = path.resolve(path.resolve(path.dirname(file.path), p[0].replace(/("|')+/g,""))).split(path.sep);
			        		if(options.base){
				        		array = array.slice(array.indexOf(path.basename(options.base))+1)
			        		}
							
			        		if(!array[0].startsWith("http://") && !array[0].startsWith("//")){
			        			contents = contents.replace(p[0].replace(/^('|")/,"").replace(/('|")$/,""), path.basename(getRevedName(array.join("/"))))
								//console.log(contents,p[0].replace(/^('|")/,"").replace(/('|")$/,""),getRevedName(array.join("/")))
			        		}
			        		
		        			//contents.replace(str,prefix + p[0].)
		        		}
		        	})
		        	//console.log(s,file.path)
					console.log("buliding file:",file.path.cyan)
		        }
		        //console.log(process.cwd()  )
		        //console.log(process.cwd() + path.sep + (options.dist=="."?'':options.dist))
		        //console.log(path.resolve(options.dist=="."?'':options.dist,path.dirname(file.path)))
		        
		        file.contents = new Buffer(contents);
		        stream.push(file);
	    	});
	        cb()
	    }
		
		function canonicalizeUri(filePath) {
			if (path.sep !== '/' && options.canonicalUris) {
			  filePath = filePath.split(path.sep).join('/');
			}
		
			return filePath;
	  }
  });

}
