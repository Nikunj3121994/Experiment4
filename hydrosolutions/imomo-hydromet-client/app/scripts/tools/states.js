'use strict';

( function ( global ) {

  var tools = {
    name: 'root.tools',
    parent: 'root',
    url: 'tools',
    templateUrl: 'views/tools/home.html',
    abstract: true
  };

  var sidebarView = {
    templateUrl: 'views/tools/sidebar.html',
    controller: 'SidebarOptsCtrl as sidebarOptsCtrl',
  };

  var mainView = {
    templateUrl: 'views/tools/about.html',
    controller: 'AboutToolsCtrl as aboutToolsCtrl'
  };

  var availableTools = [
    {
      localizedNamePath: 'tools.operationalData.displayName',
      localizedDescriptionPath: 'tools.operationalData.description',
      state: 'root.tools.operationalData',
      octicon: 'octicon-gear'
    }, {
      localizedNamePath: 'tools.forecast.displayName',
      localizedDescriptionPath: 'tools.forecast.description',
      state: 'root.tools.forecast',
      octicon: 'octicon-eye'
    }
  ];

  var toolsHome = {
    name: tools.name + '.home',
    parent: tools.name,
    url: '',
    views: {
      sidebar: sidebarView,
      main: mainView
    },
    data: {
      options: availableTools
    }
  };

  global.angular.module( 'imomoCaApp' ).config( [ '$stateProvider',
    function ( $stateProvider ) {
      $stateProvider.state( tools );
      $stateProvider.state( toolsHome );
  } ] );
} )( window );
