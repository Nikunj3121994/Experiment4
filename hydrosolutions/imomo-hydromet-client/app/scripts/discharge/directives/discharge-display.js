( function ( global ) {
  'use strict';

  /**
   * Factory function for the discharge-display directive.
   *
   * @return {Object} Directive definition for the wrapping discharge
   *                  directive.
   */
  function dischargeDisplayDir( DischargeCurveLine, DischargeCurvePoint ) {
    /**
     * Constructor for the main controller for the discharge display directive
     * ensemble.
     *
     * @class DischargeDisplayCtrl
     * @classdesc The controller for the discharge display takes care of
     *            initialization of shared data between the child directives
     *            and ensures proper intercommunication when changes happen.
     */
    function DischargeDisplayCtrl( $scope ) {
      this.displayWindowActions = {
        curve: null,
        table: null,
        controls: null
      };
      /**
       * Array of discharge points displayed in the graph.
       * @type {Array.<DischargeCurvePoint>}
       * @public
       */
      this.dischargePoints = [];
      /**
       * Array of discharge curves displayed in the graph.
       *
       * @name DischargeDisplayCtrl#dischargeCurves
       * @type {Array.<DischargeCurveLine>}
       * @public
       */
      this.dischargeCurves = [];
      /**
       * Internal reference to the scope of the directive.
       *
       * @name DischargeDisplayCtrl#_scope
       * @type {Object}
       * @protected
       */
      this._scope = $scope;

      $scope.$watchCollection( 'dischargeModels',
        this.updateDischargeModels.bind( this ) );
      $scope.$watchCollection( 'dischargeData',
        this.updateDischargeData.bind( this ) );
    }

    /**
     * Registers a function to be called when the display window changes.
     *
     * These functions must accept a new {@link WaterLevelRange}.
     *
     * @public
     * @instance
     * @memberOf DischargeDisplayCtrl
     * @param {Function} action The function to call
     * @param {external:String} directive, The directive that is registering
     *                          the action, it can be either 'curve', 'table'
     *                          or 'controls'.
     */
    function registerChangeDisplayWindowAction( action, directive ) {
      this.displayWindowActions[ directive ] = action;
    }
    DischargeDisplayCtrl.prototype.registerChangeDisplayWindowAction =
      registerChangeDisplayWindowAction;

    /**
     * Triggers a change in the window display by calling the registered
     * action.
     *
     * @public
     * @instance
     * @memberOf DischargeDisplayCtrl
     * @param {WaterLevelRange} newRange The new range desired by the user.
     * @return {WaterLevelRange} The range that is being displayed now, it
     *                           may differ from the user's original values.
     */
    function changeDisplayWindow( newRange ) {
      if ( this.displayWindowActions.curve ) {
        newRange = this.displayWindowActions.curve( newRange );
      }
      if ( this.displayWindowActions.table ) {
        this.displayWindowActions.table( newRange );
      }
      if ( this.displayWindowActions.controls ) {
        this.displayWindowActions.controls( newRange );
      }
      return newRange;
    }
    DischargeDisplayCtrl.prototype.changeDisplayWindow = changeDisplayWindow;

    /**
     * Update discharge curves based on changes on the input discharge models.
     *
     * @public
     * @instance
     * @memberOf DischargeDisplayCtrl
     * @param {Array.<DischargeModel>} newDischargeModels The set of
     *                                 new discharge models.
     */
    function updateDischargeModels( newDischargeModels ) {
      if ( newDischargeModels ) {
        this.dischargeCurves = newDischargeModels
          .map( DischargeCurveLine.fromDischargeModel );
        _.each( this.dischargeCurves,
          function ( dischargeCurveLine, idx ) {
            dischargeCurveLine.setColor( idx );
          } );
        var selectedCurve = _.find( this.dischargeCurves,
          function ( dischargeCurveLine ) {
            return dischargeCurveLine.dischargeModel ===
              this._scope.selectedDischargeModel;
          }, this );
        if ( selectedCurve ) {
          selectedCurve.select();
        }
      } else {
        this.dischargeCurves = [];
      }
    }
    DischargeDisplayCtrl.prototype.updateDischargeModels =
      updateDischargeModels;

    /**
     * Update discharge points based on changes on the input discharge data.
     *
     * Do it efficiently to preserve things like selections, this only works
     * if the only operations that happen to the original list are appends
     * and splices. Permutations would break this function.
     *
     * @public
     * @instance
     * @memberOf DischargeDisplayCtrl
     * @param {Array.<DischargeMeasurementPair>} newDischargeData The set of
     *                                           new discharge data points.
     */
    function updateDischargeData( newDischargeData ) {
      if ( newDischargeData && newDischargeData.length ) {
        var oldDischargePoints = this.dischargePoints;
        this.dischargePoints = [];
        var point1 = 0,
          point2 = 0;
        while ( point1 < newDischargeData.length && point2 < oldDischargePoints.length ) {
          if ( newDischargeData[ point1 ] === oldDischargePoints[ point2 ].dischargeData ) {
            this.dischargePoints.push( oldDischargePoints[ point2 ] );
            point1++;
            point2++;
          } else {
            point2++;
          }
        }
        for ( ; point1 < newDischargeData.length; point1++ ) {
          this.dischargePoints.push( DischargeCurvePoint.fromDischargeData( newDischargeData[ point1 ] ) );
        }
      } else {
        this.dischargePoints = [];
      }
    }
    DischargeDisplayCtrl.prototype.updateDischargeData =
      updateDischargeData;

    /**
     * Indicates the controller that a discharge model has been selected
     * by the user.
     *
     * @public
     * @instance
     * @memberOf DischargeDisplayCtrl
     * @param {DischargeCurveLine} selectedCurve The curve selected.
     */
    function selectDischargeCurve( selectedCurve ) {
      if ( selectedCurve ) {
        this._scope.selectedDischargeModel = selectedCurve.dischargeModel;
      } else {
        this._scope.selectedDischargeModel = null;
      }
    }
    DischargeDisplayCtrl.prototype.selectDischargeCurve = selectDischargeCurve;

    /**
     * Deletes a discharge model from the list given its index.
     *
     * @public
     * @instance
     * @memberOf DischargeDisplayCtrl
     * @param {Number} $index The index of the discharge model to delete.
     * @param {Boolean} wasSelected Indicates if the discharge model being
     *                              deleted was previously selected.
     */
    function deleteDischargeModel( $index, wasSelected ) {
      this._scope.dischargeModels.splice( $index, 1 );
      if ( wasSelected ) {
        this._scope.selectedDischargeModel = null;
      }
    }
    DischargeDisplayCtrl.prototype.deleteDischargeModel = deleteDischargeModel;

    /**
     * Indicates the controller that a discharge point was selected in the
     * graph. This triggers a call to the function passed in the directive
     * attributes.
     *
     * @public
     * @instance
     * @memberOf DischargeDisplayCtrl
     * @param {DischargeCurvePoint} dischargePoint The selected point.
     */
    function selectDischargePoint( dischargePoint ) {
      if ( this._scope.onDischargePairSelect ) {
        this._scope.onDischargePairSelect( {
          dischargePair: dischargePoint.dischargeData
        } );
      }
    }
    DischargeDisplayCtrl.prototype.selectDischargePoint = selectDischargePoint;

    /**
     * Indicates the controller that a discharge point was deselected from
     * the graph. This triggers a call to the function passed in the directive
     * attributes.
     *
     * @public
     * @instance
     * @memberOf DischargeDisplayCtrl
     * @param {DischargeCurvePoint} dischargePoint The de-select point.
     */
    function deselectDischargePoint( dischargePoint ) {
      if ( this._scope.onDischargePairDeselect ) {
        this._scope.onDischargePairDeselect( {
          dischargePair: dischargePoint.dischargeData
        } );
      }
    }
    DischargeDisplayCtrl.prototype.deselectDischargePoint =
      deselectDischargePoint;

    /**
     * Injectable dependencies for the controller.
     *
     * @protected
     * @static
     * @memberOf DischargeDisplayCtrl
     * @type {Array.<external:String>}
     */
    DischargeDisplayCtrl.$inject = [ '$scope' ];

    return {
      controller: DischargeDisplayCtrl,
      controllerAs: 'displayCtrl',
      scope: {
        dischargeModels: '=',
        dischargeData: '=',
        selectedDischargeModel: '=',
        onDischargePairSelect: '&',
        onDischargePairDeselect: '&'
      },
      restrict: 'E',
      templateUrl: 'templates/discharge-display.html'
    };
  }

  /**
   * Array of injectable dependencies for the directive.
   *
   * @type {Array.<external:String>}
   */
  dischargeDisplayDir.$inject = [ 'DischargeCurveLine',
    'DischargeCurvePoint'
  ];

  global.angular.module( 'imomoCaApp' )
    .directive( 'dischargeDisplay', dischargeDisplayDir );

} )( window );
