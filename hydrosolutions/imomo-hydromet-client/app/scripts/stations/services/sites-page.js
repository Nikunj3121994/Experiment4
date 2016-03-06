( function ( global ) {
  'use strict';

  /**
   * Constructor for the SitesPage service, a shared state service.
   *
   * @class SitesPage
   * @classdesc A service that stores state variables that are shared between
   *            the different child states in the hierarchy of the sites page.
   *            This allows handling things such as the back button properly.
   */
  function SitesPage() {
    /**
     * Boolean flag that controls the collapse of the site list in the
     * overview controller. The table should always be collapsed when
     * exiting the state to a child state and expanded when
     * entering the state from anywhere.
     *
     * @name SitesPage#collapsedSiteList
     * @type {Boolean}
     * @public
     * @default false
     */
    this.collapsedSiteList = false;
  }

  global.angular.module( 'imomoCaApp' ).service( 'SitesPage', SitesPage );

} )( window );
