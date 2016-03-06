( function ( global ) {
  'use strict';

  var availableOptions = [ {
    localizedNamePath: 'tools.forecast.sidebar.daily',
    state: 'root.tools.forecast',
    octicon: 'octicon-calendar'
  }, {
    localizedNamePath: 'tools.forecast.sidebar.decade',
    state: 'root.tools.forecast.decade',
    octicon: 'octicon-calendar'
  }, {
    localizedNamePath: 'tools.forecast.sidebar.monthly',
    state: 'root.tools.forecast',
    octicon: 'octicon-calendar'
  }, {
    localizedNamePath: 'tools.forecast.sidebar.seasonal',
    state: 'root.tools.forecast',
    octicon: 'octicon-calendar'
  }, {
    localizedNamePath: 'tools.forecast.sidebar.backToTools',
    state: 'root.tools.home',
    octicon: 'octicon-jump-left'
  } ];

  var forecastTool = {
    name: 'root.tools.forecast',
    parent: 'root.tools',
    url: '/forecast',
    views: {
      sidebar: {
        templateUrl: 'views/tools/forecast/sidebar.html',
        controller: 'SidebarOptsCtrl as sidebarOptsCtrl'
      },
      main: {
        templateUrl: 'views/tools/forecast/about.html'
      }
    },
    data: {
      options: availableOptions
    }
  };

  var decadeForecast = {
    name: 'root.tools.forecast.decade',
    parent: forecastTool,
    url: '/decade',
    templateUrl: 'views/tools/forecast/decade.html',
    controller: 'DecadeCtrl as ctrl',
    resolve: {
      sites: [ 'Sites', function( Sites ) {
        return Sites.getSites();
      }]
    }
  };


  // Register the states in the $stateProvider
  global.angular.module( 'imomoCaApp' ).config( [ '$stateProvider',
    function ( $stateProvider ) {
      $stateProvider.state( forecastTool );
      $stateProvider.state( decadeForecast );
    }
  ] );

} )( window );
