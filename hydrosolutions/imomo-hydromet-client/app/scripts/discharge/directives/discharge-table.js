( function ( global ) {
  'use strict';

  /**
   * Factory function for the directive.
   *
   * @return {Object} The directive configuration
   */
  function dischargeTableDir() {

    /**
     * Constructor for the linking class of the discharge-table directive.
     *
     * @class DischargeTable
     * @classdesc Linking class for the discharge-table directive, it takes
     *            care of attaching listeners to the bound data in the
     *            directive and populating the view models.
     */
    function DischargeTable() {
      this.rowRange = [];
      this.cellValues = [];
      this.updateRange( {
        min: 0,
        max: 200
      } );
    }

    /**
     * Updates the display range.
     *
     * This should be called whenever the min and max water level values
     * are changed.
     *
     * @protected
     * @instance
     * @memberOf DischargeTable
     * @param {WaterLevelRange} newRange The new range to display.
     */
    function updateRange( newRange ) {
      this.rowRange = _.range( newRange.min, newRange.max, 10 );
      if( this.dischargeModel ){
        this.calculateCells( this.dischargeModel );
      }
    }
    DischargeTable.prototype.updateRange = updateRange;

    /**
     * Calculates the discharge values using the current discharge model.
     *
     * @protected
     * @instance
     * @memberOf DischargeTable
     * @param {DischargeModel} newModel The new model to display.
     */
    function calculateCells( newModel ) {
      this.dischargeModel = newModel;
      this.cellValues = this.rowRange.map(
        function generateRange( decadeStart ) {
          return _.range( 10 ).map( function ( unitValue ) {
            if ( newModel ) {
              return newModel.getDischargeValue( decadeStart + unitValue );
            } else {
              return 0.0;
            }
          } );
        } );
    }
    DischargeTable.prototype.calculateCells = calculateCells;

    /**
     * Scope definition for the discharge table directive
     *
     * @inner
     * @memberOf DischargeTable
     * @type {Object}
     * @property {external:String} dischargeModel The model to display in the
     *                                            table, it is expected
     *                                            to be an instance of
     *                                            {@link DischargeModel}.
     */
    var scopeDefinition = {
      dischargeModel: '='
    };

    function link( $scope, element, attrs, displayCtrl ) {
      var dischargeTable = new DischargeTable();
      $scope.$watch( 'dischargeModel',
        dischargeTable.calculateCells.bind( dischargeTable ) );
      $scope.dischargeTable = dischargeTable;
      displayCtrl.registerChangeDisplayWindowAction(
        dischargeTable.updateRange.bind( dischargeTable ), 'table' );
    }

    return {
      templateUrl: 'templates/discharge-table.html',
      restrict: 'E',
      require: '^dischargeDisplay',
      scope: scopeDefinition,
      link: link
    };
  }

  /**
   * Array of injectable dependencies for the directive.
   * @type {Array}
   */
  dischargeTableDir.$inject = [];

  global.angular.module( 'imomoCaApp' )
    .directive( 'dischargeTable', dischargeTableDir );

} )( window );
