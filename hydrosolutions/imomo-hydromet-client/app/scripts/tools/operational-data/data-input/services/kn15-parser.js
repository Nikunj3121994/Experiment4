( function ( global ) {
  'use strict';
  /**
   * Regular expression that indicates the supported telegram format.
   *
   * @type {RegExp}
   */
  var rKN15Encoded = /^(((hhzz)|(3p:)) )?[0-9]{5} [0-9]{2}08(1|2)( [0-8][0-9/]{4}){1,8}( 93301( [1-8][0-9]{4}){1,8})?( 966(([0-9]{2})|(1[1-2]))( [1-8][0-9]{4}){1,8})?=$/;
  /**
   * Validation regex for station indexes. A station index has to have 5
   * digits.
   *
   * @type {RegExp}
   */
  var rStationIndex = /^[0-9]{5}$/;

  /**
   * Constructor for the KN15 parsing service.
   *
   * @class KN15Parser
   * @classdesc KN15 telegram parsing service.
   * @param {external:angular.$q} $q Promise service.
   * @param {Sites} Sites The sites API service.
   * @param {Function} DailyOperationalData
   *        The constructor for the {@link DailyOperationalData} class.
   * @param {ClientErrors} ClientErrors
   *        Service that holds all available client errors.
   */
  function KN15Parser( $q, Sites, DataValues, DailyOperationalData, ClientErrors ) {
    this.q_ = $q;
    this.sites_ = Sites;
    this.dataValues_ = DataValues;
    this.dailyOperationalData_ = DailyOperationalData;
    this.clientErrors_ = ClientErrors;
  }

  /**
   * Dependencies for the KN15Parser class.
   *
   * @protected
   * @static
   * @memberOf KN15Parser
   * @type {Array.<String>}
   */
  KN15Parser.$inject = [ '$q', 'Sites', 'DataValues', 'DailyOperationalData',
    'ClientErrors'
  ];

  /**
   * Parse a single KN15-encoded telegram line.
   *
   * The line should have the following format:
   * [HHZZ ]16290 02082 10271 20072 30272 0000/[ 93301 10275][ 96607 10255 23135 32540 40160 51217]=
   * Where the sections enclosed in brackets are optional.
   *
   * For a full explanation and description please refer to the official KN15
   * encoding document.
   *
   * @public
   * @instance
   * @memberOf KN15Parser
   * @param  {external:String} telegram KN15-encoded daily telegram line.
   * @param {Number} month The telegram's month.
   * @param {Number} year The telegrams's year.
   * @return {external:angular.$q.Promise} A promise that resolves into a
   *                                       {@link DailyOperationalData}
   *                                       instance when successful.
   */
  KN15Parser.prototype.parse = function ( telegram, month, year ) {
    var processedTelegram = telegram.trim().toLowerCase();
    if ( processedTelegram.search( rKN15Encoded ) === -1 ) {
      return this.q_.reject( this.clientErrors_.InvalidKN15TelegramError );
    }

    var telegramTokens = processedTelegram.split( ' ' ).reverse();
    var stationIndex = telegramTokens.pop();
    if ( stationIndex.search( rStationIndex ) === -1 ) {
      stationIndex = telegramTokens.pop();
    }

    // This is the first real asynchronous promise, it attempts to get the
    // site from the backend and if successful then the parsing continues.
    var stationPromise = this.sites_.getReadySiteByCode( stationIndex )
      .then( this.parseOnStationVerified.bind( this, telegramTokens,
        month, year ) );
    return stationPromise;
  };

  /**
   * Asynchronous operation that is called when the site has been verified
   * and triggers the processing of the first section of the telegram.
   *
   * @protected
   * @instance
   * @memberOf KN15Parser
   * @param  {Array.<external:String>} telegramTokens The array of telegram
   *                                                  tokens to process.
   * @param  {Number} month The telegram's month.
   * @param  {Number} year The telegram's year.
   * @param  {Array.<Site>} sites The array with the site retrieved from the
   *                              backend.
   * @return {external:angular.$q.Promise} A promise that resolves into a
   *                                       fully populated
   *                                       {@link DailyOperationalData}
   *                                       instance when successful.
   */
  KN15Parser.prototype.parseOnStationVerified = function ( telegramTokens, month, year, sites ) {
    // Initialize the result data object.
    var resultData = new this.dailyOperationalData_();
    resultData.site = sites[ 0 ];

    // Decode the date
    var zeroGroup = telegramTokens.pop();
    var dayInMonth = parseInt( zeroGroup.slice( 0, 2 ), 10 );
    resultData.mainDate = moment( {
      year: year,
      month: month,
      day: dayInMonth,
      hour: 8,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    } );
    if ( resultData.mainDate.isAfter( moment() ) ) {
      throw 'The telegram date can not be in the future.';
    }

    var sectionOneTokens = [];
    while ( telegramTokens.length &&
      telegramTokens.slice( -1 )[ 0 ].charAt( 0 ) !== '9' ) {
      sectionOneTokens.push( telegramTokens.pop() );
    }
    sectionOneTokens.reverse();
    var sectionOnePromise =
      this.parseSectionOne( sectionOneTokens, resultData )
      .then( this.parseOnSectionOneVerified
        .bind( this, telegramTokens, resultData ) );

    return sectionOnePromise;
  };

  KN15Parser.prototype.parseSectionOne = function ( sectionOneTokens, resultData ) {
    var waterLevelEightToken = sectionOneTokens.pop();
    var waterLevelTrendToken = sectionOneTokens.pop();
    var waterLevelTwentyToken = sectionOneTokens.pop();

    if ( waterLevelEightToken.charAt( 0 ) !== '1' ||
      waterLevelTrendToken.charAt( 0 ) !== '2' ||
      waterLevelTwentyToken.charAt( 0 ) !== '3' ) {
      return this.q_.reject( this.clientErrors_.NotEnoughWaterLevelDataError );
    }
    var waterLevelEightValue =
      parseInt( waterLevelEightToken.slice( 1 ) );
    var waterLevelTwentyValue =
      parseInt( waterLevelTwentyToken.slice( 1 ) );
    var waterLevelTrendValue =
      parseInt( waterLevelTrendToken.slice( 1, 4 ) );
    var waterLevelTrendSign = waterLevelTrendToken.slice( 4 );
    if ( waterLevelEightValue > 5000 ) {
      waterLevelEightValue = -( waterLevelEightValue - 5000 );
    }
    if ( waterLevelTwentyValue > 5000 ) {
      waterLevelTwentyValue = -( waterLevelTwentyValue - 5000 );
    }
    if ( waterLevelTrendSign === '2' ) {
      waterLevelTrendValue = -waterLevelTrendValue;
    }
    resultData.waterLevelEight = waterLevelEightValue;
    resultData.waterLevelTwenty = waterLevelTwentyValue;
    resultData.waterLevelTrend = waterLevelTrendValue;
    var previousDayDataPromise = this.dataValues_.getWaterLevelForSite(
        resultData.mainDate.clone().subtract(1, 'day'), resultData.site.id )
      .then( this.verifyWaterTrend.bind( this, resultData ) );
    return previousDayDataPromise;
  };

  KN15Parser.prototype.verifyWaterTrend = function ( resultData, previousDayData ) {
    if ( previousDayData.length === 0 ) {
      return;
    }
    resultData.previousWaterLevelEight = previousDayData[ 0 ].dataValue;
    var realWaterLevelTrend = resultData.waterLevelEight -
      resultData.previousWaterLevelEight;
    if ( realWaterLevelTrend !== resultData.waterLevelTrend ) {
      return this.q_.reject( this.clientErrors_.InvalidWaterLevelTrendError );
    }
  };

  KN15Parser.prototype.parseOnSectionOneVerified = function ( telegramTokens, resultData ) {
    while ( telegramTokens.length ) {
      var nextSectionToken = telegramTokens.pop();
      var nextSectionTokens = [ nextSectionToken ];

      while ( telegramTokens.length &&
        telegramTokens.slice( -1 )[ 0 ].charAt( 0 ) !== '9' ) {
        nextSectionTokens.push( telegramTokens.pop() );
      }
      nextSectionTokens.reverse();

      if ( nextSectionToken === '93301' ) {
        this.parseSectionThree( nextSectionTokens, resultData );
      } else {
        this.parseSectionSix( nextSectionTokens, resultData );
      }
    }
    return resultData;
  };

  KN15Parser.prototype.parseSectionThree = function ( sectionThreeTokens, resultData ) {
    sectionThreeTokens.pop();
    var waterLevelAverageToken = sectionThreeTokens.pop();
    if ( waterLevelAverageToken.charAt( 0 ) !== '1' ) {
      return;
    }
    var waterLevelAverageValue =
      parseInt( waterLevelAverageToken.slice( 1 ) );
    if ( waterLevelAverageValue > 5000 ) {
      waterLevelAverageValue = -( waterLevelAverageValue - 5000 );
    }
    resultData.averageWaterLevel = waterLevelAverageValue;
  };

  KN15Parser.prototype.parseSectionSix = function ( sectionSixTokens, resultData ) {
    var monthToken = sectionSixTokens.pop();
    var waterLevelToken = sectionSixTokens.pop();
    var waterFlowToken = sectionSixTokens.pop();
    var riverFreeAreaToken = sectionSixTokens.pop();
    var maximumDepthToken = sectionSixTokens.pop();
    var waterFlowDateHourToken = sectionSixTokens.pop();
    if ( waterFlowDateHourToken === undefined ) {
      waterFlowDateHourToken = maximumDepthToken;
      maximumDepthToken = '40000';
    }

    var monthNumber = parseInt( monthToken.slice( 3 ) );
    var waterFlowDay = parseInt( waterFlowDateHourToken.slice( 1, 3 ) );
    var waterFlowHour = parseInt( waterFlowDateHourToken.slice( 3 ) );

    var waterLevelValue = parseInt( waterLevelToken.slice( 1 ) );
    waterLevelValue = waterLevelValue > 5000 ? 5000 - waterLevelValue : waterLevelValue;
    var waterFlowExp = parseInt( waterFlowToken.slice( 1, 2 ) );
    var waterFlowBase = parseInt( waterFlowToken.slice( 2 ) );
    var waterFlowValue = waterFlowBase * Math.pow( 10, waterFlowExp - 3 );

    var riverFreeAreaExp = parseInt( riverFreeAreaToken.slice( 1, 2 ) );
    var riverFreeAreaBase = parseInt( riverFreeAreaToken.slice( 2 ) );
    var riverFreeAreaValue = riverFreeAreaBase *
      Math.pow( 10, riverFreeAreaExp - 3 );

    var maximumDepthValue = parseInt( maximumDepthToken.slice( 1 ) );

    resultData.dischargeDate = moment( {
      year: resultData.mainDate.year(),
      month: monthNumber - 1,
      day: waterFlowDay,
      hour: waterFlowHour,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    } );

    resultData.discharge = waterFlowValue;
    resultData.dischargeWaterLevel = waterLevelValue;
    resultData.dischargeFreeRiverArea = riverFreeAreaValue;
    resultData.dischargeMaximumDepth = maximumDepthValue;
  };

  global.angular.module( 'imomoCaApp' ).service( 'KN15Parser', KN15Parser );

} )( window );
