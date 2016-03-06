'use strict';

var customMatchers = {
  toBeWithinOf: function () {
    return {
      compare: function ( actual, expected, distance ) {
        if ( expected === undefined ) {
          expected = 0;
        }
        if ( distance === undefined ) {
          distance = 0;
        }
        var result = {};
        result.pass = Math.abs( actual - expected ) < distance;
        if ( result.pass ) {
          result.message = 'Expected value to be outside of the given range.';
        } else {
          result.message = 'Expected ' + actual + ' to be inside ' + distance +
            ' units of ' + expected + '.';
        }
        return result;
      }
    };
  }
};

describe( 'Service: DischargeCurveFitting', function () {
  // Load the service's module
  beforeEach( module( 'imomoCaApp' ) );

  beforeEach( function () {
    jasmine.addMatchers( customMatchers );
  } );

  // Instantiate the required services and factories
  var DischargeCurveFitting, DischargeMeasurementPair;
  beforeEach( inject( function ( _DischargeCurveFitting_, _DischargeMeasurementPair_ ) {
    DischargeCurveFitting = _DischargeCurveFitting_;
    DischargeMeasurementPair = _DischargeMeasurementPair_;
  } ) );

  it( 'Evaluate the private function for calculating datum correction',
    function () {
      var testWaterLevels = [ 447, 460, 481, 498, 512, 513, 526, 559, 585,
        614, 645, 675, 711, 719 ],
        testDischarges = [ 13, 21, 24, 16, 20, 24, 15, 34, 33, 33, 39, 43,
          50, 47 ],
        testMeasurements = _.map( _.zip( testDischarges, testWaterLevels ),
          function ( dischargePair ) {
            return new DischargeMeasurementPair( dischargePair[ 0 ], dischargePair[ 1 ] );
          } ),
        datumCorrection = DischargeCurveFitting._calculateDatumCorrection( testMeasurements );
      expect( datumCorrection ).toBeCloseTo( -289.77, 2 );
    } );

  it( 'Evaluate the private function for doing least squares fitting',
    function () {
      var x = [ 20, 500, 1000, 1200, 1400, 1500 ],
        y = [ 203, 197, 191, 188, 186, 184 ],
        solution = DischargeCurveFitting._leastSquaresFit( x, y );
      expect( solution.a ).toBeCloseTo( 203.3319, 4 );
      expect( solution.b ).toBeCloseTo( -0.0126, 4 );
      expect( solution.r ).toBeCloseTo( 0.9985, 4 );
    } );

  it( 'Evaluate the public API for fitting a set of water level values using fixed exponent method',
    function () {
      var testMeasurements = DischargeMeasurementPair.generateRandomDischargePairs( -80, 2, 0.002, true );
      var model = DischargeCurveFitting
        .fitCurveFromDataFixedExp( testMeasurements );
      expect( model.paramB ).toBeWithinOf( 2, 0.2 );
      expect( model.paramC ).toBeWithinOf( 0.002, 0.01 );
    } );
} );
