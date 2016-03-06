( function ( global ) {
  'use strict';

  /**
   * Factory function for the {@link JournalData} class.
   *
   * @param {Function} JournalSiteData Constructor for the
   *                                   {@link JournalSiteData} class.
   * @returns {Function} Constructor for the {@link JournalData} class
   */
  function JournalDataFactory( JournalSiteData ) {
    /**
     * Initializes a journal data instance with the given data.
     *
     * @class JournalData
     * @classdesc A view-model to process the journal data sent from the
     *            server.
     * @param {Object} options The values to initialize the instance.
     */
    function JournalData( options ) {
      options = options || {};
      /**
       * The journal data for each site.
       *
       * @name JournalData#siteData
       * @type {Array.<JournalSiteData>}
       * @public
       */
      this.siteData = options.siteData || [];
      /**
       * The URL where to download the file with the journal data.
       *
       * @name JournalData#journalUrl
       * @type {external:String}
       * @public
       * @default null
       */
      this.journalUrl = options.journalUrl || null;
    }

    /**
     * De-serializes a JSON-object sent from the server into a JournalData
     * instance.
     *
     * @public
     * @static
     * @memberOf JournalData
     * @param {Object} serverJournalData The journal data sent from the
     *                                   server.
     * @return {JournalData} The client-side instance created from the server
     *                       data.
     */
    JournalData.fromServerObject = function ( serverJournalData ) {
      var journalData = new JournalData( {
        journalUrl: serverJournalData.journalUrl
      } );
      for ( var siteId in serverJournalData.siteData ) {
        var siteData = JournalSiteData.fromServerObject(
          serverJournalData.siteData[ siteId ] );
        siteData.siteId = siteId;
        journalData.siteData.push( siteData );
      }
      return journalData;
    };

    return JournalData;
  }

  /**
   * Injectable dependencies for the factory.
   *
   * @type {Array.<external:String>}
   */
  JournalDataFactory.$inject = [ 'JournalSiteData' ];

  global.angular.module( 'imomoCaApp' )
    .factory( 'JournalData', JournalDataFactory );

} )( window );

( function ( global ) {
  'use strict';

  /**
   * Factory function for the {@link JournalSiteData} class.
   *
   * @param {Function} JournalDailyDataTriplet Constructor for the
   *                   {@link JournalDailyDataTriplet} class.
   * @param {Function} JournalDischargeTuple Constructor for the the
   *                   {@link JournalDischargeTuple} class.
   * @return {Function} The constructor for the {@link JournalSiteData} class.
   */
  function JournalSiteDataFactory( JournalDailyDataTriplet,
    JournalDischargeTuple ) {
    /**
     * Initializes the journal data for a single site.
     *
     * @class JournalSiteData
     * @classdesc Contains the discharge and daily data for a single site for
     *            display.
     * @param {Object} options The initial values for the instance.
     */
    function JournalSiteData( options ) {
      options = options || {};
      /**
       * The array of daily data triplets.
       *
       * @name JournalSiteData#dailyData
       * @type {Array.<JournalDailyDataTriplet>}
       * @public
       */
      this.dailyData = options.dailyData || [];
      /**
       * The array of discharge data tuples.
       *
       * @name JournalSiteData#dischargeData
       * @type {Array.<JournalDischargeTuple>}
       * @public
       */
      this.dischargeData = options.dischargeData || [];
      /**
       * The id of the site.
       *
       * @name JournalSiteData#siteId
       * @type {Number}
       * @public
       * @default null
       */
      this.siteId = options.siteId || null;
    }

    /**
     * De-serializes a JSON object sent from the server into a JournalSiteData
     * instance.
     *
     * @public
     * @static
     * @memberOf JournalSiteData
     * @param {Object} serverJournalSiteData The journal data sent from the
     *                                       server for a single site.
     * @return {JournalSiteData} The client-side instance created from the
     *                           server data.
     */
    JournalSiteData.fromServerObject = function ( serverJournalSiteData ) {
      var dailyData = serverJournalSiteData.dailyData.map(
        JournalDailyDataTriplet.fromServerObject );
      var dischargeData = serverJournalSiteData.dischargeData.map(
        JournalDischargeTuple.fromServerObject );
      return new JournalSiteData( {
        dailyData: dailyData,
        dischargeData: dischargeData
      } );
    };

    return JournalSiteData;
  }

  /**
   * Injectable dependencies for the factory.
   *
   * @type {Array.<external:String>}
   */
  JournalSiteDataFactory.$inject = [ 'JournalDailyDataTriplet',
    'JournalDischargeTuple'
  ];

  global.angular.module( 'imomoCaApp' )
    .factory( 'JournalSiteData', JournalSiteDataFactory );

} )( window );

( function ( global ) {
  'use strict';

  /**
   * Factory function for the {@link JournalDailyDataTriplet} class.
   *
   * @param {Function} DischargeMeasurementPair The constructor for the
   *                   {@link DischargeMeasurementPair} class.
   * @return {Function} The constructor for the {@link JournalDailyDataTriplet}
   *                    class.
   */
  function JournalDailyDataTripletFactory( DischargeMeasurementPair ) {
    /**
     * Initializes a triplet of discharge measurement pairs with the given
     * data.
     *
     * @class JournalDailyDataTriplet
     * @classdesc A triplet with one or more discharge and water level pairs
     *            for 08:00, 20:00 and the average at 12:00 of a single day.
     * @param {Object} options The values to initialize the instance.
     */
    function JournalDailyDataTriplet( options ) {
      options = options || {};
      /**
       * The data at 08:00.
       *
       * @name JournalDailyDataTriplet#eightData
       * @type {DischargeMeasurementPair}
       * @public
       * @default null
       */
      this.eightData = options.eightData || null;
      /**
       * The data at 20:00.
       *
       * @name JournalDailyDataTriplet#twentyData
       * @type {DischargeMeasurementPair}
       * @public
       * @default null
       */
      this.twentyData = options.twentyData || null;
      /**
       * The average data for the day.
       *
       * @name JournalDailyDataTriplet#averageData
       * @type {DischargeMeasurementPair}
       * @public
       * @default null
       */
      this.averageData = options.averageData || null;
      /**
       * The date for the entry.
       *
       * @name JournalDailyDataTriplet#date
       * @type {external:Moment}
       * @public
       * @default Current date
       */
      if ( this.eightData ) {
        this.date = this.eightData.waterLevel.localDateTime;
      } else if ( this.twentyData ) {
        this.date = this.twentyData.waterLevel.localDateTime;
      } else if ( this.averageData ) {
        this.date = this.averageData.waterLevel.localDateTime;
      } else {
        this.date = moment();
      }
    }

    /**
     * De-serializes a JSON object sent by the server into a
     * @{link JournalDailyDataTriplet} instance.
     *
     * @public
     * @static
     * @memberOf JournalDailyDataTriplet
     * @param {Object} serverTriplet The serialized triplet from the server.
     * @return {JournalDailyDataTriplet} The triplet created from the JSON
     *                                   object.
     */
    JournalDailyDataTriplet.fromServerObject = function ( serverTriplet ) {
      if ( serverTriplet.eightData ) {
        serverTriplet.eightData = DischargeMeasurementPair.fromServerObject(
          serverTriplet.eightData );
      }
      if ( serverTriplet.twentyData ) {
        serverTriplet.twentyData = DischargeMeasurementPair.fromServerObject(
          serverTriplet.twentyData );
      }
      if ( serverTriplet.averageData ) {
        serverTriplet.averageData = DischargeMeasurementPair.fromServerObject(
          serverTriplet.averageData );
      }
      return new JournalDailyDataTriplet( serverTriplet );
    };

    return JournalDailyDataTriplet;
  }

  /**
   * Injectable dependencies for the factory.
   *
   * @type {Array.<external:String>}
   */
  JournalDailyDataTripletFactory.$inject = [ 'DischargeMeasurementPair' ];

  global.angular.module( 'imomoCaApp' )
    .factory( 'JournalDailyDataTriplet', JournalDailyDataTripletFactory );

} )( window );

( function ( global ) {
  'use strict';

  /**
   * Factory function for the {@link JournalDischargeTuple} class.
   *
   * @param {Function} DataValue Constructor for the {@link DataValue} class.
   * @return {Function} Constructor for the
   *                    {@link JournalDischargeTuple} class.
   */
  function JournalDischargeTupleFactory( DataValue ) {
    /**
     * Initializes a tuple with all the related measurements for a discharge
     * measurement.
     *
     * @class JournalDischargeTuple
     * @classdesc A tuple with the 4 relevant data values that are recorded
     *            when storing discharge data.
     * @param {Object} options The values to initialize the instance.
     */
    function JournalDischargeTuple( options ) {
      options = options || {};
      /**
       * The discharge data value.
       *
       * @name JournalDischargeTuple#discharge
       * @type {DataValue}
       * @public
       * @default null
       */
      this.discharge = options.discharge || null;
      /**
       * The water level data value.
       *
       * @name JournalDischargeTuple#waterLevel
       * @type {DataValue}
       * @public
       * @default null
       */
      this.waterLevel = options.waterLevel || null;
      /**
       * The maximum depth data value.
       *
       * @name JournalDischargeTuple#maximumDepth
       * @type {DataValue}
       * @public
       * @default null
       */
      this.maximumDepth = options.maximumDepth || null;
      /**
       * The cross section area of the river.
       *
       * @name JournalDischargeTuple#freeRiverArea
       * @type {DataValue}
       * @public
       * @default null
       */
      this.freeRiverArea = options.freeRiverArea || null;
      /**
       * The date for the entry.
       *
       * @name JournalDischargeTuple#date
       * @type {external:Moment}
       * @public
       * @default Current date
       */
      if ( this.discharge ) {
        this.date = this.discharge.localDateTime;
      } else {
        this.date = moment();
      }
    }

    /**
     * De-serializes a JSON object from the server into a discharge tuple
     * instance.
     *
     * @public
     * @static
     * @memberOf JournalDischargeTuple
     * @param {Object} serverTuple The serialized JSON tuple from the server.
     * @return {JournalDischargeTuple} The discharge tuple from the server
     *                                 data.
     */
    JournalDischargeTuple.fromServerObject = function ( serverTuple ) {
      return new JournalDischargeTuple( {
        discharge: DataValue.fromServerObject( serverTuple.discharge ),
        waterLevel: DataValue.fromServerObject( serverTuple.waterLevel ),
        maximumDepth: DataValue.fromServerObject( serverTuple.maximumDepth ),
        freeRiverArea: DataValue.fromServerObject( serverTuple.freeRiverArea )
      } );
    };

    return JournalDischargeTuple;
  }

  /**
   * Injectable dependencies for the factory.
   *
   * @type {Array.<external:String>}
   */
  JournalDischargeTupleFactory.$inject = [ 'DataValue' ];

  global.angular.module( 'imomoCaApp' )
    .factory( 'JournalDischargeTuple', JournalDischargeTupleFactory );
} )( window );
