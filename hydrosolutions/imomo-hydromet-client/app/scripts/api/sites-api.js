( function ( global ) {
  'use strict';


  /**
   * Constructor for the Sites API. It creates a new instance of the API
   * service with the needed injectable dependencies.
   *
   * @class Sites
   * @classdesc API service to interact with the /sites endpoint in the
   *            backend.
   * @param {external:angular.$http} $http Injected $http service.
   * @param {external:String} backend The URL of the data backend.
   */
  function Sites( $http, backend ) {
    /**
     * Internal reference to the $http service.
     *
     * @name Sites#_http
     * @type {external:angular.$http}
     * @protected
     */
    this._http = $http;
    /**
     * Internal reference to the URL of the backend.
     *
     * @name Sites#_backend
     * @type {external:String}
     * @protected
     */
    this._backend = backend;
    /**
     * The full endpoint to where the requests are directed.
     *
     * @name Sites#endpoint
     * @type {external:String}
     * @protected
     */
    this.endpoint = this._backend + '/sites';
  }

  /**
   * Injectable dependencies for the service.
   *
   * @protected
   * @static
   * @memberOf Sites
   * @type {Array.<external:String>}
   */
  Sites.$inject = [ '$http', 'backend' ];

  /**
   * Makes a GET request to the server backend to retrieve all sites
   * available in the organization of the current user.
   *
   * @public
   * @instance
   * @memberOf Sites
   * @return {external:angular.$q.Promise} Promise that resolves to a list
   *                                       of Sites objects if successful.
   */
  function getSites() {
    var promise = this._http( {
      url: this.endpoint,
      method: 'GET'
    } );
    return promise;
  }
  Sites.prototype.getSites = getSites;

  /**
   * Makes a POST request to the server to create a new site, the information
   * for the new site is passed as a {@link Site} instance populated by
   * the user.
   *
   * @public
   * @instance
   * @memberOf Sites
   * @param  {Site} site The instance which contains the information of the
   *                     site to create.
   * @return {external:angular.$q.Promise} Promise that resolves to an empty
   *                                       response if successful.
   */
  function createSite( site ) {
    var promise = this._http( {
      url: this.endpoint,
      method: 'POST',
      data: site.toServerObject()
    } );
    return promise;
  }
  Sites.prototype.createSite = createSite;

  /**
   * Makes a GET request to the server to retrieve a site given its
   * unique ID in the database.
   *
   * @public
   * @instance
   * @memberOf Sites
   * @param  {Number} siteId The id of the site.
   * @return {external:angular.$q.Promise} Promise that resolves to a list with
   *                                       one element if the site exists
   *                                       and it is accessible for
   *                                       the user.
   */
  function getSiteById( siteId ) {
    var promise = this._http( {
      url: this.endpoint + '/' + siteId.toString(),
      method: 'GET'
    } );
    return promise;
  }
  Sites.prototype.getSiteById = getSiteById;

  /**
   * Makes a GET request to the server to retrieve a site given its
   * unique local code.
   *
   * A site is only retrieved if the site is ready for use, i.e. it is fully
   * initialized already.
   *
   * @public
   * @instance
   * @memberOf Sites
   * @param {external:String} siteCode The site code to query.
   * @return {external:angular.$q.Promise} Promise that resolves to a list
   *                                       with one element if such site
   *                                       exists and it is ready.
   */
  function getReadySiteByCode( siteCode ) {
    var promise = this._http( {
      url: this.endpoint,
      method: 'GET',
      params: {
        siteCode: siteCode,
        ready: true
      }
    } );
    return promise;
  }
  Sites.prototype.getReadySiteByCode = getReadySiteByCode;

  /**
   * Makes a PUT request to the server to modify an existing site with
   * new information from the user.
   *
   * It is expected that only the changed properties of the site will be
   * passed as an argument to this function.
   *
   * @public
   * @instance
   * @memberOf Sites
   * @param  {Object} site A JSON object representing the modified properties
   *                       of the {@link Site}. Also the id must be included.
   * @return {external:angular.$q.Promise} Promise that resolves to an empty
   *                                       response if the update was
   *                                       successful.
   */
  function editSite( site ) {
    var promise = this._http( {
      url: this.endpoint + '/' + site.id,
      method: 'PUT',
      data: site
    } );
    return promise;
  }
  Sites.prototype.editSite = editSite;

  /**
   * Makes a GET request to the server retrieve the discharge norm for a site.
   *
   * The endpoint for this is: /sites/{siteId}/discharge_norm
   *
   * @public
   * @instance
   * @memberOf Sites
   * @param {Number} siteId The id of the site of interested.
   * @return {external:angular.$q.Promise} Promise that resolves to an object
   *                                       with the discharge norm
   *                                       values.
   */
  function siteDischargeNorm( siteId ) {
    var promise = this._http( {
      url: this.endpoint + '/' + siteId + '/discharge_norm',
      method: 'GET'
    } );
    return promise;
  }
  Sites.prototype.siteDischargeNorm = siteDischargeNorm;

  /**
   * Makes a POST request to the server to trigger the processing a previously
   * uploaded excel file with the discharge data. The file is expected to be
   * found in the S3 bucket for uploads.
   *
   * The endpoint for this is /sites/{siteId}/average_historic_discharge
   *
   * @public
   * @instance
   * @memberOf sites
   * @param {Number} siteId The id of the site.
   * @param {external:String} filename The name of the file, this is the suffix
   *                                   for the key in the bucket.
   * @return {external:angular.$q.Promise} Promise that resolves to an empty
   *                                       response if successful.
   */
  function storeSiteDischargeData( siteId, filename ) {
    var promise = this._http( {
      url: this.endpoint + '/' + siteId + '/average_historic_discharge',
      method: 'POST',
      data: {
        'filename': filename
      }
    } );
    return promise;
  }
  Sites.prototype.storeSiteDischargeData = storeSiteDischargeData;

  function getSiteDischargeData( siteId ) {
    var promise = this._http( {
      url: this.endpoint + '/' + siteId + '/average_historic_discharge',
      method: 'GET'
    } );
    return promise;
  }
  Sites.prototype.getSiteDischargeData = getSiteDischargeData;

  global.angular.module( 'imomoCaApp' ).service( 'Sites', Sites );

} )( window );
