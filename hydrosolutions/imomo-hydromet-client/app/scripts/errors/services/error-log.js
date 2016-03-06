'use strict';

( function ( global ) {

  var ErrorLogService = function () {
    this._error = undefined;
  };

  Object.defineProperty( ErrorLogService.prototype, 'error', {
    enumerable: true,
    get: function () {
      return this._error;
    },
    set: function ( value ) {
      this._error = value;
    }
  } );

  ErrorLogService.prototype.log = function ( error ) {
    this.error = error;
    console.log( this.error );
  };

  global.angular.module( 'imomoCaApp' )
    .service( 'ErrorLog', ErrorLogService );

} )( window );
