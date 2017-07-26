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
gulp.task('views', () => {
	return gulp.src('./src/views/*.html')
		.pipe(plugins.rigger())
		.pipe(gulp.dest('./dist'))
});

//watch scss file changes and run css task
gulp.task('watch', ['css', 'views'], ()=> {
	gulp.watch(['./src/sass/**/*.+(scss|sass)'], ['css']);
	gulp.watch(['./src/views/**/*.html'], ['views']);
	// gulp.watch(['./src/js/*/**.js'], ['scripts']);
});

//default task
gulp.task('default', ['watch', 'watchify']);