'use strict';

var path = require( 'path' ),
  yaml = require( 'js-yaml' );

function localeClone( target, src ) {
  for ( var k in src ) {
    if ( target[ k ] === undefined ) {
      continue;
    }
    if ( Array.isArray( src[ k ] ) ) {
      for ( var i = 0; i < src[ k ].length; i++ ) {
        target[ k ][ i ] = src[ k ][ i ];
      }
    } else if ( typeof src[ k ] === 'object' ) {
      localeClone( target[ k ], src[ k ] );
    } else if ( typeof src[ k ] === 'string' ) {
      target[ k ] = src[ k ];
    }
  }
}

module.exports = function ( grunt ) {
  grunt.registerMultiTask( 'mergelocales', function () {
    var options = this.options( {
      'mainLocale': 'en'
    } );
    var files = this.filesSrc;
    var locales = {};
    var paths = {};

    files.forEach( function ( filepath ) {
      var locale = path.basename( filepath, '.yaml' );
      locales[ locale ] = grunt.file.readYAML( filepath );
      paths[ locale ] = filepath;
    } );
    grunt.log.ok( 'Found ' + Object.keys(locales).length + ' locales.' );
    grunt.log.ok( 'Main locale is ' + options.mainLocale + '.' );

    var mainLocale = locales[ options.mainLocale ];

    for ( var locale in locales ) {
      if ( locale === options.mainLocale ) {
        continue;
      }
      var mainLocaleClone = JSON.parse( JSON.stringify( mainLocale ) );
      localeClone( mainLocaleClone, locales[ locale ] );
      grunt.file.write( paths[ locale ], yaml.safeDump( mainLocaleClone ) );
      grunt.log.ok( 'Processed ' + locale + ' locale.' );
    }

  } );
};
