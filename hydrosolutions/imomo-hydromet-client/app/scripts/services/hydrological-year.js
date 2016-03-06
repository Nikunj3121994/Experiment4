( function ( global ) {
  'use strict';

  /**
   * Constructor for the service to handle issues with hydrological years
   * and real dates.
   *
   * @class HydroYear
   * @classdesc Service that provides the functionality related to the
   * definition of a hydrological year.
   *
   * The definition of a hydrological year must be synchronized between this
   * service and the code in the backend. The current definition for a
   * hydrological year starts on the 1st of October of each year. E.g.
   *
   * 02.10.2015 belongs to hydrological year 2016
   * 28.09.2015 belongs to hydrological year 2015
   */
  function HydroYear() {
    this.hydroYearStartMonth = 9; // October
  }

  /**
   * Determine the hydrological year number for the given date.
   * @param  {external:Moment} date The date to analyze.
   * @return {Number} The number of the hydrological year.
   */
  HydroYear.prototype.getYearForDate = function ( date ) {
    if ( date.month() < this.hydroYearStartMonth ) {
      return date.year();
    } else {
      return date.year() + 1;
    }
  };

  global.angular.module( 'imomoCaApp' )
    .service( 'HydroYear', HydroYear );

} )( window );
