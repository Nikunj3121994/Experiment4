'use strict';

( function ( global ) {

  var boundedDraggableNodeDir = function ( $document ) {

    function BoundedDraggableNode( scope, element ) {
      this.startX = 0;
      this.startY = 0;
      this.startNodeX = 0;
      this.startNodeY = 0;
      this.element = element;
      this.node = scope.node;
      this.bounds = {
        minX: scope.minX,
        minY: scope.minY,
        maxX: scope.maxX,
        maxY: scope.maxY
      };
      this.scope = scope;

      this._boundMousemove = undefined;
      this._boundMouseup = undefined;
    }

    BoundedDraggableNode.prototype = {};

    BoundedDraggableNode.prototype.link = function () {
      this.element.on( 'mousedown', this.mousedown.bind( this ) );
    };

    BoundedDraggableNode.prototype.mousedown = function ( $event ) {
      $event.preventDefault();
      this.startX = $event.pageX;
      this.startY = $event.pageY;
      this.startNodeX = this.node.x;
      this.startNodeY = this.node.y;
      this._boundMousemove = this.mousemove.bind( this );
      this._boundMouseup = this.mouseup.bind( this );
      $document.on( 'mousemove', this._boundMousemove );
      $document.on( 'mouseup', this._boundMouseup );
    };

    BoundedDraggableNode.prototype.mousemove = function ( $event ) {
      var deltaX = $event.pageX - this.startX,
        deltaY = $event.pageY - this.startY;
      this.node.x = Math.max( this.startNodeX + deltaX, this.bounds.minX );
      this.node.y = Math.max( this.startNodeY + deltaY, this.bounds.minY );
      this.node.x = Math.min( this.node.x, this.bounds.maxX );
      this.node.y = Math.min( this.node.y, this.bounds.maxY );
      this.scope.$apply();
    };

    BoundedDraggableNode.prototype.mouseup = function () {
      $document.off( 'mousemove', this._boundMousemove );
      $document.off( 'mouseup', this._boundMouseup );
    };

    function link( scope, element ) {
      ( new BoundedDraggableNode( scope, element ) ).link();
    }

    return {
      scope: {
        node: '=',
        minX: '@',
        minY: '@',
        maxX: '@',
        maxY: '@'
      },
      restrict: 'A',
      link: link
    };

  };

  boundedDraggableNodeDir.$inject = [ '$document' ];

  global.angular.module( 'imomoCaApp' )
    .directive( 'boundedDraggableNode', boundedDraggableNodeDir );

} )( window );
