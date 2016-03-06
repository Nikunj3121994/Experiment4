( function ( global ) {
  'use strict';

  /**
   * Constructor for the discharge curve fitting service. The constructor
   * does nothing else but attach the injected dependencies in the newly
   * created singleton service.
   *
   * @class DischargeCurveFitting
   * @classdesc Service that provides an API for creating discharge models
   *            from discharge models or discharge data
   * @param {DischargeModel} DischargeModel Injected constructor for the
   *                         {@link DischargeModel|discharge model} class.
   */
  function DischargeCurveFitting( DischargeModel ) {
    this._dischargeModelConstructor = DischargeModel;
  }

  /**
   * Injectable dependencies for the service..
   *
   * @protected
   * @memberOf DischargeCurveFitting
   * @type {Array.<external:String>}
   */
  DischargeCurveFitting.$inject = [ 'DischargeModel' ];

  /**
   * Indicates whether the given point is apt for the
   * purposes of the fitter. The fitter only requires that the object provides
   * a water level and discharge value, any object that provides this interface
   * is considered a discharge measurement pair.
   *
   * These conditions is met by {@link SiteCurveCtrl~FakeDischargePair}.
   *
   * @protected
   * @memberOf DischargeCurveFitting
   * @param {Object} pairObject Object to test.
   * @return {Boolean} True if the object has the appropriate interface for the
   *                   fitting function, false otherwise.
   */
  function isDischargeMeasurementPair( pairObject ) {
    return !!( pairObject &&
      !isNaN( parseFloat( pairObject.waterLevelValue ) ) &&
      !isNaN( parseFloat( pairObject.dischargeValue ) ) );
  }

  /**
   * Approximates the datum correction value from a given set of discharge
   * measurement pairs. This is done using the Johnson's method.
   *
   * @private
   * @memberOf DischargeCurveFitting
   * @param {Array.<DischargeMeasurementPair>} measurements
   *        Array of data points to calculate the datum correction from.
   * @return {Number} The approximated datum correction.
   */
  function calculateDatumCorrection( measurements ) {
    var breakPoints = [ 0, 0 ];
    var sortedMeasurements = _.sortBy( measurements, 'dischargeValue' );

    if ( measurements.length % 3 === 0 ) {
      breakPoints[ 0 ] = measurements.length / 3;
      breakPoints[ 1 ] = 2 * measurements.length / 3;
    } else if ( measurements.length % 3 === 1 ) {
      breakPoints[ 0 ] = ( measurements.length - 1 ) / 3;
      breakPoints[ 1 ] = 2 * ( measurements.length - 1 ) / 3 + 1;
    } else {
      breakPoints[ 0 ] = ( measurements.length + 1 ) / 3;
      breakPoints[ 1 ] = 2 * ( measurements.length + 1 ) / 3;
    }

    var medianDischarges = [
      math.median(
        _.pluck(
          sortedMeasurements.slice( 0, breakPoints[ 0 ] ),
          'dischargeValue' ) ),
      math.median(
        _.pluck(
          sortedMeasurements.slice( breakPoints[ 0 ], breakPoints[ 1 ] ),
          'dischargeValue' ) ),
      math.median(
        _.pluck(
          sortedMeasurements.slice( breakPoints[ 1 ] ),
          'dischargeValue' ) )
    ];
    var medianWaterLevels = [
      math.median(
        _.pluck(
          sortedMeasurements.slice( 0, breakPoints[ 0 ] ),
          'waterLevelValue' ) ),
      math.median(
        _.pluck(
          sortedMeasurements.slice( breakPoints[ 0 ], breakPoints[ 1 ] ),
          'waterLevelValue' ) ),
      math.median(
        _.pluck(
          sortedMeasurements.slice( breakPoints[ 1 ] ),
          'waterLevelValue' ) )
    ];

    // The equation of the median line is Y = a + bX
    var medianLogDischarges = math.log( medianDischarges ),
      medianLogWaterLevels = math.log( medianWaterLevels );
    var a = 0,
      b = 1;
    if ( medianLogWaterLevels[ 2 ] !== medianLogWaterLevels[ 0 ] ) {
      b = ( medianLogDischarges[ 2 ] - medianLogDischarges[ 0 ] ) /
        ( medianLogWaterLevels[ 2 ] - medianLogWaterLevels[ 0 ] );
    }
    a = ( math.sum( medianLogDischarges ) -
      b * ( math.sum( medianLogWaterLevels ) ) ) / 3;

    // Johnson's method
    medianDischarges[ 1 ] = math.sqrt( medianDischarges[ 0 ] *
      medianDischarges[ 2 ] );
    medianWaterLevels[ 1 ] =
      math.exp( a + b * math.log( medianDischarges[ 1 ] ) );
    if ( medianWaterLevels[ 0 ] + medianWaterLevels[ 2 ] -
      2 * medianWaterLevels[ 1 ] === 0 ) {
      throw 'An exception because there is no datum correction.';
    }

    return ( math.pow( medianWaterLevels[ 1 ], 2 ) -
        medianWaterLevels[ 0 ] * medianWaterLevels[ 2 ] ) /
      ( medianWaterLevels[ 0 ] + medianWaterLevels[ 2 ] -
        2 * medianWaterLevels[ 1 ] );
  }

  /**
   * Data type representing the resulting coefficients of a
   * linear least-squares fit. The corresponding linear equation is:
   * y = a + bx
   *
   * @typedef {Object} DischargeCurveFitting~LeastSquaresFit
   * @property {Number} a The offset of the linear fit.
   * @property {Number} b The coefficient of the linear fit.
   * @property {Number} r The correlation coefficient (note that this is r^2).
   */

  /**
   * An auxiliary general least-squares fitting function.
   *
   * @private
   * @memberOf DischargeCurveFitting
   * @param {Array.<Number>} x The independent variable in the data.
   * @param {Array.<Number>} y The dependent variable in the data.
   * @return {DischargeCurveFitting~LeastSquaresFit} The coefficients that
   *                                                 best fit the data
   *                                                 according to least-squares
   */
  function leastSquaresFit( x, y ) {
    if ( x.length !== y.length || x.length === 0 ) {
      throw 'Hey dimensions are all wrong!';
    }
    var meanX = math.mean( x ),
      meanY = math.mean( y );

    function reduceSumOfSquaredDifferences( mean, memo, value ) {
      return memo + math.pow( value - mean, 2 );
    }

    function reduceSumOfSquaredDifferencesCross( meanX, meanY, memo, tuple ) {
      return memo + ( tuple[ 0 ] - meanX ) * ( tuple[ 1 ] - meanY );
    }

    var ssxx = _.reduce( x,
        reduceSumOfSquaredDifferences.bind( null, meanX ), 0 ),
      ssyy = _.reduce( y,
        reduceSumOfSquaredDifferences.bind( null, meanY ), 0 ),
      ssxy = _.reduce( _.zip( x, y ),
        reduceSumOfSquaredDifferencesCross.bind( null, meanX, meanY ), 0 ),
      b = ssxy / ssxx,
      a = meanY - b * meanX,
      r = math.pow( ssxy, 2 ) / ( ssxx * ssyy );

    return {
      a: a,
      b: b,
      r: r
    };
  }

  /**
   * Creates a new discharge model that best fits the given discharge data,
   * using Johnson's method for datum correction and fitting the best
   * values for b and c.
   *
   * @public
   * @memberOf DischargeCurveFitting
   * @instance
   * @param {Array.<DischargeMeasurementPair>} measurements
   *        Array of data points to fit the model.
   * @return {DischargeModel} The discharge model that best fits the data
   *                          inside the selected model space.
   */
  function fitCurveFromDataJohnsons( measurements ) {
    if ( !_.every( measurements, isDischargeMeasurementPair ) ) {
      throw 'A real error';
    }
    if ( measurements.length < 3 ) {
      throw 'Another error';
    }

    // First calculate the datum correction
    var datum = calculateDatumCorrection( measurements );

    // Only values above the datum are permitted, filter them out.
    var filteredMeasurements = _.filter( measurements,
      function ( measurement ) {
        return measurement.waterLevelValue + datum > 0;
      } );
    if ( filteredMeasurements.length < 2 ) {
      throw 'Not enough measurements above datum.';
    }

    // The approximation is linear on the log-log values
    var logMeasurements = _.map( filteredMeasurements,
        function ( measurement ) {
          return {
            waterLevelValue: math.log( measurement.waterLevelValue + datum ),
            dischargeValue: math.log( measurement.dischargeValue )
          };
        } ),
      fitSolution = leastSquaresFit(
        _.pluck( logMeasurements, 'waterLevelValue' ),
        _.pluck( logMeasurements, 'dischargeValue' ) );

    // Build the models from the result of the datum calculation and
    // the linear regression
    var fitModel = new this._dischargeModelConstructor();
    fitModel.paramA = datum;
    fitModel.paramB = fitSolution.b;
    fitModel.paramC = math.exp( fitSolution.a );
    fitModel.paramDeltaLevel = 0;

    return fitModel;
  }
  DischargeCurveFitting.prototype.fitCurveFromDataJohnsons =
    fitCurveFromDataJohnsons;

  /**
   * Creates a new discharge model that best fits the given discharge data
   * using a least-squares fit, by fixing the coefficient b to specific
   * values.
   *
   * @public
   * @memberOf DischargeCurveFitting
   * @instance
   * @param {Array.<DischargeMeasurementPair|FakeDischargePair>} measurements
   *        Array of data points to fit the model.
   * @return {DischargeModel} The discharge model that best fits the data
   *                          inside the selected model space.
   */
  function fitCurveFromDataFixedExp( measurements ) {
    if ( !_.every( measurements, isDischargeMeasurementPair ) ) {
      throw 'A real error';
    }
    if ( measurements.length < 2 ) {
      throw 'Another error';
    }
    var bFixed = 2; // TODO: Iterate over several b and select the best one.
    // bInverseFixed = 1 / bFixed;

    var adjustedDischarges = math.sqrt(
        _.pluck( measurements, 'dischargeValue' ) ), // TODO: Adapt to general bFixed and inversed
      fitSolution = leastSquaresFit(
        _.pluck( measurements, 'waterLevelValue' ), adjustedDischarges );

    var paramA = fitSolution.a / fitSolution.b,
      paramC = math.pow( fitSolution.b, bFixed );

    var fitModel = new this._dischargeModelConstructor();
    fitModel.paramA = paramA;
    fitModel.paramB = bFixed;
    fitModel.paramC = paramC;
    fitModel.paramDeltaLevel = 0;

    return fitModel;
  }
  DischargeCurveFitting.prototype.fitCurveFromDataFixedExp =
    fitCurveFromDataFixedExp;

  /**
   * Creates a new discharge model from a previous one by removing any
   * ΔH level in the given model.
   *
   * @public
   * @memberOf DischargeCurveFitting
   * @instance
   * @param {DischargeModel} inputModel The model to modify.
   * @return {DischargeModel} A clone of the input model, without the input
   *                          ΔH value.
   */
  function fitDeleteDeltaH( inputModel ) {
    var newModel = this._dischargeModelConstructor.clone( inputModel );
    newModel.paramDeltaLevel = 0;
    return newModel;
  }
  DischargeCurveFitting.prototype.fitDeleteDeltaH = fitDeleteDeltaH;

  /**
   * Creates a new discharge model from a previous one by merging the model's
   * ΔH into the 'a' parameter.
   *
   * @public
   * @memberOf DischargeCurveFitting
   * @instance
   * @param {DischargeModel} inputModel The model to modify.
   * @return {DischargeModel} A clone of the input model, which has a modified
   *                          'a' parameter that includes the ΔH value.
   */
  function fitMergeDeltaH( inputModel ) {
    var newModel = this._dischargeModelConstructor.clone( inputModel );
    newModel.paramA += newModel.paramDeltaLevel;
    newModel.paramDeltaLevel = 0;
    return newModel;
  }
  DischargeCurveFitting.prototype.fitMergeDeltaH = fitMergeDeltaH;

  /**
   * Creates a new discharge model from a previous one by changing the model's
   * ΔH value to the given amount.
   *
   * @public
   * @memberOf DischargeCurveFitting
   * @instance
   * @param {DischargeModel} inputModel The model to modify.
   * @param {Number} deltaLevel The new ΔH value.
   * @return {DischargeModel} A clone of the input model, with a modified
   *                          ΔH value.
   */
  function fitAdjustDeltaH( inputModel, deltaLevel ) {
    var newModel = this._dischargeModelConstructor.clone( inputModel );
    newModel.paramDeltaLevel = deltaLevel;
    return newModel;
  }
  DischargeCurveFitting.prototype.fitAdjustDeltaH = fitAdjustDeltaH;

  /**
   * Adjusts the delta H in a discharge model and returns a model with the
   * adjusted value. Note that this does not modify the original discharge
   * model.
   *
   * If the given model is already adjusted for delta, then this delta is
   * incorporated into the a parameter before the new adjusted delta
   * is recorded in the delta level parameter.
   *
   * @public
   * @instance
   * @memberOf DischargeCurveFitting
   * @param {DischargeModel} model The model to use as a starting point.
   * @param {Number} deltaLevel The new delta-H value.
   * @return {DischargeModel} A clone of the input model with the adjusted
   *                          datum.
   */
  function adjustDeltaH( model, deltaLevel ) {
    var newModel = model.clone();
    newModel.paramA = newModel.paramA + newModel.paramDeltaLevel;
    newModel.paramDeltaLevel = deltaLevel;
    return newModel;
  }
  DischargeCurveFitting.prototype.adjustDeltaH = adjustDeltaH;

  /** start: Private testing API */
  DischargeCurveFitting.prototype._calculateDatumCorrection =
    calculateDatumCorrection;
  DischargeCurveFitting.prototype._leastSquaresFit = leastSquaresFit;
  /** end: Private testing API */

  global.angular.module( 'imomoCaApp' )
    .service( 'DischargeCurveFitting', DischargeCurveFitting );

}( window ) );
