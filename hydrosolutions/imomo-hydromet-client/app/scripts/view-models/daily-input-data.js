( function ( global ) {
  'use strict';

  /**
   * Enumeration that records the possible methods for obtaining the average
   * water level.
   *
   * @enum
   * @type {Number}
   * @readOnly
   */
  var DailyAverageType = {
    MEASURED: 0,
    ARITHMETIC: 1,
    UNKNOWN: 3
  };

  global.angular.module( 'imomoCaApp' )
    .constant( 'DailyAverageType', DailyAverageType );

} )( window );

( function ( global ) {
  'use strict';

  /**
   * Factory function the {@link DailyOperationalData} view model.
   *
   * @param {Function} DataValue Constructor for the @{link DataValue} class.
   * @param {DailyAverageType} DailyAverageType The constant with the possible
   *                                            average types.
   * @returns {Function} Constructor for the @{link DailyOperationalData}
   *                     class.
   */
  function DailyOperationalDataFactory( DataValue, DailyAverageType ) {
    /**
     * Constructor for the daily operational data object.
     *
     * @class DailyOperationalData
     * @classdesc Contains all the relevant values stored when processing
     *            input telegrams in the system. This provides a simple object
     *            where the different values can be stored and then serialized
     *            for consumption by the server.
     */
    function DailyOperationalData() {
      /**
       * The main date. This is the date set for the water level
       * measurements and the calculated discharge.
       *
       * @name DailyOperationalData#mainDate
       * @type {external:Moment}
       * @public
       * @default null
       */
      this.mainDate = null;
      /**
       * Date set for the measurements of the discharge group.
       *
       * @name DailyOperationalData#dischargeDate
       * @type {external:Moment}
       * @public
       * @default null
       */
      this.dischargeDate = null;
      /**
       * The value of the water level at 08:00 on the same day as
       * {@link DailyOperationalData#mainDate|the main date}.
       *
       * @name DailyOperationalData#waterLevelEight
       * @type {Number}
       * @public
       * @default 0.0
       */
      this.waterLevelEight = 0.0;
      /**
       * The value of the water level at 20:00 on the previous day from
       * {@link DailyOperationalData#mainDate|the main date}.
       *
       * @name DailyOperationalData#waterLevelTwenty
       * @type {Number}
       * @public
       * @default 0.0
       */
      this.waterLevelTwenty = 0.0;
      /**
       * The average water level on the previous day from
       * {@link DailyOperationalData#mainDate|the main date}, it is registered
       * at 12:00.
       *
       * @name DailyOperationalData#averageWaterLevel
       * @type {Number}
       * @public
       * @default null
       */
      this.averageWaterLevel = null;
      /**
       * The measured decadal discharge, registered on the
       * {@link DailyOperationalData#dischargeDate|discharge date and time}.
       *
       * @name DailyOperationalData#discharge
       * @type {Number}
       * @public
       * @default null
       */
      this.discharge = null;
      /**
       * The measured water level accompanying the discharge measurement,
       * registered on the same date and time.
       *
       * @name DailyOperationalData#dischargeWaterLevel
       * @type {Number}
       * @public
       * @default null
       * @see {@link DailyOperationalData#discharge}
       */
      this.dischargeWaterLevel = null;
      /**
       * The measured free river area accompanying the discharge measurement,
       * registered on the same date and time.
       *
       * @name DailyOperationalData#dischargeFreeRiverArea
       * @type {Number}
       * @public
       * @default null
       * @see {@link DailyOperationalData#discharge}
       */
      this.dischargeFreeRiverArea = null;
      /**
       * The measured maximum depth in the river accompanying the discharge
       * measurement, registered on the same date and time.
       *
       * @name DailyOperationalData#dischargeMaximumDepth
       * @type {Number}
       * @public
       * @default null
       * @see {@link DailyOperationalData#discharge}
       */
      this.dischargeMaximumDepth = null;
      /**
       * The value of the water level trend registered on the telegram.
       *
       * @name DailyOperationalData#waterLevelTrend
       * @type {Number}
       * @public
       * @default 0,0
       */
      this.waterLevelTrend = 0.0;
      /**
       * The value of the water level on the previous day. This is used
       * to compared the validity of the recorded trend.
       *
       * @name DailyOperationalData#previousWaterLevelEight
       * @type {Number}
       * @public
       * @default null
       */
      this.previousWaterLevelEight = null;
      /**
       * The type of calculation for the average water level.
       *
       * @name DailyOperationalData#averageWaterLevelType
       * @type {DailyAverageType}
       * @public
       * @default null
       */
      this.averageWaterLevelType = null;
      /**
       * The site recorded in the telegram
       *
       * @name DailyOperationalData#site
       * @type {Site}
       * @public
       * @default null
       */
      this.site = null;
      /**
       * The discharge calculated from the water level at 08:00.
       *
       * @name DailyOperationalData#calculatedDischargeEight
       * @type {Number}
       * @public
       * @default null
       */
      this.calculatedDischargeEight = null;
      /**
       * The discharge calculated from the water level at 20:00.
       *
       * @name DailyOperationalData#calculatedDischargeTwenty
       * @type {Number}
       * @public
       * @default null
       */
      this.calculatedDischargeTwenty = null;
      /**
       * The discharge calculated from the average water level.
       *
       * @name DailyOperationalData#calculatedAverageDischarge
       * @type {Number}
       * @public
       * @default null
       */
      this.calculatedAverageDischarge = null;
    }

    /**
     * Calculate and return the date of the day previous to the main date.
     *
     * @public
     * @instance
     * @memberOf DailyOperationalData
     * @return {external:Moment} A date exactly one day before the
     *         {@link DailyOperationalData#mainDate| main date}.
     */
    DailyOperationalData.prototype.previousDayDate = function () {
      return this.mainDate.clone().subtract( 1, 'day' ).hour( 20 );
    };

    /**
     * Determines the correct average water level and its type.
     *
     * It checks if an average water level was specified and if not
     * then it calculates one and sets the correct type.
     *
     * @public
     * @instance
     * @memberOf DailyOperationalData
     */
    DailyOperationalData.prototype.determineWaterLevelAverage = function () {
      if ( this.averageWaterLevel === null ) {
        if ( this.previousWaterLevelEight !== null ) {
          this.averageWaterLevel = ( this.waterLevelTwenty + this.previousWaterLevelEight ) / 2;
          this.averageWaterLevelType = DailyAverageType.ARITHMETIC;
        } else {
          this.averageWaterLevel = this.waterLevelTwenty;
          this.averageWaterLevelType = DailyAverageType.UNKNOWN;
        }
      } else {
        this.averageWaterLevelType = DailyAverageType.MEASURED;
      }
    };

    /**
     * Indicates whether the the data object contains a new discharge
     * measurement or only daily water level values.
     *
     * @public
     * @instance
     * @memberOf DailyOperationalData
     * @return {Boolean} true if there is discharge data available, false
     *                   otherwise.
     */
    DailyOperationalData.prototype.isDischargeAvailable = function () {
      return this.discharge !== null;
    };

    /**
     * Indicates if the displayed average water level is an arithmetic average
     * of the data from the previous day.
     *
     * @public
     * @instance
     * @memberOf DailyOperationalData
     * @return {Boolean} true if the average is arithmetic, false
     *                   otherwise
     */
    DailyOperationalData.prototype.isAverageWaterLevelArithmetic =
      function () {
        return this.averageWaterLevelType === DailyAverageType.ARITHMETIC;
      };

    /**
     * Indicates if the displayed average water level was a measurement
     * recorded in the input telegram.
     *
     * @public
     * @instance
     * @memberOf DailyOperationalData
     * @return {Boolean} true if the average is a measurement, false otherwise.
     */
    DailyOperationalData.prototype.isAverageWaterLevelFromMeasurement =
      function () {
        return this.averageWaterLevelType === DailyAverageType.MEASURED;
      };

    /**
     * Indicates if the displayed average water level is an estimation based
     * on a single observed value.
     *
     * @public
     * @instance
     * @memberOf DailyOperationalData
     * @return {Boolean} true if the average is based on a single measurement,
     *                   false otherwise.
     */
    DailyOperationalData.prototype.isAverageWaterLevelEstimated = function () {
      return this.averageWaterLevelType === DailyAverageType.UNKNOWN;
    };

    /**
     * Serializes the operational data for consumption by the backend.
     *
     * @public
     * @instance
     * @memberOf DailyOperationalData
     * @return {Object} The serialized instance.
     */
    DailyOperationalData.prototype.toServerObject = function () {
      var payload = {
        mainDate: this.mainDate.unix(),
        mainDateOffset: this.mainDate.utcOffset(),
        previousDayDate: this.previousDayDate().unix(),
        previousDayDateOffset: this.previousDayDate().utcOffset(),
        previousDayAverageDate: this.previousDayDate().hour( 12 ).unix(),
        previousDayAverageDateOffset: this.previousDayDate().hour( 12 )
          .utcOffset(),
        waterLevelEight: this.waterLevelEight,
        waterLevelTwenty: this.waterLevelTwenty,
        averageWaterLevel: this.averageWaterLevel,
        calculatedDischargeEight: this.calculatedDischargeEight,
        calculatedDischargeTwenty: this.calculatedDischargeTwenty,
        calculatedAverageDischarge: this.calculatedAverageDischarge,
        isAverageMeasured: this.isAverageWaterLevelFromMeasurement(),
        siteId: this.site.id,
      };
      if ( this.discharge !== null ) {
        payload.dischargeDate = this.dischargeDate.unix();
        payload.dischargeDateOffset = this.dischargeDate.utcOffset();
        payload.discharge = this.discharge;
        payload.dischargeWaterLevel = this.dischargeWaterLevel;
        payload.dischargeFreeRiverArea = this.dischargeFreeRiverArea;
        payload.dischargeMaximumDepth = this.dischargeMaximumDepth;
      }
      return payload;
    };
    return DailyOperationalData;
  }

  /**
   * Injectable dependencies for the {@link DailyOperationalData} factory.
   * @type {Array.<external:String>}
   */
  DailyOperationalDataFactory.$inject = [ 'DataValue', 'DailyAverageType' ];

  global.angular.module( 'imomoCaApp' )
    .factory( 'DailyOperationalData', DailyOperationalDataFactory );
} )( window );
