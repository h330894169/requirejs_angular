var less = require('gulp-less');
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var gulp = require('gulp');
var rjs = require('requirejs');
var amdOptimize = require('amd-optimize');
var concat = require('gulp-concat');
var cfg = require('./package.json');
var path = require('path');
var fs = require('fs');
var minifycss = require('gulp-minify-css');
var argv = require('yargs').argv,//获取命令行参数
   _ = require('lodash');
var uglify = require('gulp-uglify');
var gulpFilter = require('gulp-filter');//过滤文件
var rev = require('./lib/gulp-rev-customer');//md5
var server = require('./lib/server');//md5
var useref = require('./lib/customer-gulp-useref');
var replaceFilePath = require("./lib/replace-file-path");
var replacejsPath = require("./lib/replace-js-path");
var replaceCssPath = require("./lib/replace-css-path");
var md5Type = cfg.cfg.md5Type || null;
cfg.cfg.distPath = cfg.cfg.distPath || ".";
var is_dev = argv.d || !argv.p;
var paths = {
  scripts: ['src/**/*.js', 'src/**/*.js','src/**/main.js']
};
gulp.task('cleanPath',function() {
	if(is_dev)return gulp.src("");
	var files = ['!bower_components','!bower.json',"rev-manifest.json",cfg.cfg.distPath+"/*",'!.svn','!node_modules','!src','!lib',"!gulpfile.js","!package.json"]
	return gulp.src(files, {read: false})
	.pipe(clean());
});
//编译md5文件
gulp.task('build_manifest',['cleanPath'],function() {
	if(is_dev)return gulp.src("");
	return gulp.src(["src/**/*.js","src/**/*.css"])
	.pipe(rev({
		type:cfg.cfg.md5Type
	}))
    .pipe(rev.manifest({
            base: process.cwd(),
            merge: true,
            type:cfg.cfg.md5Type
      }))
    .pipe(gulp.dest("./"));
});
var buildReleasePath = function(pathName){
	var src = gulp.src([pathName],{ base: "src"})
	var realPath = path.resolve(process.cwd(),pathName.replace("**",""));
	if(!fs.existsSync(realPath)){
		console.log("path:",realPath.red,"not exist.")
		return;
	}
	console.log("build release path:"+pathName.red);
	var htmlFilter = gulpFilter(['**/*.html','**/*.htm'], {restore: true});
	var jsFilter = gulpFilter(['**/*.js'], {restore: true});
	var lessFilter = gulpFilter(['**/*.less'], {restore: true});
    var cssFilter = gulpFilter(['**/*.css'], {restore: true});
    var imgFilter = gulpFilter(["**/*.bmp","**/*.jpg","**/*.gif","**/*.svg","**/*.png"], {restore: true});
	return src
	 .pipe(replace(/%requireUrl%/g, "",{skipBinary:true}))
	 .pipe(htmlFilter)
	 .pipe(rev({
		type:md5Type
	 }))
	 .pipe(replaceFilePath({
	    	manifest: "./rev-manifest.json",
	    	base:"src",
	    	domain:"",
	    	prefix: ""
	  }))
     .pipe(gulp.dest(cfg.cfg.distPath))
     .pipe(htmlFilter.restore)
	
	
	 .pipe(jsFilter)
	 .pipe(rev({
		type:md5Type
	 }))
	 .pipe(uglify({mangle:true}).on('error', function(fileName,lineNumber,message){console.log(fileName)}))
     .pipe(gulp.dest(cfg.cfg.distPath))
     .pipe(jsFilter.restore)

     //less
     .pipe(lessFilter)
	 .pipe(rev({
		type:md5Type
	 }))
	 .pipe(less())
     .pipe(gulp.dest(cfg.cfg.distPath))
     .pipe(lessFilter.restore)

     //css
     .pipe(cssFilter)
	 .pipe(rev({
		type:md5Type
	 }))
	 .pipe(minifycss({
	 	advanced: false
	 }))
     .pipe(gulp.dest(cfg.cfg.distPath))
     .pipe(cssFilter.restore)
	 //输出其它文件
	 .pipe(gulp.dest(cfg.cfg.distPath))

     .pipe(rev.manifest({
            base: process.cwd(),
            merge: true,
            type:md5Type
      }))
    .pipe(gulp.dest("./"));
};
//编译总入口
gulp.task('buildOther', ['cleanPath','build_manifest'],function () {
	if(is_dev)return gulp.src("");;
	return buildReleasePath("src/**")
});


gulp.task('build',['cleanPath','buildOther'], function(cb){
	 if(is_dev){return gulp.src("");}
	 return gulp.src("src/**/*.js")   //路劲  
	 .pipe(replace(/%requireUrl%/g, "",{skipBinary:true}))
    // Traces all modules and outputs them in the correct order.   

         .pipe(amdOptimize("main",{
             baseUrl: "./src/js",
             configFile: './src/js/main.js',
             include: false,
             findNestedDependencies:false
         }))   //主入口文件

    .pipe(concat("js/main.js"))      //合并后的文件，如何合并后的文件和主入口名一样，构建后便只有一个文件
    //.pipe(uglify({mangle:true}).on('error', function(fileName,lineNumber,message){console.log(fileName)}))
    .pipe(gulp.dest(cfg.cfg.distPath));
  /**
  rjs.optimize({
    baseUrl: "./src/js",
    mainConfigFile:"./src/js/main.js",
    name:'main',
    optimize:"none",
    out:'./dist/main.js'
  }, function(buildResponse){
    // console.log('build response', buildResponse);
    cb();
  }, cb);
  **/
});
// Rerun the task when a file changes
gulp.task('watch', function() {
  var watcher = gulp.watch(paths.scripts, ['build']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

//本地server开发 watch
var watchCallBack = function(filePath){
	if(filePath){
		console.log("watch file:",filePath);
		buildReleasePath(filePath);
	}
};

gulp.task('server',['build'],function() {
	return server({
		watchCallBack:watchCallBack,
		is_dev:is_dev,
		dataSource:argv.s
	});
});

gulp.task('default', ['build']);