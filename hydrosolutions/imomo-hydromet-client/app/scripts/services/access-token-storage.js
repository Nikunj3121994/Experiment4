'use strict';

( function ( global ) {

  var SESSION_STORAGE_KEY = 'imomo-access-token';

  var AccessTokenStorage = function ( $window, $q, AccessToken ) {
    this.window_ = $window;
    this.accessToken_ = AccessToken;
    this.q_ = $q;

    this.loadToken();
  };

  Object.defineProperty( AccessTokenStorage.prototype, 'token', {
    enumerable: true,
    get: function () {
      return this._token;
    },
    set: function ( value ) {
      if ( value === null || value instanceof this.accessToken_ ) {
        this._token = value;
      }
    }
  } );

  AccessTokenStorage.prototype.storeToken = function ( accessToken ) {
    this.window_.sessionStorage
      .setItem( SESSION_STORAGE_KEY, accessToken.toSessionStorage() );
    this.token = accessToken;
  };

  AccessTokenStorage.prototype.clearToken = function () {
    this.token = null;
    this.window_.sessionStorage.removeItem( SESSION_STORAGE_KEY );
  };

  AccessTokenStorage.prototype.loadToken = function () {
    var storedToken = this.window_.sessionStorage
      .getItem( SESSION_STORAGE_KEY );
    if ( storedToken !== null ) {
      try {
        this.token = this.accessToken_.fromSessionStorage( storedToken );
      } catch ( e ) {
        // TODO: log it
        this.window_.sessionStorage.removeItem( SESSION_STORAGE_KEY );
        this.token = null;
      }
    } else {
      this.token = null;
    }
  };

  AccessTokenStorage.prototype.hasValidToken = function () {
    if ( this.token === null ) {
      return false;
    }
    return this.token.isValid();
  };

  AccessTokenStorage.$inject = [ '$window', '$q', 'AccessToken' ];

  global.angular.module( 'imomoCaApp' )
    .service( 'AccessTokenStorage', AccessTokenStorage );

} )( window );
