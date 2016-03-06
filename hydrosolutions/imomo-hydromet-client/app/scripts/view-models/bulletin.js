( function ( global ) {
  'use strict';

  /**
   * Factory function for the {@link Bulletin} class.
   *
   * @return {Function} Constructor for the {@link Bulletin} class.
   */
  function BulletinFactory() {
    /**
     * Constructor that initializes the bulletin with the given properties.
     *
     * @class Bulletin
     * @classdesc A data structure containing the link to a bulletin file.
     * @param {Object} options
     */
    function Bulletin( options ) {
      /**
       * The URL to the bulletin file.
       *
       * @name Bulletin#bulletinUrl
       * @type {external:String}
       * @public
       * @default null
       */
      this.bulletinUrl = options.bulletinUrl || null;
    }

    /**
     * Factory function to create a bulletin instance from a serialized
     * JSON version.
     *
     * @public
     * @static
     * @memberOf Bulletin
     * @param {Object} serverBulletin
     * @return {Bulletin}
     */
    Bulletin.fromServerObject = function( serverBulletin ){
      return new Bulletin( serverBulletin );
    };

    return Bulletin;
  }

  global.angular.module( 'imomoCaApp' )
    .factory( 'Bulletin', BulletinFactory );
} )( window );