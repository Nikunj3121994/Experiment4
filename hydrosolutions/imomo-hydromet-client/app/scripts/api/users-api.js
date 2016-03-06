( function ( global ) {
  'use strict';

  /**
   * Constructor for the Users API. It creates a new instance of the API
   * service with the needed injectable dependencies.
   *
   * @class Users
   * @classdesc API service to interact with the /users endpoint in the
   *            backend.
   * @param {external:angular.$http} $http Injected $http service.
   * @param {external:String} backend The URL of the data backend.
   */
  function Users( $http, backend ) {
    /**
     * Internal reference to the $http service.
     *
     * @name Users#_http
     * @type {external:angular.$http}
     * @protected
     */
    this._http = $http;
    /**
     * Internal reference to the URL of the backend.
     *
     * @name Users#_backend
     * @type {external:angular.$http}
     * @protected
     */
    this._backend = backend;
  }

  /**
   * Array of injectable dependencies for the service.
   *
   * @protected
   * @static
   * @memberOf Users
   * @type {Array.<external:String>}
   */
  Users.$inject = [ '$http', 'backend' ];

  /**
   * Call the backend to retrieve the information about the current user.
   * The current user is determined by the access token attached by the
   * corresponding HTTP interceptor, if there is a user already logged in.
   *
   * @public
   * @instance
   * @memberOf Users
   * @return {external:angular.$q.Promise} A promise that resolves to an array
   *                                       of {@link User} objects with a
   *                                       single element.
   */
  function getMe() {
    var promise = this._http( {
      url: this._backend + '/users/me',
      method: 'GET'
    } );
    return promise;
  }
  Users.prototype.getMe = getMe;

  /**
   * Call the backend to register a new user.
   * The information about the new user is passed as User instance and
   * must have the toServerObject method to produce a JSON compatible
   * object.
   *
   * @public
   * @instance
   * @memberOf Users
   * @param {User} user The new user to register.
   * @return {external:angular.$q.Promise} A promise that resolves to an empty
   *                                       response if the user was created
   *                                       successfully.
   */
  function registerUser( user ) {
    var promise = this._http( {
      url: this._backend + '/users',
      method: 'POST',
      data: user.toServerObject()
    } );
    return promise;
  }
  Users.prototype.registerUser = registerUser;

  global.angular.module( 'imomoCaApp' )
    .service( 'Users', Users );

} )( window );
