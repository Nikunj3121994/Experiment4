( function ( global ) {
  'use strict';

  /**
   * Enum for the different stages that occur when uploading discharge data.
   *
   * @inner
   * @memberOf SiteNormCtrl
   * @readOnly
   * @enum {Number}
   */
  var UploadStage = {
    NOT_INITIATED: 'stations.selected.norm.upload.startUpload',
    RETRIEVING_URL: 'stations.selected.norm.upload.retrieving',
    UPLOADING_TO_S3: 'stations.selected.norm.upload.uploading',
    PROCESSING_DATA: 'stations.selected.norm.upload.processing',
    DONE: 'stations.selected.norm.upload.done',
    ERROR: 'stations.selected.norm.upload.error'
  };

  /**
   * Constructor for the controller for the discharge norm section of the
   * sites page. It initializes the required properties and stores the
   * injected dependencies.
   *
   * @class SiteNormCtrl
   * @classdesc The controller allows the upload of historic discharge data to
   *            a S3 bucket and the display of the calculated discharge norms
   *            when available.
   * @param {Sites} Sites API for interacting with the backend sites endpoint.
   * @param {Array.<DischargeNorm>} dischargeNorm
   *        The object with the discharge norm values for the selected site.
   * @param {Array.<DownloadURL>} dischargeDataURL
   * @param {AccessTokens} AccessTokens The injected AccessTokens API.
   * @param {external:ng-file-upload.$upload} $upload
   *        The $upload service from ng-file-upload.
   * @param {external:ui-router.$state} $state
   *        The $state service from ui-router.
   * @param {Array.<Site>} siteInfo The array with the selected site as its
   *                                only element.
   * @param {Function} ServerError Constructor for the {@link ServerError}
   *                               class.
   * @param {Localization} Localization The injected localization service.
   */
  function SiteNormCtrl( Sites, dischargeNorm, dischargeDataURL,
    AccessTokens, $upload, $state, siteInfo, ServerError, Localization ) {
    /**
     * Internal reference to the Sites API.
     *
     * @name SiteNormCtrl#sitesApi
     * @type {Sites}
     * @protected
     */
    this.sitesApi = Sites;
    /**
     * The discharge norm for the selected site.
     *
     * @name SiteNormCtrl#dischargeNorm
     * @type {DischargeNorm}
     * @public
     */
    this.dischargeNorm = dischargeNorm[0];
    /**
     * The URL for the discharge data for the site.
     *
     * @name SiteNormCtrl#dischargeDataURL
     * @type {DischargeURL}
     * @public
     */
    this.dischargeDataURL = dischargeDataURL[0];

    /**
     * The file selected for upload.
     *
     * @name SiteNormCtrl#selectedFile
     * @type {File}
     * @protected
     * @default null
     */
    this.selectedFile = null;
    /**
     * Internal reference to the AccessTokens API.
     *
     * @name SiteNormCtrl#accessTokensApi
     * @type {AccessTokens}
     * @protected
     */
    this.accessTokensApi = AccessTokens;
    /**
     * Internal reference to the $upload service.
     *
     * @name SiteNormCtrl#uploadSvc
     * @type {external:ng-file-upload.$upload}
     * @protected
     */
    this.uploadSvc = $upload;
    /**
     * Internal reference to the $state service.
     *
     * @name SiteNormCtrl#stateSvc
     * @type {external:ui-router.$state}
     * @protected
     */
    this.stateSvc = $state;
    /**
     * The selected site.
     *
     * @name SiteNormCtrl#selectedSite
     * @type {Site}
     * @protected
     */
    this.selectedSite = siteInfo[ 0 ];
    /**
     * The list of the names of the month, localized.
     *
     * @name SiteNormCtrl#monthNames
     * @type {Array.<external:String>}
     * @public
     */
    this.monthNames = moment.monthsShort();
    /**
     * Container for any error that may occur when uploading discharge data.
     *
     * @name SiteNormCtrl#error
     * @type {ServerError}
     * @public
     * @default null
     */
    this.error = null;
    /**
     * Internal reference to the {@link ServerError} constructor.
     *
     * @name SiteNormCtrl#serverErrorFactory
     * @type {Function}
     * @protected
     */
    this.serverErrorFactory = ServerError;
    /**
     * The stages for the upload of data.
     *
     * @name SiteNormCtrl#uploadStage
     * @type {SiteNormCtrl~UploadStage}
     * @protected
     * @default UploadStage.NOT_INITIATED
     */
    this.uploadStage = UploadStage.NOT_INITIATED;
    /**
     * Internal reference to the localization service.
     *
     * @name SiteNormCtrl#localizationSvc
     * @type {Localization}
     * @protected
     */
    this.localizationSvc = Localization;
    /**
     * The message to display next to the upload options.
     *
     * @name SiteNormCtrl#progressMsg
     * @type {external:String}
     * @public
     * @default null
     */
    this.progressMsg = this.localizationSvc.localize( this.uploadStage );
  }

  /**
   * Handles the selection of a file, this stores the selected file in the
   * controller.
   *
   * @public
   * @instance
   * @memberOf SiteNormCtrl
   * @param  {Array.<File>} $files Array with a single file to upload.
   */
  SiteNormCtrl.prototype.filesSelected = function ( $files ) {
    var file = $files[ 0 ];
    this.selectedFile = file;
  };

  /**
   * Handles the upload of a file.
   *
   * The upload has 3 steps, handled in asynchronous fashion:
   *
   * 1. Retrieving the AWS form data from the application server.
   * 2. Uploading the file to the AWS URL.
   * 3. Sending the AWS key to the application for processing of the file.
   *
   * It is expected that this is only called when uploadDisabled returns false.
   *
   * @public
   * @instance
   * @memberOf SiteNormCtrl
   */
  SiteNormCtrl.prototype.uploadFile = function () {
    this.retrieveFormData();
  };

  /**
   * Initiator for the first step in the process of a file upload.
   *
   * Requests the form data for the AWS upload.
   *
   * @protected
   * @instance
   * @memberOf SiteNormCtrl
   */
  SiteNormCtrl.prototype.retrieveFormData = function () {
    this.uploadStage = UploadStage.RETRIEVING_URL;
    this.progressMsg = this.localizationSvc.localize( this.uploadStage );
    this.accessTokensApi.getAwsFormData()
      .then( this.onDataRetrieved.bind( this ) )
      .catch( this.onFileUploadError.bind( this ) );
  };

  /**
   * Handles the retrieved form data and initiates the file upload to S3.
   *
   * @protected
   * @instance
   * @memberOf SiteNormCtrl
   * @param {Array.<AWSFormData>} formData The object containing the signed
   *                                       form data.
   */
  SiteNormCtrl.prototype.onDataRetrieved = function ( formData ) {
    var singleFormData = formData[ 0 ];
    this.uploadToS3( singleFormData );
  };

  /**
   * Initiates the upload of the selected file to S3.
   *
   * @protected
   * @instance
   * @memberOf SiteNormCtrl
   * @param {AWSFormData} formData The object containing the form data.
   */
  SiteNormCtrl.prototype.uploadToS3 = function ( formData ) {
    this.uploadStage = UploadStage.UPLOADING_TO_S3;
    this.progressMsg = this.localizationSvc.localize( this.uploadStage );
    formData.fields.key = formData.fields.key + '/' + this.selectedFile.name;
    this.uploadSvc.upload( {
        url: formData.action,
        fields: formData.fields,
        file: this.selectedFile,
        method: 'POST'
      } )
      .success( this.onS3Upload.bind( this ) )
      .error( this.onS3UploadError.bind( this ) );
  };

  /**
   * After uploading the file to S3, sends the key to the application
   * server for processing.
   *
   * @protected
   * @instance
   * @memberOf SiteNormCtrl
   */
  SiteNormCtrl.prototype.onS3Upload = function () {
    this.uploadStage = UploadStage.PROCESSING_DATA;
    this.progressMsg = this.localizationSvc.localize( this.uploadStage );
    this.sitesApi.storeSiteDischargeData(
        this.selectedSite.id, this.selectedFile.name )
      .then( this.onDataProcessed.bind( this ) )
      .catch( this.onDataProcessingError.bind( this ) );
  };

  /**
   * After the data is processed, reload the page to trigger the load of the
   * discharge norm.
   *
   * @protected
   * @instance
   * @memberOf SiteNormCtrl
   */
  SiteNormCtrl.prototype.onDataProcessed = function () {
    this.uploadStage = UploadStage.DONE;
    this.progressMsg = this.localizationSvc.localize( this.uploadStage );
    this.stateSvc.reload();
  };

  /**
   * Handles errors while processing the discharge data.
   *
   * @protected
   * @instance
   * @memberOf SiteNormCtrl
   * @param {ServerError} err The error that occurred on the server.
   */
  SiteNormCtrl.prototype.onDataProcessingError = function ( err ) {
    this.uploadStage = UploadStage.ERROR;
    this.progressMsg = this.localizationSvc.localize( this.uploadStage );
    this.error = err;
  };

  /**
   * Handles S3 upload errors.
   *
   * @protected
   * @instance
   * @memberOf SiteNormCtrl
   * @param {Object} err The error from the S3 upload.
   */
  SiteNormCtrl.prototype.onS3UploadError = function ( err ) {
    this.uploadStage = UploadStage.ERROR;
    this.progressMsg = this.localizationSvc.localize( this.uploadStage );
    this.error = new this.serverErrorFactory( {
      errorCode: 22000,
      details: err.data
    } );
  };

  /**
   * Handles errors occurred while retrieving the form data from the server.
   *
   * @protected
   * @instance
   * @memberOf SiteNormCtrl
   * @param {ServerError} err A server error with details on what happened.
   */
  SiteNormCtrl.prototype.onFileUploadError = function ( err ) {
    this.uploadStage = UploadStage.ERROR;
    this.progressMsg = this.localizationSvc.localize( this.uploadStage );
    this.error = err;
  };

  /**
   * Indicates to the view whether the upload button is disabled or not.
   *
   * The button is disabled if any of the following conditions is met:
   *
   * * There is no selected file.
   * * The upload is in any state different from not initiated.
   *
   * @public
   * @instance
   * @memberOf SiteNormCtrl
   * @return {Boolean} true if the upload button should be disabled, false
   *                   otherwise.
   */
  SiteNormCtrl.prototype.uploadDisabled = function () {
    return !this.selectedFile ||
      this.uploadStage !== UploadStage.NOT_INITIATED;
  };

  /**
   * Close the error alert by invalidating the error object.
   *
   * @public
   * @instance
   * @memberOf SiteNormCtrl
   */
  SiteNormCtrl.prototype.closeErrorAlert = function () {
    this.uploadStage = UploadStage.NOT_INITIATED;
    this.progressMsg = this.localizationSvc.localize( this.uploadStage );
    this.error = null;
  };

  /**
   * Array of injectable dependencies to the controller.
   *
   * @protected
   * @static
   * @memberOf SiteNormCtrl
   * @type {Array.<external:String>}
   */
  SiteNormCtrl.$inject = [ 'Sites', 'dischargeNorm', 'dischargeDataURL',
    'AccessTokens', '$upload', '$state', 'siteInfo', 'ServerError',
    'Localization'
  ];

  global.angular.module( 'imomoCaApp' )
    .controller( 'SiteNormCtrl', SiteNormCtrl );

} )( window );
