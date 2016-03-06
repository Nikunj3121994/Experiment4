( function ( global ) {
  'use strict';

  /**
   * Constructs a simple bounding box with default limits.
   *
   * @class BoundingBox
   * @classdesc Represents a set of possible limits of water level and
   *            discharge values for the display of the curve.
   * @param {Object} options Properties to initialize the instance.
   */
  function BoundingBox( options ) {
    options = options || {};
    /**
     * The minimum value of water level (i.e. the y axis).
     *
     * @name BoundingBox#minY
     * @type {Number}
     * @public
     * @default 0.0
     */
    this.minY = options.minY || 0.0;
    /**
     * The maximum value of water level (i.e. the y axis).
     *
     * @name BoundingBox#maxY
     * @type {Number}
     * @public
     * @default 200.0
     */
    this.maxY = options.maxY || 200.0;
    /**
     * The minimum value of discharge (i.e. the X axis).
     *
     * @name BoundingBox#minX
     * @type {Number}
     * @public
     * @default 0.0
     */
    this.minX = options.minX || 0.0;
    /**
     * The maximum value of discharge (i.e. the X axis).
     *
     * @name BoundingBox#maxX
     * @type {Number}
     * @public
     * @default 0.0
     */
    this.maxX = options.maxX || 10.0;
  }

  /**
   * Clone the bounding box by copying its property values.
   *
   * @public
   * @instance
   * @memberOf BoundingBox
   * @return {BoundingBox} Clone of the original bounding box.
   */
  function clone() {
    return new BoundingBox( this );
  }
  BoundingBox.prototype.clone = clone;

  global.angular.module( 'imomoCaApp' )
    .factory( 'BoundingBox', function () {
      return BoundingBox;
    } );


} )( window );
