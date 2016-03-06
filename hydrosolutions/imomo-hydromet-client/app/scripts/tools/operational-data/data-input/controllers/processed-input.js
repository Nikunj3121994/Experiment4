( function ( global ) {
  'use strict';

  /**
   * Builds the controller with the injected dependencies.
   *
   * @class
   * @classdesc The controller for the view showing the decoded telegram
   *            information.
   * @param {DataInputStorage} DataInputStorage The service keeping the state
   *                                            of the complete page.
   * @param {Localization} Localization The localization service.
   */
  function ProcessedInputCtrl( DataInputStorage, Localization ) {
    this.localization_ = Localization;
    this.localizeDate = this.localization_
      .localizeDate.bind( this.localization_ );
    this.localizeDateTime = this.localization_
      .localizeDateTime.bind( this.localization_ );

    /**
     * Instance containing the decoded data.
     *
     * @name ProcessedInputCtrl#dailyData
     * @type {DailyOperationalData}
     * @public
     */
    this.dailyData = DataInputStorage.dailyInputData;
  }

  /**
   * Injectable dependencies for the controller.
   *
   * @static
   * @protected
   * @memberOf ProcessedInputCtrl
   * @type {Array.<external:String>}
   */
  ProcessedInputCtrl.$inject = [ 'DataInputStorage', 'Localization' ];

  global.angular.module( 'imomoCaApp' )
    .controller( 'ProcessedInputCtrl', ProcessedInputCtrl );

} )( window );
