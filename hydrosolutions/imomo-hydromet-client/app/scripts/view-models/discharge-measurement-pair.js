( function ( global ) {
  'use strict';

  /**
   * Factory function for the {@link DischargeMeasurementPair} class.
   *
   * @param {Function} DataValue Constructor for the {@link DataValue} class.
   * @return {Function} Constructor for the {@link DischargeMeasurementPair}
   *                    class.
   */
  function DischargeMeasurementPairFactory( DataValue ) {

    /**
     * Constructor that initializes the discharge measurement pair with the
     * given data values.
     *
     * @class DischargeMeasurementPair
     * @classdesc A discharge measurement pair contains a water level and
     *            discharge {@link DataValue} instances. This is constructed
     *            from a serialized JSON object with the same structure.
     * @param {Object} options The options to initialize the instance.
     */
    function DischargeMeasurementPair( options ) {
      options = options || {};
      /**
       * The water level data value.
       *
       * @name DischargeMeasurementPair#waterLevel
       * @type {DataValue}
       * @public
       * @default null
       */
      this.waterLevel = options.waterLevel || null;
      /**
       * The discharge data value.
       *
       * @name DischargeMeasurementPair#discharge
       * @type {DataValue}
       * @public
       * @default null
       */
      this.discharge = options.discharge || null;
    }

    /**
     * Factory function to create an instance from a serialized JSON object
     * from the backend.
     *
     * @public
     * @static
     * @memberOf DischargeMeasurementPair
     * @param  {Object} serverPair The JSON object from the backend.
     * @return {DischargeMeasurementPair} The client side instance.
     */
    DischargeMeasurementPair.fromServerObject = function ( serverPair ) {
      return new DischargeMeasurementPair( {
        waterLevel: DataValue.fromServerObject( serverPair.waterLevel ),
        discharge: DataValue.fromServerObject( serverPair.discharge )
      } );
    };

    return DischargeMeasurementPair;
  }

  DischargeMeasurementPairFactory.$inject = [ 'DataValue' ];

  global.angular.module( 'imomoCaApp' )
    .factory( 'DischargeMeasurementPair', DischargeMeasurementPairFactory );

} )( window );
