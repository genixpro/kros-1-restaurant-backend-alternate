'use strict'

/**
 * @class angular_module.newsApp.BackupRestoreCtrl
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs controller.
 * It allows the user to manipulate with their entries in the database
 *
 */
angular.module('newsApp')
    .controller('BackupRestoreCtrl', ['$scope', 'DB', '$timeout', 'modalRestoreDB', 'toastr',
      /**
       * @function BackupRestoreCtrl
       *
       * @param - It is the same as defined in the inject dependencies
       * @param $scope - angularjs $scope
       * @param DB - This is an angularjs service - angular_module.newsApp.DB.
       * @param $timeout - angularjs $timeout
       * @param modalRestoreDB - this is an angularjs service - angular_module.newsApp.modalRestoreDB.
       */
      function($scope, DB, $timeout, modalRestoreDB, toastr) {
        /**
         * @this - all the properties of this object will be used in templates with the prefix 'backupRestore'
         * (described in angular_module.newsApp.config.$stateProvider  property: controllerAs)
         * @example this.paginator - in the template should be used as a - backupRestore.paginator
         *
         */
        var self = this;

        /**
         * functions and variables used in the controller
         */
        self.onBackup = onBackup;
        self.onRestore = onRestore;
        self.stringToObj = stringToObj;
        self.dataForDisplay = dataForDisplay;
        self.onUploadJson = onUploadJson;
        self.clearBackupData = clearBackupData;
        self.clearRestoreData = clearRestoreData;

        self.backupData = [];
        self.backupDataForSaving = {};

        self.uploadFile = [];
        self.restoreData = [];
        self.uploadedDataForRestore = {};
        self.string = '';

        self.ui = {};
        self.ui.progress = 0;
        self.ui.inProgress = false;
        self.progressStart = progressStart;
        self.progressEnd = progressEnd;
        /**
         * end enumeration functions and variables used in the controller
         */

        /**
         *  @function onBackup
         *  @description
         *  called after clicking on button 'Backup'
         *  It is requesting from the database all the records of the current user and sends them to the processing
         */
        function onBackup(){
          self.clearBackupData();
          self.clearRestoreData();
          self.progressStart();

          DB.query().$promise.then(
              function(response) {
                self.backupDataForSaving = response.data;
                self.dataForDisplay(self.backupData, response.data)
              },
              function(error){
                if(error.status == 403) {
                  toastr.warning('You do not have permission')
                }
                self.progressEnd();
              })
        }

        /**
         *  @function onRestore
         *  @description
         *  called after clicking on button 'Restore'
         *  It is restore the database from the downloaded data
         */
        function onRestore(){
          self.progressStart();

          modalRestoreDB.open(function() {
            DB.restore(self.uploadedDataForRestore).$promise.then(
              function(response) {
                console.log('====', response);
                self.uploadedDataForRestore = {};
                self.clearRestoreData();
              },
              function(error){
                if(error.status == 403) {
                  toastr.warning('You do not have permission')
                }
                self.progressEnd();
              })
          }, function(){
            self.progressEnd();
          })
        }

        /**
         *  @function dataForDisplay
         *  @description
         *  It converts the object data{key: value} into an array of the form [{name: key, records: value.length}, ...]
         *
         *  @param {Array} _array - a reference to array in which we store the data in the form that will be displayed to the user
         *  @param {Object} data - data from the database where the key is the name of the scheme, and the value - array of records
         */
        function dataForDisplay(_array, data){
          _.forIn(data, function(value, key){
            _array.push({name: key, records: value.length})
          });
          self.progressEnd();
        }

        /**
         *  @function onUploadJson
         *  @description
         *  It handles the download JSON file
         *
         *  @param {FileList} files - a reference to array in which we store the data in the form that will be displayed to the user
         */
        function onUploadJson(files){
          self.clearRestoreData();
          self.clearBackupData();

          if(files) self.uploadFile = files;
          else files = self.uploadFile;

          self.progressStart();
          var reader=new FileReader();
          reader.onload=function(e){
            self.string=reader.result;
            self.uploadedDataForRestore = self.stringToObj(self.string);
            $timeout(function(){
              self.dataForDisplay(self.restoreData, self.uploadedDataForRestore)
            }, 0);
          };
          if(files.length){
            reader.readAsText(files[0]);
          }else{
            self.progressEnd();
          }
        }

        /**
         *  @function stringToObj
         *  @description
         *  It converts the string in JSON format
         *
         *  @param {String} string - the string you want to convert
         *  @return {Object} object converted from a string
         */
        function stringToObj(string){
          return angular.fromJson(string);
        }

        /**
         *  @function clearBackupData
         *  @description
         *  It clear backup data
         *
         */
        function clearBackupData(){
          self.backupData = [];
          self.progressEnd();
        }

        /**
         *  @function clearRestoreData
         *  @description
         *  It clear restore data
         *
         */
        function clearRestoreData(){
          self.restoreData = [];
          self.progressEnd();
        }

        /**
         *  @function progressStart
         *  @description launches a loader
         */
        function progressStart() {
          self.ui.inProgress = true;
        }

        /**
         *  @function progressEnd
         *  @description stops the loader
         */
        function progressEnd() {
          self.ui.inProgress = false;
        }

      }
    ]);
