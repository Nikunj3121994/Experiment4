'use strict';

( function ( global ) {

  var DeleteConfirmationCtrl = function ( $scope, $stateParams, Sites ) {
    this.scope_ = $scope;
    this.sites_ = Sites;

    this.selectedSite = $stateParams.site;
  };

  DeleteConfirmationCtrl.$inject = [ '$scope', '$stateParams', 'Sites' ];

  DeleteConfirmationCtrl.prototype.delete = function ( $event ) {
    $event.preventDefault();
    this.sites_.deleteSite( this.selectedSite )
      .then( this.siteDeleted.bind( this ) )
      .catch( this.siteDeleteFailed.bind( this ) );
  };

  DeleteConfirmationCtrl.prototype.siteDeleted = function () {
    this.scope_.$close( true );
  };

  DeleteConfirmationCtrl.prototype.siteDeleteFailed = function () {
    this.scope_.$dismiss();
  };

  DeleteConfirmationCtrl.prototype.cancel = function ( $event ) {
    $event.preventDefault();
    this.scope_.$dismiss();
  };

  global.angular.module( 'imomoCaApp' )
    .controller( 'DeleteConfirmationCtrl', DeleteConfirmationCtrl );

} )( window );
