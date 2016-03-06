( function ( global ) {
  'use strict';

  /**
   * Factory function for the discharge curve directive.
   * @param  {$window} $window AngularJS wrapping of the window element.
   * @param  {BoundingBox} BoundingBox Constructor for the class.
   * @return {Object} The definition of the directive.
   */
  function dischargeCurveDir( $window, BoundingBox ) {

    function link( $scope, $element, attrs, displayCtrl ) {
      var boundingBox = new BoundingBox();
      var svgElement = $element.find( 'svg' );
      var d3Helpers = {};
      var d3Element = d3.select( svgElement[ 0 ] );

      /**
       * Initializes properties which reside in the directive's scope.
       *
       * @public
       */
      function initScope() {
        $scope.dimensions = {
          margins: {
            left: 60,
            top: 20,
            right: 20,
            bottom: 50
          },
          titles: {
            fontsize: 20,
            style: {
              'font-size': 18
            }
          }
        };
      }

      /**
       * Initialize the d3 helper objects that provide an API to draw axes,
       * lines and force diagrams.
       *
       * @public
       */
      function initD3Helpers() {
        d3Helpers.scales = {
          x: d3.scale.linear(),
          y: d3.scale.linear()
        };
        d3Helpers.axes = {
          x: d3.svg.axis().orient( 'bottom' ),
          y: d3.svg.axis().orient( 'left' )
        };
        d3Helpers.generators = {
          line: d3.svg.line().x( function getX( p ) {
            return d3Helpers.scales.x( p.x );
          } ).y( function getY( p ) {
            return d3Helpers.scales.y( p.y );
          } ).interpolate( 'cardinal' ),
          point: d3.svg.symbol()
        };
        d3Helpers.force = d3.layout.force().charge( -150 ).linkDistance( 60 )
          .linkStrength( 1 ).on( 'tick', function onTick() {
            $scope.$apply();
          } );
      }


      /**
       * Calculate the minimum bounding box to contain all data points present
       * in the discharge curve.
       *
       * @protected
       * @return {BoundingBox} The minimum bounding box.
       */
      function minimumBoundingBox() {
        var minMaxX = $scope.dischargePoints.reduce(
          function ( maxValue, point ) {
            return Math.max( maxValue, point.dataValue.discharge );
          }, Number.NEGATIVE_INFINITY );
        var minMaxY = $scope.dischargePoints.reduce(
          function ( maxValue, point ) {
            return Math.max( maxValue, point.dataValue.waterLevel );
          }, Number.NEGATIVE_INFINITY );
        var maxMinX = $scope.dischargePoints.reduce(
          function ( minValue, point ) {
            return Math.min( minValue, point.dataValue.discharge );
          }, Number.POSITIVE_INFINITY );
        var maxMinY = $scope.dischargePoints.reduce(
          function ( minValue, point ) {
            return Math.min( minValue, point.dataValue.waterLevel );
          }, Number.POSITIVE_INFINITY );
        return new BoundingBox( {
          minX: maxMinX,
          minY: maxMinY,
          maxX: minMaxX,
          maxY: minMaxY
        } );
      }

      /**
       * (Re-)Generate the axes and discharge curves in the graph after a
       * change in the window's size, the water level range or the
       * array of discharge models.
       *
       * @public
       * @param  {Object} options Parameters for the function
       * @param {Boolean} options.resize Indicates if the adjustment was
       *                                 triggered by a resize
       * @param {Boolean} options.domain Indicates if the adjustment was
       *                                 triggered by a change in the water level
       *                                 limits
       * @param {Boolean} options.model Indicates if the adjustment was
       *                                triggered by a change in the discharge
       *                                models
       * @param {Boolean} options.points Indicates if the adjustment was
       *                                 triggered by a change in the discharge
       *                                 points
       */
      function adjustGraphicElements( options ) {
        if ( options.resize ) {
          $scope.dimensions.width = svgElement[ 0 ].clientWidth;
          $scope.dimensions.height = svgElement[ 0 ].clientHeight;
          $scope.dimensions.innerWidth = $scope.dimensions.width -
            $scope.dimensions.margins.left -
            $scope.dimensions.margins.right;
          $scope.dimensions.innerHeight = $scope.dimensions.height -
            $scope.dimensions.margins.top -
            $scope.dimensions.margins.bottom;
          d3Helpers.scales.x.range(
            [ 0, $scope.dimensions.innerWidth ] );
          d3Helpers.scales.y.range(
            [ $scope.dimensions.innerHeight, 0 ] );
          d3Helpers.force.size(
            [ $scope.dimensions.innerWidth,
              $scope.dimensions.innerHeight
            ] );
        }
        var minBounding = minimumBoundingBox();
        if ( options.points ) {
          var originalBox = boundingBox.clone();
          boundingBox.minX = Math.min( boundingBox.minX,
            minBounding.minX );
          boundingBox.maxX = Math.max( boundingBox.maxX,
            minBounding.maxX );
          boundingBox.minY = Math.min( boundingBox.minY,
            minBounding.minY );
          boundingBox.maxY = Math.max( boundingBox.maxY,
            minBounding.maxY );
          if ( originalBox !== boundingBox ) {
            displayCtrl.changeDisplayWindow( {
              min: boundingBox.minY,
              max: boundingBox.maxY
            } );
            options.domain = true;
          }
        }

        if ( options.domain || options.model ) {
          if ( !_.isEmpty( $scope.dischargeCurves ) ) {
            _.each( $scope.dischargeCurves, function ( dischargeCurveLine ) {
              dischargeCurveLine.changeDomain( boundingBox );
            } );
            var maxDischargeCurveLine = _.max( $scope.dischargeCurves,
              function ( dischargeCurveLine ) {
                return dischargeCurveLine.dischargeModel
                  .getDischargeValue( boundingBox.maxY );
              } );
            var maxDischargeValue = maxDischargeCurveLine.dischargeModel
              .getDischargeValue( boundingBox.maxY );
            boundingBox.maxX = Math.max( maxDischargeValue, minBounding.maxX );
            d3Helpers.scales.x
              .domain( [ boundingBox.minX, boundingBox.maxX ] );
          } else {
            d3Helpers.scales.x
              .domain( [ boundingBox.minX, boundingBox.maxX ] );
          }
          d3Helpers.scales.y.domain(
            [ boundingBox.minY, boundingBox.maxY ] );
        }

        if ( options.domain || options.model || options.resize ||
          options.points ) {
          d3Helpers.axes.x.ticks( 5 )
            .tickSize( $scope.dimensions.innerHeight, 0 );
          d3Helpers.axes.y.ticks( 5 )
            .tickSize( $scope.dimensions.innerWidth, 0 );
          d3Helpers.axes.x.scale( d3Helpers.scales.x );
          d3Helpers.axes.y.scale( d3Helpers.scales.y );
          d3Element.select( '.x.axis' ).call( d3Helpers.axes.x );
          d3Element.select( '.y.axis' ).call( d3Helpers.axes.y );
          _.each( $scope.dischargeCurves, function ( dischargeCurveLine ) {
            dischargeCurveLine.dPath = d3Helpers.generators
              .line( dischargeCurveLine.dataPoints );
          } );
        }
        _.each( $scope.dischargePoints, function ( dischargeCurvePoint ) {
          dischargeCurvePoint.dataValue.px = undefined;
          dischargeCurvePoint.dataValue.py = undefined;
          dischargeCurvePoint.dataValue.x = d3Helpers.scales.x( dischargeCurvePoint.dataValue.discharge );
          dischargeCurvePoint.dataValue.y = d3Helpers.scales.y(
            dischargeCurvePoint.dataValue.waterLevel );
        } );

        var nodes = _.flatten( _.map( $scope.dischargePoints,
          function ( dischargeCurvePoint ) {
            return [ dischargeCurvePoint.dataValue, dischargeCurvePoint.label ];
          } ), true );
        var links = _.map( _.range( 0, $scope.dischargePoints.length ), function ( val ) {
          return {
            source: 2 * val,
            target: 2 * val + 1
          };
        } );
        if ( _.every( nodes ) ) {
          d3Helpers.force.nodes( nodes ).links( links ).start();
        }
      }

      /**
       * Selects the indicated discharge point in the graph.
       * The selection of a discharge point is indicated visually.
       *
       * If the point is already selected then a second click, deselects it.
       *
       * @public
       * @param {angular.event} $event The triggering click event.
       * @param {DischargeCurvePoint} dischargePoint The selected discharge
       *                                             point.
       */
      function onDischargePointClick( $event, dischargePoint ) {
        $event.preventDefault();
        if ( dischargePoint.isSelectable() ) {
          if ( dischargePoint.isSelected() ) {
            dischargePoint.deselect();
            displayCtrl.deselectDischargePoint( dischargePoint );
          } else {
            dischargePoint.select();
            displayCtrl.selectDischargePoint( dischargePoint );
          }
        }
      }
      $scope.onDischargePointClick = onDischargePointClick;

      /**
       * Applies a change in the display window if possible.
       *
       * The function makes sure that the given limits are good enough
       * to contain all data points, if not then the previous limits are
       * kept intact.
       *
       * @public
       * @param {WaterLevelRange} newRange The new water level range to apply.
       * @return {WaterLevelRange} The applied range.
       */
      function changeBoundingBox( newRange ) {
        var min = parseInt( newRange.min ),
          max = parseInt( newRange.max ),
          minBox = minimumBoundingBox();
        min = Math.min( min, max, minBox.minY );
        max = Math.max( min, max, minBox.maxY );
        if ( min === max ) {
          max += 1;
        }
        if ( min !== boundingBox.minY || max !== boundingBox.maxY ) {
          boundingBox.minY = min;
          boundingBox.maxY = max;
          adjustGraphicElements( {
            domain: true
          } );
        }
        return {
          min: boundingBox.minY,
          max: boundingBox.maxY
        };
      }

      /**
       * Event handler that responds to changes in the window's size. It triggers
       * an adjustment of the discharge curves and axes.
       * It also initiates an $apply cycle in the directive's scope.
       *
       * @public
       */
      function onResize() {
        adjustGraphicElements( {
          resize: true
        } );
        $scope.$apply();
      }
      global.angular.element( $window ).bind( 'resize', onResize );

      initScope();
      initD3Helpers();
      adjustGraphicElements( {
        resize: true,
        domain: true
      } );
      $scope.$watchCollection( 'dischargeCurves',
        adjustGraphicElements.bind( null, {
          model: true
        } ) );
      $scope.$watchCollection( 'dischargePoints',
        adjustGraphicElements.bind( null, {
          points: true
        } ) );
      displayCtrl
        .registerChangeDisplayWindowAction( changeBoundingBox, 'curve' );
    }

    return {
      templateUrl: 'templates/discharge-curve.html',
      restrict: 'E',
      require: '^dischargeDisplay',
      scope: {
        dischargeCurves: '=',
        dischargePoints: '='
      },
      link: link
    };
  }

  dischargeCurveDir.$inject = [ '$window', 'BoundingBox' ];

  global.angular.module( 'imomoCaApp' )
    .directive( 'dischargeCurve', dischargeCurveDir );

} )( window );
