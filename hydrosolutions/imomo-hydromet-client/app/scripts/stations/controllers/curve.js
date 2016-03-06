( function ( global ) {
  'use strict';

  /**
   * Constructor for the controller for viewing and editing the discharge
   * rating curve of a site.
   *
   * @class SiteCurveCtrl
   * @classdesc The controller for the view where the user can see and edit
   *            the current discharge curve for a site, if no discharge curve
   *            is present then the user can create one from artificial data
   *            points using the standard fitting tools.
   * @param {DischargeCurveFitting} DischargeCurveFitting The service
   *                                for fitting discharge curves to discharge
   *                                pairs.
   * @param {Localization} Localization The localization service.
   * @param {Array.<Site>} siteInfo The selected site, wrapped in a single-item
   *                                array.
   * @param {DischargeModels} DischargeModels The injected DischargeModels API.
   * @param {Object} $state The injected ui-router $state service.
   * @param {Array.<DischargeModel>} dischargeModels The discharge models
   *                                                 retrieved for the site.
   * @param {Function} FakeDischargePair Injected constructor for the
   *        {@link FakeDischargePair} class.
   */
  function SiteCurveCtrl( DischargeCurveFitting, Localization, siteInfo,
    DischargeModels, $state, dischargeModels, FakeDischargePair ) {
    /**
     * Internal reference to the {@link DischargeCurveFitting|fitting} service.
     *
     * @name SiteCurveCtrl#fitter
     * @type {DischargeCurveFitting}
     * @protected
     */
    this.fitter = DischargeCurveFitting;
    /**
     * Internal reference to the {@link Localization|localization} service.
     *
     * @name SiteCurveCtrl#localization
     * @type {Localization}
     * @protected
     */
    this.localization = Localization;
    /**
     * Internal reference to the selected site.
     *
     * @name SiteCurveCtrl#selectedSite
     * @type {Site}
     * @protected
     */
    this.selectedSite = siteInfo[ 0 ];
    /**
     * Internal reference to the discharge models API.
     *
     * @name SiteCurveCtrl#dischargeModelsApi
     * @type {DischargeModels}
     * @protected
     */
    this.dischargeModelsApi = DischargeModels;
    /**
     * Internal reference to the $state service.
     *
     * @name SiteCurveCtrl#stateService
     * @type {Object}
     * @protected
     */
    this.stateService = $state;
    /**
     * Internal reference to {@link FakeDischargePair} constructor.
     *
     * @name SiteCurveCtrl#fakeDischargePairFactory
     * @type {Function}
     * @protected
     */
    this.fakeDischargePairFactory = FakeDischargePair;
    /**
     * Object to hold the input values from the user when adding a new
     * discharge-water level pair to the rating curve display.
     *
     * @name SiteCurveCtrl#newDischargePair
     * @type {FakeDischargePair}
     * @public
     */
    this.newDischargePair = new this.fakeDischargePairFactory();
    /**
     * Array of fake discharge points entered by the user in this session.
     *
     * @name SiteCurveCtrl#fakeDischargePairs
     * @type {Array.<SiteCurveCtrl~FakeDischargePair>}
     * @public
     * @default Empty array.
     */
    this.fakeDischargePairs = [];
    /**
     * Array of discharge models for the site in this session.
     *
     * This is initialized with the discharge models stored for the site
     * in the backend, but it is then populated with any discharge models
     * created by the user during this session.
     *
     * @name SiteCurveCtrl#sessionDischargeModels
     * @type {Array.<DischargeModel>}
     * @public
     * @default Empty array.
     */
    this.sessionDischargeModels = dischargeModels;
    /**
     * The discharge model currently selected by the user.
     *
     * @name SiteCurveCtrl#selectedDischargeModel
     * @type {DischargeModel}
     * @public
     * @default null
     */
    this.selectedDischargeModel = null;
    /**
     * An error when creating a new discharge model in the server.
     *
     * @name SiteCurveCtrl#createDischargeModelError
     * @type {ServerError}
     * @public
     * @default null
     */
    this.createDischargeModelError = null;
  }

  /**
   * Adds a fake point to the list of discharge data passed to the discharge
   * curve display.
   *
   * @public
   * @instance
   * @memberOf SiteCurveCtrl
   * @param {Object} $event The click event that triggered the action.
   */
  function addFakePoint( $event ) {
    $event.preventDefault();
    this.fakeDischargePairs.push( this.newDischargePair );
    this.newDischargePair = new this.fakeDischargePairFactory();
  }
  SiteCurveCtrl.prototype.addFakePoint = addFakePoint;

  /**
   * Removes a fake point from the list of discharge data passed to the
   * discharge curve display.
   *
   * @public
   * @instance
   * @memberOf SiteCurveCtrl
   * @param {Object} $event The click event that triggered the action.
   * @param {Number} $index The index of the discharge point to delete.
   */
  function deleteFakePoint( $event, $index ) {
    $event.preventDefault();
    this.fakeDischargePairs.splice( $index, 1 );
  }
  SiteCurveCtrl.prototype.deleteFakePoint = deleteFakePoint;

  /**
   * Creates a new model and attaches it to the end of the list of discharge
   * models. This does not remove previous discharge models created by
   * the user.
   *
   * @public
   * @instance
   * @memberOf SiteCurveCtrl
   * @param {Object} $even The click event that triggered the action.
   */
  function createNewModel( $event ) {
    $event.preventDefault();
    var newModel = this.fitter
      .fitCurveFromDataFixedExp( this.fakeDischargePairs );
    newModel.modelName = this.localization
      .localize( 'stations.selected.curve.newCurve.newModelName' );
    newModel.siteId = this.selectedSite.id;
    this.sessionDischargeModels.push( newModel );
  }
  SiteCurveCtrl.prototype.createNewModel = createNewModel;

  /**
   * Indicates whether it is possible to create a new model with the currently
   * selected points and artificial points created.
   *
   * @public
   * @instance
   * @memberOf SiteCurveCtrl
   * @return {Boolean} true if there are enough data points, false otherwise.
   */
  function enoughDataPoints() {
    return this.fakeDischargePairs.length > 2;
  }
  SiteCurveCtrl.prototype.enoughDataPoints = enoughDataPoints;

  /**
   * Indicates whether it is possible to submit the currently selected model.
   *
   * The condition is that the model is not coming from the server but instead
   * it was created on the client side. Also, there mustn't be an active error
   * alert
   *
   * @public
   * @instance
   * @memberOf SiteCurveCtrl
   * @return {Boolean} true if the site can be submitted to the server.
   */
  function isModelSubmittable() {
    return this.selectedDischargeModel &&
      this.selectedDischargeModel.id === null &&
      !this.createDischargeModelError;
  }
  SiteCurveCtrl.prototype.isModelSubmittable = isModelSubmittable;

  /**
   * Submit a new discharge model for a site.
   *
   * @public
   * @instance
   * @memberOf SiteCurveCtrl
   * @param {angular.event} $event The click event that triggered the action.
   */
  function submitNewModel( $event ) {
    $event.preventDefault();
    this.dischargeModelsApi
      .submitDischargeModel( this.selectedDischargeModel )
      .then( this.onDischargeModelCreated.bind( this ) )
      .catch( this.onDischargeModelError.bind( this ) );
  }
  SiteCurveCtrl.prototype.submitNewModel = submitNewModel;

  /**
   * Handle the successful creation of the discharge model.
   *
   * This reloads the state to display the newly created discharge model.
   *
   * @protected
   * @instance
   * @memberOf SiteCurveCtrl
   */
  function onDischargeModelCreated() {
    this.stateService.reload();
  }
  SiteCurveCtrl.prototype.onDischargeModelCreated = onDischargeModelCreated;

  /**
   * Handle any error that occurs while creating a new discharge model.
   *
   * @protected
   * @instance
   * @memberOf SiteCurveCtrl
   * @param {ServerError} err The error object with the details of what
   *                          happened.
   */
  function onDischargeModelError( err ) {
    this.createDischargeModelError = err;
  }
  SiteCurveCtrl.prototype.onDischargeModelError = onDischargeModelError;

  /**
   * Close the error alert by removing the reference to the last error object.
   *
   * @public
   * @instance
   * @memberOf SiteCurveCtrl
   */
  function closeErrorAlert() {
    this.createDischargeModelError = null;
  }
  SiteCurveCtrl.prototype.closeErrorAlert = closeErrorAlert;

  /**
   * Array of injectable dependencies for the site.
   *
   * @protected
   * @static
   * @memberOf SiteCurveCtrl
   * @type {Array.<external:String>}
   */
  SiteCurveCtrl.$inject = [ 'DischargeCurveFitting', 'Localization',
    'siteInfo', 'DischargeModels', '$state', 'dischargeModels',
    'FakeDischargePair'
  ];

  global.angular.module( 'imomoCaApp' )
    .controller( 'SiteCurveCtrl', SiteCurveCtrl );

} )( window );
