( function ( global ) {
  'use strict';

  /**
   * Factory function for the Site class.
   *
   * @return {Site#constructor} The constructor for the class.
   */
  function SiteFactory() {

    /**
     * Constructor for the Site class. It creates an instance of a site with
     * the given properties.
     *
     * @class Site
     * @classdesc Site model which is equivalent to the site table in the
     *            backend.
     * @param {Object} options Properties to initialize the model.
     */
    function Site( options ) {
      options = options || {};
      /**
       * The id of the site instance in the backend.
       *
       * @name Site#id
       * @type {Number}
       * @public
       * @default null
       */
      this.id = options.id || null;
      /**
       * The code for the local authorities.
       *
       * @name Site#siteCode
       * @type {external:String}
       * @public
       */
      this.siteCode = options.siteCode || '';
      /**
       * A user-friendly name.
       *
       * @name Site#siteName
       * @type {external:String}
       * @public
       */
      this.siteName = options.siteName || '';
      /**
       * The owner data source.
       *
       * @name Site#sourceId
       * @type {Number}
       * @public
       * @default null
       */
      this.sourceId = options.sourceId || null;
      /**
       * The latitude.
       *
       * @name Site#latitude
       * @type {Number}
       * @public
       * @default 0.0
       */
      this.latitude = options.latitude || 0.0;
      /**
       * The longitude.
       *
       * @name Site#longitude
       * @type {Number}
       * @public
       * @default 0.0
       */
      this.longitude = options.longitude || 0.0;
      /**
       * The spatial reference system used for the lat/long.
       *
       * @name Site#latLongDatumId
       * @type {Number}
       * @public
       * @default null
       */
      this.latLongDatumId = options.latLongDatumId || null;
      /**
       * The elevation in meters.
       *
       * @name Site#elevationM
       * @type {Number}
       * @public
       * @default 0.0
       */
      this.elevationM = options.elevationM || 0.0;
      /**
       * The vertical reference for the elevation.
       *
       * @name Site#verticalDatumId
       * @type {Number}
       * @public
       * @default null
       */
      this.verticalDatumId = options.verticalDatumId || null;
      /**
       * The X coordinate in the system used by local authorities.
       *
       * @name Site#localX
       * @type {Number}
       * @public
       * @default null
       */
      this.localX = options.localX || null;
      /**
       * The Y coordinate in the system used by the local authorities.
       *
       * @name Site#localY
       * @type {Number}
       * @public
       * @default null
       */
      this.localY = options.localY || null;
      /**
       * The spatial reference system for the local coordinates.
       *
       * @name Site#localProjectionId
       * @type {Number}
       * @public
       * @default null
       */
      this.localProjectionId = options.localProjectionId || null;
      /**
       * The accuracy of the recorded location, in meters.
       *
       * @name Site#posAccuracyM
       * @type {Number}
       * @public
       * @default null
       */
      this.posAccuracyM = options.posAccuracyM || null;
      /**
       * The country where the site is located.
       *
       * @name Site#country
       * @type {external:String}
       * @public
       */
      this.country = options.country || '';
      /**
       * The basin where the site is located.
       *
       * @name Site#basin
       * @type {external:String}
       * @public
       */
      this.basin = options.basin || '';
      /**
       * The local region.
       *
       * @name Site#region
       * @type {external:String}
       * @public
       */
      this.region = options.region || '';
      /**
       * Additional comments about the site.
       *
       * @name Site#comments
       * @type {external:String}
       * @public
       * @default null
       */
      this.comments = options.comments || null;
      /**
       * The data value of the maximum safe discharge for the site.
       *
       * This property is not part of the server site model and must retrieved
       * separately from the server.
       *
       * @name Site#safeDischarge
       * @type {Number}
       * @public
       * @default null
       */
      this.safeDischarge = options.safeDischarge || null;
    }

    /**
     * Serialization method for the model.
     *
     * @public
     * @instance
     * @memberOf Site
     * @return {Object} JSON object representing the site instance.
     */
    function toServerObject() {
      return {
        siteCode: this.siteCode,
        siteName: this.siteName,
        latitude: this.latitude,
        longitude: this.longitude,
        country: this.country,
        basin: this.basin,
        region: this.region,
        comments: this.comments,
        safeDischarge: this.safeDischarge
      };
    }
    Site.prototype.toServerObject = toServerObject;

    /**
     * Alias for {@link Site#toServerObject|toServerObject}.
     *
     * @public
     * @instance
     * @method toJsonizable
     * @memberOf Site
     */
    Site.prototype.toJsonizable = toServerObject;

    /**
     * Produces a standard string representation of a Site instance.
     *
     * It overrides the toString method in Object.
     *
     * @public
     * @instance
     * @memberOf Site
     * @return {external:String} String representation of the site.
     */
    function toString() {
      return sprintf( '%s - %s (%s, %s)', this.siteCode, this.siteName, this.basin, this.country );
    }
    Site.prototype.toString = toString;

    /**
     * Clones the site object, it creates a new instance of the same with
     * the same properties and copies of their values.
     *
     * @public
     * @instance
     * @memberOf Site
     * @return {Site} A clone of the site.
     */
    function clone() {
      return new Site( this );
    }
    Site.prototype.clone = clone;

    /**
     * Determines the differences between the current site and another Site
     * instance and returns the list of properties where a difference exist.
     *
     * @public
     * @instance
     * @memberOf Site
     * @param {Site} otherSite The other site to compare.
     * @return {Array.<external.String>} The list of properties with
     *                                   differences.
     */
    function diff( otherSite ) {
      var differences = [];
      for ( var prop in this ) {
        if ( !global.angular.equals( this[ prop ], otherSite[ prop ] ) ) {
          differences.push( prop );
        }
      }
      return differences;
    }
    Site.prototype.diff = diff;

    /**
     * Factory function to create a new {@link Site} object instance from a
     * JSON resource from the backend.
     *
     * @static
     * @memberOf Site
     * @param  {Object} serverSite A JSON object produced by the backend to
     *                             represent a user instance.
     * @return {Site} The client-side instance corresponding to the object
     *                sent by the server.
     */
    function fromServerObject( serverSite ) {
      return new Site( serverSite );
    }
    Site.fromServerObject = fromServerObject;
    Site.fromJson = fromServerObject;

    return Site;
  }

  global.angular.module( 'imomoCaApp' ).factory( 'Site', SiteFactory );

} )( window );
