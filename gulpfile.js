const gulp = require('gulp'),
		plugins = require('gulp-load-plugins')(),
		browserSync = require('browser-sync').create();
var source = require('vinyl-source-stream');
const babelify = require('babelify');
const browserify = require('browserify');
const watchify = require('watchify');
var gutil = require('gulp-util');

//reate sourcemap, compile sass to css, add prefixes, minify css file and save into dest file
gulp.task('css', ()=>{
	return gulp.src(['./src/sass/style.scss'])
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.sass({outputStyle: 'compressed'}).on('error', plugins.sass.logError))
		.pipe(plugins.autoprefixer())
		.pipe(plugins.sourcemaps.write())
		// .pipe(plugins.rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/css'))
		// .pipe(browserSync.stream());
});

// gulp.task('js', ()=>{
// 	return gulp.src([
// 		'./node_modules/jquery/dist/jquery.min.js',
// 		'./src/js/first.js',
// 		'./src/js/second.js'
// 		])
// 		.pipe(plugins.babel({
// 			presets: 'es2015'
// 		}))
// 		.pipe(plugins.concat('main.js'))
// 		.pipe(plugins.uglify())
// 		.pipe(plugins.rename({suffix: '.min'}))
// 		.pipe(gulp.dest('./dist/js/'))
// 		.pipe(browserSync.stream());
// });
const appBundle = browserify({
    entries: './src/js/entry.js', // main js file 
    debug: true,
    packageCache: {},
    cache: {}
}).transform(babelify, { presets: ['es2015'], only: './src/js' });

const b = watchify(appBundle);

function rebundle(bundler) {
    return bundler
        .bundle()
        .on('error', function (err) {
            gutil.log('Browserify error: ' + gutil.colors.red(err.message));
        })
        .pipe(source('app.js'))
        .pipe(gulp.dest('./dist/js'))
				.pipe(browserSync.stream());
}

gulp.task('watchify', function () {
    rebundle(b);
    b.on('update', function () {
        rebundle(b)
    });
    b.on('log', gutil.log); // output build logs to terminal
});


gulp.task('scripts', ()=> {
	return gulp.src('./src/js/entry.js')
	.pipe(plugins.browserify({

	}))
	.pipe(gulp.dest('./dist/js'))
	.pipe(browserSync.stream());
});

// browserify("./script.js")
//   .transform("babelify", {presets: ["es2015", "react"]})
//   .bundle()
//   .pipe(fs.createWriteStream("bundle.js"));

//watch scss file changes and run css task
gulp.task('watch', ['css', 'views'], ()=> {
	gulp.watch(['./src/sass/**/*.+(scss|sass)'], ['css']);
	gulp.watch(['./src/views/**/*.mustache'], ['views']);
	// gulp.watch(['./src/js/*/**.js'], ['scripts']);
});

//browser response to html file changes
// gulp.task('serve', ()=>{
// 	browserSync.init({
// 		server:{
// 			baseDir: './'
// 		}
// 	});
// 	gulp.watch('*.html').on('change', browserSync.reload);
// });

// var ejs = require("gulp-ejs")
//  gulp.task('views', () => {
// 	return gulp.src("./src/views/**/*.ejs")
// 			.pipe(ejs({ ext:'.html' }))
// 			.pipe(gulp.dest("./dist/html"));
//  })
// var pug = require('gulp-pug');
 
// gulp.task('views', function buildHTML() {
//   return gulp.src('./src/views/**/*.pug')
//   .pipe(pug({
//     // Your options in here. 
//   }))
// 	.pipe(gulp.dest('./dist/html'))
// });
// var jade = require('gulp-jade');
 
// gulp.task('views', function() {
//   gulp.src('./views/**/*.jade')
//     .pipe(jade({
//       client: true
//     }))
//     .pipe(gulp.dest('./dist/html'))
// });
// var hogan = require('gulp-hogan');
 
// gulp.task('views', function(){
//   return gulp.src('./src/views/**/*/.hogan')
//     .pipe(hogan({handle: 'gnumanth'}))
//     .pipe(gulp.dest('./dist/html'));
// });
var mustache = require("gulp-mustache");
 gulp.task('views', function(){
gulp.src("./src/views/**/*.mustache")
    .pipe(mustache({
        msg: "Hello Gulp!"
    }))
		.pipe(plugins.rename({ extname: '.html'}))
    .pipe(gulp.dest("./dist/html"));
});
//default task
gulp.task('default', ['watch', 'watchify']);