( function ( global ) {
  'use strict';
  /**
   * Creates a controller for the first step in the new station page.
   *
   * @class NewStationCtrl
   * @classdesc Controller for the first step in the new station page, it
   *            provides access to the Lexicon and the storage object
   *            to input the details of the new site.
   * @param {Sites} Sites The Sites API service.
   * @param {Site.constructor} Site Constructor for the Site class.
   * @param {Lexicon} Lexicon The Lexicon service which provides validation
   *                          rules for the site.
   * @param {Object} $state AngularJS-UI state service.
   */
  function NewStationCtrl( Sites, Site, Lexicon, $state ) {
    /**
     * Internal reference to the Sites API service.
     *
     * @name NewStationCtrl#_sites
     * @type {Sites}
     * @protected
     */
    this._sites = Sites;
    /**
     * Reference to the state service.
     *
     * @name NewStationCtrl#_state
     * @type {Object}
     * @protected
     */
    this._state = $state;
    /**
     * Reference to the lexicon for Site models.
     *
     * @name NewStationCtrl#sitesLexicon
     * @type {Object}
     * @public
     */
    this.sitesLexicon = Lexicon.sites;
    /**
     * The station object to be edited by the user.
     *
     * @name NewStationCtrl#newSite
     * @type {Site}
     * @public
     */
    this.newSite = new Site();
    /**
     * State variable that indicates when the input is disabled from further
     * editing.
     *
     * @name NewStationCtrl#inputDisabled
     * @type {Boolean}
     * @public
     * @default false
     */
    this.inputDisabled = false;
    /**
     * Flag that indicates when a site has been successfully created in the
     * backend.
     *
     * @name NewStationCtrl#siteCreated
     * @type {Boolean}
     * @public
     * @default false
     */
    this.siteCreated = false;
    /**
     * Container for any error generated while creating a new site in the
     * backend.
     *
     * @name NewStationCtrl#siteCreateError
     * @type {ServerError}
     * @public
     * @default null
     */
    this.siteCreateError = null;
  }

  /**
   * Array of injectable dependencies for the controller.
   *
   * @protected
   * @static
   * @memberOf NewStationCtrl
   * @type {Array.<String>}
   */
  NewStationCtrl.$inject = [ 'Sites', 'Site', 'Lexicon', '$state' ];

  /**
   * Submit a request to the backend to the store the new site.
   *
   * This request stores the basic information about the site and if
   * successful it then informs the user about the next steps to get the
   * site ready for use (i.e. discharge model creation and norm upload).
   *
   * @public
   * @instance
   * @memberOf NewStationCtrl
   * @param {angular.event} $event The click event that initiated the
   *                                change of state.
   */
  function storeSite( $event ) {
    $event.preventDefault();
    this.inputDisabled = true;
    this._sites.createSite( this.newSite )
      .then( this.onSiteCreated.bind( this ) )
      .catch( this.onSiteCreateError.bind( this ) );
  }
  NewStationCtrl.prototype.storeSite = storeSite;

  /**
   * Handle a successful response from the server when creating a new site.
   *
   * The controller enables the display of a success message that also
   * indicates the next step to make the site fully functional.
   *
   * @protected
   * @instance
   * @memberOf NewStationCtrl
   */
  function onSiteCreated() {
    this.siteCreated = true;
  }
  NewStationCtrl.prototype.onSiteCreated = onSiteCreated;

  /**
   * Handle an error response from the server when creating a new site.
   *
   * The controller passes the error to the alert directive in order to
   * display it for the user.
   *
   * @protected
   * @instance
   * @memberOf NewStationCtrl
   * @param {ServerError} err The error generated by the server while creating
   *                          the new site.
   */
  function onSiteCreateError( err ) {
    this.siteCreateError = err;
  }
  NewStationCtrl.prototype.onSiteCreateError = onSiteCreateError;

  /**
   * Close the error alert when request by the user, and enable the form again
   * for modification.
   *
   * @public
   * @instance
   * @memberOf NewStationCtrl
   */
  function closeErrorAlert() {
    this.siteCreateError = null;
    this.inputDisabled = false;
  }
  NewStationCtrl.prototype.closeErrorAlert = closeErrorAlert;

  global.angular.module( 'imomoCaApp' )
    .controller( 'NewStationCtrl', NewStationCtrl );

} )( window );
