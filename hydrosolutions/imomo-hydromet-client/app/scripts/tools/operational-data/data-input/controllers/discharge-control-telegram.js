( function ( global ) {
  'use strict';
  /**
   * Adjustment option for discharge models.
   *
   * @typedef DischargeTelegramCtrl~AdjustmentOption
   * @type {Object}
   * @property {external:String} label The localized label that identifies
   *                                   the option.
   * @property {external:String} description The localized description for the
   *                                         option.
   * @property {external:String} optionsForm
   *           URL to the partial view that includes a form with
   *           specific options for the model adjustment.
   */

  /**
   * Initializes a controller for the discharge view in the telegram input
   * page.
   *
   * @class DischargeTelegramCtrl
   * @classdesc Controller class for the discharge view displayed when entering
   *            new operational data into the system.
   * @param {Array.<DischargeModel>} dischargeModels
   *        Discharge to display in the view.
   * @param {Array.<DischargeMeasurementPair>} dischargeData
   *        Pairs of discharge and water level measurements to be displayed
   *        in the discharge graph.
   * @param {Function} FakeDischargePair
   *        Constructor for the {@link FakeDischargePair} class.
   * @param {DataInputStorage} DataInputStorage Injected shared state service.
   * @param {Localization} Localization Injected Localization service.
   * @param {Object} $state State service from ui-router
   * @param {DischargeCurveFitting} DischargeCurveFitting
   *        Singleton instance of the DischargeCurveFitting service.
   * @param {DischargeControLState} DischargeControlState
   *        Injected shared-state service used to communicate with the
   *        sub-controllers in the view.
   */
  function DischargeTelegramCtrl( dischargeModels, dischargeData,
    FakeDischargePair, DataInputStorage, Localization, $state,
    DischargeCurveFitting, DischargeControlState ) {
    /**
     * State service from ui-router
     *
     * @name DischargeTelegramCtrl#_state
     * @type {Object}
     * @protected
     */
    this._state = $state;
    /**
     * Localization method for strings.
     *
     * @name DischargeTelegramCtrl#localize
     * @type {Function}
     * @public
     */
    this.localize = Localization.localize.bind( Localization );
    /**
     * Internal reference to the shared-state service.
     *
     * @name DischargeTelegramCtrl#dischargeControlState
     * @type {DischargeControlState}
     * @protected
     */
    this.dischargeControlState = DischargeControlState;
    this.dischargeControlState.onNewModel = this.onNewModel.bind( this );
    this.dischargeControlState.onNewDischargePair =
      this.onNewDischargePair.bind( this );
    this.dischargeControlState.onDeletedDischargePair =
      this.onDeletedDischargePair.bind( this );
    /**
     * Array of discharge models to be displayed.
     *
     * @name DischargeTelegramCtrl#dischargeModels
     * @type {Array.<DischargeModel>}
     * @public
     */
    this.dischargeModels = dischargeModels;
    this.dischargeControlState.sharedSelectedModel =
      this.dischargeModels.slice( -1 )[ 0 ];

    /**
     * Array of discharge points to be displayed. These are built from the
     * discharge data passed as input.
     *
     * @name DischargeTelegramCtrl#dischargeData
     * @type {Array.<DischargeMeasurementPair>}
     * @public
     */
    this.dischargeData = dischargeData;
    if ( DataInputStorage.dailyInputData.isDischargeAvailable() ) {
      var newPoint = new FakeDischargePair( {
        dischargeValue: DataInputStorage.dailyInputData.discharge,
        waterLevelValue: DataInputStorage.dailyInputData.dischargeWaterLevel,
        labelDate: DataInputStorage.dailyInputData.dischargeDate,
        measured: true
      } );
      this.dischargeData.push( newPoint );
    }
    /**
     * Freezes the number of real measured discharge points.
     *
     * @name DischargeTelegramCtrl#dischargeDataCount
     * @type {Number}
     * @public
     */
    this.dischargeDataCount = this.dischargeData.length;

    /**
     * Storage service singleton that holds data that is shared across
     * controllers and states.
     *
     * @name DischargeTelegramCtrl#dataInputStorage_
     * @type {DataInputStorage}
     * @public
     */
    this.dataInputStorage_ = DataInputStorage;

    /**
     * Discharge curve fitting service singleton that provides an API for
     * creating and manipulating discharge models.
     *
     * @name DischargeTelegramCtrl#_dischargeCurveFitting
     * @type {DischargeCurveFitting}
     * @public
     */
    this._dischargeCurveFitting = DischargeCurveFitting;

    /**
     * Indicates whether it is allowed to modify the current discharge model.
     *
     * @name DischargeTelegramCtrl#modelOptionsEnabled
     * @type {Boolean}
     * @public
     */
    this.modelOptionsEnabled = DataInputStorage.dailyInputData
      .isDischargeAvailable();
    /**
     * The currently selected option from the options panel.
     *
     * @name DischargeTelegramCtrl#selectedOption
     * @type {AdjustmentOption}
     * @public
     * @default null
     */
    this.selectedOption = null;
    /**
     * The set of selected discharge points from the graph.
     *
     * @name DischargeTelegramCtrl#selectedPoints
     * @type {Array.<DischargeMeasurementPair>}
     * @public
     */
    this.selectedPoints = DischargeControlState.sharedSelectedDischargeData;
    /**
     * Indicates that the user has finished processing the discharge control
     * and moved to the next section.
     *
     * @name DischargeTelegramCtrl#sectionDisabled
     * @type {Boolean}
     * @public
     * @default false
     */
    this.sectionDisabled = false;

    if ( this.modelOptionsEnabled ) {
      /**
       * Options available for the adjustment of the current discharge model.
       *
       * @name DischargeTelegramCtrl#adjustmentOptions
       * @type {Array.<DischargeTelegramCtrl~AdjustmentOption>}
       * @public
       */
      this.adjustmentOptions = this.generateModelOptions();
    } else {
      this.proceedWithModel();
    }
  }

  /**
   * Injectable dependencies for the controller.
   *
   * @protected
   * @static
   * @memberOf DischargeTelegramCtrl
   * @type {Array.<external:String>}
   */
  DischargeTelegramCtrl.$inject = [ 'dischargeModels', 'dischargeData',
    'FakeDischargePair', 'DataInputStorage', 'Localization', '$state',
    'DischargeCurveFitting', 'DischargeControlState'
  ];

  /**
   * Generate the array of available model adjustment options compatible
   * with the controller.
   *
   * @protected
   * @instance
   * @memberOf DischargeTelegramCtrl
   * @return {DischargeTelegramCtrl~AdjustmentOption} The set of model
   *                                                  adjustment options.
   */
  function generateModelOptions() {
    var basePath = 'tools.operationalData.dischargeControl.adjustment',
      baseNames = [ 'adjustDeltaH', 'fitModel' ],
      viewNames = [ 'adjust-delta-h', 'fit-model' ],
      options = baseNames.map( function ( baseName, idx ) {
        return {
          label: this.localize( basePath + '.' + baseName + '.label' ),
          description: this.localize( basePath + '.' + baseName +
            '.description' ),
          optionsForm: 'views/tools/operational-data/data-input/' +
            viewNames[ idx ] + '.html',
        };
      }, this );
    return options;
  }
  DischargeTelegramCtrl.prototype.generateModelOptions = generateModelOptions;

  /**
   * Processes a new model created by the controller in the active sub-view.
   * The new model is added to the list of available discharge models.
   *
   * @public
   * @instance
   * @memberOf DischargeTelegramCtrl
   * @param {DischargeModel} newModel The newly create model.
   */
  function onNewModel( newModel ) {
    this.dischargeModels.push( newModel );
  }
  DischargeTelegramCtrl.prototype.onNewModel = onNewModel;

  /**
   * Processes a new fake discharge point created by the controller in the
   * active sub-view. The new discharge point is added to the list of discharge
   * data.
   *
   * @public
   * @instance
   * @memberOf DischargeTelegramCtrl
   * @param {FakeDischargePair} dischargePair The newly created discharge pair.
   */
  function onNewDischargePair( dischargePair ) {
    this.dischargeData.push( dischargePair );
  }
  DischargeTelegramCtrl.prototype.onNewDischargePair =
    onNewDischargePair;

  /**
   * Processes the deletion of a fake discharge point from the list.
   *
   * @public
   * @instance
   * @memberOf DischargeTelegramCtrl
   * @param {FakeDischargePair} dischargePair The deleted discharge pair.
   * @param {Number} index The index of the discharge pair according to the
   *                       current ordering by creation time.
   */
  function onDeletedDischargePair( dischargePair, index ) {
    this.dischargeData.splice( index + this.dischargeDataCount, 1 );
  }
  DischargeTelegramCtrl.prototype.onDeletedDischargePair =
    onDeletedDischargePair;

  /**
   * Handles the selection of a discharge pair by adding to the list of
   * selected discharge pairs.
   *
   * @public
   * @instance
   * @memberOf DischargeTelegramCtrl
   * @param {DischargeMeasurementPair} dischargePair The selected discharge
   *                                                 pair.
   */
  function selectDischargePair( dischargePair ) {
    this.dischargeControlState.sharedSelectedDischargeData.push( dischargePair );
  }
  DischargeTelegramCtrl.prototype.selectDischargePair = selectDischargePair;

  /**
   * Handles the de-selection of a discharge pair.
   *
   * @public
   * @instance
   * @memberOf DischargeTelegramCtrl
   * @param {DischargeMeasurementPair} dischargePair The de-selected discharge
   *                                                 pair.
   */
  function deselectDischargePair( dischargePair ) {
    this.dischargeControlState.sharedSelectedDischargeData.splice(
      this.dischargeControlState.sharedSelectedDischargeData
      .indexOf( dischargePair ), 1 );
  }
  DischargeTelegramCtrl.prototype.deselectDischargePair =
    deselectDischargePair;

  /**
   * Indicates if it is possible to proceed to the next state with the
   * current model.
   *
   * @public
   * @instance
   * @memberOf DischargeTelegramCtrl
   * @return {Boolean} true if there is no model available to proceed, false
   *                   otherwise.
   */
  function isInputDisabled() {
    return this.sectionDisabled || !this.dischargeControlState.sharedSelectedModel;
  }
  DischargeTelegramCtrl.prototype.isInputDisabled = isInputDisabled;

  /**
   * Handler for the button that allows the user to indicate that the model
   * adjustment is finished and the that the discharge can be calculated.
   *
   * @public
   * @memberOf DischargeTelegramCtrl
   * @param {angular.event} $event Triggering click event.
   */
  DischargeTelegramCtrl.prototype.proceedWithModel = function ( $event ) {
    if ( $event ) {
      $event.preventDefault();
    }
    var selectedModel = this.dischargeControlState.sharedSelectedModel;
    var submittableModel = selectedModel;
    if ( selectedModel.id !== null ) {
      var index = this.dischargeModels.indexOf( selectedModel );
      if ( index < this.dischargeModels.length - 1 ) {
        if ( this.dischargeModels[ index + 1 ].id !== null ) {
          submittableModel = selectedModel.clone();
          submittableModel.modelName = selectedModel.modelName;
        }
      }
    }
    this.dataInputStorage_.dischargeModel = submittableModel;
    this._state.go( '.dischargeCalculated' ).then(
      function () {
        this.sectionDisabled = true;
      }.bind( this ) );
  };

  global.angular.module( 'imomoCaApp' )
    .controller( 'DischargeTelegramCtrl', DischargeTelegramCtrl );

} )( window );


( function ( global ) {
  'use strict';

  /**
   * Creates a new controller for adjusting the delta H in a discharge model.
   *
   * @class AdjustDeltaHCtrl
   * @classdesc Controller for the partial view that allows the modification
   *            of the delta-H parameter in a selected discharge model.
   *            This controller communicates new discharge models to its parent
   *            by broadcasting it through a shared state service.
   * @param {DischargeControlState} DischargeControlState Injected shared-state
   *                                                      service.
   * @param {DischargeCurveFitting} DischargeCurveFitting Injected service for
   *                                                      fitting discharge
   *                                                      models.
   */
  function AdjustDeltaHCtrl( DischargeControlState, DischargeCurveFitting ) {
    /**
     * Proposed delta-H value from the user.
     *
     * @name AdjustDeltaHCtrl#deltaH
     * @type {Number}
     * @public
     * @default null
     */
    this.deltaH = null;
    /**
     * Label for the new model.
     *
     * @name AdjustDeltaHCtrl#modelName
     * @type {external:String}
     * @public
     * @default null
     */
    this.modelName = null;
    /**
     * Internal reference to the shared state service.
     *
     * @name AdjustDeltaHCtrl#dischargeControlState
     * @type {DischargeControlState}
     * @protected
     */
    this.dischargeControlState = DischargeControlState;
    /**
     * Internal reference to the fitting service.
     *
     * @name AdjustDeltaHCtrl#fitter
     * @type {DischargeCurveFitting}
     * @protected
     */
    this.fitter = DischargeCurveFitting;
  }

  /**
   * Creates a new model with the given delta-H adjustment value and model
   * name.
   *
   * @public
   * @instance
   * @memberOf AdjustDeltaHCtrl
   * @param {Object} $event The triggering click event.
   */
  AdjustDeltaHCtrl.prototype.createNewModel = function ( $event ) {
    $event.preventDefault();
    var newModel = this.fitter.adjustDeltaH( this.dischargeControlState.sharedSelectedModel, this.deltaH );
    newModel.modelName = this.modelName;
    this.dischargeControlState.createNewModel( newModel );
    this.modelName = null;
    this.deltaH = null;
  };

  /**
   * Indicates the view whether the input is disabled or not.
   *
   * @public
   * @instance
   * @memberOf AdjustDeltaHCtrl
   * @return {Boolean} true if the input should be disabled, false otherwise.
   */
  AdjustDeltaHCtrl.prototype.isInputDisabled = function () {
    return this.dischargeControlState.sharedSelectedModel === null;
  };

  /**
   * Injectable dependencies for the controller.
   *
   * @protected
   * @static
   * @memberOf AdjustDeltaHCtrl
   * @type {Array.<external:String>}
   */
  AdjustDeltaHCtrl.$inject = [ 'DischargeControlState',
    'DischargeCurveFitting'
  ];

  global.angular.module( 'imomoCaApp' )
    .controller( 'AdjustDeltaHCtrl', AdjustDeltaHCtrl );

} )( window );

( function ( global ) {
  'use strict';
  /**
   * Creates a new controller for fitting a model given a set of discharge/
   * water-level data points.
   *
   * @class FitModelCtrl
   * @classdesc Controller for the partial view that allows the creation of a
   *            new model based on several data points.
   * @param {DischargeControlState} DischargeControlState Injected shared-state
   *        service for the discharge control view.
   * @param {Function} FakeDischargePair Constructor for the
   *                                     {@link FakeDischargePair} class.
   * @param {DischargeCurveFitting} DischargeCurveFitting Injected service
   *                                for fitting discharge models.
   */
  function FitModelCtrl( DischargeControlState, FakeDischargePair,
    DischargeCurveFitting ) {
    /**
     * Internal reference to the shared state service.
     *
     * @name FitModelCtrl#dischargeControlState
     * @type {DischargeControlState}
     * @public
     */
    this.dischargeControlState = DischargeControlState;
    /**
     * Internal reference to the {@link FakeDischargePair} constructor.
     *
     * @name FitModelCtrl#fakeDischargePairFactory
     * @type {DischargeControlState}
     * @protected
     */
    this.fakeDischargePairFactory = FakeDischargePair;
    /**
     * Internal reference to the fitting service.
     *
     * @name FitModelCtrl#fitter
     * @type {DischargeCurveFitting}
     * @protected
     */
    this.fitter = DischargeCurveFitting;
    /**
     * Array of fake discharge pairs created by the user.
     *
     * @name FitModelCtrl#fakeDischargePairs
     * @type {Array.<FakeDischargePair>}
     * @public
     */
    this.fakeDischargePairs = this.dischargeControlState.fakeDischargePairs;
    /**
     * The editable fake discharge pair in the view.
     *
     * @name FitModelCtrl#newDischargePair
     * @type {FakeDischargePair}
     * @public
     */
    this.newDischargePair = new this.fakeDischargePairFactory();
    /**
     * The editable model name.
     *
     * @name FitModelCtrl#modelName
     * @type {external:String}
     * @public
     * @default null
     */
    this.modelName = null;
  }

  /**
   * Adds the current fake discharge pair to the list of points and notifies
   * the parent controller to add it to the graph.
   *
   * @public
   * @instance
   * @memberOf FitModelCtrl
   * @param {Object} $event The click event that triggered the action.
   */
  FitModelCtrl.prototype.addFakePoint = function ( $event ) {
    $event.preventDefault();
    this.fakeDischargePairs.push( this.newDischargePair );
    this.dischargeControlState.createDischargePair( this.newDischargePair );
    this.newDischargePair = new this.fakeDischargePairFactory();
  };

  /**
   * Deletes a fake discharge pair from the list and notifies the parent
   * controller to remove it from the graph.
   *
   * @public
   * @instance
   * @memberOf FitModelCtrl
   * @param  {Object} $event The triggering click event.
   * @param  {Number} $index The index of the discharge pair in the list.
   */
  FitModelCtrl.prototype.deleteFakePoint = function ( $event, $index ) {
    $event.preventDefault();
    var deletedPair = this.fakeDischargePairs.splice( $index, 1 )[ 0 ];
    this.dischargeControlState.deleteDischargePair( deletedPair, $index );
  };

  /**
   * Indicates if the button to fit a new model should be disabled.
   *
   * The button is disabled if the available data points is less than 3.
   *
   * @public
   * @instance
   * @memberOf FitModelCtrl
   * @return {Boolean} true if the button to fit a new model should be
   *                   disabled, false otherwise.
   */
  FitModelCtrl.prototype.isInputDisabled = function () {
    return ( this.fakeDischargePairs.length + this.dischargeControlState.sharedSelectedDischargeData.length ) < 3;
  };

  /**
   * Creates a new model by fitting a quadratic model to the selected and
   * created data.
   *
   * The new model is passed through the shared service to the parent
   * controller.
   *
   * @public
   * @instance
   * @memberOf FitModelCtrl
   * @param {Object} $event The triggering click event.
   */
  FitModelCtrl.prototype.createNewModel = function ( $event ) {
    $event.preventDefault();
    var dischargeData = this.dischargeControlState
      .sharedSelectedDischargeData.concat( this.fakeDischargePairs );
    var newModel = this.fitter.fitCurveFromDataFixedExp( dischargeData );
    newModel.modelName = this.modelName;
    this.dischargeControlState.createNewModel( newModel );
  };

  /**
   * Injectable dependencies for the controller.
   *
   * @static
   * @protected
   * @memberOf FiteModelCtrl
   * @type {Array.<external:String>}
   */
  FitModelCtrl.$inject = [ 'DischargeControlState', 'FakeDischargePair',
    'DischargeCurveFitting'
  ];

  global.angular.module( 'imomoCaApp' )
    .controller( 'FitModelCtrl', FitModelCtrl );

} )( window );
