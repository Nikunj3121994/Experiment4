( function ( global ) {
  'use strict';

  /**
   * Initializes a storage service that acts as shared state between
   * controllers in a single page.
   *
   * @class DataInputStorage
   * @classdesc A shared state service for the telegram input view.
   */
  function DataInputStorage() {
    /**
     * The decoded input data.
     *
     * @name DataInputStorage#dailyInputData
     * @type {DailyOperationalData}
     * @public
     * @default null
     */
    this.dailyInputData = null;
    /**
     * The discharge model used for the calculation.
     *
     * @name DataInputStorage#dischargeModel
     * @type {DischargeModel}
     * @public
     * @default null
     */
    this.dischargeModel = null;
  }

  /**
   * Injectable dependencies for the service.
   *
   * @protected
   * @static
   * @memberOf DataInputStorage
   * @type {Array.<external:String>}
   */
  DataInputStorage.$inject = [];

  global.angular.module( 'imomoCaApp' )
    .service( 'DataInputStorage', DataInputStorage );
} )( window );
