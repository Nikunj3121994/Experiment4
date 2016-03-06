( function ( global ) {
  'use strict';
  /**
   * Constructor the data input controller class. It initializes the
   * controller with the injectable dependencies as arguments.
   *
   * @class DataInputCtrl
   * @classdesc Controller for the first step in the telegram input page.
   * @param {Object}     $state           Angular-UI's router state service.
   * @param {KN15Parser} KN15Parser       KN15 parsing service.
   * @param {DataInputStorage} DataInputStorage
   *        Storage service for the input data.
   */
  function DataInputCtrl( $state, KN15Parser, DataInputStorage ) {
    /**
     * KN15 parsing service
     *
     * @name DataInputCtrl#kn15Parser_
     * @type {KN15Parser}
     * @protected
     */
    this.kn15Parser_ = KN15Parser;
    /**
     * Storage service for the input data
     *
     * @name DataInputCtrl#dataInputStorage_
     * @type {DataInputStorage}
     * @protected
     */
    this.dataInputStorage_ = DataInputStorage;
    /**
     * Angular UI's state service.
     *
     * @name DataInputCtrl#state_
     * @type {Object}
     * @protected
     */
    this.state_ = $state;

    /**
     * State variable that indicates whether the telegram is being parsed.
     *
     * @name DataInputCtrl#processingData
     * @type {Boolean}
     * @public
     * @default false
     */
    this.processingData = false;
    /**
     * State variable that indicates whether the input is disabled.
     *
     * @name DataInputCtrl#disabledInput
     * @type {Boolean}
     * @public
     * @default false
     */
    this.disableInput = false;
    /**
     * State variable that indicates whether the help associated with the
     * telegram input is collapsed or visible.
     *
     * @name DataInputCtrl#kn15HelpCollapsed
     * @type {Boolean}
     * @public
     * @default true
     */
    this.kn15HelpCollapsed = true;

    /**
     * Telegram input string.
     *
     * @name DataInputCtrl#kn15Input
     * @type {external:String}
     * @public
     * @default ''
     */
    this.kn15Input = '';
    /**
     * Telegram input month.
     *
     * @name DataInputCtrl#telegramMonth
     * @type {Number}
     * @public
     * @default Current month
     */
    this.telegramMonth = moment.months( moment().month() );
    /**
     * Telegram input year.
     *
     * @name DataInputCtrl#telegramYear
     * @type {Number}
     * @public
     * @default Current year
     */
    this.telegramYear = moment().year();

    /**
     * List of localized months in the year.
     *
     * @name DataInputCtrl#months
     * @type {Array.<external:String>}
     * @public
     */
    this.months = moment.months();

    /**
     * List of years.
     *
     * @name DataInputCtrl#years
     * @type {Array.<Number>}
     * @public
     */
    this.years = _.range( 1950, 2051 );
    /**
     * An error that may have occurred during the parsing.
     *
     * @name DataInputCtrl#parseError
     * @type {ServerError}
     * @protected
     * @default null
     */
    this.parseError = null;
  }

  /**
   * List of injectable dependencies.
   *
   * @protected
   * @static
   * @memberOf DataInputCtrl
   * @type {Array.<external:String>}
   */
  DataInputCtrl.$inject = [ '$state', 'KN15Parser', 'DataInputStorage' ];

  /**
   * Display or hide the KN15 help text.
   *
   * @public
   * @instance
   * @memberOf DataInputCtrl
   * @param  {angular.event} $event The click event to change the help display
   *                                status.
   */
  function toggleHelp( $event ) {
    $event.preventDefault();
    this.kn15HelpCollapsed = !this.kn15HelpCollapsed;
  }
  DataInputCtrl.prototype.toggleHelp = toggleHelp;

  /**
   * Decode the input telegram using the parsing service.
   *
   * @public
   * @instance
   * @memberOf DataInputCtrl
   * @param  {angular.event} $event The click event that triggered the parsing.
   */
  function decodeTelegram( $event ) {
    $event.preventDefault();
    this.processingData = true;
    this.kn15Parser_.parse( this.kn15Input,
        moment().month( this.telegramMonth ).month(), this.telegramYear )
      .then( this.onTelegramDecoded.bind( this ) )
      .catch( this.onDecodeTelegramError.bind( this ) );
  }
  DataInputCtrl.prototype.decodeTelegram = decodeTelegram;

  /**
   * Once the telegram is decoded, verify the input data and store in the
   * storage service.
   *
   * @public
   * @instance
   * @memberOf DataInputCtrl
   * @param  {DailyOperationalData} dailyInputData The daily data decoded
   *                                               from the telegram.
   * @return {$q.promise} A promise that is resolved when there is a state
   *                      transition to the next step in the processing.
   */
  function onTelegramDecoded( dailyInputData ) {
    this.inputData = dailyInputData;
    this.inputData.determineWaterLevelAverage();
    this.dataInputStorage_.dailyInputData = this.inputData;
    return this.state_.go( '.processed' ).then( function () {
      this.processingData = false;
      this.disableInput = true;
    }.bind( this ) );
  }
  DataInputCtrl.prototype.onTelegramDecoded = onTelegramDecoded;

  /**
   * If an error occurs then block the inputs and display the error for
   * review by the user.
   *
   * @public
   * @instance
   * @memberOf DataInputCtrl
   * @param  {ServerError} errorData Error data that triggered the rejection of
   *                                 a promise.
   */
  function onDecodeTelegramError( errorData ) {
    this.parseError = errorData;
    this.disableInput = true;
    this.processingData = false;
  }
  DataInputCtrl.prototype.onDecodeTelegramError = onDecodeTelegramError;

  /**
   * Close the error alert and enable the inputs again.
   *
   * @public
   * @instance
   * @memberOf DataInputCtrl
   */
  function closeErrorAlert() {
    this.parseError = null;
    this.disableInput = false;
  }
  DataInputCtrl.prototype.closeErrorAlert = closeErrorAlert;

  global.angular.module( 'imomoCaApp' )
    .controller( 'DataInputCtrl', DataInputCtrl );

} )( window );
