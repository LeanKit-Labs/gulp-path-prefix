var evs = require( 'event-stream' );
var _ = require( 'lodash' );
var through = require( 'through2' );
var builtPatterns = [];

function buildRegex( templates, prefix, excludeExternal ) {
	builtPatterns = templates.map( function( template ) {

		var patt = template
      .replace( "$PREFIX$", prefix )
      .replace( "$EXTERNAL$", excludeExternal ? "(?!\/\/)" : "" )
		return new RegExp( patt, "gm" );
	} );
}

module.exports = function( opt ) {
	var options = _.extend({
		patterns: [
			"(React.DOM.img\\((?:.|[\\n\\r])*src:\\s*['\"]$EXTERNAL$(?!$PREFIX$))(\\/.*)(['\"])",
			"(<img.*src=['\"]$EXTERNAL$(?!$PREFIX$))(\\/.*)(['\"].*>)",
			"(<link.*href=['\"]$EXTERNAL$(?!\/\/)(?!$PREFIX$))(\\/.*)(['\"].*>)",
			"(<script.*src=['\"]$EXTERNAL$(?!$PREFIX$))(\\/.*)(['\"].*>)",
			"(url.*\\(.*['\"]$EXTERNAL$(?!$PREFIX$))(\\/.*)(['\"]\\))"
		],
    excludeExternal: false
	}, opt );

	buildRegex( options.patterns, options.prefix, options.excludeExternal );

	function prefixAllTheThings( file, enc, cb ) {
		if ( file._contents !== null ) {
			var contents = String( file._contents );

			builtPatterns.forEach( function( pattern ) {
				contents = contents.replace(
					pattern,
					"$1" + options.prefix + "$2$3"
				);
			} );

			file._contents = new Buffer( contents );
			cb( null, file );
		} else {
			cb();
		}
	}

	return through.obj( prefixAllTheThings, function( cb ) {
		cb( null );
	} );
};
