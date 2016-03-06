( function ( global ) {
  'use strict';

  var CalculatedDischargeCtrl = function ( DataInputStorage, Localization, DataValues, $state, $timeout ) {
    this.localizeDate = Localization.localizeDate.bind( Localization );
    this.dataValues_ = DataValues;
    this.state_ = $state;
    this.timeout_ = $timeout;

    this.dischargeModel = DataInputStorage.dischargeModel;
    this.dailyData = DataInputStorage.dailyInputData;
    this.calculateDischarge();

    this.storing = false;
    this.redirecting = false;
    this.dataStoreError = false;
  };

  CalculatedDischargeCtrl.$inject = [ 'DataInputStorage', 'Localization',
    'DataValues', '$state', '$timeout'
  ];

  CalculatedDischargeCtrl.prototype.calculateDischarge = function () {
    this.dailyData.calculatedDischargeTwenty =
      this.dischargeModel.getWaterFlow( this.dailyData.waterLevelTwenty );
    this.dailyData.calculatedAverageDischarge =
      this.dischargeModel.getWaterFlow( this.dailyData.averageWaterLevel );
    this.dailyData.calculatedDischargeEight =
      this.dischargeModel.getWaterFlow( this.dailyData.waterLevelEight );
  };

  CalculatedDischargeCtrl.prototype.storeDailyData = function () {
    this.storing = true;
    this.dataValues_.submitDailyOperationalData( this.dischargeModel, this.dailyData )
      .then( this.dataStored.bind( this ) )
      .catch( this.onDataStoreError.bind( this ) );
  };

  CalculatedDischargeCtrl.prototype.dataStored = function () {
    this.storing = false;
    this.redirecting = true;
    this.timeout_( function () {
      this.state_.go( 'root.tools.operationalData.input', null, {
        reload: true
      } );
    }.bind( this ), 3000 );
  };

  CalculatedDischargeCtrl.prototype.onDataStoreError = function () {
    this.dataStoreError = true;
    this.storing = false;
  };

  CalculatedDischargeCtrl.prototype.closeErrorAlert = function () {
    this.dataStoreError = false;
  };

  global.angular.module( 'imomoCaApp' )
    .controller( 'CalculatedDischargeCtrl', CalculatedDischargeCtrl );

} )( window );
