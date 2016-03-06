( function ( global ) {
  'use strict';
  /**
   * Creates an instance of the controller with the given injectable
   * dependencies.
   *
   * @class RegisterUserCtrl
   * @classdesc Controller for the register user page, the controller provides
   *            functionalities to create a new user in the system.
   * @param {Object}           $timeout       AngularJS wrapper for the
   *                                          window.timeout function.
   * @param {Object}           $state         AngularJS-UI state service.
   * @param {User.constructor} User           Constructor for the {@link User}
   *                                          class.
   * @param {Lexicon}          Lexicon        Lexicon service.
   * @param {Users}            Users          API service for the users
   *                                          endpoint.
   * @param {Function}         localize       Resolved localize function for
   *                                          generic strings.
   * @param {Array.<Source>}
   *                           sources  Array of data sources registered
   *                                    in the system.
   */
  function RegisterUserCtrl( $timeout, $state, User, Lexicon, Users, localize, sources ) {
    /**
     * Reference to the timeout wrapper object.
     *
     * @name RegisterUserCtrl#_timeout
     * @type {Object}
     * @protected
     */
    this._timeout = $timeout;
    /**
     * Reference to the state object.
     *
     * @name RegisterUserCtrl#_state
     * @type {Object}
     * @protected
     */
    this._state = $state;
    /**
     * Reference to the users API service.
     *
     * @name RegisterUserCtrl#_users
     * @type {Users}
     * @protected
     */
    this._users = Users;
    /**
     * Lexicon rules for user models.
     *
     * @name RegisterUserCtrl#usersLexicon
     * @type {Object}
     * @public
     */
    this.usersLexicon = Lexicon.users;
    /**
     * Array of registered sources in the system.
     *
     * @name RegisterUserCtrl#sources
     * @type {Array.<Source>}
     * @public
     */
    this.sources = sources;
    /**
     * Localization function for generic strings.
     *
     * @name RegisterUserCtrl#localize
     * @type {Function}
     * @public
     */
    this.localize = localize;

    /**
     * The new user being created.
     *
     * @name RegisterUserCtrl#newUser
     * @type {User}
     * @public
     */
    this.newUser = new User();
    this.newUser.sourceId = this.sources[0].id;

    this.registerUserWaiting = true;
    this.registerUserError = false;
    this.registerUserSuccess = false;
    this.registeringUser = false;
  }

  /**
   * Array of injectable dependencies for the controller.
   *
   * @protected
   * @static
   * @memberOf RegisterUserCtrl
   * @type {Array.<String>}
   */
  RegisterUserCtrl.$inject = [ '$timeout', '$state', 'User', 'Lexicon',
    'Users', 'localize', 'sources'
  ];

  /**
   * Validates the strength of the password using the user's lexicon.
   *
   * @public
   * @instance
   * @memberOf RegisterUserCtrl
   * @param  {String} viewValue The view value entered by the user.
   * @return {Boolean}          true if the password is good enough, false
   *                            otherwise.
   */
  function validatePasswordStrength( viewValue ) {
    return this.usersLexicon.passwordStrength( viewValue );
  }
  RegisterUserCtrl.prototype.validatePasswordStrength =
    validatePasswordStrength;

  /**
   * Sends a request to the backend to register a new user through the
   * API service.
   *
   * @public
   * @instance
   * @memberOf RegisterUserCtrl
   * @param  {angular.event} $event The click event triggered by the user.
   */
  function register( $event ) {
    $event.preventDefault();
    this.registerUserWaiting = false;
    this.registeringUser = true;
    this._users.registerUser( this.newUser ).then(
        this.onRegisterSuccess.bind( this ) )
      .catch( this.onRegisterError.bind( this ) )
      .finally( this.onRegisterEnd.bind( this ) );
  }
  RegisterUserCtrl.prototype.register = register;

  /**
   * Indicates to the user that the registration was successful and then
   * returns to the home page state.
   *
   * @protected
   * @instance
   * @memberOf RegisterUserCtrl
   */
  function onRegisterSuccess() {
    this.registerUserSuccess = true;
    this.newUser = null;
    this._timeout( function () {
      this._state.go( 'root' );
    }.bind( this ), 3000 );
  }
  RegisterUserCtrl.prototype.onRegisterSuccess = onRegisterSuccess;

  /**
   * Indicates that there was an error and presents the error message
   * received from the server.
   *
   * @protected
   * @instance
   * @memberOf RegisterUserCtrl
   * @param {ServerError} err The error sent by the server.
   */
  function onRegisterError(err) {
    this.registerUserError = err;
  }
  RegisterUserCtrl.prototype.onRegisterError = onRegisterError;

  /**
   * Finalizes the register operation and cleans up any indication of
   * the process.
   *
   * @protected
   * @instance
   * @memberOf RegisterUserCtrl
   */
  function onRegisterEnd() {
    this.registeringUser = false;
  }
  RegisterUserCtrl.prototype.onRegisterEnd = onRegisterEnd;

  /**
   * Closes the error alert and restarts the user input functions.
   *
   * @public
   * @instance
   * @memberOf RegisterUserCtrl
   */
  function closeErrorAlert() {
    this.registerUserError = null;
    this.registerUserWaiting = true;
  }
  RegisterUserCtrl.prototype.closeErrorAlert = closeErrorAlert;

  global.angular.module( 'imomoCaApp' )
    .controller( 'RegisterUserCtrl', RegisterUserCtrl );

} )( window );
