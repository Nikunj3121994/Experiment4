'use strict';

var CherrypyError = function ( status, message, traceback ) {
  this._status = status;
  this._message = message;
  this._traceback = traceback;
};

CherrypyError.prototype = {
  get details() {
    try {
      var jsonError = JSON.parse( this._message );
      return jsonError.details;
    } catch ( e ) {
      return this._message;
    }
  },
  get type() {
    return 'danger';
  }
};

var ErrorsService = function () {};

/**
 * Discerns if the given error message is an error response originated
 * from the cherrypy-powered web service.
 * @param  {Object}  errorData
 * @return {Boolean}  true if the error can be treated as an error from the
 *   server, false otherwise.
 */
ErrorsService.prototype.isCherrypyError = function ( errorData ) {
  return errorData.data.hasOwnProperty( 'message' ) &&
    errorData.data.hasOwnProperty( 'status' );
};

ErrorsService.prototype.parseCherrypyError = function ( errorData ) {
  return new CherrypyError( errorData.data.status, errorData.data.message,
    errorData.data.traceback );
};


angular.module( 'imomoCaApp' ).service( 'Errors', ErrorsService );
