'use strict'

/**
 * @class angular_module.newsApp.UploadCsvCtrl
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs controller.
 * It loads posters from CSV file
 *
 */
angular.module('newsApp')
    .controller('UploadCsvCtrl', ['$scope', 'Posters', '$filter', '$timeout', 'paginator', 'CheckStruct', 'toastr', 'Modal',
      /**
       * @function UploadCsvCtrl
       *
       * @description all @params should be comply Injection Dependency
       *
       * @param $scope - angularjs $scope
       * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
       * @param $filter - angularjs filter
       * @param $timeout - angularjs $timeout
       * @param paginator - This is an angularjs service - angular_module.newsApp.paginator.
       * @param CheckStruct - This is an angularjs service - angular_module.newsApp.checkStruct.
       *
       */
      function($scope, Posters, $filter, $timeout, paginator, CheckStruct, toastr, Modal) {
        /**
         * @this - all the properties of this object will be used in templates with the prefix 'exportCsv'
         * (described in angular_module.newsApp.config.$stateProvider  property: controllerAs)
         * @example this.csvFile - in the template should be used as a - uploadCsv.csvFile
         *
         */
        var self = this;
        /**
         * functions and variables used in the controller
         */
        self.csvFile = csvFile;
        self.updateObject = updateObject;
        self.groupPosters = groupPosters;
        self.unionPosters = unionPosters;
        self.onSave = onSave;
        self.filterPosters = filterPosters;
        self.getParsData = getParsData;

        self.string = '';
        self.checkbox = 'YES';
        self.delimiter = [',', ';', '|', '^'];
        self.currentDelimiter = self.delimiter[0];
        self.uploadedPosters = [];
        self.structureNotMatch=false;


        self.ui = {};
        self.ui.progress = 0;
        self.ui.inProgress = false;
        self.progressStart = progressStart;
        self.progressEnd = progressEnd;
        self.changeDelimiter = changeDelimiter;
        self.previousPage = previousPage;
        self.nextPage = nextPage;
        self.setPager = setPager;
        self.uploadedAllData = [];
        self.encoding = ['utf-8', 'macintosh'];
        self.currentEncoding = self.encoding[0];
        self.uploadFile = [];
        self.customPresentationType = [
          'MCC',
          'Electronic Poster',
          'Poster Discussion'
        ];
        self.onChangePresentationType = onChangePresentationType;

        // pagination
        self.firstPage = 1; // get the 1st page
        self.paginator = paginator;
        /**
         * end enumeration functions and variables used in the controller
         */

        /**
         * @function activate
         * It runs all the functions that need to be running when the controller is initialized
         */
        activate();
        function activate(){
          self.setPager(self.firstPage);
        }

        /**
         *  @function csvFile
         *  @description
         *  It handles the download CSV file
         *
         *  @param {FileList} files - downloadable file
         */
        function csvFile(files){

          if(files) self.uploadFile = files;
          else files = self.uploadFile;

          self.progressStart();
          var reader=new FileReader();
          reader.onload=function(e){
            self.string=reader.result;
            self.filterPosters();
          };
          if(files.length){
            reader.readAsText(files[0], self.currentEncoding);
          }else{
            self.uploadedPosters = [];
            self.progressEnd();
          }
        }

        /**
         *  @function filterPosters
         *  @description
         *  It check the structure of the downloaded file, and if the structure is valid passes through the filter converting the CSV file into an object
         *
         */
        function filterPosters(){
            if(!CheckStruct.check(self.string,self.currentDelimiter)){
              $timeout(function() {
                self.structureNotMatch=true;
                self.uploadedPosters = [];
                self.progressEnd();
              }, 0);

            }else{
              self.structureNotMatch=false;
              var obj=$filter('csvToObj')(self.string, self.currentDelimiter);
                //do what you want with obj !
                self.updateObject(obj);
            }
        }

        /**
         *  @function updateObject
         *  @description data processing
         *
         *  @param {Array} obj - downloaded data -an array of objects
         */
        function updateObject(obj){

          self.uploadedAllData = self.groupPosters(obj);
          self.getParsData(self.firstPage);

        }

        /**
         *  @function groupPosters
         *  @description groups the data by the field 'Code' and each group sends them to the union in the required format
         *
         *  @param {Array} obj - downloaded data - an array of objects
         *  @return {Array} union_obj - returns the data (are grouped and the combined) is ready to record in a database
         */
        function groupPosters(obj){
          var group_obj = _.groupBy(obj, 'Code')
              , union_obj = [];

          _.each(group_obj, function(el){
            union_obj.push(self.unionPosters(el))
          });
          return union_obj;
        }

        /**
         *  @function unionPosters
         *  @description It union the grouped records, by common fields
         *
         *  @param {Array} el - downloaded data - an array of objects
         *  @return {Array} union_obj - returns the data (are grouped and the combined) is ready to record in a database
         */
        function unionPosters(el){
          var _union = {};

          _.each(el, function(item){
            _union.code = item['Code'];
            _union.title = item['Abstract Title'];
            _union.presentationType = self.selectedPresentationType;
            item.author = {
              firstName: item['Author FirstName'],
              lastName: item['Author LastName'],
              institution: item['Author Affiliation'],
              email: item['Author Email']
            };

            if(item['Author FirstName'] == item['Corresponding Author FirstName'] &&
                item['Author LastName'] == item['Corresponding Author LastName']&&item['Author FirstName']!=''){
              item.author.isCorresponding = true;
            }
            if(item['Author FirstName'] == item['Presenter FirstName'] &&
                item['Author LastName'] == item['Presenter LastName']&&item['Author FirstName']!=''){
              item.author.isPresenter = true;
            }

            if(!_union.authors) _union.authors = [];
            _union.authors.push(item.author);

          });
          return _union;
        }

        /**
         *  @function onSave
         *  @description saves the processed data into the database
         *
         */
        function onSave(){
            var message = 'Are you sure you want to import <code>' + self.uploadFile[0].name + '</code> for presentation type <code>' + self.selectedPresentationType + '</code>?';
            Modal.confirm({
              message: message
            }).then(function() {
              self.progressStart();
              Posters.save(self.uploadedAllData).$promise.then(function onSuccess(){
              // notify the listener when the record is added
              console.log('=======', arguments[0]);
              self.uploadedPosters = [];
              self.progressEnd();
              toastr.success('Posters have been imported successfully.');
            });
          });
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

        /**
         *  @function changeDelimiter
         *  @description change delimiter
         *
         */
        function changeDelimiter() {
            if(self.string){
            self.progressStart();
            self.filterPosters();
          }
        }

        /**
         * @function previousPage
         * @description Browse the previous page of records, and updates the data in accordance with this change
         */
        function previousPage() {
          var page = paginator.getPage() - 1;
          // fetch the pages
          self.getParsData(page);
        };

        /**
         * @function nextPage
         * @description Browse the next page of records, and updates the data in accordance with this change
         */
        function nextPage() {
          var page = paginator.getPage() + 1;
          // fetch the pages
          self.getParsData(page);
        };

        /**
         * @function setPager
         * @description It is called when returning filtered posters and sets the correct pagination
         * @param {Number} page - number of page
         */
        function setPager(page) {
          // set the pager
          paginator.setPage(page);
          paginator.setPrevious(page === 1);
          paginator.setNext(!self.uploadedPosters || self.uploadedPosters.length != 10);

        }


        /**
         *  @function getParsData
         *  @description selects from  all records  those that should be displayed on the page, number of which  passed to the function
         *  @param {Number} page - number of page
         */
        function getParsData(page) {
          var _num = page - 1;
          self.uploadedPosters = [];
          for(var i=_num*10, len=_num*10+10; i<len; i++){
            if(self.uploadedAllData[i]) {
              self.uploadedPosters[self.uploadedPosters.length] = self.uploadedAllData[i];
            }
          }
          $timeout(function(){
              if(self.structureNotMatch){
                  self.uploadedPosters = [];
              }
            self.setPager(page);
            self.progressEnd();
          }, 1);
        }

        /**
         *  @function onChangePresentationType
         *  @description selects a record corresponding to the selected type; variable: self.selectedPresentationType
         */
        function onChangePresentationType() {
          _.map(self.uploadedAllData, function(el){
            el.presentationType = self.selectedPresentationType;
            return el;
          })
        }

      }
    ]);
