( function ( global ) {
  'use strict';
  var currentLocale = 'en';

  global.angular.module( 'imomoCaApp' )
    .constant( 'locale', currentLocale )
    .run( function () {
      moment.locale( 'en' );
    } );

} )( window );
