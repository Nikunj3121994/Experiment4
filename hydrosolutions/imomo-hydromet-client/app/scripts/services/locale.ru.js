( function ( global ) {
  'use strict';
  var currentLocale = 'ru';

  global.angular.module( 'imomoCaApp' )
    .constant( 'locale', currentLocale )
    .run( function () {
      moment.locale( 'ru' );
    } );

} )( window );
