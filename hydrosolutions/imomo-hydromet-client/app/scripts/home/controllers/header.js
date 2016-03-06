( function ( global ) {
  'use strict';

  var HeaderCtrl = function ( AccessTokens, AccessTokenStorage, $state, $timeout, Users, ErrorLog, CurrentUser, ErrorFormatter ) {
    this.accessTokens_ = AccessTokens;
    this.accessTokenStorage_ = AccessTokenStorage;
    this.state_ = $state;
    this.timeout_ = $timeout;
    this.users_ = Users;
    this.errorLog_ = ErrorLog;
    this.currentUser_ = CurrentUser;
    this.formatError = ErrorFormatter.formatError.bind( ErrorFormatter );

    this.isLoggedIn = this.accessTokenStorage_.hasValidToken();
    this.loginInfo = {
      usernameOrEmail: null,
      password: null
    };

    this.loginInProgress = false;
    this.loginError = null;
    this.userInfoLoadInProgress = false;

    if ( this.isLoggedIn ) {
      this.loadUserInfo();
    }
  };

  HeaderCtrl.$inject = [ 'AccessTokens', 'AccessTokenStorage', '$state',
    '$timeout', 'Users', 'ErrorLog', 'CurrentUser', 'ErrorFormatter'
  ];


  Object.defineProperty( HeaderCtrl.prototype, 'currentUser', {
    enumerable: true,
    get: function () {
      return this.currentUser_.user;
    }
  } );

  HeaderCtrl.prototype.login = function ( $event ) {
    $event.preventDefault();
    this.loginInProgress = true;
    this.accessTokens_.getToken( this.loginInfo.usernameOrEmail,
        this.loginInfo.password ).then( this.onGetTokenSuccess.bind( this ) )
      .catch( this.onGetTokenError.bind( this ) )
      .finally( this.onLoginEnd.bind( this ) );
  };

  HeaderCtrl.prototype.onGetTokenSuccess = function ( accessTokens ) {
    var accessToken = accessTokens[ 0 ];
    this.accessTokenStorage_.storeToken( accessToken );
    this.loginInfo.usernameOrEmail = null;
    this.loginInfo.password = null;
    this.state_.reload();
  };

  HeaderCtrl.prototype.onGetTokenError = function ( errorData ) {
    this.loginError = errorData;
    this.loginInfo.password = null;
  };

  HeaderCtrl.prototype.onLoginEnd = function () {
    this.loginInProgress = false;
  };

  HeaderCtrl.prototype.dismissLoginError = function ( $event ) {
    $event.preventDefault();
    this.loginError = null;
  };

  HeaderCtrl.prototype.logout = function ( $event ) {
    $event.preventDefault();
    if ( this.isLoggedIn ) {
      this.accessTokenStorage_.clearToken();
      this.currentUser_.user = null;
      this.state_.reload();
    }
  };

  HeaderCtrl.prototype.loadUserInfo = function () {
    this.userInfoLoadInProgress = true;
    var promise = this.users_.getMe();
    promise.then( this.onUserInfoLoaded.bind( this ) )
      .catch( this.onUserInfoLoadError.bind( this ) );
  };

  HeaderCtrl.prototype.onUserInfoLoaded = function ( user ) {
    this.userInfoLoadInProgress = false;
    this.currentUser_.user = user[ 0 ];
  };

  HeaderCtrl.prototype.onUserInfoLoadError = function ( error ) {
    this.errorLog_.log( error );
    this.state_.go( 'generalError' );
  };

  global.angular.module( 'imomoCaApp' )
    .controller( 'HeaderCtrl', HeaderCtrl );

} )( window );
