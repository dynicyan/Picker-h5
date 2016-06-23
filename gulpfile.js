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
// gulp.task('sprite', function() {
//   return gulp.src(paths.images+'sprites/*.png')//需要合并的图片地址
//         .pipe(spritesmith({
//             imgName: 'sprite.png',//保存合并后图片的地址
//             cssName: 'sprite.css',//保存合并后对于css样式的地址
//             padding:5,//合并时两个图片的间距
//             algorithm: 'binary-tree',//注释1
//             cssTemplate:paths.css+'sprite.css'//注释2
//         }))
//         .pipe(gulp.dest( paths.css));
// })
//压缩
// gulp.task('sprite:images', function() {
//   return gulp.src(configs.spritesOutputPath + '/**/*.+(png|jpg|jpeg|gif|svg)')
//   // Caching images that ran through imagemin
//   .pipe($.imagemin({
//       interlaced: true,
//     }))
//   .pipe(gulp.dest(configs.spritesOutputPath))
// });
//打开文件目录
// gulp.task('sprite:open', function() {
//   gulp.src('')
//     .pipe($.open({app: 'Finder', uri: configs.spritesOutputPath}));
// })
//总命令
// gulp.task('sprite', function(callback) {
//   runSequence(
//     'sprite:build', 
//     'sprite:images',
//     'sprite:open',
//     callback
//   )
// });
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
gulp.task('server', ['compass','pug','browserSync'], function (){
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
    ['compass', 'pug','useref','imagemin'],
    callback
  )
})
