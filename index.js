var evs = require( 'event-stream' );
var _ = require( 'lodash' );
var builtPatterns = [];

function buildRegex( templates, prefix ) {
	builtPatterns = templates.map( function( template ) {

		var patt = template.replace( "$PREFIX$", prefix );
		console.log( patt );
		return new RegExp( patt, "gm" );
	} );
}

module.exports = function( opt ) {
	var options = _.extend( {
		patterns: [
			"(React.DOM.img\\((?:.|[\\n\\r])*src:\\s*['\"](?!$PREFIX$))(\\/.*)(['\"])",
			"(<img.*src=['\"](?!$PREFIX$))(\\/.*)(['\"].*>)",
			"(<link.*href=['\"](?!$PREFIX$))(\\/.*)(['\"].*>)",
			"(<script.*src=['\"](?!$PREFIX$))(\\/.*)(['\"].*>)",
			"(url.*\\(.*['\"](?!$PREFIX$))(\\/.*)(['\"]\\))"
		]
	}, opt );

	buildRegex( options.patterns, options.prefix );

	function prefixAllTheThings( file ) {
		var contents = String( file.contents );

		builtPatterns.forEach( function( pattern ) {
			contents = contents.replace(
				pattern,
				"$1" + options.prefix + "$2$3"
			);
		} );

		file.contents = new Buffer( contents );

		this.emit( 'data', file );
	}

	return evs.through( prefixAllTheThings );
};