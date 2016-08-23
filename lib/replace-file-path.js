'use strict';

module.exports = plugin;
var gulp = require('gulp');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var jsdom = require("jsdom").jsdom;
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
  //link 是css
  options.filterTag = options.filterTag || ["script","link","img"]

  var cache = [],renames = [];
  options.domain = options.domain || ""
  options.prefix = options.prefix || "";
  options.replaceInExtensions = options.replaceInExtensions || [".html",".htm"]
  
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
  			options.manifest = gulp.src(options.manifest);
	      // Read manifest file for the list of renames.
	      options.manifest.on('data', function (file) {
	        var manifest = JSON.parse(file.contents.toString());
	        Object.keys(manifest).forEach(function (srcFile) {
	          renames.push({
	            unreved: canonicalizeUri(srcFile),
	            reved: options.domain + options.prefix + canonicalizeUri(manifest[srcFile])
	          });
	          //srcFile.indexOf("combined.js")!=-1&&console.log("---->"+options.domain + options.prefix + canonicalizeUri(manifest[srcFile]))
	        });
	      });
	      options.manifest.on('end', replaceContents);
	    }
	    else {
	      replaceContents();
	    }
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
		        //console.log(contents.match(/<script[^>]*?>.*?<\/script>/g))
		        var document = jsdom(contents);
		          for(var tagIndex in options.filterTag){
				        var script  = document.getElementsByTagName(options.filterTag[tagIndex]);
				        
				        var src = null,tempSrc;
				        for(var index in script){
				        	tempSrc = options.filterTag[tagIndex] == "link"?(script[index].getAttribute("href")):(script[index].getAttribute("src"))
				        	src = tempSrc?tempSrc.replace(/^ +/g,"").replace(/ +$/g,""):null;				        	
				        	if(src && (!src.startsWith("http://") && !src.startsWith("//") && !src.startsWith("data:image"))){
			        			var reName = getRevedName(url.parse(src).pathname);
				        		if(src.startsWith("..")){
				        			contents = contents.replace(tempSrc,src.replace("../",""));
				        		}else if(reName){
				        			contents = contents.replace(tempSrc,reName);
				        		}
				        		if(index == 0 && !file.print){
				        			file.print = true;
				        			console.log("buliding file:",file.path.green);
				        		}
				        		//console.log(src,reName)
				        		
				        		/**
				        		var array = path.resolve(path.dirname(file.path), src).split(path.sep);
				        		if(options.base){
					        		array = array.slice(array.indexOf(path.basename(options.base))+1)
				        		}
				        		var reName = getRevedName(url.parse(array.join("/")).pathname);
				        		reName = reName || (options.domain + options.prefix + array.join("/"));
				        		//console.log(reName)
				        		//TO-DO 这里有点问题，替换重复了 路径中最好使用.或者..
				        		contents = contents.replace(tempSrc,reName);
				        		if(index == 0 && !file.print){
				        			file.print = true;
				        			console.log("buliding file:",file.path.green);
				        		}
				        		**/
				        	}
				        }
		        }
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
