( function ( global ) {
  'use strict';
  /* State tree for the stations page.
   * root.stations (A)
   * --root.stations.home (A)
   * ----root.stations.home.overview
   * ------root.stations.home.overview.selected (A)
   * --------root.stations.home.overview.selected.details
   * --------root.stations.home.overview.selected.curve
   * --------root.stations.home.overview.selected.norm
   * ----root.stations.home.new
   */

  /**
   * Root state for the stations page. It is abstract.
   *
   * @type {Object}
   */
  var stations = {
    url: 'stations',
    name: 'root.stations',
    parent: 'root',
    templateUrl: 'views/stations/home.html',
    abstract: true
  };

  /**
   * Array of options that are listed in the sidebar of the stations page.
   *
   * @type {Array.<Object>}
   */
  var stationOptions = [ {
    state: 'root.stations.home.overview',
    localizedNamePath: 'stations.options.overview',
    octicon: 'octicon-eye'
  }, {
    state: 'root.stations.home.new',
    localizedNamePath: 'stations.options.new',
    octicon: 'octicon-milestone'
  } ];

  /**
   * Home state that provides containers for the different options in the page.
   * It is abstract.
   *
   * @type {Object}
   */
  var stationsHome = {
    name: stations.name + '.home',
    parent: stations,
    views: {
      sidebar: {
        templateUrl: 'views/stations/sidebar.html',
        controller: 'SidebarOptsCtrl as sidebarOptsCtrl'
      },
      main: {
        template: '<ui-view/>'
      }
    },
    data: {
      options: stationOptions
    },
    abstract: true
  };

  /**
   * State that provides an overview of all the stations in the system.
   *
   * @type {Object}
   */
  var stationsOverview = {
    url: '',
    name: stationsHome.name + '.overview',
    parent: stationsHome,
    templateUrl: 'views/stations/overview/overview.html',
    controller: 'OverviewCtrl as overviewCtrl',
    resolve: {
      sites: [ 'Sites',
        function ( Sites ) {
          return Sites.getSites();
        }
      ]
    }
  };

  /**
   * Base state for displaying information about a selected site.
   * It is abstract.
   *
   * @type {Object}
   */
  var selectedSite = {
    url: '/details/{siteId}',
    name: stationsOverview.name + '.selected',
    parent: stationsOverview,
    templateUrl: 'views/stations/details/base.html',
    controller: 'BaseSiteCtrl as baseSiteCtrl',
    resolve: {
      siteInfo: [ 'Sites', '$stateParams',
        function ( Sites, $stateParams ) {
          return Sites.getSiteById( $stateParams.siteId );
        }
      ],
      siteSafeDischarge: [ 'DataValues', '$stateParams',
        function ( DataValues, $stateParams ) {
          return DataValues.getMaxSafeDischargeForSite( $stateParams.siteId );
        }
      ]
    },
    onEnter: [ 'SitesPage', function ( SitesPage ) {
      SitesPage.collapsedSiteList = true;
    } ],
    onExit: [ 'SitesPage', function ( SitesPage ) {
      SitesPage.collapsedSiteList = false;
    } ],
    abstract: true
  };

  /**
   * State for displaying and editing the basic details of a site.
   *
   * @type {Object}
   */
  var siteDetails = {
    url: '',
    name: selectedSite.name + '.details',
    parent: selectedSite,
    templateUrl: 'views/stations/details/details.html',
    controller: 'SiteDetailsCtrl as siteDetailsCtrl'
  };

  /**
   * State for displaying the history of discharge curves and data.
   * It also allows editing the discharge curve.
   *
   * @type {Object}
   */
  var siteRatingCurve = {
    url: '/ratingcurve',
    name: selectedSite.name + '.curve',
    parent: selectedSite,
    templateUrl: 'views/stations/details/curve.html',
    controller: 'SiteCurveCtrl as siteCurveCtrl',
    resolve: {
      dischargeModels: [ 'DischargeModels', '$stateParams',
        function ( DischargeModels, $stateParams ) {
          return DischargeModels
            .getCurrentYearModelsForSite( $stateParams.siteId );
        }
      ]
    }
  };

  /**
   * State for uploading and displaying the current discharge norm for the
   * site.
   *
   * @type {Object}
   */
  var siteDischargeNorm = {
    url: '/dischargenorm',
    name: selectedSite.name + '.norm',
    parent: selectedSite,
    templateUrl: 'views/stations/details/norm.html',
    controller: 'SiteNormCtrl as siteNormCtrl',
    resolve: {
      dischargeNorm: [ 'Sites', '$stateParams',
        function ( Sites, $stateParams ) {
          var promise = Sites.siteDischargeNorm( $stateParams.siteId );
          return promise.catch(function(serverError) {
            if( serverError.errorCode === '10104' ){
              return [];
            }
          });
        }
      ],
      dischargeDataURL: [ 'Sites', '$stateParams',
        function ( Sites, $stateParams ) {
          return Sites.getSiteDischargeData( $stateParams.siteId );
        }
      ]
    }
  };

  /**
   * State for creating a new station.
   * @type {Object}
   */
  var newStation = {
    url: '/new',
    name: stationsHome.name + '.new',
    parent: stationsHome,
    templateUrl: 'views/stations/new-station/new-station.html',
    controller: 'NewStationCtrl as newStationCtrl'
  };



  global.angular.module( 'imomoCaApp' ).config( [ '$stateProvider',
    function ( $stateProvider ) {
      $stateProvider.state( stations );
      $stateProvider.state( stationsHome );
      $stateProvider.state( stationsOverview );
      $stateProvider.state( selectedSite );
      $stateProvider.state( siteDetails );
      $stateProvider.state( siteRatingCurve );
      $stateProvider.state( siteDischargeNorm );
      $stateProvider.state( newStation );
    }
  ] );
} )( window );
