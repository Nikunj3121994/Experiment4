'use strict';

( function ( global ) {

  var generalError = {
    name: 'generalError',
    url: '/error',
    views: {
      'main': {
        templateUrl: 'views/general-error.html',
        controller: 'ErrorDisplayCtrl as errorDisplayCtrl',
        resolve: {
          localizeError: [ 'Localization',
            function ( Localization ) {
              return Localization.localizePromise( true );
          } ]
        }
      }
    }
  };

  global.angular.module( 'imomoCaApp' )
    .config( [ '$stateProvider',
      function ( $stateProvider ) {
        $stateProvider.state( generalError );
    } ] );

} )( window );
