( function ( global ) {
  'use strict';

  /**
   * Constructor for the DataValues API. It creates a new instance of the API
   * service with the needed injectable dependencies.
   *
   * @class DataValues
   * @classdesc API service to interact with the /data_values endpoint in the
   *            backend.
   * @param {external:angular.$http} $http Injected $http service.
   * @param {external:String} backend The URL of the data backend.
   * @param {external:angular.$q} $q Injected $q service.
   * @param {HydroYear} HydroYear Service to resolve hydrological years.
   */
  function DataValues( $http, backend, $q, HydroYear ) {
    /**
     * Internal reference to the $http service.
     *
     * @name DataValues#httpSvc
     * @type {external:angular.$http}
     * @protected
     */
    this.httpSvc = $http;
    /**
     * The URL for the backend.
     *
     * @name DataValues#backend
     * @type {external:angular.$http}
     * @protected
     */
    this.backend = backend;
    /**
     * Internal reference to the $q service.
     *
     * @name DataValues#qSvc
     * @type {external:angular.$q}
     * @protected
     */
    this.qSvc = $q;
    /**
     * The endpoint for the requests.
     *
     * @name DataValues#endpoint
     * @type {external:String}
     * @protected
     */
    this.endpoint = this.backend + '/data_values';
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
   * Injectable dependencies for the service.
   *
   * @protected
   * @static
   * @memberOf DataValues
   * @type {Array.<external:String>}
   */
  DataValues.$inject = [ '$http', 'backend', '$q', 'HydroYear' ];

  /**
   * Makes a GET request to the server backend to retrieve the water level for
   * a particular site on a particular date and time.
   *
   * @public
   * @instance
   * @memberOf DataValues
   * @return {external:angular.$q.Promise} A promise that resolves to an array
   *                                       with a {@link DataValue} instance.
   */
  DataValues.prototype.getWaterLevelForSite =
    function ( localDateTime, siteId ) {
      var promise = this.httpSvc( {
        url: this.endpoint + '/water_level',
        method: 'GET',
        params: {
          localDateTime: localDateTime.unix(),
          siteId: siteId
        }
      } );
      return promise;
    };

  /**
   * Makes a GET request to the server backend to retrieve the discharge
   * measurements for a particular site during the current hydrological
   * year.
   *
   * @public
   * @instance
   * @memberOf DataValues
   * @param {Number} siteId The id of the site of interest.
   * @return {external:angular.$q.Promise} A promise that resolves to an array
   *         of zero or more {@link DischargeMeasurementPair} instances.
   */
  DataValues.prototype.getCurrentYearDischargeDataForSite =
    function ( siteId ) {
      var promise = this.httpSvc( {
        url: this.endpoint + '/discharge',
        method: 'GET',
        params: {
          siteId: siteId,
          hydroYear: this.hydroYearSvc.getYearForDate( moment() )
        }
      } );
      return promise;
    };

  /**
   * Makes a POST request to the server backend to store the processed daily
   * input data and associated discharge model if a new one was created.
   *
   * @public
   * @instance
   * @memberOf DataValues
   * @param  {DischargeModel} dischargeModel The discharge model used for the
   *                                         calculations.
   * @param  {DailyOperationalData} dailyInputData Object with the input
   *                                               data.
   * @return {external:angular.$q.Promise} A promise that resolves to an empty
   *                                       response if successful.
   */
  DataValues.prototype.submitDailyOperationalData =
    function ( dischargeModel, dailyInputData ) {
      var promise = this.httpSvc( {
        url: this.endpoint + '/daily_data',
        method: 'POST',
        data: {
          dailyInputData: dailyInputData.toServerObject(),
          dischargeModel: dischargeModel.toServerObject()
        }
      } );
      return promise;
    };

  /**
   * Makes a GET request to the server backend to retrieve all data for the
   * operational journal for several sites.
   *
   * @public
   * @instance
   * @memberOf DataValues
   * @param {Array.<Site>} sites The sites for which the data is requested.
   * @param {Moment} date The month and year for which the data should be
   *                      displayed.
   * @return {external:angular.$q.Promise} Promise object that resolves to
   *                                       an array with a single
   *                                       {@link JournalData} entry if
   *                                       successful.
   */
  DataValues.prototype.getJournalData = function ( sites, date ) {
    var month = date.month() + 1;
    var year = date.year();
    var siteIds = _.pluck( sites, 'id' );
    var promise = this.httpSvc( {
      url: this.endpoint + '/journal',
      method: 'GET',
      params: {
        month: month,
        year: year,
        siteIds: siteIds
      }
    } );
    return promise;
  };

  /**
   * Makes a GET request to the server backend to retrieve the maximum safe
   * discharge value for a single site given its ID.
   *
   * @public
   * @instance
   * @memberOf DataValues
   * @param {Number} siteId The id of the site.
   * @return {external:angular.$q.Promise} Promise object that resolves to
   *                                       an array with zero or one
   *                                       {@link DataValue} entries if
   *                                       successful.
   */
  DataValues.prototype.getMaxSafeDischargeForSite = function ( siteId ) {
    var promise = this.httpSvc( {
      url: this.endpoint + '/safe_discharge',
      method: 'GET',
      params: {
        siteId: siteId
      }
    } );
    return promise;
  };

  /**
   * Makes a GET request to the server backend to retrieve the daily
   * bulletin for an array of sites.
   *
   * @public
   * @instance
   * @memberOf DataValues
   * @param  {Array.<!Site>}
   * @param  {!external:moment}
   * @return {external:angular.$q.Promise} Promise object that resolves to an
   *                                       array with one {@link Bulletin}
   *                                       entry if successful.
   */
  DataValues.prototype.requestBulletin = function ( siteArray, date ) {
    var siteIds = _.pluck( siteArray, 'id' );
    var promise = this.httpSvc( {
      url: this.endpoint + '/bulletin',
      method: 'GET',
      params: {
        year: date.year(),
        month: date.month() + 1,
        day: date.date(),
        siteIds: siteIds
      }
    } );
    return promise;
  };

  global.angular.module( 'imomoCaApp' )
    .service( 'DataValues', DataValues );

} )( window );
