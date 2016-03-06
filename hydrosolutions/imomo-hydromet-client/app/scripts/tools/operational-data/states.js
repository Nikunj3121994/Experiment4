( function ( global ) {
  'use strict';

  var availableOptions = [ {
    localizedNamePath: 'tools.operationalData.sidebar.dataInput',
    state: 'root.tools.operationalData.input',
    octicon: 'octicon-keyboard'
  }, {
    localizedNamePath: 'tools.operationalData.sidebar.journal',
    state: 'root.tools.operationalData.journal',
    octicon: 'octicon-book'
  }, {
    localizedNamePath: 'tools.operationalData.sidebar.bulletin',
    state: 'root.tools.operationalData.bulletin',
    octicon: 'octicon-file-text'
  }, {
    localizedNamePath: 'tools.operationalData.sidebar.backToTools',
    state: 'root.tools.home',
    octicon: 'octicon-jump-left'
  } ];

  /**
   * Abstract state for the operational data tool.
   * It defines the sidebar template and controller, it also provides
   * a ui-view to locate the different options in the tool.
   * @type {Object}
   */
  var operationalDataTool = {
    name: 'root.tools.operationalData',
    parent: 'root.tools',
    url: '/operational-data',
    views: {
      sidebar: {
        templateUrl: 'views/tools/operational-data/sidebar.html',
        controller: 'SidebarOptsCtrl as sidebarOptsCtrl'
      },
      main: {
        templateUrl: 'views/tools/operational-data/about.html'
      }
    },
    data: {
      options: availableOptions
    }
  };

  /**
   * Start state for the operational data input option.
   * This provides two parallel views for children states, dataDisplay and
   * dischargeCurve.
   * @type {Object}
   */
  var dataInput = {
    name: 'root.tools.operationalData.input',
    parent: operationalDataTool,
    url: '/input',
    templateUrl: 'views/tools/operational-data/data-input/input.html',
    controller: 'DataInputCtrl as inputCtrl'
  };

  /**
   * Second state of the operational data input option.
   * This state is reached after the KN15 telegram has been parsed or the
   * plain data input has been verified. It populates the two views of the
   * parent with the following data:
   * -dataDisplay:    Displays a table with the decoded data.
   * -dischargeCurve: It loads the discharge curve template and controller in
   *                  order to display and manipulate the discharge models and
   *                  measurements.
   * The resolves load the discharge data and models for the hydrological year
   * for the given station.
   * @type {Object}
   */
  var processedInput = {
    name: 'root.tools.operationalData.input.processed',
    parent: dataInput,
    data: {},
    views: {
      dataDisplay: {
        templateUrl: 'views/tools/operational-data/data-input/processed-input.html',
        controller: 'ProcessedInputCtrl as processedInputCtrl'
      },
      dischargeCurve: {
        templateUrl: 'views/tools/operational-data/data-input/discharge-control.html',
        controller: 'DischargeTelegramCtrl as dischargeTelegramCtrl',
        resolve: {
          storageService: 'DataInputStorage',
          dischargeModels: [ 'DischargeModels', 'DataInputStorage',
            function ( DischargeModels, DataInputStorage ) {
              return DischargeModels.getCurrentYearModelsForSite( DataInputStorage.dailyInputData.site.id );
            }
          ],
          dischargeData: [ 'DataValues', 'DataInputStorage',
            function ( DataValues, DataInputStorage ) {
              return DataValues.getCurrentYearDischargeDataForSite(
                DataInputStorage.dailyInputData.site.id );
            }
          ]
        }
      }
    }
  };

  /**
   * Third and last state of the operational data input option.
   * This state is reached after the user has reviewed/modified the discharge
   * models and decoded measurements and has selected one for the discharge
   * calculation.
   * @type {Object}
   */
  var calculatedDischarge = {
    name: 'root.tools.operationalData.input.processed.dischargeCalculated',
    parent: processedInput,
    templateUrl: 'views/tools/operational-data/data-input/calculated-discharge.html',
    controller: 'CalculatedDischargeCtrl as calculatedDischargeCtrl'
  };

  /**
   * Defines the state to return to if the user wishes to modify the data
   * during the discharge calculation.
   * @type {string}
   */
  processedInput.data.previousState = dataInput.name;

  /**
   * Defines the state to transition to after the user selects a discharge
   * model.
   * @type {string}
   */
  processedInput.data.nextState = calculatedDischarge.name;


  /**
   * State for the operational data journal option.
   * @type {Object}
   */
  var journal = {
    name: 'root.tools.operationalData.journal',
    parent: operationalDataTool,
    url: '/journal',
    templateUrl: 'views/tools/operational-data/journal.html',
    controller: 'JournalCtrl as journalCtrl',
    resolve: {
      sites: [ 'Sites',
        function ( Sites ) {
          return Sites.getSites();
        }
      ]
    }
  };

  /**
   * State for the operational bulletin production option.
   * @type {Object}
   */
  var bulletin = {
    name: 'root.tools.operationalData.bulletin',
    parent: operationalDataTool,
    url: '/bulletin',
    templateUrl: 'views/tools/operational-data/bulletin.html',
    controller: 'BulletinCtrl as bulletinCtrl',
    resolve: {
      sites: [ 'Sites',
        function ( Sites ) {
          return Sites.getSites();
        }
      ]
    }
  };


  // Register the states in the $stateProvider
  global.angular.module( 'imomoCaApp' ).config( [ '$stateProvider',
    function ( $stateProvider ) {
      $stateProvider.state( operationalDataTool );
      $stateProvider.state( dataInput );
      $stateProvider.state( processedInput );
      $stateProvider.state( calculatedDischarge );
      $stateProvider.state( journal );
      $stateProvider.state( bulletin );
    }
  ] );

} )( window );
