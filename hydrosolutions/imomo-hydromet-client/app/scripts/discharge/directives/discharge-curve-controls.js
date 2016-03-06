( function ( global ) {
  'use strict';

  /**
   * A range of water level values for the discharge curve graph.
   *
   * @typedef WaterLevelRange
   * @type {Object}
   * @property {Number} min Minimum water level value
   * @property {Number} max Maximum water level value
   */

  /**
   * Factory function for the directive that displays the controls for the
   * discharge curve view.
   *
   * @return {Object} Directive definition.
   */
  function dischargeCurveControlsDir() {

    function link( $scope, element, attrs, displayCtrl ) {
      /**
       * Initialize the water level controls with a default range.
       *
       * @type {WaterLevelRange}
       */
      $scope.waterLevelControl = {
        min: 0,
        max: 200
      };
      /**
       * Highlights a discharge curve in the graph when the user hovers over
       * the corresponding item in the legend.
       *
       * @public
       * @param {DischargeCurveLine} dischargeCurveLine The discharge curve
       *                             line that is affected by the event.
       * @param {Boolean} enter Indicates if the cursor is entering or leaving
       *                        the entry in the legend.
       */
      function hoverOverModel( dischargeCurveLine, enter ) {
        dischargeCurveLine.cursorEnter( enter );
      }
      $scope.hoverOverModel = hoverOverModel;

      /**
       * Selects the given curve, the curve selection is made visually clear in
       * the graph and the legend.
       *
       * @public
       * @param {angular.event} $event The triggering click event.
       * @param {DischargeCurveLine} dischargeCurveLine The discharge curve line
       *                                                that was selected.
       */
      function onCurveLegendItemClicked( $event, dischargeCurveLine ) {
        $event.preventDefault();
        _.each( $scope.dischargeCurves, function ( dischargeCurve ) {
          dischargeCurve.deselect();
        } );
        dischargeCurveLine.select();
        displayCtrl.selectDischargeCurve( dischargeCurveLine );
      }
      $scope.onCurveLegendItemClicked = onCurveLegendItemClicked;

      /**
       * Triggers a change in the display window, this must be passed to
       * the display controller so that it can be communicated to the siblings
       * directives.
       *
       * @public
       * @param {angular.event} $event The triggering click event.
       */
      function changeDisplayWindow( $event ) {
        $event.preventDefault();
        $scope.waterLevelControl = displayCtrl
          .changeDisplayWindow( $scope.waterLevelControl );
      }
      $scope.changeDisplayWindow = changeDisplayWindow;

      /**
       * Deletes the given discharge curve from the list of discharge curves
       * and indicates the display controller to do the same.
       *
       * @public
       * @param {angular.event} $event The triggering click event.
       * @param {Number} $index The index of the discharge curve to delete.
       */
      function deleteDischargeCurve( $event, $index ) {
        $event.preventDefault();
        var wasSelected = $scope.dischargeCurves[ $index ].isSelected();
        $scope.dischargeCurves[ $index ].deselect();
        $scope.dischargeCurves.splice( $index, 1 );
        displayCtrl.deleteDischargeModel( $index, wasSelected );
      }
      $scope.deleteDischargeCurve = deleteDischargeCurve;
    }

    return {
      scope: {
        dischargeCurves: '=',
        selectedCurve: '='
      },
      require: '^dischargeDisplay',
      restrict: 'E',
      templateUrl: 'templates/discharge-curve-controls.html',
      link: link
    };
  }

  global.angular.module( 'imomoCaApp' )
    .directive( 'dischargeCurveControls', dischargeCurveControlsDir );

} )( window );
