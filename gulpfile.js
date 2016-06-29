/**
 * @version 1.0.0
 * @copyright dynicyan [All Rights Reserved]
 * @license
 */
 'user-strict'
//some plugins I need
var gulp = require('gulp'),//引入gulp
    plugins  = require('gulp-load-plugins')(),//自动加载插件
		autoprefixer = require('autoprefixer'),//添加前缀
		path = require('path'),//json命名格式路径
		fs = require('fs'),//node获取文件节点
		del = require('del'),//删除文件夹
		spritesmith  = require('gulp.spritesmith'),//合并雪碧图
		browserSync = require('browser-sync');//实时刷新

var $ = plugins;
//雪碧图合成图配置
var configs = {
  //修改图片位置
  spritesSource: './app/images/sprites/*.*',
  spritesMithConfig: {
    //由于图片最终是要放到七牛上，这里的cssOpts用来当成最终scss文件中的变量名，详情看scss.template.mustache
    cssOpts: 'spriteSrc',
    imgName: '../images/sprite.png',
    cssName: 'components/sprite.scss',
    cssFormat: 'scss',
    cssTemplate: 'scss.template.mustache',
    algorithm: 'binary-tree',
    padding: 8,
    cssVarMap: function(sprite) {
      sprite.name = 'icon-' + sprite.name
    }
  },
  spritesOutputPath: './app/images/'
}
//定义路径
var paths = {
    sass: './app/_source/scss/',
    css:'./app/css/',
    pug:'./app/_source/pug/',
    data:'./app/_source/pug/data/',
    // js: 'js/',
    // img: 'img/',
    images: './app/images/'
};
//编译sass
gulp.task('compass',function() {
	var processors = [
		autoprefixer({
			browsers:[
				'last 2 versions',
				'> 1%',
				'ie > 8',
				'ff > 20',
				'chrome > 34' ,
        'safari >= 6',
        'opera >= 12.1',
        'ios >= 6',
        'android >= 4.4',
        'bb >= 10',
        'and_uc 9.9'
			],
			cascade:false
		})
	];
	return gulp.src(paths.sass+'*.{scss,sass}')
		.pipe($.compass({
			sass:paths.sass,
			css:paths.css,
			image:paths.images
		}))
		.pipe($.postcss(processors))
		.pipe($.plumber())
		.pipe(gulp.dest(paths.css))
		.pipe($.rename({ suffix: '.min' }))
    .pipe($.minifyCss())
    .pipe(gulp.dest(paths.css))
});


//编译pug(jade)
gulp.task('pug',function(){
	return gulp.src(paths.pug+'*.pug')
		.pipe($.plumber())
		.pipe($.data(function(file) {
			var datajson = paths.data + path.basename(file.path) + '.json';
			if (fs.existsSync(datajson)) {
				return require(datajson);
			}else{
				return require('./app/_source/pug/data/data.json')
			}
	  }))
		.pipe($.pug({pretty:true}))
		.pipe(gulp.dest('./app'))
});


//合并并压缩css  js等 减少服务器请求次数
gulp.task('useref',['pug'],function(){
  return gulp.src('./app/*.html')
		.pipe($.useref())
		.pipe($.gulpif('*.js', uglify()))
		.pipe($.gulpif('*.css', minifycss()))
		.pipe(gulp.dest('./dist'))
});
//图片优化
gulp.task('imagemin', function(){
  return gulp.src(paths.images + '/**/*.+(png|jpg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe($.cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});


//合成雪碧图

//创建精灵图
gulp.task('sprite', function(){
	var spriteData = gulp.src(configs.spritesSource) // source path of the sprite images
	    .pipe(spritesmith(
	        configs.spritesMithConfig
	    ));
	spriteData.img.pipe(gulp.dest(configs.spritesOutputPath)); // output path for the sprite
	spriteData.css.pipe(gulp.dest(paths.sass)); // output path for the CSS
})
//实时刷新
gulp.task('browserSync', function() {
  browserSync({
      notify: false,
      port: 7000,
      server: {
          baseDir: './app',
          index: 'index.html',
          routes: {
              // '/bower_components': 'bower_components'
          }
      }
  });
});
//清理生成的文件
gulp.task('clean', function(callback) {
  del('dist');
  return cache.clearAll(callback);
})
gulp.task('clean:dist', function(callback){
  del(['dist/**/*', '!dist/images', '!dist/images/**/*'], callback)
});
//default task
gulp.task('server', ['compass','pug','sprite','browserSync'], function (){
  gulp.watch('./app/_source/scss/*.{scss,sass}', ['compass']);
  gulp.watch('./app/_source/pug/*.pug', ['pug']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch([
        './app/js/**/*.js',
        './app/css/*.css',
        './app/*.html'
    ]).on('change', browserSync.reload);
})
gulp.task('default',['server'])
gulp.task('build', function(callback) {
  runSequence(
  	'clean:dist',
    ['compass', 'pug','useref','sprite','imagemin'],
    callback
  )
})
