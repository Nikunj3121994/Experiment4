( function ( global ) {
  'use strict';

  /**
   * Factory function for the {@link FakeDischargePair} class.
   *
   * @return {Function} Constructor for the {@link FakeDischargePair} class.
   */
  function FakeDischargePairFactory() {
    /**
     * Creates a new instance of a fake discharge pair with the given initial
     * values.
     *
     * @class FakeDischargePair
     * @classdesc A fake discharge pair contains water level and discharge data
     *            as well as an optional date to be used as a label, but it
     *            differentiates from a {@link DischargeMeasurementPair} in
     *            that it does not come from real {@link DataValue|data values}
     *            stored in the server but rather input data on the client,
     *            however this can be a real measured point from a telegram
     *            which is distinguished by the measured property.
     * @param {Object} options The input options to initialize the object.
     */
    function FakeDischargePair( options ) {
      options = options || {};
      /**
       * The discharge value.
       *
       * @name FakeDischargePair#dischargeValue
       * @type {Number}
       * @public
       * @default 0.0
       */
      this.dischargeValue = options.dischargeValue || 0.0;
      /**
       * The water level value.
       *
       * @name FakeDischargePair#waterLevelValue
       * @type {Number}
       * @public
       * @default 0.0
       */
      this.waterLevelValue = options.waterLevelValue || 0.0;
      /**
       * An optional date to use for labeling purposes.
       *
       * @name FakeDischargePair#labelDate
       * @type {external:Moment}
       * @public
       * @default null
       */
      this.labelDate = options.labelDate || null;
      /**
       * Indicates if the point was artificially created or was created from
       * a telegram input.
       *
       * @name FakeDischargePair#measured
       * @type {Boolean}
       * @public
       * @default false
       */
      this.measured = options.measured || false;
    }
    return FakeDischargePair;
  }

  global.angular.module( 'imomoCaApp' )
    .factory( 'FakeDischargePair', FakeDischargePairFactory );

} )( window );

( function ( global ) {
  'use strict';

  moment.locale( 'en-roman-months', {
    monthsShort: [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII',
      'VIII', 'IX', 'X', 'XI', 'XII'
    ]
  } );
  moment.locale( 'en' );

  /**
   * Factory function for the {@link DischargeCurvePoint} class.
   * @param {Function} DischargeMeasurementPair The constructor for the
   *                   {@link DischargeMeasurementPair} class.
   * @param {Function} FakeDischargePair The constructor for the
   *                   {@link FakeDischargePair} class.
   * @return {Function} The constructor for the {@link DischargeCurvePoint}
   *                    class.
   */
  function DischargeCurvePointFactory( DischargeMeasurementPair,
    FakeDischargePair ) {
    /**
     * A discharge node in the graph.
     *
     * @typedef DischargeCurvePoint~DischargeNode
     * @type {Object}
     * @property {Number} waterLevel Water level value
     * @property {Number} discharge Discharge value
     * @property {Number} x X-coordinate
     * @property {Number} y Y-coordinate
     * @property {Number} radius Radius of the displayed node
     * @property {Boolean} fixed Indicates that the discharge node is fixed
     */

    /**
     * A label node in the graph.
     *
     * @typedef DischargeCurvePoint~LabelNode
     * @type {Object}
     * @property {Number} x X-coordinate
     * @property {Number} y Y-coordinate
     * @property {Number} dx Horizontal displacement
     * @property {Number} dy Vertical displacement
     * @property {String} text Descriptive label
     */

    /**
     * Constructs a default discharge data point.
     *
     * @class DischargeCurvePoint
     * @classdesc A view model that represents a discharge point in the graph,
     *            this includes the date label and link, if any exists.
     */
    function DischargeCurvePoint() {
      /**
       * The discharge data value to display in the graph.
       *
       * @name DischargeCurvePoint#dataValue
       * @type {DischargeCurvePoint~DischargeNode}
       * @public
       */
      this.dataValue = {
        x: 0,
        y: 0,
        radius: 6,
        fixed: true,
        waterLevel: 0,
        discharge: 0
      };
      /**
       * The label associated with the data value.
       *
       * @name DischargeCurvePoint#label
       * @type {DischargeCurvePoint~LabelNode}
       * @public
       * @default null
       */
      this.label = null;
      /**
       * The associated discharge data point.
       *
       * @name  DischargeCurvePoint#dischargeData
       * @type {(DischargeMeasurementPair|FakeDischargePair)}
       * @public
       * @default null
       */
      this.dischargeData = null;
      /**
       * Set of conditionally enabled CSS classes that apply to the discharge
       * point and its label.
       *
       *
       * @name DischargeCurvePoint#cssClasses
       * @type {Object}
       * @public
       * @property {Boolean} selected Indicates whether the point has been
       *                              selected.
       * @property {Boolean} fake Indicates whether the point is created on
       *                          the client side or not.
       * @property {Boolean} measured Indicates whether the point was
       *                              measured or created artificially.
       */
      this.cssClasses = {};
    }

    /**
     * Indicates if the discharge point has an associated label.
     *
     * @public
     * @memberOf DischargeCurvePoint
     * @return {Boolean} True if there is a non-null label present in the
     *                        point, false otherwise.
     */
    DischargeCurvePoint.prototype.hasLabel = function () {
      return !!this.label;
    };

    /**
     * Indicates whether the discharge point is selected.
     *
     * @public
     * @instance
     * @memberOf DischargeCurvePoint
     * @returns {Boolean} True if the discharge point has been selected,
     *                    False otherwise.
     */
    function isSelected() {
      return this.cssClasses.selected;
    }
    DischargeCurvePoint.prototype.isSelected = isSelected;


    /**
     * Change the selected status of the point to true.
     *
     * @public
     * @instance
     * @memberOf DischargeCurvePoint
     */
    function select() {
      this.cssClasses.selected = true;
    }
    DischargeCurvePoint.prototype.select = select;

    /**
     * Change the selected status of the point to false.
     *
     * @public
     * @instance
     * @memberOf DischargeCurvePoint
     */
    function deselect() {
      this.cssClasses.selected = false;
    }
    DischargeCurvePoint.prototype.deselect = deselect;

    /**
     * Indicates if the point is selectable, only measured points are
     * selectable.
     *
     * @public
     * @instance
     * @memberOf DischargeCurvePoint
     */
    function isSelectable() {
      return this.cssClasses.measured;
    }
    DischargeCurvePoint.prototype.isSelectable = isSelectable;

    /**
     * Factory function to create new {@link DischargeCurvePoint} from either
     * a {@link DischargeMeasurementPair|real} or
     * {@link FakeDischargePair|fake} pair of discharge-water level data.
     *
     * @public
     * @static
     * @memberOf DischargeCurvePoint
     * @param  {(DischargeMeasurementPair|FakeDischargePair)} dischargeData
     *         The input discharge data point.
     * @return {DischargeCurvePoint} The newly created discharge curve point.
     */
    DischargeCurvePoint.fromDischargeData = function ( dischargeData ) {
      var dischargeCurvePoint = new DischargeCurvePoint();
      dischargeCurvePoint.dischargeData = dischargeData;

      if ( dischargeData instanceof DischargeMeasurementPair ) {
        dischargeCurvePoint.dataValue.waterLevel =
          dischargeData.waterLevel.dataValue;
        dischargeCurvePoint.dataValue.discharge =
          dischargeData.discharge.dataValue;
        dischargeCurvePoint.label = {
          text: dischargeData.discharge.localDateTime.clone()
            .locale( 'en-roman-months' ).format( 'D.MMM' ),
          dx: 4,
          dy: 4
        };
        dischargeCurvePoint.cssClasses.measured = true;
      } else if ( dischargeData instanceof FakeDischargePair ) {
        dischargeCurvePoint.dataValue.waterLevel =
          dischargeData.waterLevelValue;
        dischargeCurvePoint.dataValue.discharge = dischargeData.dischargeValue;
        if ( dischargeData.labelDate !== null ) {
          dischargeCurvePoint.label = {
            text: dischargeData.labelDate.clone().locale( 'en-roman-months' )
              .format( 'D.MMM' ),
            dx: 4,
            dy: 4
          };
        }
        dischargeCurvePoint.cssClasses.fake = !dischargeData.measured;
        dischargeCurvePoint.cssClasses.measured = dischargeData.measured;
      }
      return dischargeCurvePoint;
    };

    DischargeCurvePoint.buildFixedDataNode =
      function ( measurementPair, scales ) {
        return new DischargeCurvePoint( {
          y: scales.y( measurementPair.waterLevel.dataValue ),
          x: scales.x( measurementPair.waterFlow.dataValue ),
          fixed: true,
          measurementPair: measurementPair
        } );
      };

    DischargeCurvePoint.buildDateNode =
      function ( measurementPair ) {
        return new DischargeCurvePoint( {
          label: measurementPair.waterFlow.localDateTime.clone()
            .locale( 'en-roman-months' ).format( 'D.MMM' ),
          measurementPair: measurementPair
        } );
      };

    return DischargeCurvePoint;
  }

  /**
   * Injectable dependencies for the factory.
   *
   * @type {Array.<external:String>}
   */
  DischargeCurvePointFactory.$inject = [ 'DischargeMeasurementPair',
    'FakeDischargePair'
  ];

  global.angular.module( 'imomoCaApp' )
    .factory( 'DischargeCurvePoint', DischargeCurvePointFactory );
} )( window );
