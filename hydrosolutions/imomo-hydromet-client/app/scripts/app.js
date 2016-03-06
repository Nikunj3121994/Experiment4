'use strict';

angular
  .module( 'imomoCaApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
    'ui.utils',
    'angularFileUpload'
  ] )
  .config( [ '$stateProvider', '$urlRouterProvider', '$compileProvider',
    function ( $stateProvider, $urlRouterProvider, $compileProvider ) {
      $stateProvider.state( 'root', {
        url: '/',
        views: {
          header: {
            templateUrl: 'views/header.html',
            controller: 'HeaderCtrl as headerCtrl'
          },
          main: {
            templateUrl: 'views/main.html'
          },
          footer: {
            templateUrl: 'views/footer.html'
          }
        },
        resolve: {
          localize: [ 'Localization',
            function ( Localization ) {
              return Localization.localizePromise();
            }
          ],
          localizeError: [ 'Localization',
            function ( Localization ) {
              return Localization.localizePromise( true );
            }
          ]
        }
      } );

      $stateProvider.state( 'root.discharge', {
        url: 'discharge',
        parent: 'root',
        templateUrl: 'views/discharge/discharge-telegram.html',
        controller: 'DischargeTelegramTestCtrl as dischargeCtrl'
      } );

      $urlRouterProvider.when( '', '/' );

      $compileProvider.aHrefSanitizationWhitelist( /^\s*(https?|ftp|mailto|tel|file|blob):/ );
    }
  ] )
  .run( [ '$rootScope', '$state', 'ErrorLog',
    function ( $rootScope, $state, ErrorLog ) {
      $rootScope.$on( '$stateChangeError', function ( event, toState, toParams,
        fromState, fromParams, error ) {
        if ( toState.name === 'generalError' ) {
          // CRITICAL ERROR, nothing to do
          console.log( error );
        } else {
          ErrorLog.log( error );
          $state.go( 'generalError' );
        }
      } );
      $rootScope.$on( '$stateChangeStart', function () {} );
      $rootScope.$on( '$stateChangeSuccess',
        function logStates( event, toState, toParams, fromState ) {
          console.log( 'Next state: ' + toState.name );
          console.log( 'Previous state: ' + fromState.name );
        } );
      $rootScope.$on( 'edit-station-started', function ( event ) {
        console.log( event );
      } );
    }
  ] );
