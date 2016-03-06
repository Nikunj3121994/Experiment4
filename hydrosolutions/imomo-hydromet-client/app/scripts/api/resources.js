( function ( global ) {
  'use strict';

  var resources = function ( DischargeModel, User, AccessToken, Source, Site,
    DataValue, AWSSignedUrl, AWSFormData, DischargeMeasurementPair,
    JournalData, Bulletin, DischargeNorm, DownloadURL, ForecastData ) {
    return {
      DischargeModel: DischargeModel.fromServerObject,
      User: User.fromServerObject,
      AccessToken: AccessToken.fromServerObject,
      Source: Source.fromServerObject,
      Site: Site.fromServerObject,
      DataValue: DataValue.fromServerObject,
      AWSSignedUrl: AWSSignedUrl.fromServerObject,
      AWSFormData: AWSFormData.fromServerObject,
      DischargeMeasurementPair: DischargeMeasurementPair.fromServerObject,
      JournalData: JournalData.fromServerObject,
      Bulletin: Bulletin.fromServerObject,
      DischargeNorm: DischargeNorm.fromServerObject,
      DownloadURL: DownloadURL.fromServerObject,
      ForecastData: ForecastData.fromServerObject
    };
  };

  resources.$inject = [ 'DischargeModel', 'User', 'AccessToken',
    'Source', 'Site', 'DataValue', 'AWSSignedUrl', 'AWSFormData',
    'DischargeMeasurementPair', 'JournalData', 'Bulletin',
    'DischargeNorm', 'DownloadURL', 'ForecastData'
  ];

  global.angular.module( 'imomoCaApp' ).service( 'resources', resources );

} )( window );
