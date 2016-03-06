'use strict';

( function ( global ) {

  function initializeState() {
    return false;
  }

  var AboutToolsCtrl = function ( $state, localize ) {
    this.localize = localize;
    this.tools = [];
    if ( $state.current.data && $state.current.data.options ) {
      this.tools = $state.current.data.options;
    }
    this.descriptionStates = _.map( this.tools, initializeState );
  };

  AboutToolsCtrl.$inject = [ '$state', 'localize' ];

  global.angular.module( 'imomoCaApp' )
    .controller( 'AboutToolsCtrl', AboutToolsCtrl );

} )( window );
