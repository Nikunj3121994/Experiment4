( function ( global ) {
  'use strict';

  /**
   * Factory function for the ServerError class.
   *
   * @return {ServerError#constructor} The constructor for the class.
   */
  function ServerErrorFactory () {

    /**
     * Constructor the ServerError class. It creates an instance of an error
     * coming from the backend with the given properties.
     *
     * @class ServerError
     * @classdesc ServerError which represent an standard JSON error emitted
     *            by the server when a request is not successful.
     * @param {Object} options Properties to initialize the object.
     */
    function ServerError ( options ) {
      options = options || {};
      /**
       * The standard error code defined in the backend.
       *
       * @name ServerError#errorCode
       * @type {external:String}
       * @public
       * @default null
       */
      this.errorCode = options.errorCode || null;

      /**
       * The type of error, this is the name of the class on the server
       * application code. Usually this is not presented to the user.
       *
       * @name ServerError#errorType
       * @type {external:String}
       * @public
       * @default null
       */
      this.errorType = options.errorType || null;

      /**
       * Extra details sent from the server, note that this can not be
       * localized on the client side and any localization should have been
       * done by the server.
       *
       * @name ServerError#details
       * @type {external:String}
       * @public
       * @default null
       */
      this.details = options.details || null;

    }

    /**
     * Indicates whether the current instance is a proper server error.
     * By default is true and it is a enumerable, read-only property.
     *
     * @name ServerError#isServerError
     * @type {Boolean}
     * @public
     * @default true
     */
    Object.defineProperty( ServerError.prototype, 'isServerError', {
      enumerable: true,
      value: true
    } );

    ServerError.isServerError = function ( error ) {
      if ( error ) {
        return error.isServerError;
      }
      return false;
    };

    ServerError.isError = function ( jsonError ) {
      return jsonError.data && jsonError.data.errorCode && jsonError.data.errorType;
    };

    /**
     * Factory function to create a new {@link ServerError} instance from
     * a JSON error response from the backend
     *
     * @static
     * @memberOf ServerError
     * @param  {Object} jsonError A JSON error response from the server.
     * @return {ServerError} The client-side instance of the error.
     */
    function fromServerObject ( jsonError ) {
      return new ServerError( jsonError.data );
    }
    ServerError.fromServerObject = fromServerObject;

    return ServerError;
  }

  global.angular.module( 'imomoCaApp' )
    .factory( 'ServerError', ServerErrorFactory );

} )( window );
