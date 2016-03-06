( function ( global ) {
  'use strict';

  /**
   * Constructor for the controller for the view with the site details.
   *
   * @class SiteDetailsCtrl
   * @classdesc The controller for the site details simply binds the selected
   *            site in order to expose it to the view. It also provides
   *            access to the lexicon to validate any edits to the site's
   *            information. Finally it allows the user to submit any
   *            edits to the server.
   * @param {Array.<Site>} siteInfo The resolved site information.
   * @param {Array.<DataValue>} siteSafeDischarge The resolved maximum safe
   *                                              discharge for the site.
   * @param {Object} $state The ui-router $state service.
   * @param {Lexicon} Lexicon The lexicon service.
   * @param {Sites} Sites The Sites API service.
   */
  function SiteDetailsCtrl( siteInfo, siteSafeDischarge, $state, Lexicon,
    Sites ) {
    /**
     * Reference to the site being displayed and edited.
     *
     * @name SiteDetailsCtrl#siteInfo
     * @type {Site}
     * @public
     */
    this.site = siteInfo[ 0 ];
    if ( siteSafeDischarge.length ) {
      this.site.safeDischarge = siteSafeDischarge[ 0 ].dataValue;
    }
    /**
     * Internal reference to the $state service.
     *
     * @name SiteDetailsCtrl#_state
     * @type {Object}
     * @protected
     */
    this._state = $state;
    /**
     * Reference to the lexicon definitions for sites.
     *
     * @name SiteDetailsCtrl#sitesLexicon
     * @type {Object}
     * @public
     */
    this.sitesLexicon = Lexicon.sites;
    /**
     * Original JSON representation of the site, this is used to determine
     * if the user has made any changes to the site's information.
     *
     * @name SiteDetailsCtrl#originalSite
     * @type {Object}
     * @protected
     */
    this.originalSite = this.site.clone();
    /**
     * Flag that indicates when a modification is being submitted to the
     * server.
     *
     * @name SiteDetailsCtrl#modifying
     * @type {Boolean}
     * @public
     * @default false
     */
    this.modifying = false;
    /**
     * Internal reference to the Sites API.
     *
     * @name SiteDetailsCtrl#_sites
     * @type {Sites}
     * @public
     */
    this._sites = Sites;
    /**
     * Reference to any server error that may occur while editing a site.
     *
     * @name SiteDetailsCtrl#editError
     * @type {ServerError}
     * @public
     * @default null
     */
    this.editError = null;
  }

  /**
   * Indicates whether the site's information has been modified by the user.
   *
   * @public
   * @instance
   * @memberOf SiteDetailsCtrl
   * @return {Boolean} True if the site has been modified, false otherwise.
   */
  function isModified() {
    return !global.angular.equals( this.site, this.originalSite );
  }
  SiteDetailsCtrl.prototype.isModified = isModified;

  /**
   * Makes a request to the server to update the site with the new
   * information provided by the user.
   *
   * @public
   * @instance
   * @memberOf SiteDetailsCtrl
   * @param {Object} $event The click event that triggered the action.
   */
  function submitChanges( $event ) {
    $event.preventDefault();
    this.modifying = true;
    var diffObject = {};
    var differences = this.originalSite.diff( this.site );
    differences.forEach( function ( item ) {
      diffObject[ item ] = this.site[ item ];
    }, this );
    diffObject.id = this.originalSite.id;
    this._sites.editSite( diffObject ).then(
        this.onEditSuccess.bind( this ) )
      .catch( this.onEditError.bind( this ) );
  }
  SiteDetailsCtrl.prototype.submitChanges = submitChanges;

  /**
   * Handle a successful edit of the site information.
   *
   * This reloads the current state to reflect the changes in both the list
   * and the details view.
   *
   * @protected
   * @instance
   * @memberOf SiteDetailsCtrl
   */
  function onEditSuccess() {
    this._state.reload();
  }
  SiteDetailsCtrl.prototype.onEditSuccess = onEditSuccess;

  /**
   * Handle an error during the edit of the site information.
   *
   * This function exposes the server error for the user to take action.
   *
   * @protected
   * @instance
   * @memberOf SiteDetailsCtrl
   * @param {ServerError} err The error coming from the server.
   */
  function onEditError( err ) {
    this.editError = err;
  }
  SiteDetailsCtrl.prototype.onEditError = onEditError;

  /**
   * Close the error alert by nullifying the error object.
   *
   * It also releases the modifying lock, so that the user may try again.
   *
   * @public
   * @instance
   * @memberOf SiteDetailsCtrl
   */
  function closeErrorAlert() {
    this.editError = null;
    this.modifying = false;
  }
  SiteDetailsCtrl.prototype.closeErrorAlert = closeErrorAlert;

  /**
   * Array of injectable dependencies for the controller.
   *
   * @protected
   * @static
   * @memberOf SiteDetailsCtrl
   * @type {Array.<external:String>}
   */
  SiteDetailsCtrl.$inject = [ 'siteInfo', 'siteSafeDischarge', '$state',
    'Lexicon', 'Sites'
  ];

  global.angular.module( 'imomoCaApp' )
    .controller( 'SiteDetailsCtrl', SiteDetailsCtrl );

} )( window );
