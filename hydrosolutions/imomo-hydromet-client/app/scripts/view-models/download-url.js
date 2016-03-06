( function ( global ) {
  'use strict';

  function DownloadURLFactory() {
    function DownloadURL( options ) {
      this.url = options.url || null;
    }

    DownloadURL.fromServerObject = function( serverDownloadURL ) {
      return new DownloadURL(serverDownloadURL);
    };
    return DownloadURL;
  }

  global.angular.module('imomoCaApp')
    .factory( 'DownloadURL', DownloadURLFactory );

} )( window );