const gulp = require('gulp'),
		plugins = require('gulp-load-plugins')(),
		browserSync = require('browser-sync').create();

//reate sourcemap, compile sass to css, add prefixes, minify css file and save into dest file
gulp.task('css', ()=>{
	return gulp.src(['./src/sass/style.scss'])
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.sass({outputStyle: 'compressed'}).on('error', plugins.sass.logError))
		.pipe(plugins.autoprefixer())
		// .pipe(plugins.cssmin())
		.pipe(plugins.sourcemaps.write())
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('js', ()=>{
	return gulp.src([
		'./node_modules/jquery/dist/jquery.min.js',
		'./src/js/first.js',
		'./src/js/second.js'
		])
		.pipe(plugins.babel({
			presets: 'es2015'
		}))
		.pipe(plugins.concat('main.js'))
		.pipe(plugins.uglify())
		.pipe(plugins.rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/js/'))
		.pipe(browserSync.stream());
});



//watch scss file changes and run css task
gulp.task('watch', ()=> {
	gulp.watch(['./src/sass/style.scss', './src/sass/*.scss', './src/sass/**/*.scss'], ['css']);
	gulp.watch(['./src/js/*.js'], ['js']);
});

//browser response to html file changes
gulp.task('serve', ()=>{
	browserSync.init({
		server:{
			baseDir: './'
		}
	});
	gulp.watch('*.html').on('change', browserSync.reload);
});


//default task
gulp.task('default', ['css', 'js', 'watch', 'serve']);