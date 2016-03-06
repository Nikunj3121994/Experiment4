'use strict';

( function ( global ) {

  var ErrorDisplayCtrl = function ( ErrorLog, localizeError ) {
    this.error = ErrorLog.error;
    this.localizeError = localizeError;
  };

  ErrorDisplayCtrl.$inject = [ 'ErrorLog', 'localizeError' ];

  global.angular.module( 'imomoCaApp' )
    .controller( 'ErrorDisplayCtrl', ErrorDisplayCtrl );

} )( window );
