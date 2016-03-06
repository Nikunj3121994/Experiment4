'use strict';

( function ( global ) {

  var authInterceptor = function ( $q, $window, backend, AccessTokenStorage ) {
    return {
      request: function ( config ) {
        if ( config.url.indexOf( backend ) === 0 ) {
          config.headers = config.headers || {};
          if ( AccessTokenStorage.hasValidToken() ) {
            config.headers.Authorization = 'Bearer ' +
              AccessTokenStorage.token.tokenString;
          }
        }
        return config;
      }
    };
  };

  authInterceptor.$inject = [ '$q', '$window', 'backend',
    'AccessTokenStorage' ];

  global.angular.module( 'imomoCaApp' )
    .factory( 'authInterceptor', authInterceptor );

  var resourceInterceptor = function ( $q, backend, resources, ServerError ) {
    return {
      response: function ( response ) {
        if ( response.config.url.indexOf( backend ) === 0 ) {
          if ( response.data.status === undefined ) {
            return response;
          }
          if ( response.data.status >= 200 && response.data.status < 300 ) {
            var resourceType = response.data.resourceType;
            if ( resourceType &&
              typeof resources[ resourceType ] === 'function' ) {
              return _.map( response.data.resources,
                function ( resource ) {
                  return resources[ resourceType ].call(
                    null, resource );
                } );
            }
          }
          return response;
        }
        return response;
      },
      responseError: function ( rejection ) {
        if ( ServerError.isError( rejection ) ) {
          return $q.reject( ServerError.fromServerObject( rejection ) );
        }
        return $q.reject( rejection );
      }
    };
  };

  resourceInterceptor.$inject = [ '$q', 'backend', 'resources',
    'ServerError' ];

  global.angular.module( 'imomoCaApp' )
    .factory( 'resourceInterceptor', resourceInterceptor );

  global.angular.module( 'imomoCaApp' )
    .config( [ '$httpProvider',
      function ( $httpProvider ) {
        $httpProvider.interceptors.push( 'authInterceptor' );
        $httpProvider.interceptors.push( 'resourceInterceptor' );
    } ] );

} )( window );
