'use strict';

( function ( global ) {

  var AccessTokenFactory = function () {
    var AccessToken = function ( tokenString ) {
      this._tokenString = tokenString;
      this.decodeToken();
    };

    AccessToken.prototype = {};

    Object.defineProperty( AccessToken.prototype, 'tokenString', {
      enumerable: true,
      get: function () {
        return this._tokenString;
      },
      set: function ( value ) {
        this._tokenString = value;
      }
    } );

    Object.defineProperty( AccessToken.prototype, 'userId', {
      enumerable: true,
      get: function () {
        return this._userId;
      },
      set: function ( value ) {
        this._userId = value;
      }
    } );

    Object.defineProperty( AccessToken.prototype, 'expirationDate', {
      enumerable: true,
      get: function () {
        return this._expirationDate;
      },
      set: function ( value ) {
        this._expirationDate = value;
      }
    } );

    AccessToken.prototype.decodeToken = function () {
      var startIndex = this.tokenString.indexOf( '.' );
      var endIndex = this.tokenString.indexOf( '.', startIndex + 1 );
      var encodedPayload = this.tokenString
        .substring( startIndex + 1, endIndex );
      var payload = JSON.parse( global.atob( encodedPayload ) );
      this.userId = payload.userId;
      this.expirationDate = moment.unix( payload.exp );
    };

    AccessToken.prototype.isValid = function () {
      if ( this.userId === undefined ) {
        return false;
      }
      return this.expirationDate.isAfter( moment() );
    };

    AccessToken.prototype.toSessionStorage = function () {
      return this.tokenString;
    };

    AccessToken.fromSessionStorage = function ( storedToken ) {
      return new AccessToken( storedToken );
    };

    AccessToken.fromServerObject = function ( serverToken ) {
      return new AccessToken( serverToken.tokenString );
    };

    return AccessToken;
  };

  global.angular.module( 'imomoCaApp' )
    .factory( 'AccessToken', AccessTokenFactory );

} )( window );
