( function ( global ) {
  'use strict';

  function ForecastDataFactory( DataValue ) {
    function ForecastData(params) {
      this.year = params.year;
      this.decade = params.decade;
      this.siteId = params.siteId;
      this.predictedValue = params.predictedValue;
      this.previousValues = params.previousValues;
    }

    function fromServerObject( serverForecastData ) {
      serverForecastData.previousValues = serverForecastData
        .previousValues.map(function(dataValue) {
          return DataValue.fromServerObject(dataValue);
        });
      return new ForecastData(serverForecastData);
    }
    ForecastData.fromServerObject = fromServerObject;

    return ForecastData;
  }

  ForecastDataFactory.$inject = ['DataValue'];

  global.angular.module( 'imomoCaApp' )
    .service( 'ForecastData', ForecastDataFactory );

} )( window );
