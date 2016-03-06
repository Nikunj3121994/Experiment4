( function ( global ) {
  'use strict';

  /**
   * Structure for holding the options that accompany the site name in the
   * header.
   *
   * @typedef {BaseSiteCtrl~Option}
   * @type {Object}
   * @property {String} state The target state for the option.
   * @property {String} localizedLabel The label to display, already localized.
   * @property {String} icon The octicon to accompany the label.
   */

  /**
   * Constructor for the base site details controller.
   *
   * @class BaseSiteCtrl
   * @classdesc Controller for the base view for the site details section of
   *            the sites page.
   * @param {Array.<Site>} siteInfo Array with a single site corresponding to
   *                                the selected site.
   * @param {Localization} Localization The localization service
   * @param {Object} $state The ui-router $state service.
   */
  function BaseSiteCtrl( siteInfo, Localization, $state ) {
    /**
     * Reference to the selected site.
     *
     * @name BaseSiteCtrl#focusSite
     * @type {Site}
     * @public
     */
    this.focusSite = siteInfo[ 0 ];
    /**
     * The set of options available for the user.
     *
     * @name BaseSiteCtrl#options
     * @type {Array.<BaseSiteCtrl~Option>}
     * @public
     */
    this.options = [ {
      state: 'root.stations.home.overview.selected.details',
      localizedLabel: Localization
        .localize( 'stations.selected.options.details' ),
      icon: 'octicon-three-bars'
    }, {
      state: 'root.stations.home.overview.selected.curve',
      localizedLabel: Localization
        .localize( 'stations.selected.options.curve' ),
      icon: 'octicon-graph'
    }, {
      state: 'root.stations.home.overview.selected.norm',
      localizedLabel: Localization
        .localize( 'stations.selected.options.norm' ),
      icon: 'octicon-database'
    } ];
    /**
     * The selected option.
     *
     * @name BaseSiteCtrl#selectedOption
     * @type {BaseSiteCtrl~Option}
     * @public
     */
    this.selectedOption = _.find( this.options, function ( option ) {
      return option.state === $state.current.name;
    } );
  }

  /**
   * Change the currently selected option in the controller.
   *
   * @public
   * @instance
   * @memberOf BaseSiteCtrl
   * @param {angular.event} $event The click event that triggered the action.
   * @param {BaseSiteCtrl~Option} option The selected option.
   */
  BaseSiteCtrl.prototype.changeSelectedOption = function ( $event, option ) {
    this.selectedOption = option;
  };

  /**
   * The array of injectable dependencies for the controller.
   *
   * @protected
   * @static
   * @memberOf BaseSiteCtrl
   * @type {Array.<external:String>}
   */
  BaseSiteCtrl.$inject = [ 'siteInfo', 'Localization', '$state' ];

  global.angular.module( 'imomoCaApp' )
    .controller( 'BaseSiteCtrl', BaseSiteCtrl );

} )( window );
