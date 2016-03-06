'use strict';

( function ( global ) {

  var ClientErrorFactory = function () {
    var ClientError = function ( errorCode ) {
      this._errorCode = errorCode;
    };

    Object.defineProperty( ClientError.prototype, 'errorCode', {
      enumerable: true,
      get: function () {
        return this._errorCode;
      },
      set: function ( value ) {
        this._errorCode = value;
      }
    } );

    return ClientError;
  };

  ClientErrorFactory.$inject = [];

  global.angular.module( 'imomoCaApp' )
    .factory( 'ClientError', ClientErrorFactory );

  var ClientErrors = function ( ClientError ) {
    this.clientError_ = ClientError;
  };

  ClientErrors.prototype = {};

  Object.defineProperty( ClientErrors.prototype, 'InvalidKN15TelegramError', {
    enumerable: true,
    get: function () {
      return new this.clientError_( '21001' );
    }
  } );

  Object.defineProperty( ClientErrors.prototype, 'NotEnoughWaterLevelDataError', {
    enumerable: true,
    get: function () {
      return new this.clientError_( '21002' );
    }
  } );

  Object.defineProperty( ClientErrors.prototype, 'InvalidWaterLevelTrendError', {
    enumerable: true,
    get: function () {
      return new this.clientError_('21003');
    }
  } );

  ClientErrors.$inject = [ 'ClientError' ];

  global.angular.module( 'imomoCaApp' )
    .service( 'ClientErrors', ClientErrors );

} )( window );
