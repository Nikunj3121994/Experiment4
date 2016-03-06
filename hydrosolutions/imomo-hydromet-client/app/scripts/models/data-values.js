( function ( global ) {
  'use strict';


  /**
   * Factory function for the DataValue class.
   *
   * @return {Function} The constructor for the {@link DataValue} class.
   */
  function DataValueFactory() {

    /**
     * Constructor for the DataValue class. It creates an instance of a data
     * value with the given properties.
     *
     * @class DataValue
     * @classdesc DataValue model which is equivalent to the data_value table
     *            in the backend.
     * @param {Object} options Properties to initialize the model.
     */
    function DataValue( options ) {
      /**
       * The id of the data value instance in the backend.
       *
       * @name DataValue#id
       * @type {Number}
       * @public
       * @default null
       */
      this.id = options.id || null;
      /**
       * The numerical value.
       *
       * @name DataValue#dataValue
       * @type {Number}
       * @public
       * @default null
       */
      this.dataValue = options.dataValue || null;
      /**
       * The accuracy.
       *
       * @name DataValue#valueAccuracy
       * @type {Number}
       * @public
       * @default null
       */
      this.valueAccuracy = options.valueAccuracy || null;
      /**
       * The local date and time.
       *
       * @name DataValue#localDateTime
       * @type {external:Moment}
       * @public
       * @default null
       */
      this.localDateTime = options.localDateTime || null;
      /**
       * The UTC offset against the local date time.
       *
       * @name DataValue#utcOffset
       * @type {Number}
       * @public
       * @default null
       */
      this.utcOffset = options.utcOffset || null;
      /**
       * The UTC date time.
       *
       * @name DataValue#dateTimeUtc
       * @type {Number}
       * @public
       * @default null
       */
      this.dateTimeUtc = options.dateTimeUtc || null;
      /**
       * The id of the associated site.
       *
       * @name DataValue#siteId
       * @type {Number}
       * @public
       * @default null
       */
      this.siteId = options.siteId || null;
      /**
       * The id of the associated variable.
       *
       * @name DataValue#variableId
       * @type {Number}
       * @public
       * @default null
       */
      this.variableId = options.variableId || null;
      /**
       * The offset.
       *
       * @name DataValue#offsetValue
       * @type {Number}
       * @public
       * @default null
       */
      this.offfsetValue = options.offsetValue || null;
      /**
       * The type of offset.
       *
       * @name DataValue#offsetTypeId
       * @type {Number}
       * @public
       * @default null
       */
      this.offsetTypeId = options.offsetTypeId || null;
      /**
       * The id of the censor code.
       *
       * @name DataValue#censorCodeId
       * @type {Number}
       * @public
       * @default null
       */
      this.censorCodeId = options.censorCodeId || null;
      /**
       * The id of the data qualifier.
       *
       * @name DataValue#qualifierId
       * @type {Number}
       * @public
       * @default null
       */
      this.qualifierId = options.qualifierId || null;
      /**
       * The id of the method that produced the data.
       *
       * @name DataValue#methodId
       * @type {Number}
       * @public
       * @default null
       */
      this.methodId = options.methodId || null;
      /**
       * The id of the owner source.
       *
       * @name DataValue#sourceId
       * @type {Number}
       * @public
       * @default null
       */
      this.sourceId = options.sourceId || null;
      /**
       * The id of the sample.
       *
       * @name DataValue#sampleId
       * @type {Number}
       * @public
       * @default null
       */
      this.sampleId = options.sampleId || null;
      /**
       * The group that indicates the originating data values.
       *
       * @name DataValue#derivedFromId
       * @type {Number}
       * @public
       * @default null
       */
      this.derivedFromId = options.derivedFromId || null;
      /**
       * The id of the quality control level.
       *
       * @name DataValue#qualityControlLevelId
       * @type {Number}
       * @public
       * @default null
       */
    }

    /**
     * Factory method that produces a client-side data value from a
     * serialized JSON object from the server.
     *
     * @public
     * @static
     * @memberOf DataValue
     * @param  {Object} serverDataValue The serialized JSON object from the
     *                                  server.
     * @return {DataValue} The client-side instance.
     */
    DataValue.fromServerObject = function ( serverDataValue ) {
      serverDataValue.localDateTime = moment.unix(
        serverDataValue.dateTimeUtc );
      serverDataValue.dateTimeUtc = moment.utc(
        serverDataValue.dateTimeUtc * 1000 );
      return new DataValue( serverDataValue );
    };

    return DataValue;
  }

  global.angular.module( 'imomoCaApp' )
    .factory( 'DataValue', DataValueFactory );

} )( window );
