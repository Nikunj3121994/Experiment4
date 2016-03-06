'use strict';

xdescribe( 'Controller: OperationalDataSidebarCtrl', function () {
  // Load the main app module
  beforeEach( module( 'imomoCaApp' ) );

  // Load the required injection
  beforeEach( inject( function ( $controller, Localization ) {
    this.controller = $controller( 'OperationalDataSidebarCtrl', {
      localize: Localization.localize
    } );
  } ) );

  it( 'Check the initial state of the sidebar controller', function () {
    expect( this.controller ).toBeDefined();
    expect( this.controller.availableOptions ).toEqual( jasmine.any( Object ) );
    expect( this.controller.localize ).toEqual( jasmine.any( Function ) );
    expect( this.controller.availableOptions.length ).toBeGreaterThan( 0 );

    for ( var i = 0; i < this.controller.availableOptions.length; i++ ) {
      expect( this.controller.availableOptions[ i ].name ).toBeDefined();
      expect( this.controller.availableOptions[ i ].target ).toBeDefined();
      expect( this.controller.availableOptions[ i ].iconClass ).toBeDefined();
    }
  } );
} );
