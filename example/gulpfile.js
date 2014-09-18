var gulp = require( 'gulp' );
var pathPrefix = require( '../index' );
var prettify = require( 'gulp-prettify' );

gulp.task( 'default', function() {
	gulp.src( [ 'source/*.*' ] )
		.pipe( pathPrefix( { prefix: '/analytics' } ) )
		.pipe( gulp.dest( './result' ) );
} );