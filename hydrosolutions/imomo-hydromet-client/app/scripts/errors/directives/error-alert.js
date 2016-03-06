( function ( global ) {
  'use strict';

  /**
   * Directive for error alerts.
   * @param  {Localization} Localization Injected localization service.
   * @return {Object} The directive definition object.
   */
  function errorAlertDir( Localization ) {
    /**
     * Scope definition for the error-alert directive.
     *
     * @type {Object}
     * @memberOf ErrorAlert
     * @inner
     * @property {external:String} error Two-way binding (=) definition for the
     *                                   error to display in the alert.
     * @property {external:String} close Function binding (&) for the function
     *                                   that closes the alert.
     */
    var scopeDefinition = {
      error: '=',
      close: '&'
    };

    /**
     * The link function for the directive, it simply puts the
     * {@link Localization#localizeError} method in the local scope.
     * @param {Object} scope The directive's scope.
     */
    function link( scope ) {
      scope.localizeError = Localization.localizeError.bind( Localization );
    }

    return {
      templateUrl: 'templates/error-alert.html',
      restrict: 'E',
      scope: scopeDefinition,
      link: link
    };
  }

  /**
   * Array of injectable dependencies for the directive.
   *
   * @static
   * @protected
   * @memberOf errorAlertDir
   * @type {Array.<external:String>}
   */
  errorAlertDir.$inject = [ 'Localization' ];

  global.angular.module( 'imomoCaApp' )
    .directive( 'errorAlert', errorAlertDir );

} )( window );
