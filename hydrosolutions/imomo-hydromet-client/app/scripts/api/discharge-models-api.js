( function ( global ) {
  'use strict';

  /**
   * Constructor for the DischargeModels API. It creates a new instance of the
   * API service with the needed injectable dependencies.
   *
   * @class DischargeModels
   * @classdesc API service to interact with the /discharge_models endpoint
   *            in the backend.
   * @param {external:angular.$http} $http Injected $http service.
   * @param {external:String} backend The URL of the data backend.
   * @param {HydroYear} HydroYear Service to resolve hydrological years.
   *
   */
  function DischargeModels( $http, backend, HydroYear ) {
    /**
     * Internal reference to the $http service.
     *
     * @name DischargeModels#_http
     * @type {external:angular.$http}
     * @protected
     */
    this._http = $http;
    /**
     * Internal reference to the URL of the backend.
     *
     * @name DischargeModels#_backend
     * @type {external:String}
     * @protected
     */
    this._backend = backend;
    /**
     * The full string composed of the backend URL and endpoint.
     *
     * @name DischargeModels#endpoint
     * @type {external:String}
     * @protected
     */
    this.endpoint = this._backend + '/discharge_models';
    /**
     * Internal reference to the {@link HydroYear|hydrological year} service.
     *
     * @name DischargeModels#hydroYearSvc
     * @type {HydroYear}
     * @protected
     */
    this.hydroYearSvc = HydroYear;
  }

  /**
   * Array of injectable dependencies for the service.
   *
   * @protected
   * @memberOf DischargeModels
   * @type {Array.<external:String>}
   */
  DischargeModels.$inject = [ '$http', 'backend', 'HydroYear' ];

  /**
   * Makes a POST request to the server to create a new discharge model
   * and associate it with the given site, if the user is allowed according
   * to his organization association.
   *
   * @public
   * @instance
   * @memberOf DischargeModels
   * @param {DischargeModel} dischargeModel The discharge model to create.
   *        It must contain a valid {@link DischargeModel#siteId|siteId}.
   * @return {external:angular.$q.Promise} Promise that resolves to an empty
   *                                       response if the discharge model is
   *                                       created successfully.
   */
  DischargeModels.prototype.submitDischargeModel =
    function ( dischargeModel ) {
      var promise = this._http( {
        url: this.endpoint,
        method: 'POST',
        data: dischargeModel.toServerObject()
      } );
      return promise;
    };

  /**
   * Makes a GET request to the server to retrieve all discharge models
   * associated to the site for the current hydrological year. If no
   * model has been created in the current hydrological year,
   * then it is expected that the server will return the latest model
   * regardless of age.
   *
   * @public
   * @instance
   * @memberOf DischargeModels
   * @param {Number} siteId The site's id.
   * @return {external:angular.$q.Promise} Promise that resolves to an array
   *                                       of {@link DischargeModel} instances.
   */
  DischargeModels.prototype.getCurrentYearModelsForSite = function ( siteId ) {
    var promise = this._http( {
      url: this.endpoint,
      method: 'GET',
      params: {
        siteId: siteId,
        hydroYear: this.hydroYearSvc.getYearForDate( moment() )
      }
    } );
    return promise;
  };

  global.angular.module( 'imomoCaApp' )
    .service( 'DischargeModels', DischargeModels );

} )( window );
