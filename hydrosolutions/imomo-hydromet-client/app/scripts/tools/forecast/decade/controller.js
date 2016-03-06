( function ( global ) {
  'use strict';

  function DecadeCtrl( sites, Forecast ) {
    this.allSites = sites;
    this.selectedSite = null;
    this.selectedSites = [];
    this.forecastPromise = null;
    this.forecastService = Forecast;
    this.indexedSites = {};
    this.allSites.forEach(function(site) {
      this.indexedSites[site.id] = site;
    }, this);
  }

  function siteSelected() {
    if( this.selectedSite !== null &&
        this.selectedSites.indexOf(this.selectedSite) === -1 ){
      this.selectedSites.push(this.selectedSite);
    }
    this.selectedSite = null;
  }
  DecadeCtrl.prototype.siteSelected = siteSelected;

  function unselectSite($event, site) {
    $event.preventDefault();
    if( !this.inputDisabled() ){
      this.selectedSites.splice(this.selectedSites.indexOf(site), 1);
    }
  }
  DecadeCtrl.prototype.unselectSite = unselectSite;

  function inputDisabled() {
    return !!this.forecastPromise;
  }
  DecadeCtrl.prototype.inputDisabled = inputDisabled;

  function getForecastDisabled() {
    return !this.selectedSites.length || !!this.forecastPromise;
  }
  DecadeCtrl.prototype.getForecastDisabled = getForecastDisabled;

  function getForecast($event) {
    $event.preventDefault();
    this.forecastDataArray = [];
    var siteIds = this.selectedSites.map(function(site){
      return site.id;
    });
    this.forecastPromise = this.forecastService.getDecadeForecast(
      siteIds, this.month, this.decade);
    this.forecastPromise.then(this.onForecastRetrieved.bind(this),
      this.onForecastError.bind(this));
  }
  DecadeCtrl.prototype.getForecast = getForecast;

  function onForecastRetrieved(forecastDataArray){
    this.forecastDataArray = forecastDataArray;
    this.forecastPromise = null;
  }
  DecadeCtrl.prototype.onForecastRetrieved = onForecastRetrieved;

  function onForecastError(serverError) {
    this.forecastError = serverError;
    this.forecastPromise = null;
  }
  DecadeCtrl.prototype.onForecastError = onForecastError;

  function dataReady() {
    return this.forecastDataArray && this.forecastDataArray.length;
  }
  DecadeCtrl.prototype.dataReady = dataReady;

  function dataError() {
    return this.forecastError;
  }
  DecadeCtrl.prototype.dataError = dataError;

  function closeErrorAlert() {
    this.forecastError = null;
  }
  DecadeCtrl.prototype.closeErrorAlert = closeErrorAlert;

  DecadeCtrl.$inject = ['sites', 'Forecast'];

  global.angular.module( 'imomoCaApp' )
    .controller( 'DecadeCtrl', DecadeCtrl );

} )( window );
