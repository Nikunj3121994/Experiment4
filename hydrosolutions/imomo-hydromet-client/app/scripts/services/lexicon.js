'use strict';

( function ( global ) {

  var odm = {
    maxLength: function ( type ) {
      switch ( type ) {
      case 'code':
        return 50;
      case 'identifier':
        return 255;
      case 'link':
        return 255;
      default:
        return Number.MAX_VALUE;
      }
    }
  };

  var Lexicon = function () {};

  Lexicon.$inject = [];

  Lexicon.prototype.users = {
    maxLength: function ( attr ) {
      switch ( attr ) {
      case 'username':
        return odm.maxLength( 'code' );
      case 'password':
        return 72;
      case 'email':
        return odm.maxLength( 'identifier' );
      case 'fullName':
        return odm.maxLength( 'identifier' );
      default:
        return odm.maxLength( 'default' );
      }
    },
    minLength: function ( attr ) {
      switch ( attr ) {
      case 'username':
        return 6;
      case 'password':
        return 6;
      default:
        return 0;
      }
    },
    pattern: function ( attr ) {
      switch ( attr ) {
      case 'username':
        return /^\w+$/;
      case 'fullName':
        return '^[\s\w\u0400-\u04FF]+$';
      default:
        return '^.*$';
      }
    },
    passwordStrength: function ( password ) {
      if ( !/\d/.test( password ) ) {
        return false;
      }
      return ( /[A-Z]/ ).test( password );
    }
  };

  Lexicon.prototype.sites = {
    maxLength: function ( attr ) {
      switch ( attr ) {
      case 'siteCode':
        return odm.maxLength( 'code' );
      case 'siteName':
      case 'region':
      case 'country':
      case 'basin':
        return odm.maxLength( 'identifier' );
      default:
        return odm.maxLength( attr );
      }
    },
    min: function ( attr ) {
      switch ( attr ) {
      case 'latitude':
        return -90;
      case 'longitude':
        return -180;
      default:
        return -Number.MAX_VALUE;
      }
    },
    max: function ( attr ) {
      switch ( attr ) {
      case 'latitude':
        return 90;
      case 'longitude':
        return 180;
      default:
        return Number.MAX_VALUE;
      }
    }
  };


  global.angular.module( 'imomoCaApp' )
    .service( 'Lexicon', Lexicon );
} )( window );
