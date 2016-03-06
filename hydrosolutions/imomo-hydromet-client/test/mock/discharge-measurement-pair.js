( function ( global ) {
  'use strict';

  function DischargeMeasurementPairFactory() {
    /**
     * Creates a mock discharge measurement pair with the given discharge and
     * water level values.
     *
     * @class
     * @classdesc A mock discharge measurement pair model that can be used
     *            in unit tests.
     * @param {Number} dischargeValue  Discharge value.
     * @param {Number} waterLevelValue Water level value.
     */
    function DischargeMeasurementPair( dischargeValue, waterLevelValue ) {
      this.dischargeValue = dischargeValue;
      this.waterLevelValue = waterLevelValue;
    }

    /**
     * Generate an array of 10 discharge measurement pairs that follow
     * the power model: Q = c(H + a)^b + e.
     * Where e is Gaussian noise.
     *
     * @public
     * @memberof DischargeMeasurementPair
     * @param  {Number} a      Parameter a of the power model.
     * @param  {Number} b      Parameter b of the power model.
     * @param  {Number} c      Parameter c of the power model.
     * @param  {Boolean} noise Indicates if noise should be added to the
     *                         resulting pairs.
     * @return {Array.<DischargeMeasurementPair>} The generated measurement
     *                                            pairs.
     */
    function generateRandomDischargePairs( a, b, c, noise ) {
      var waterLevelMin = 100,
        waterLevelMax = 150,
        waterLevelStep = 5;
      return _.map( _.range( waterLevelMin, waterLevelMax, waterLevelStep ),
        function generateRandomPair( waterLevel ) {
          var gaussian = 0;
          if ( noise ) {
            var u1 = Math.random(),
              u2 = Math.random();
            gaussian = Math.sqrt( -2 * Math.log( u1 ) ) *
              Math.cos( 2 * Math.PI * u2 );
          }
          return {
            waterLevelValue: waterLevel,
            dischargeValue: c * Math.pow( waterLevel + a, b ) +
              Math.abs( gaussian )
          };
        } );
    }
    DischargeMeasurementPair.generateRandomDischargePairs =
      generateRandomDischargePairs;

    return DischargeMeasurementPair;
  }

  global.angular.module( 'imomoCaApp' )
    .factory( 'DischargeMeasurementPair', DischargeMeasurementPairFactory );
} )( window );
