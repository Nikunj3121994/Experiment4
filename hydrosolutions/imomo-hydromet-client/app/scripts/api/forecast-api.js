( function ( global ) {
  'use strict';

  function Forecast( $http, backend ){
    this.httpService = $http;
    this.backend = backend;
    this.endpoint = this.backend + '/forecast';
  }

  Forecast.$inject = ['$http', 'backend'];

  function getDecadeForecast( siteIds, month, decadeInMonth ) {
    var decade = 3 * (month - 1) + (decadeInMonth - 1);
    var promise = this.httpService({
      method: 'POST',
      url: this.endpoint + '/decade',
      data: {
        siteIds: siteIds,
        year: moment().year(),
        decade: decade
      }
    });
    return promise;
  }
  Forecast.prototype.getDecadeForecast = getDecadeForecast;

  global.angular.module( 'imomoCaApp' ).service( 'Forecast', Forecast );

} )( window );
