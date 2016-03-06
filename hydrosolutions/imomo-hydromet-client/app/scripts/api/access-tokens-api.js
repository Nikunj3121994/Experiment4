( function ( global ) {
  'use strict';

  /**
   * Constructor for the singleton service for access tokens.
   *
   * @class AccessTokens
   * @classdesc API service to interact with the /access_tokens endpoint in
   *            the server.
   * @param {external:angular.$http} $http The injected $http service.
   * @param {external:String} backend The URL for the backend.
   */
  function AccessTokens( $http, backend ) {
    /**
     * Internal reference to the $http service.
     *
     * @name AccessTokens#_http
     * @type {external:angular.$http}
     * @protected
     */
    this._http = $http;
    /**
     * Internal reference to the backend URL
     *
     * @name AccessTokens#_backend
     * @type {external:String}
     * @protected
     */
    this._backend = backend;
    /**
     * Endpoint to make the requests.
     *
     * @name AccessTokens#endpoint
     * @type {external:String}
     * @protected
     */
    this.endpoint = this._backend + '/access_tokens';
  }

  /**
   * Array of injected dependencies for the service.
   *
   * @protected
   * @static
   * @memberOf AccessTokens
   * @type {Array.<external:String>}
   */
  AccessTokens.$inject = [ '$http', 'backend' ];

  /**
   * Makes a POST request to the server to retrieve the access tokens that
   * allows authentication as the user with the given username or e-mail.
   *
   * The token is only issued if the credentials match a user in the database.
   *
   * @public
   * @instance
   * @memberOf AccessTokens
   * @param  {external:String} usernameOrEmail The username or e-mail
   *                                           to authenticate.
   * @param  {external:String} password The plaintext password.
   * @return {external:angular.$q.Promise} A promise that resolves to an array
   *                                       of {@link AccessToken} objects with
   *                                       a single entry if the credentials
   *                                       are valid.
   */
  AccessTokens.prototype.getToken = function ( usernameOrEmail, password ) {
    var promise = this._http( {
      url: this.endpoint,
      method: 'POST',
      data: {
        usernameOrEmail: usernameOrEmail,
        password: password
      }
    } );
    return promise;
  };

  /**
   * Makes an authenticated GET request to the server to retrieve a pre-signed
   * URL that can be used to upload a file to a S3 bucket.
   *
   * @public
   * @instance
   * @memberOf AccessTokens
   * @return {external:angular.$q.Promise} A promise that resolves to a
   *                                       {@link AWSSignedUrl} object.
   */
  AccessTokens.prototype.getAwsUrl = function () {
    var promise = this._http( {
      url: this.endpoint + '/aws',
      method: 'GET'
    } );
    return promise;
  };

  /**
   * Makes an authenticated GET request to the server to retrieve the signed
   * form data to use for a POSt upload to a S3 bucket.
   *
   * @public
   * @instance
   * @memberOf AccessTokens
   * @return {external:angular.$q.Promise} A promise that resolves to a
   *                                       {@link AWSFormData} object.
   */
  AccessTokens.prototype.getAwsFormData = function () {
    var promise = this._http( {
      url: this.endpoint + '/awsform',
      method: 'GET'
    } );
    return promise;
  };

  global.angular.module( 'imomoCaApp' )
    .service( 'AccessTokens', AccessTokens );

} )( window );


( function ( global ) {
  'use strict';

  /**
   * Factory function that returns the constructor for the {@link AWSSignedUrl}
   * class.
   */
  function AWSSignedUrlFactory() {
    /**
     * Constructor that initializes the properties of the class with the given
     * object.
     *
     * @class AWSSignedUrl
     * @classdesc Model that provides a client-side object to capture the
     *            response to a request for an AWS URL.
     * @param {Object} options The properties to initialize the instance.
     */
    function AWSSignedUrl( options ) {
      options = options || {};
      /**
       * The signed URL.
       *
       * @name AWSSignedUrl#signedUrl
       * @type {external:String}
       * @public
       * @default null
       */
      this.signedUrl = options.signedUrl || null;
    }

    /**
     * Factory function to create a new instance of the class from a serialized
     * JSON object from the server.
     *
     * @public
     * @static
     * @memberOf AWSSignedUrl
     * @param  {Object} serverSignedUrl The serialized JSON object.
     * @return {AWSSignedUrl} The new client-side instance.
     */
    AWSSignedUrl.fromServerObject = function ( serverSignedUrl ) {
      return new AWSSignedUrl( serverSignedUrl );
    };

    return AWSSignedUrl;
  }

  global.angular.module( 'imomoCaApp' )
    .factory( 'AWSSignedUrl', AWSSignedUrlFactory );

} )( window );

( function ( global ) {
  'use strict';

  /**
   * Factory function that returns the constructor for the {@link AWSFormData}
   * class.
   */
  function AWSFormDataFactory() {
    /**
     * Constructor that initializes the properties of the class with the given
     * object.
     *
     * @class AWSFormData
     * @classdesc Model that provides a client-side object to capture the
     *            response to a request for the form data to upload to AWS
     *            using POST.
     * @param {Object} options The properties to initialize the instance.
     */
    function AWSFormData( options ) {
      options = options || {};
      /**
       * The destination for the POST upload.
       *
       * @name AWSFormData#action
       * @type {external:String}
       * @public
       */
      this.action = options.action || null;
      /**
       * The set of fields to be submitted with the POST request.
       *
       * @name AWSFormData#fields
       * @type {Object}
       * @public
       */
      this.fields = options.fields || [];
    }

    /**
     * Factor function to create a new instance of the class from a serialized
     * JSON object from the server.
     *
     * @public
     * @static
     * @memberOf AWSFormData
     * @param {Object} serverFormData The serialized JSON object.
     * @return {AWSFormData} The new client side instance.
     */
    AWSFormData.fromServerObject = function ( serverFormData ) {
      return new AWSFormData( serverFormData );
    };

    return AWSFormData;
  }

  global.angular.module( 'imomoCaApp' )
    .factory( 'AWSFormData', AWSFormDataFactory );

} )( window );
