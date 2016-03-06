( function ( global ) {
  'use strict';

  /**
   * Constructor for the Sources API. It creates a new instance of the API
   * service with the needed injectable dependencies.
   *
   * @class  Sources
   * @classdesc API service to interact with the /sources endpoint in the
   *            backend.
   * @param {external:angular.$http} $http Injected $http service.
   * @param {external:String} backend The URL of the data backend.
   */
  function Sources( $http, backend ) {
    /**
     * Internal reference to the $http service.
     *
     * @name Sources#_http
     * @type {external:angular.$http}
     * @protected
     */
    this._http = $http;
    /**
     * Internal reference to the URL of the backend.
     *
     * @name Sources#_backend
     * @type {external:String}
     * @protected
     */
    this._backend = backend;
  }

  /**
   * Array of injectable dependencies for the service.
   *
   * @protected
   * @static
   * @memberOf Sources
   * @type {Array.<external:String>}
   */
  Sources.$inject = [ '$http', 'backend' ];


  /**
   * Calls the backend to retrieve all registered data sources in the system.
   *
   * @public
   * @instance
   * @memberOf Sources
   * @return {external:angular.$q.Promise} A promise that resolves to an
   *                                       array of {@link Source} objects.
   */
  function getAll () {
    var promise = this._http( {
      url: this._backend + '/sources',
      method: 'GET'
    } );
    return promise;
  }
  Sources.prototype.getAll = getAll;

  global.angular.module( 'imomoCaApp' )
    .service( 'Sources', Sources );

} )( window );
