( function ( global ) {
  'use strict';

  /**
   * Enumeration of possible sorting states for the table of stations.
   *
   * @inner
   * @memberOf OverviewCtrl
   * @type {Object}
   * @property {Number} unsorted Indicates that the table is not sorted
   * @property {Number} ascending Indicates that the table is sorted in
   *                              ascending order.
   * @property {Number} descending Indicates that the table is sorted in
   *                               descending order.
   */
  var SORT_TYPE = {
    unsorted: 0,
    ascending: 1,
    descending: 2
  };

  /**
   * Object with the CSS classes for styling header cells in the stations
   * table.
   *
   * @typedef {Object} OverviewCtrl~HeaderIcon
   * @property {external:String} anchor The CSS classes for the anchor tag
   * @property {external:String} cell The CSS classes for the table header
   *                                  cell tag
   */
  /**
   * Creates a default instance of the {@link OverviewCtrl~HeaderIcon} type.
   *
   * @inner
   * @memberOf OverviewCtrl
   * @return {OverviewCtrl~HeaderIcon} Default instance for this type.
   */
  function defaultIconHeader() {
    return {
      anchor: 'octicon-dash',
      cell: ''
    };
  }

  /**
   * Creates an instance of the controller for the site overview page.
   *
   * @class OverviewCtrl
   * @classdesc Controller for the overview page for the sites, it
   *            provides functions for sorting, filtering and displaying
   *            different information about the stations.
   * @param {Array.<Site>} sites The array of sites registered in the system.
   * @param {SitesPage} SitesPage SitesPage service for shared state.
   * @param {external:angular.$filter} $filter AngularJS filter service.
   * @param {Object} $scope The controller's scope.
   * @param {Object} $state AngularUI-router state service.
   */
  function OverviewCtrl( sites, SitesPage, $filter, $scope,
    $state ) {
    this.filter_ = $filter;
    /**
     * Internal reference to the state service.
     *
     * @name OverviewCtrl#_state
     * @type {Object}
     * @protected
     */
    this._state = $state;

    this.mapCenter = {
      lat: 0,
      lng: 0,
      zoom: 4
    };

    /**
     * The original list of sites registered in the server.
     *
     * @name OverviewCtrl#sites
     * @type {Array.<Site>}
     * @protected
     */
    this.sites = sites;
    /**
     * The sorted list of sites according to the current criteria.
     *
     * @name OverviewCtrl#sortedSites
     * @type {Array.<Site>}
     * @protected
     */
    this.sortedSites = sites;
    /**
     * Current sorted state of the table.
     *
     * @name OverviewCtrl#tableSort
     * @type {Number}
     * @public
     * @default {@link OverviewCtrl~SORT_TYPE.unsorted}
     */
    this.tableSort = SORT_TYPE.unsorted;
    /**
     * Name of the property by which the table is sorted.
     *
     * @name OverviewCtrl#sortedProperty
     * @type {String}
     * @public
     * @default null
     */
    this.sortedProperty = null;
    /**
     * Available filters for the site table.
     *
     * @name OverviewCtrl#filters
     * @type {Object}
     * @public
     * @property {String} siteCode Filter for the site code property.
     * @property {String} siteName Filter for the site name property.
     * @property {String} region Filter for the region property.
     * @property {String} basin Filter for the basin property.
     * @property {String} country Filter for the country property.
     */
    /**
     * List of sites after filtering.
     *
     * @name OverviewCtrl#filteredSites
     * @type {Array.<Site>}
     * @public
     */
    this.filteredSites = [];
    this.clearFilters();

    /**
     * Icon classes to change the style of the table headers.
     *
     * @name OverviewCtrl#headerIcons
     * @type {Object}
     * @public
     * @property {OverviewCtrl~HeaderIcon} siteCode The header icon classes
     *                                              for the site code header.
     * @property {OverviewCtrl~HeaderIcon} siteName The header icon classes
     *                                              for the site name header.
     * @property {OverviewCtrl~HeaderIcon} county The header icon classes
     *                                            for the county header.
     * @property {OverviewCtrl~HeaderIcon} basin The header icon classes
     *                                           for the basin header.
     * @property {OverviewCtrl~HeaderIcon} state The header icon classes
     *                                           for the state header.
     */
    this.headerIcons = {
      siteCode: defaultIconHeader(),
      siteName: defaultIconHeader(),
      region: defaultIconHeader(),
      basin: defaultIconHeader(),
      country: defaultIconHeader()
    };
    /**
     * Service holding state that is shared across various controllers in
     * the sites page.
     *
     * @name OverviewCtrl#sharedState
     * @type {SitesPage}
     * @public
     */
    this.sharedState = SitesPage;

    //$scope.$on( 'leafletDirectiveMarker.click',
    //  this.onMarkerClicked.bind( this ) );
  }

  /**
   * Array of injectable dependencies for the controller.
   *
   * @protected
   * @static
   * @memberOf OverviewCtrl
   * @type {Array.<external:String>}
   */
  OverviewCtrl.$inject = [ 'sites', 'SitesPage', '$filter', '$scope',
    '$state'
  ];

  OverviewCtrl.prototype.onMarkerClicked = function ( event, args ) {
    this.state_.go( '.', {
      stationId: args.markerName
    } );
  };

  OverviewCtrl.prototype.deleteStation = function ( $event ) {
    $event.preventDefault();
    this.state_.go( '.delete', {
      site: this.selectedSite
    } );
  };

  /**
   * Sort the list of sites by the given property.
   *
   * @public
   * @instance
   * @memberOf OverviewCtrl
   * @param {Object} $event The click event that triggered the action.
   * @param {String} siteProperty The name of the site property to use
   *                              for the ordering.
   */
  function sortBy( $event, siteProperty ) {
    $event.preventDefault();
    if ( this.sortedProperty !== siteProperty ) {
      this.headerIcons[ this.sortedProperty ] = defaultIconHeader();
    }
    if ( this.tableSort === SORT_TYPE.unsorted ||
      this.sortedProperty !== siteProperty ) {
      this.sortedSites = _.sortBy( this.sites, siteProperty );
      this.tableSort = SORT_TYPE.ascending;
      this.sortedProperty = siteProperty;
      this.headerIcons[ this.sortedProperty ].anchor = 'octicon-chevron-up';
      this.headerIcons[ this.sortedProperty ].cell = 'info';
      this.onFilterChanged();
    } else if ( this.tableSort === SORT_TYPE.ascending ) {
      this.sortedSites = this.sortedSites.reverse();
      this.tableSort = SORT_TYPE.descending;
      this.headerIcons[ this.sortedProperty ].anchor = 'octicon-chevron-down';
      this.onFilterChanged();
    } else {
      this.resetSort();
    }
  }
  OverviewCtrl.prototype.sortBy = sortBy;

  /**
   * Filters the ordered list of sites according to all the property filters.
   *
   * The filtering is done using the 'filter' filter from AngularJS.
   * Additionally, it populates the object of filtered markers for the map
   * display.
   *
   * @public
   * @instance
   * @memberOf OverviewCtrl
   */
  function onFilterChanged() {
    var filters = global.angular.copy( this.filters );
    this.filteredSites = this.filter_( 'filter' )( this.sortedSites, filters );
  }
  OverviewCtrl.prototype.onFilterChanged = onFilterChanged;

  /**
   * Resets the filters to their default value. It calls the filter update
   * function afterwards.
   *
   * @public
   * @instance
   * @memberOf OverviewCtrl
   * @param  {Object} $event The click event that triggered the action, if
   *                         any.
   */
  function clearFilters( $event ) {
    if ( $event !== undefined ) {
      $event.preventDefault();
    }
    this.filters = {
      siteName: '',
      siteCode: '',
      region: '',
      basin: '',
      country: ''
    };
    this.onFilterChanged();
  }
  OverviewCtrl.prototype.clearFilters = clearFilters;

  /**
   * Resets the sorting of the site list.
   *
   * This calls the filtering afterwards to re-apply the filters.
   *
   * @public
   * @instance
   * @memberOf OverviewCtrl
   * @param {Object} $event The click event that triggered the action.
   */
  function resetSort( $event ) {
    if ( $event ) {
      $event.preventDefault();
    }
    this.sortedSites = this.sites;
    this.tableSort = SORT_TYPE.unsorted;
    this.headerIcons[ this.sortedProperty ] = defaultIconHeader();
    this.sortedProperty = null;
    this.onFilterChanged();
  }
  OverviewCtrl.prototype.resetSort = resetSort;

  /**
   * Selects a site from the list.
   *
   * This triggers a change of state to the display state where the station
   * details are listed and a few extra options are presented
   * to the user.
   *
   * @public
   * @instance
   * @memberOf OverviewCtrl
   * @param {Object} $event The click event that triggered the action.
   * @param {Number} siteId The id of the site that was selected.
   */
  function selectSite( $event, siteId ) {
    this._state.go( 'root.stations.home.overview.selected.details', {
      siteId: siteId,
    } );
  }
  OverviewCtrl.prototype.selectSite = selectSite;

  /**
   * Collapse the list of sites.
   *
   * @public
   * @instance
   * @memberOf OverviewCtrl
   * @param {Object} $event The click event that triggered the action.
   */
  function collapseList( $event ) {
    $event.preventDefault();
    this.sharedState.collapsedSiteList = true;
  }
  OverviewCtrl.prototype.collapseList = collapseList;

  /**
   * Show the list of sites.
   *
   * @public
   * @instance
   * @memberOf OverviewCtrl
   * @param {Object} $event The click event that triggered the action.
   */
  function showList( $event ) {
    $event.preventDefault();
    this.sharedState.collapsedSiteList = false;
  }
  OverviewCtrl.prototype.showList = showList;

  global.angular.module( 'imomoCaApp' )
    .controller( 'OverviewCtrl', OverviewCtrl );

} )( window );
