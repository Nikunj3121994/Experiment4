( function ( global ) {
  'use strict';
  /**
   * Constructor for the controller of the bulletin page.
   *
   * @class BulletinCtrl
   * @classdesc The controller class for the bulletin generation page.
   * @param {Array.<Site>} sites Resolved list of sites provided by the
   *                             backend.
   * @param {Object} $window AngularJS wrapper around the browser window
   *                         object.
   * @param {DataValues} DataValues DataValues API service.
   * @param {Localization} Localization Localization service.
   */
  function BulletinCtrl( sites, $window, DataValues, Localization ) {
    /**
     * AngularJS proxy to the global Window object.
     *
     * @name BulletinCtrl#_window
     * @type {Object}
     * @protected
     */
    this._window = $window;
    /**
     * Array of available sites in the backend.
     *
     * @name BulletinCtrl#sites
     * @type {Array.<Site>}
     * @public
     */
    this.sites = sites;
    /**
     * Object with the sites indexed by site ID.
     *
     * @name BulletinCtrl#sitesIndex
     * @type {Object}
     * @public
     */
    this.sitesIndex = _.indexBy( this.sites, function ( site ) {
      return site.id;
    } );
    /**
     * DataValues API service.
     *
     * @name BulletinCtrl#_dataValues
     * @type {DataValues}
     * @protected
     */
    this._dataValues = DataValues;
    /**
     * Auxiliary function for localizing error messages.
     *
     * @name BulletinCtrl#localizeError
     * @type {Function}
     * @public
     */
    this.localizeError = Localization.localizeError.bind( Localization );
    /**
     * Auxiliary function for localizing dates.
     *
     * @name BulletinCtrl#localizeError
     * @type {Function}
     * @public
     */
    this.localizeDate = Localization.localizeDate.bind( Localization );

    /**
     * Array of sites selected for bulletin generation.
     *
     * @name BulletinCtrl#selectedSites
     * @type {Array.<Site>}
     * @public
     */
    this.selectedSites = [];
    /**
     * User-selected date for the bulletin generation.
     *
     * @name BulletinCtrl#date
     * @type {Date}
     */
    this.date = new Date();
    /**
     * The maximum date for the date picker.
     *
     * @name BulletinCtrl#maxDate
     * @type {Date}
     * @public
     */
    this.maxDate = new Date();
    /**
     * State variable that indicate whether the date picker is opened.
     *
     * @name BulletinCtrl#dateOpen
     * @type {Boolean}
     * @public
     * @default false
     */
    this.dateOpen = false;
    /**
     * The localized format string for the date input.
     *
     * @name BulletinCtrl#dateFormat
     * @type {string}
     */
    this.dateFormat = Localization.getDateFormat();
    /**
     * State variable that indicates that the bulletin is being compiled in
     * the backend.
     *
     * @name BulletinCtrl#dateOpen
     * @type {Boolean}
     * @public
     * @default false
     */
    this.generatingBulletin = false;
    /**
     * Object holding any possible error generated while producing the
     * bulletin.
     *
     * @name BulletinCtrl#bulletinError
     * @type {Object}
     * @public
     * @default null
     */
    this.bulletinError = null;
    /**
     * A string containing an object URL to the last generated bulletin.
     *
     * @name BulletinCtrl#downloadLink
     * @type {String}
     * @public
     * @default null
     */
    this.downloadLink = null;

    this.loadSiteList();
  }

  /**
   * The list of injectable dependencies for the controller.
   *
   * @protected
   * @static
   * @memberOf BulletinCtrl
   * @type {Array.<String>}
   */
  BulletinCtrl.$inject = [ 'sites', '$window', 'DataValues', 'Localization' ];


  /**
   * Key for the site list in local storage.
   *
   * @private
   * @static
   * @memberOf BulletinCtrl
   * @type {String}
   */
  var SITE_LIST_KEY = 'imomo_sitelist_bulletin';

  /**
   * Loads the site list from local storage and populate the selected sites
   * from it.
   *
   * The list is expected to have the format produced by the
   * @{link BulletinCtrl#storeSiteList} method.
   *
   * @protected
   * @instance
   * @memberOf BulletinCtrl
   */
  function loadSiteList() {
    if ( this._window.localStorage !== undefined ) {
      var retrievedKey = this._window.localStorage.getItem( SITE_LIST_KEY );
      if ( retrievedKey !== null ) {
        try {
          var siteList = JSON.parse( retrievedKey );
          siteList.forEach( function ( siteId ) {
            if ( this.sitesIndex[ siteId ] !== undefined ) {
              this.selectedSites.push( this.sitesIndex[ siteId ] );
              this.sites.splice(
                this.sites.indexOf( this.sitesIndex[ siteId ] ) );
            }
          }, this );
        } catch ( e ) {
          this._window.localStorage.removeItem( SITE_LIST_KEY );
        }
      }
    }
  }
  BulletinCtrl.prototype.loadSiteList = loadSiteList;

  /**
   * Stores the current site list in local storage. This only stores the site
   * IDs.
   *
   * @protected
   * @instance
   * @memberOf BulletinCtrl
   */
  function storeSiteList() {
    if ( this._window.localStorage !== undefined ) {
      this._window.localStorage.setItem( SITE_LIST_KEY,
        JSON.stringify( _.pluck( this.selectedSites, 'id' ) ) );
    }
  }
  BulletinCtrl.prototype.storeSiteList = storeSiteList;

  /**
   * Adds the currently selected site to the array of sites.
   *
   * @public
   * @instance
   * @memberOf BulletinCtrl
   * @param {angular.event} $event The click event that triggered the addition.
   */
  function addSite( $event ) {
    $event.preventDefault();
    var index = this.sites.indexOf( this.siteToAdd );
    this.selectedSites.push( this.sites.splice( index, 1 )[ 0 ] );
    this.siteToAdd = null;
    this.storeSiteList();
    this.invalidateLink();
  }
  BulletinCtrl.prototype.addSite = addSite;

  /**
   * Removes the site with the given index from the list of selected sites.
   *
   * @public
   * @instance
   * @memberOf BulletinCtrl
   * @param  {angular.event} $event The click event that triggered the removal.
   * @param  {Number} $index The index of the station to remove.
   */
  function removeSite( $event, $index ) {
    $event.preventDefault();
    this.sites.push( this.selectedSites.splice( $index, 1 )[ 0 ] );
    this.storeSiteList();
    this.invalidateLink();
  }
  BulletinCtrl.prototype.removeSite = removeSite;

  /**
   * Opens the date picker pop-up element in the page.
   *
   * @public
   * @instance
   * @memberOf BulletinCtrl
   * @param  {angular.event} $event The click event on the pop-up button.
   */
  function openDatePicker( $event ) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dateOpen = true;
  }
  BulletinCtrl.prototype.openDatePicker = openDatePicker;

  /**
   * Invalidates the current download link, this should be called whenever
   * the displayed options do not match the last generated bulletin.
   *
   * @protected
   * @instance
   * @memberOf BulletinCtrl
   */
  function invalidateLink() {
    this.downloadLink = null;
  }
  BulletinCtrl.prototype.invalidateLink = invalidateLink;

  /**
   * Requests the bulletin from the server and registers the callbacks
   * for when the bulletin is received.
   *
   * @public
   * @instance
   * @memberOf BulletinCtrl
   * @param  {angular.event} $event The click event on the generate button.
   */
  function generateBulletin( $event ) {
    $event.preventDefault();
    this.generatingBulletin = true;
    this._dataValues.requestBulletin( this.selectedSites, moment( this.date ) )
      .then( this.onBulletinGenerated.bind( this ) )
      .catch( this.onBulletinError.bind( this ) );
  }
  BulletinCtrl.prototype.generateBulletin = generateBulletin;

  /**
   * Handler for a successful bulletin request, it receives the generated
   * bulletin and provides a download link for it.
   *
   * @protected
   * @instance
   * @memberOf BulletinCtrl
   * @param  {Array.<!Bulletin>} bulletinData
   */
  function onBulletinGenerated( bulletinData ) {
    this.downloadLink = bulletinData[0].bulletinUrl;
    this.generatingBulletin = false;
  }
  BulletinCtrl.prototype.onBulletinGenerated = onBulletinGenerated;

  /**
   * Handler for errors when generating the bulletin data. It localizes
   * the server errors and sets it for display.
   *
   * @protected
   * @instance
   * @memberOf BulletinCtrl
   * @param  {ServerError} error A error instance with more information about
   *                             what went wrong.
   */
  function onBulletinError( error ) {
    this.bulletinError = this.localizeError( error.errorCode );
    this.generatingBulletin = false;
  }
  BulletinCtrl.prototype.onBulletinError = onBulletinError;

  /**
   * Closes the error alert by removing the error object.
   *
   * @public
   * @instance
   * @memberOf BulletinCtrl
   */
  function closeErrorAlert() {
    this.bulletinError = null;
  }
  BulletinCtrl.prototype.closeErrorAlert = closeErrorAlert;

  global.angular.module( 'imomoCaApp' )
    .controller( 'BulletinCtrl', BulletinCtrl );

} )( window );
