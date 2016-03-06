( function ( global ) {
  'use strict';

  function DischargeNormFactory() {
    function DischargeNorm( options ) {
      this.normUrl = options.normUrl || null;
      this.normData = options.normData || null;
      this.siteId = options.siteId || null;
    }

    DischargeNorm.fromServerObject = function( serverDischargeNorm ) {
      return new DischargeNorm(serverDischargeNorm);
    };
    return DischargeNorm;
  }

  global.angular.module('imomoCaApp')
    .factory( 'DischargeNorm', DischargeNormFactory );

} )( window );