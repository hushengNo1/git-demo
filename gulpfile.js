/**
 * 这个文件的文件名固定
 * 在这个文件中抽象我们需要做的任务
 */

'use strict';

/*
 *抽象的任务有：
 * 1.less编译 压缩 合并(合并没有太大必要,可以直接在less中导入@import url('_demo.less');)
 * 2.JS合并 压缩 混淆
 * 3.img复制
 * html压缩
 */

//在gulpfile.js中先载入gulp包,因为这个包提供了一些API(引号中的名称与npm安装时一致)
var gulp = require('gulp');
//同理,载入用于转换less为css的工具包;gulp本身没有直接提供这样的功能,它也是引用第三方的包
var less = require('gulp-less');
//同理,载入压缩css文件的工具包
var cssnano = require('gulp-cssnano');
//js合并工具包
var concat = require('gulp-concat');
//js压缩混淆
var uglify = require('gulp-uglify');
//html压缩工具包
var htmlmin = require('gulp-htmlmin');
//当不知道怎么使用时可查看文档,快速查看方法:https://www.npmjs.com/package/gulp-htmlmin(最后面可以改成相应的巩固包名)

//1.less编译 压缩 合并
gulp.task('style', function() {
	//这里是在执行style任务时自动执行的,'style'为任务的名称----最后去命令行执行时输入:gulp style就是执行该任务
	//执行前先找到.less文件(src方法),然后再执行,然后导向到目标文件夹(dest方法)
	//	gulp.src('src/styles/*.less')//如果不会写匹配规则的话,可以在style下面新建一个文件夹用来存放被导入的less文件,这样就让src/styles/*.less只找到一个less文件
	gulp.src(['src/styles/*.less', '!src/styles/_*.less'])
		.pipe(less())
		.pipe(cssnano())
		.pipe(gulp.dest('dist/styles'))
		.pipe(browserSync.reload({
			stream:true
		}));
});

//2.JS合并  (压缩混淆是一个过程)--->建议合并后在混淆,因为混淆时会改变变量名
gulp.task('script', function() {
	gulp.src('src/scripts/*.js')
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts'))
		.pipe(browserSync.reload({
			stream:true
		}));
});

//3.图片复制
gulp.task('image', function() {
	gulp.src('src/images/*.*') //(*.*)表示所有格式的所有图片
		.pipe(gulp.dest('dist/images'))
		.pipe(browserSync.reload({
			stream:true
		}));
});

//4.html压缩
//removeComments: true-->压缩时去掉注释
//removeAttributeQuotes:true-->压缩时去除引号
//更多功能查看:https://github.com/kangax/html-minifier
gulp.task('html', function() {
	gulp.src('src/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({
			stream:true
		}));//工作流走到此处,通知浏览器刷新一下
});

//重要:
//启动一个服务,顺便监视文件的变化
var browserSync = require('browser-sync');
//这里取任务名时注意,server已经被某某?占用,要避免重复
gulp.task('serve', function() {
	browserSync({
		server: {
			baseDir:['dist']
		},
	}, function(err, bs) {
		console.log(bs.options.getIn(["urls", "local"]));
	});
	
	//watch监视文件变化,当文件变化时执行相应的任务
	gulp.watch('src/styles/*.less',['style']);
	gulp.watch('src/scripts/*.js',['script']);
	gulp.watch('src/images/*.*',['image']);
	gulp.watch('src/*.html',['html']);
});