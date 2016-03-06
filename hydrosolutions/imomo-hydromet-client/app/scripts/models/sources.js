( function ( global ) {
  'use strict';

  /**
   * Factory function for the Source class.
   *
   * @return {Source#constructor} The constructor for the class
   */
  function SourceFactory() {
    /**
     * Constructor for the Source class. It creates an instance of the source
     * with the given properties.
     *
     * @class Source
     * @classdesc Source model which is equivalent to the Source table in the
     *            backend.
     * @param {Object} options Properties to initialize the model.
     */
    function Source( options ) {
      options = options || {};
      /**
       * The id of the source instance in the backend.
       *
       * @name Source#id
       * @type {Number}
       * @public
       * @default null
       */
      this.id = options.id || null;
      /**
       * The name of the organization represented by the source model.
       *
       * @name Source#organization
       * @type {external:String}
       * @public
       * @default null
       */
      this.organization = options.organization || null;

      /**
       * Textual description of the source.
       *
       * @name Source#sourceDescription
       * @type {external:String}
       * @public
       * @default null
       */
      this.sourceDescription = options.sourceDescription || null;

      /**
       * A URL to the source's website
       *
       * @name Source#sourceLink
       * @type {external:String}
       * @public
       * @default null
       */
      this.sourceLink = options.sourceLink || null;

      /**
       * The source's contact person's name
       *
       * @name Source#contactName
       * @type {external:String}
       * @public
       * @default null
       */
      this.contactName = options.contactName || null;

      /**
       * Phone number
       *
       * @name Source#phone
       * @type {external:String}
       * @public
       * @default null
       */
      this.phone = options.phone || null;

      /**
       * Contact e-mail
       *
       * @name Source#email
       * @type {external:String}
       * @public
       * @default null
       */
      this.email = options.email || null;

      /**
       * City where the organization is located.
       *
       * @name Source#city
       * @type {external:String}
       * @public
       * @default null
       */
      this.city = options.city || null;

      /**
       * Country where the organization is located.
       *
       * @name Source#country
       * @type {external:String}
       * @public
       * @default null
       */
      this.country = options.country || null;

      /**
       * Zip code where the organization is located.
       *
       * @name Source#zipCode
       * @type {external:String}
       * @public
       * @default null
       */
      this.zipCode = options.zipCode || null;

      /**
       * Text for citing the data from this source.
       *
       * @name Source#citation
       * @type {external:String}
       * @public
       * @default null
       */
      this.citation = options.citation || null;

      /**
       * Id of the associated metadata record in the backend
       *
       * @name Source#isoMetadataId
       * @type {Number}
       * @public
       * @default null
       */
      this.isoMetadataId = options.isoMetadataId || null;
    }

    /**
     * Factory function to create a new {@link Source} instance from a
     * JSON resource from the backend.
     *
     * @static
     * @memberOf Source
     * @param  {Object} serverSource A JSON object produced by the backend
     *                               to represent a source instance.
     * @return {Source} The client-side instance corresponding
     *                  to the object sent by the server.
     */
    function fromServerObject( serverSource ) {
      return new Source( serverSource );
    }
    Source.fromServerObject = fromServerObject;

    return Source;
  }

  SourceFactory.$inject = [];

  global.angular.module( 'imomoCaApp' ).factory( 'Source', SourceFactory );
} )( window );
