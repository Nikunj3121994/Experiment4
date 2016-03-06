'use strict';

xdescribe( 'Service: KN15Parser', function () {

  // load the service's module
  beforeEach( module( 'imomoCaApp' ) );

  // instantiate service
  var KN15Parser;
  beforeEach( inject( function ( _KN15Parser_ ) {
    KN15Parser = _KN15Parser_;
  } ) );

  it( 'Parse telegrams with only water level', function () {
    var parsedTelegram =
      KN15Parser.parse( '3P: 16055 01082 11134 20000 31131 4//14 00000=' );
    var currentMomentEight = moment().date( 1 ).hours( 8 )
      .minutes( 0 ).seconds( 0 ).milliseconds( 0 );
    expect( parsedTelegram.dateOfObservations.isSame( currentMomentEight ) )
      .toBe( true );
    expect( parsedTelegram.stationIndex ).toEqual( '16055' );
    expect( parsedTelegram.waterLevelEight ).not.toBeUndefined();
    expect( parsedTelegram.waterLevelTwenty ).not.toBeUndefined();
    expect( parsedTelegram.waterLevelTrend ).not.toBeUndefined();

    var waterLevelEight = parsedTelegram.waterLevelEight;
    expect( waterLevelEight.measurementDateTime
      .isSame( currentMomentEight ) ).toBe( true );
    expect( waterLevelEight.value ).toEqual( 1134 );

    var waterLevelTwenty = parsedTelegram.waterLevelTwenty;
    var currentMomentTwenty = moment().date( 1 ).hours( 20 ).minutes( 0 ).seconds( 0 ).milliseconds( 0 ).subtract( 1, 'days' );
    expect( waterLevelTwenty.measurementDateTime
      .isSame( currentMomentTwenty ) ).toBe( true );
    expect( waterLevelTwenty.value ).toEqual( 1131 );

    var waterLevelTrend = parsedTelegram.waterLevelTrend;
    expect( waterLevelTrend.value ).toEqual( 0 );
  } );

} );
