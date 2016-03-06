( function ( global ) {
  'use strict';

  /**
   * Constructs a new singleton service that is used for shared state between
   * controllers of the discharge control view in the input data page.
   *
   * @class DischargeControlState
   * @classdesc Shared-state service that allows communication between the
   *            main controller for the view of the discharge curve during the
   *            input of a new telegram and the controllers in the sub-views
   *            that provide options to create new models.
   */
  function DischargeControlState() {
    /**
     * The shared selected model that can be used as a starting point by the
     * sub-controllers. The sub-controllers should not modify it, only clone it
     * and create a new one.
     *
     * @name DischargeControlState#sharedSelectedModel
     * @type {DischargeModel}
     * @public
     * @default null
     */
    this.sharedSelectedModel = null;
    /**
     * @callback DischargeControlState~newModelCallback
     * @param {DischargeModel} newModel The newly created model.
     */
    /**
     * The function that will be called when a new discharge model is created
     * by the active adjustment controller.
     *
     * @name DischargeControlState#onNewModel
     * @type {DischargeControlState~newModelCallback}
     * @public
     * @default null
     */
    this.onNewModel = null;
    /**
     * The shared array of selected discharge points from the discharge
     * display.
     *
     * @name DischargeControlState#sharedSelectedDischargeData
     * @type {Array.<DischargeMeasurementPair>}
     * @public
     */
    this.sharedSelectedDischargeData = [];
    /**
     * Keep the array of artificial points in the service in case the
     * controller is re-instantiated.
     *
     * @name DischargeControlState#fakeDischargePairs
     * @type {Array.<FakeDischargePair>}
     * @public
     */
    this.fakeDischargePairs = [];
    /**
     * @callback DischargeControlState~newDischargePairCallback
     * @param {FakeDischargePair} dischargePair The created discharge pair.
     */
    /**
     * The callback that will be called when a new artificial discharge point
     * is created by the active adjustment controller.
     *
     * @name DischargeControlState#onNewDischargePair
     * @type {DischargeControlState~newDischargePairCallback}
     * @public
     * @default null
     */
    this.onNewDischargePair = null;
    /**
     * @callback DischargeControlState~deleteDischargePairCallback
     * @param {FakeDischargePair} dischargePair The deleted discharge pair.
     * @param {Number} index The index of the discharge pair to delete
     *                       according to the current ordering of creation.
     */
    /**
     * The callback that will be called when an existing artificial discharge
     * point is deleted by the active adjustment controller.
     *
     * @name DischargeControlState#onDeletedDischargePair
     * @type {DischargeControlState~deletedDischargePairCallback}
     * @public
     * @default null
     */
    this.onDeletedDischargePair = null;
  }

  /**
   * Passes a new model to the registered callback.
   *
   * @public
   * @instance
   * @memberOf DischargeControlState
   * @param {DischargeModel} newModel The newly created model.
   */
  DischargeControlState.prototype.createNewModel = function ( newModel ) {
    if ( this.onNewModel ) {
      this.onNewModel( newModel );
    }
  };

  /**
   * Passes a new discharge pair to the registered callback.
   *
   * @public
   * @instance
   * @memberOf DischargeControlState
   * @param {FakeDischargePair} newDischargePair The newly created pair.
   */
  DischargeControlState.prototype.createDischargePair =
    function ( newDischargePair ) {
      if ( this.onNewDischargePair ) {
        this.onNewDischargePair( newDischargePair );
      }
    };

  /**
   * Passes the deletion of a fake discharge pair to the registered callback.
   *
   * @public
   * @instance
   * @memberOf DischargeControlState
   * @param {FakeDischargePair} dischargePair The deleted discharge pair.
   * @param {Number} index The index of the discharge pair in the current
   *                       ordering according to creation.
   */
  DischargeControlState.prototype.deleteDischargePair =
    function ( dischargePair, index ) {
      if ( this.onDeletedDischargePair ) {
        this.onDeletedDischargePair( dischargePair, index );
      }
    };

  /**
   * Injectable dependencies for the service.
   *
   * @protected
   * @static
   * @memberOf DischargeControlState
   * @type {Array.<external:String>}
   */
  DischargeControlState.$inject = [];

  global.angular.module( 'imomoCaApp' )
    .service( 'DischargeControlState', DischargeControlState );

} )( window );
