(function(global) {
  'use strict';

  /**
   * Constructor for the localization service.
   *
   * @class Localization
   * @classdesc The localization service provides a mapping from variables to
   *            localized user strings that can be safely presented to users
   *            in the views.
   * @param {external:angular.$http} $http The AngularJS $http service.
   * @param {external:angular.$parse} $parse The AngularJS $parse service.
   * @param {external:String} locale String that indicates the current locale.
   */
  function Localization($http, $parse, locale) {
    /**
     * Internal reference to the $http service.
     *
     * @name Localization#_http
     * @type {external:angular.$http}
     * @protected
     */
    this._http = $http;
    /**
     * Internal reference to the $parse service.
     *
     * @name Localization#_parse
     * @type {external:angular.$parse}
     * @protected
     */
    this._parse = $parse;
    /**
     * Current locale.
     *
     * @name Localization#_locale
     * @type {external:String}
     * @protected
     */
    this._locale = locale;

    /**
     * The loaded language data.
     *
     * @name Localization#_languageDefinitions
     * @type {Object}
     * @protected
     * @default null
     */
    this.languageDefinitions = null;

    /**
     * Promise that resolves to the locale data.
     *
     * @name Localization#loadFilePromise
     * @type {external:angular.$q.Promise}
     * @protected
     * @default null
     */
    this.loadFilePromise = null;
  }

  /**
   * Array of injectable dependencies for the service.
   *
   * @protected
   * @static
   * @memberOf Users
   * @type {Array.<external:String>}
   */
  Localization.$inject = ['$http', '$parse', 'locale'];

  /**
   * Load the language file, if not loaded already.
   *
   * If there is no loading operation present and the locale object is not
   * populated, then this method starts an asynchronous request for the YAML
   * file with the localized strings. The corresponding promise is stored
   * in {@link Localization#loadFilePromise}.
   *
   * @instance
   * @memberOf Localization
   */
  function loadLanguageFile() {
    if (!this.languageDefinitions && !this.loadFilePromise) {
      this.loadFilePromise = this._http({
        url: 'locales/' + this._locale + '.yaml'
      }).then(this.parseLanguageFile.bind(this))
        .catch(this.languageFileError.bind(this));
    }
  }

  Localization.prototype.loadLanguageFile = loadLanguageFile;

  /**
   * Parse the loaded YAML file and store the corresponding object in the
   * service.
   *
   * @instance
   * @memberOf Localization
   * @param  {Object} httpData The returned HTTP data.
   */
  function parseLanguageFile(httpData) {
    this.languageDefinitions = jsyaml.load(httpData.data);
  }

  Localization.prototype.parseLanguageFile = parseLanguageFile;

  /**
   * Function called in case of error while loading the locale file.
   *
   * This is a non-recoverable error, if the file is not loaded then the
   * web application can't continue and support should be sought.
   *
   * @instance
   * @memberOf Localization
   */
  function languageFileError() {
    window.console.log('ERROR!');
    //TODO: Properly log error.
  }

  Localization.prototype.languageFileError = languageFileError;

  Localization.prototype.localizePromise = function(isError) {
    this.loadLanguageFile();
    var promise = this.loadFilePromise.then(
      function whenReady() {
        if (!isError) {
          return this.localize.bind(this);
        } else {
          return this.localizeError.bind(this);
        }
      }.bind(this));
    return promise;
  };

  /**
   * The main localize function for generic strings, this does not localize
   * error codes.
   *
   * @instance
   * @memberOf Localization
   * @param  {external:String} path The path to the string in the locale
   *                                object, e.g. discharge.title.
   * @return {external:String} The localized string, if it exists.
   */
  function localize(path) {
    var absPath = 'languageDefinitions.' + path;
    var getter = this._parse(absPath);
    return getter(this);
  }

  Localization.prototype.localize = localize;

  /**
   * Localize function for error codes, works both for client and server
   * errors.
   *
   * @instance
   * @memberOf Localization
   * @param  {external:String} errorCode The error code to localize.
   * @return {external:String} The localized string, if it exists.
   */
  function localizeError(errorCode) {
    var absPath = 'languageDefinitions.errors.code' + errorCode;
    var getter = this._parse(absPath);
    return getter(this);
  }

  Localization.prototype.localizeError = localizeError;

  function localizeDate(dateObject) {
    var momentObject = moment.isMoment(dateObject) ? dateObject : moment(dateObject);
    if (momentObject.isValid()) {
      return momentObject.format('L');
    } else {
      return 'Not a valid date!';
    }
  }

  Localization.prototype.localizeDate = localizeDate;

  Localization.prototype.localizeDateTime = function(dateObject) {
    var momentObject = moment.isMoment(dateObject) ? dateObject : moment(dateObject);
    if (momentObject.isValid()) {
      return momentObject.format('L LT');
    } else {
      return 'Not a valid date!';
    }
  };

  Localization.prototype.localizeMonth = function(dateObject) {
    var momentObject = moment.isMoment(dateObject) ? dateObject : moment(dateObject);
    if (momentObject.isValid() && momentObject.locale() === 'en') {
      return momentObject.format('MM/YYYY');
    } else if (momentObject.isValid() && momentObject.locale() === 'ru') {
      return momentObject.format('MM.YYYY');
    }
  };

  Localization.prototype.getDateFormat = function() {
    switch (moment.locale()) {
      case 'ru':
        return 'dd.MM.yyyy';
      /* falls through */
      case 'en':
      /* falls through */
      default:
        return 'MM/dd/yyyy';
    }
  };

  Localization.prototype.getMonthFormat = function() {
    switch (moment.locale()) {
      case 'ru':
        return 'MM.yyyy';
        /* falls through */
      case 'en':
        /* falls through */
      default:
        return 'MM/yyyy';
    }
  };

  global.angular.module('imomoCaApp')
    .service('Localization', Localization);

})(window);
