( function ( global ) {
  'use strict';

  /**
   * Factory function for the DischargeModel class.
   *
   * @return {Function} Constructor function for
   *                    {@link DischargeModel| discharge model}.
   */
  function DischargeModelFactory() {
    /**
     * Creates a new discharge model with the given parameters, or the default
     * ones if no parameters are provided. The default model is valid from
     * the moment of its creation and represents the following power model:
     * Q = H^2
     *
     * @class DischargeModel
     * @classdesc Client-side class representing discharge models which
     *            are used to estimate discharge from water level measurements
     *            in gauging stations. This model matches the server-side
     *            model with the same class name.
     * @param {Object} options The options to initialize the model.
     */
    function DischargeModel( options ) {
      options = options || {};
      /**
       * Server-side id for the discharge model.
       *
       * @name DischargeModel#id
       * @type {Number}
       * @public
       * @default null
       */
      this.id = options.id || null;
      /**
       * The name for the discharge model.
       *
       * @name DischargeModel#modelName
       * @type {external:String}
       * @public
       * @default Empty string.
       */
      this.modelName = options.modelName || '';
      /**
       * The parameter a in the equation.
       *
       * @name DischargeModel#paramA
       * @type {Number}
       * @public
       * @default 0.0
       */
      this.paramA = options.paramA || 0.0;
      /**
       * The parameter b in the equation.
       *
       * @name DischargeModel#paramB
       * @type {Number}
       * @public
       * @default 2.0
       */
      this.paramB = options.paramB || 2.0;
      /**
       * The parameter c in the equation.
       *
       * @name DischargeModel#paramC
       * @type {Number}
       * @public
       * @default 1.0
       */
      this.paramC = options.paramC || 1.0;
      /**
       * The parameter delta-h in the equation.
       *
       * @name DischargeModel#paramDeltaLevel
       * @type {Number}
       * @public
       * @default 0.0
       */
      this.paramDeltaLevel = options.paramDeltaLevel || 0.0;
      /**
       * Indicates the start date of validity for the model.
       *
       * @name DischargeModel#validFrom
       * @type {external:Moment}
       * @public
       */
      this.validFrom = options.validFrom || moment();
      /**
       * The ID of the associated site.
       *
       * @name DischargeModel#siteId
       * @type {Number}
       * @public
       * @default null
       */
      this.siteId = options.siteId || null;
    }

    Object.defineProperty( DischargeModel.prototype, 'label', {
      enumerable: true,
      get: function () {
        return this._modelName + ' (' + this._validFrom.format( 'll' ) + ')';
      }
    } );


    /**
     * @deprecated Water flow should be referred as discharge across the
     * application.
     */
    DischargeModel.prototype.getWaterFlow = function ( waterLevel ) {
      return this.getDischargeValue( waterLevel );
    };

    DischargeModel.prototype.getWaterFlowNoDelta = function ( waterLevel ) {
      if ( this.isValidWaterLevelNoDelta( waterLevel ) ) {
        return this.paramC * Math.pow( waterLevel + this.paramA, this.paramB );
      } else {
        return 0.0;
      }
    };

    DischargeModel.prototype.isValidWaterLevelNoDelta = function ( waterLevel ) {
      return waterLevel + this.paramA > 0.0;
    };

    DischargeModel.prototype.isValidWaterLevel = function ( waterLevel ) {
      return waterLevel > this.zeroDischargeWaterLevel();
    };

    DischargeModel.prototype.minValidWaterLevelNoDelta = function () {
      return -this.paramA;
    };

    /**
     * @deprecated Replaced by zeroDischargeWaterLevel which is more
     * descriptive of the value.
     */
    DischargeModel.prototype.minValidWaterLevel = function () {
      return this.zeroDischargeWaterLevel();
    };

    DischargeModel.prototype.zeroDischargeWaterLevel = function () {
      return -this.paramA - this.paramDeltaLevel;
    };

    DischargeModel.prototype.getDischargeValue = function ( waterLevel ) {
      if ( this.isValidWaterLevel( waterLevel ) ) {
        return this.paramC * Math.pow( waterLevel + this.paramA + this.paramDeltaLevel, this.paramB );
      }
      return 0.0;
    };

    /**
     * Indicates whether there is a delta level adjustment in the model.
     *
     * @public
     * @memberOf DischargeModel
     * @return {Boolean} True if there is a delta level adjustment, false
     *                   otherwise.
     */
    DischargeModel.prototype.hasDeltaLevelAdjustment = function () {
      return this.paramDeltaLevel !== 0;
    };

    /**
     * Produces a user-friendly string representing the discharge model.
     *
     * @public
     * @memberOf DischargeModel
     * @return {String} Representation of the discharge model.
     */
    DischargeModel.prototype.toString = function () {
      return sprintf( '%s (%s)',
        this.modelName, this.validFrom.format( 'L' ) );
    };

    /**
     * Serializes the instance into a JSON object that can be sent to
     * the server.
     *
     * @public
     * @instance
     * @memberOf DischargeModel
     * @return {Object} Server-friendly representation of the
     *                  {@link DischargeModel} instance.
     */
    DischargeModel.prototype.toServerObject = function () {
      return {
        id: this.id,
        modelName: this.modelName,
        paramA: this.paramA,
        paramB: this.paramB,
        paramC: this.paramC,
        paramDeltaLevel: this.paramDeltaLevel,
        validFrom: this.validFrom.unix(),
        siteId: this.siteId
      };
    };

    /**
     * Clones the model, this returns a new model with the same parameters
     * but and updated timestamp and without any ID.
     *
     * @public
     * @instance
     * @memberOf DischargeModel
     * @return {DischargeModel} The cloned discharge model.
     */
    DischargeModel.prototype.clone = function () {
      return new DischargeModel( {
        modelName: this.modelName,
        paramA: this.paramA,
        paramB: this.paramB,
        paramC: this.paramC,
        paramDeltaLevel: this.paramDeltaLevel,
        siteId: this.siteId
      } );
    };

    /**
     * Clone the given model. This returns a new discharge model instance
     * with the same parameters but updated validity timestamp and without
     * any ID.
     *
     * @deprecated Use the instance clone method instead.
     * @public
     * @static
     * @memberOf DischargeModel
     * @param {DischargeModel} clonable Model to clone.
     * @return {DischargeModel} A clone of the given model.
     */
    DischargeModel.clone = function ( clonable ) {
      return clonable.clone();
    };

    /**
     * De-serialize a JSON object into a
     * {@link DischargeModel|discharge model}.
     *
     * @public
     * @static
     * @memberOf DischargeModel
     * @param  {Object} serverDischargeModel
     *         The JSON-serialized discharge model.
     * @return {DischargeModel} The client-side discharge model.
     */
    DischargeModel.fromServerObject = function ( serverDischargeModel ) {
      serverDischargeModel.validFrom = moment
        .unix( serverDischargeModel.validFrom );
      return new DischargeModel( serverDischargeModel );
    };

    return DischargeModel;
  }

  global.angular.module( 'imomoCaApp' )
    .factory( 'DischargeModel', DischargeModelFactory );

} )( window );
