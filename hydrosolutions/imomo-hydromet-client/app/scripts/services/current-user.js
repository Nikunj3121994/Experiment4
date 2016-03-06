'use strict';

( function ( global ) {

  var CurrentUser = function () {

  };

  Object.defineProperty( CurrentUser.prototype, 'user', {
    enumerable: true,
    get: function () {
      return this._user;
    },
    set: function ( value ) {
      this._user = value;
    }
  } );

  CurrentUser.$inject = [];

  global.angular.module( 'imomoCaApp' )
    .service( 'CurrentUser', CurrentUser );

} )( window );
