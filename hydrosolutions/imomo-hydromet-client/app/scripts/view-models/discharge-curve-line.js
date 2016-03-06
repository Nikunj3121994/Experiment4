( function ( global ) {
  'use strict';
  /**
   * Factory to register the DischargeCurveLine view model class in the
   * angular module.
   *
   * @return {Function} The constructor for the
   *                    {@link DischargeCurveLine|class}.
   */
  function DischargeCurveLineFactory() {
    /**
     * A data point that defines the discharge curve.
     *
     * @typedef DischargeCurveLine~DataPoint
     * @type {Object}
     * @property {Number} x The x-coordinate value of the point
     * @property {Number} y The y-coordinate value of the point
     */

    /**
     * Constructs a default discharge curve.
     *
     * @class DischargeCurveLine
     * @classdesc A view model that represents a single discharge curve
     *            in a graph.
     */
    var DischargeCurveLine = function () {
      /**
       * The discharge model generating the curve.
       *
       * @name DischargeCurveLine#dischargeModel
       * @type {DischargeModel}
       * @default null
       * @public
       */
      this.dischargeModel = null;
      /**
       * The generated points for the curve.
       *
       * @name DischargeCurveLine#dataPoints
       * @type {Array.<DischargeCurveLine~DataPoint>}
       * @default null
       * @public
       */
      this.dataPoints = null;
      /**
       * The generated path that describes the curve in the graph.
       *
       * @name DischargeCurveLine#dPath
       * @type {String}
       * @default M0,0
       * @public
       */
      this.dPath = 'M0,0';
      /**
       * An object holding the different CSS classes to be applied to the curve
       * in the graph.
       *
       * @name  DischargeCurveLine#cssClasses
       * @type {Object}
       * @public
       * @property {Boolean} hover Indicates if the cursor is hovering over the
       *                           curve.
       * @property {Boolean} curve-{i} A set of classes that indicate the color
       *                               of the class, currently supports values
       *                               from 0 to 4 for the i variable. Only one
       *                               can be true at a time.
       * @property {Boolean} selected Indicates whether the line has been
       *                              selected.
       */
      this.cssClasses = {};
    };

    /**
     * Extends the domain of the calculated data points to accommodate for the
     * new range given.
     *
     * @public
     * @instance
     * @memberOf DischargeCurveLine
     * @param {BoundingBox} boundingBox Bounding box currently displayed.
     */
    DischargeCurveLine.prototype.changeDomain = function ( boundingBox ) {
      var minWaterLevel = Math.max( boundingBox.minY,
        this.dischargeModel.zeroDischargeWaterLevel() );
      var curveDataPoints = _.map(
        _.range( minWaterLevel, boundingBox.maxY + 1 ),
        function getDataPoint( waterLevelValue ) {
          var y = waterLevelValue,
            x = this.dischargeModel.getDischargeValue( waterLevelValue );
          return {
            x: x,
            y: y
          };
        }.bind( this ) );
      this.dataPoints = curveDataPoints;
    };

    /**
     * Produces a user-friendly string that represents the discharge curve.
     * This is equivalent to the {@link DischargeModel#toString} method.
     *
     * @public
     * @instance
     * @memberOf DischargeCurveLine
     * @return {external:String} String representation of the curve.
     */
    DischargeCurveLine.prototype.toString = function () {
      return this.dischargeModel.toString();
    };

    /**
     * Sets the color class of the curve to the given index.
     * Currently there are only 5 available colors so a modulo 5 is applied
     * to the index.
     *
     * @public
     * @instance
     * @memberOf DischargeCurveLine
     * @param {Number} idx Color index for the curve
     */
    DischargeCurveLine.prototype.setColor = function ( idx ) {
      var modIdx = idx % 5;
      _.each( _.range( 0, 5 ), function ( val ) {
        this.cssClasses[ sprintf( 'curve-%d', val ) ] = ( val === modIdx );
      }.bind( this ) );
    };


    /**
     * Indicates whether the cursor is entering or leaving an item associated
     * with the discharge curve line and therefore should trigger a visual
     * effect on the graph.
     *
     * @public
     * @instance
     * @memberOf DischargeCurveLine
     * @param {Boolean} enter Indicates if the cursor is entering (true)
     *                        or leaving (false).
     */
    DischargeCurveLine.prototype.cursorEnter = function ( enter ) {
      this.cssClasses.hover = enter;
    };

    /**
     * Indicates that the discharge curve has been selected and thus a class
     * should be added to make this visible.
     *
     * @public
     * @instance
     * @memberOf DischargeCurveLine
     */
    DischargeCurveLine.prototype.select = function () {
      this.cssClasses.selected = true;
    };

    /**
     * Indicates that the discharge curve is not selected and thus any
     * related visual effect should be removed.
     *
     * @public
     * @instance
     * @memberOf DischargeCurveLine
     */
    DischargeCurveLine.prototype.deselect = function () {
      this.cssClasses.selected = false;
    };

    /**
     * Indicates whether the discharge curve is selected.
     *
     * @public
     * @instance
     * @memberOf DischargeCurveLine
     * @return {Boolean} true if the discharge curve is selected.
     */
    DischargeCurveLine.prototype.isSelected = function () {
      return this.cssClasses.selected;
    };

    /**
     * Indicates whether the current discharge curve can be deleted from the
     * list of curves.
     *
     * This can only be done if the discharge curve is created from a
     * client-side discharge model, i.e. a model that has not yet been
     * persisted to the server backend.
     *
     * @public
     * @instance
     * @memberOf DischargeCurveLine
     * @return {Boolean} true if the discharge curve can be deleted.
     */
    DischargeCurveLine.prototype.isDeletable = function () {
      return this.dischargeModel.id === null;
    };

    /**
     * Build a discharge curve line from a discharge model.
     *
     * @public
     * @static
     * @memberOf DischargeCurveLine
     * @param  {DischargeModel} dischargeModel
     *         Discharge model from which the line should be built.
     * @return {DischargeCurveLine}
     *         Discharge curve line bound to the given discharge model.
     */
    DischargeCurveLine.fromDischargeModel = function ( dischargeModel ) {
      var dischargeCurveLine = new DischargeCurveLine();
      dischargeCurveLine.dischargeModel = dischargeModel;
      return dischargeCurveLine;
    };

    return DischargeCurveLine;
  }

  global.angular.module( 'imomoCaApp' )
    .factory( 'DischargeCurveLine', DischargeCurveLineFactory );

} )( window );
