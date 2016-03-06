'use strict';

( function ( global ) {

  var SidebarOptsCtrl = function ( localize, $state ) {
    this.localize = localize;
    this.options = [];
    if ( $state.current.data && $state.current.data.options ) {
      this.options = $state.current.data.options;
    }
  };

  SidebarOptsCtrl.$inject = [ 'localize', '$state' ];

  global.angular.module( 'imomoCaApp' )
    .controller( 'SidebarOptsCtrl', SidebarOptsCtrl );

} )( window );
