'use strict';

( function ( global ) {

  var ErrorFormatter = function ( Localization, ServerError ) {
    this.localization_ = Localization;
    this.serverError_ = ServerError;
  };

  ErrorFormatter.$inject = [ 'Localization', 'ServerError' ];

  ErrorFormatter.prototype.formatError = function ( errorObject ) {
    if( !this.serverError_.isServerError( errorObject ) ) {
      return;
    }
    var baseMessage = this.localization_
      .localizeError( errorObject.errorCode );
    var finalMessage = sprintf( baseMessage, errorObject.serverDetails );
    return finalMessage;
  };

  global.angular.module( 'imomoCaApp' )
    .service( 'ErrorFormatter', ErrorFormatter );

} )( window );
