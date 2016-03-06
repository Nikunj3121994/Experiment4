( function ( global ) {
  'use strict';

  function HydrologicalRoundingFilterFactory() {
    function hydrologicalRoundingFilter( input ) {
      if( input !== 0){
        input = input || '';
      }
      var inputNumber = parseFloat( input );
      if ( isNaN( inputNumber ) ) {
        return '';
      }
      return parseFloat( inputNumber.toPrecision( 3 ) ).toString();
    }
    return hydrologicalRoundingFilter;
  }

  HydrologicalRoundingFilterFactory.$inject = [];

  global.angular.module( 'imomoCaApp' )
    .filter( 'hydroround', HydrologicalRoundingFilterFactory );

} )( window );
