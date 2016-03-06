( function ( global ) {
  'use strict';

  /**
   * Constructor for the journal controller class.
   *
   * @class JournalCtrl
   * @classdesc Controller for the operational journal page.
   * @param {Array.<Site>} sites Array with all the sites retrieved from the
   *                             backend.
   * @param {DataValues} DataValues DataValues API service.
   * @param {Localization} Localization Localization service.
   * @param {external:angular.$window} $window The AngularJS wrapped window.
   */
  function JournalCtrl( sites, DataValues, Localization, $window ) {
    /**
     * List of available sites in the backend.
     *
     * @name JournalCtrl#sites
     * @type {Array.<Site>}
     * @public
     */
    this.sites = sites;
    /**
     * Object with the sites indexed by site ID.
     *
     * @name JournalCtrl#sitesIndex
     * @type {Object}
     * @public
     */
    this.sitesIndex = _.indexBy( this.sites, function ( site ) {
      return site.id;
    } );
    /**
     * Internal reference to the DataValues API service.
     *
     * @name JournalCtrl#dataValuesApi
     * @type {DataValues}
     * @protected
     */
    this.dataValuesApi = DataValues;

    this.localizeDate = Localization.localizeDate.bind( Localization );
    this.localizeDateTime = Localization.localizeDateTime.bind( Localization );
    this.localizeError = Localization.localizeError.bind( Localization );
    /**
     * Internal reference to the $window service.
     *
     * @name JournalCtrl#_window
     * @type {external:angular.$window}
     * @protected
     */
    this._window = $window;
    /**
     * State variable that indicates whether the date popup is open.
     *
     * @name JournalCtrl#dateOpen
     * @type {Boolean}
     * @public
     * @default false
     */
    this.dateOpen = false;
    /**
     * Variable that indicates the default mode for the date picker.
     *
     * @name JournalCtrl#dateMode
     * @type {external:String}
     * @public
     * @default 'month'
     */
    this.dateMode = 'month';
    /**
     * Object that contains extra options for the datePicker.
     * The minMode property needs to be passed this way as a workaround.
     *
     * @see {@link https://github.com/angular-ui/bootstrap/issues/2618|#2618}.
     * @name JournalCtrl#dateOptions
     * @property {external:String} minMode
     *           The minimum mode allowed for the date picker.
     * @type {Object}
     * @public
     */
    this.dateOptions = {
      minMode: 'month'
    };
    /**
     * @name JournalCtrl#date
     * @type {Date}
     */
    this.date = new Date();
    /**
     * @type {string}
     */
    this.dateFormat = Localization.getMonthFormat();
    /**
     * State variable that indicates that the journal data is being loaded
     * from the server.
     *
     * @name JournalCtrl#loadingJournalData
     * @type {Boolean}
     * @public
     * @default false
     */
    this.loadingJournalData = false;
    /**
     * State variable that indicates whether the journal data was loaded
     * successfully from the server.
     *
     * @name JournalCtrl#journalLoaded
     * @type {Boolean}
     * @public
     * @default false
     */
    this.journalLoaded = false;
    /**
     * Variable that holds the localized data error when there is a server
     * error while loading the data.
     *
     * @name JournalCtrl#journalDataError
     * @type {String}
     * @public
     * @default null
     */
    this.journalDataError = null;
    /**
     * List of sites selected for the operational data journal display.
     *
     * @name JournalCtrl#selectedSites
     * @type {Array.<Site>}
     * @public
     */
    this.selectedSites = [];
    /**
     * The journal data retrieved from the server for the selected sites.
     *
     * @name JournalCtrl#sitesJournalData
     * @type {Array.<JournalSiteData>}
     * @public
     * @default Empty array
     */
    this.sitesJournalData = [];
    /**
     * The journal data object built from the server response.
     *
     * @name JournalCtrl#journal
     * @type {JournalData}
     * @public
     * @default null
     */
    this.journal = null;

    this.loadSiteList();
  }

  /**
   * Injectable dependencies for the controller.
   *
   * @protected
   * @static
   * @memberOf JournalCtrl
   * @type {Array.<external:String>}
   */
  JournalCtrl.$inject = [ 'sites', 'DataValues', 'Localization',
    '$window'
  ];

  /**
   * Opens the date picker popup.
   *
   * @public
   * @instance
   * @memberOf JournalCtrl
   * @param  {angular.event} $event The click event on the popup button.
   */
  function openDatePicker( $event ) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dateOpen = true;
  }
  JournalCtrl.prototype.openDatePicker = openDatePicker;

  /**
   * Key for the site list in local storage.
   *
   * @private
   * @static
   * @memberOf JournalCtrl
   * @type {String}
   */
  var SITE_LIST_KEY = 'imomo_sitelist_journal';

  /**
   * Loads the site list from local storage and populate the selected sites
   * from it.
   *
   * The list is expected to have the format produced by the
   * @{link JournalCtrl#storeSiteList} method.
   *
   * @protected
   * @instance
   * @memberOf JournalCtrl
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
  JournalCtrl.prototype.loadSiteList = loadSiteList;

  /**
   * Stores the current site list in local storage. This only stores the site
   * IDs.
   *
   * @protected
   * @instance
   * @memberOf JournalCtrl
   */
  function storeSiteList() {
    if ( this._window.localStorage !== undefined ) {
      this._window.localStorage.setItem( SITE_LIST_KEY,
        JSON.stringify( _.pluck( this.selectedSites, 'id' ) ) );
    }
  }
  JournalCtrl.prototype.storeSiteList = storeSiteList;

  /**
   * Adds the currently selected site to the array of sites.
   *
   * @public
   * @instance
   * @memberOf JournalCtrl
   * @param {angular.event} $event The click event that triggered the addition.
   */
  function addSite( $event ) {
    $event.preventDefault();
    var index = this.sites.indexOf( this.site );
    this.selectedSites.push( this.sites.splice( index, 1 )[ 0 ] );
    this.site = null;
    this.storeSiteList();
  }
  JournalCtrl.prototype.addSite = addSite;

  /**
   * Removes the site with the given index from the list of selected sites.
   *
   * @public
   * @instance
   * @memberOf JournalCtrl
   * @param  {angular.event} $event The click event that triggered the removal.
   * @param  {Number} $index The index of the station to remove.
   */
  function removeSite( $event, $index ) {
    $event.preventDefault();
    if ( this.loadingJournalData || this.journalLoaded ||
      this.journalDataError ) {
      return;
    }
    this.sites.push( this.selectedSites.splice( $index, 1 )[ 0 ] );
    this.storeSiteList();
  }
  JournalCtrl.prototype.removeSite = removeSite;

  /**
   * Sends a request for the journal data to the backend.
   *
   * @public
   * @instance
   * @memberOf JournalCtrl
   * @param  {angular.event} $event The click event that triggered the request.
   */
  function displayJournal( $event ) {
    $event.preventDefault();
    this.loadingJournalData = true;
    this.dataValuesApi.getJournalData( this.selectedSites,
        moment(this.date) ).then( this.onJournalDataLoaded.bind( this ) )
      .catch( this.onJournalDataError.bind( this ) )
      .finally( this.onJournalDataFinished.bind( this ) );
  }
  JournalCtrl.prototype.displayJournal = displayJournal;

  /**
   * Processes the incoming journal data and prepares it for display in the
   * page.
   *
   * @public
   * @instance
   * @memberOf JournalCtrl
   * @param  {Array.<JournalData>} journalData
   *         An array with a single @{link JournalData} entry.
   */
  function onJournalDataLoaded( journalData ) {
    journalData = journalData[ 0 ];
    this.journal = journalData;
    this.sitesJournalData = this.journal.siteData;
    this.journalLoaded = true;
  }
  JournalCtrl.prototype.onJournalDataLoaded = onJournalDataLoaded;

  /**
   * Localizes and displays the server error received when loading the
   * journal data.
   *
   * @public
   * @instance
   * @memberOf JournalCtrl
   * @param {ServerError} error Error instance with details about what went
   *                             wrong.
   */
  function onJournalDataError( error ) {
    this.journalDataError = this.localizeError( error.errorCode );
  }
  JournalCtrl.prototype.onJournalDataError = onJournalDataError;

  /**
   * Changes the corresponding state variable to indicate that the loading
   * of the journal data is done, not necessarily successfully.
   *
   * @public
   * @instance
   * @memberOf JournalCtrl
   */
  function onJournalDataFinished() {
    this.loadingJournalData = false;
  }
  JournalCtrl.prototype.onJournalDataFinished = onJournalDataFinished;

  /**
   * Closes the current journal display so that a new query can be made.
   *
   * @public
   * @instance
   * @memberOf JournalCtrl
   * @param {angular.event} $event The click event that trigger the close
   *                               action.
   */
  function closeJournal( $event ) {
    $event.preventDefault();
    this.journalLoaded = false;
  }
  JournalCtrl.prototype.closeJournal = closeJournal;

  /**
   * Close the error alert by disposing of the error message.
   *
   * @public
   * @instance
   * @memberOf JournalCtrl
   */
  function closeErrorAlert() {
    this.journalDataError = null;
  }
  JournalCtrl.prototype.closeErrorAlert = closeErrorAlert;

  global.angular.module( 'imomoCaApp' )
    .controller( 'JournalCtrl', JournalCtrl );

} )( window );
