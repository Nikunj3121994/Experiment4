'use strict';

( function ( global ) {

  var registerUser = {
    url: 'register',
    name: 'root.registerUser',
    parent: 'root',
    templateUrl: 'views/register-user/register.html',
    controller: 'RegisterUserCtrl as registerUserCtrl',
    resolve: {
      sources: [ 'Sources',
        function getSources( Sources ) {
          return Sources.getAll();
        }
      ]
    }
  };

  global.angular.module( 'imomoCaApp' )
    .config( [ '$stateProvider',
      function ( $stateProvider ) {
        $stateProvider.state( registerUser );
    } ] );

} )( window );
