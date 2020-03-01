'use strict'

/**
 * @class angular_module.newsApp.ExportCsvCtrl
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs controller.
 * It exports all the posters in the CSV file
 *
 */
angular.module('newsApp')
    .controller('ExportCsvCtrl', ['$scope', 'Posters', '$filter', '$timeout', 'paginator', 'preLoadPosters','PostersExport',
      /**
       * @function ExportCsvCtrl
       *
       * @description all @params should be comply Injection Dependency
       *
       * @param $scope - angularjs $scope
       * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
       * @param $filter - angularjs filter
       * @param $timeout - angularjs $timeout
       * @param paginator - This is an angularjs service - angular_module.newsApp.paginator.
       * @param {Object} preLoadPosters - {Array} preLoadPosters.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       *
       */
      function($scope, Posters, $filter, $timeout, paginator, preLoadPosters,PostersExport) {
        /**
         * @this - all the properties of this object will be used in templates with the prefix 'exportCsv'
         * (described in angular_module.newsApp.config.$stateProvider  property: controllerAs)
         * @example this.exportArray - in the template should be used as a - exportCsv.exportArray
         *
         */
        var self = this;

        /**
         * functions and variables used in the controller
         */
        self.postersList = preLoadPosters.result;

        self.getPostersByFiltered = getPostersByFiltered;
        self.exportToFile=exportToFile;

        self.string = '';
        self.checkbox = 'YES';
        self.delimiter = [',', ';', '|', '^'];
        self.currentDelimiter = self.delimiter[0];
        self.encoding = ['utf-8', 'macintosh'];
        self.currentEncoding = self.encoding[0];
        self.exportArray = [];

        self.ui = {};
        self.ui.progress = 0;
        self.ui.inProgress = false;
        self.progressStart = progressStart;
        self.progressEnd = progressEnd;
        self.previousPage = previousPage;
        self.nextPage = nextPage;
        self.setPager = setPager;
        self.assigned = true;

        self.header =  ["Code" ,"Abstract Title","Topic","Subtopic","Session","Presenter FirstName","Presenter LastName",
          "Presenter Affiliation","Presenter Email","Corresponding Author FirstName","Corresponding Author LastName",
          "Corresponding Author Affiliation","Corresponding Author Email","Author FirstName","Author LastName","Author Affiliation","Author Email"];

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
          self.getPostersByFiltered(self.firstPage).then(function(result) {
            self.filteredPostersList = result;
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
         * @function previousPage
         * @description Browse the previous page of records, and updates the data in accordance with this change
         */
        function previousPage() {
          var page = paginator.getPage() - 1;
          // fetch the pages
          self.getPostersByFiltered(page).then(function(result) {
            self.filteredPostersList = result;
          })
        };

        /**
         * @function nextPage
         * @description Browse the next page of records, and updates the data in accordance with this change
         */
        function nextPage() {
          var page = paginator.getPage() + 1;
          // fetch the pages
          self.getPostersByFiltered(page).then(function(result) {
            self.filteredPostersList = result;
          })
        };

        /**
         * @function setPager
         * @description It is called when returning filtered posters and sets the correct pagination
         * @param {Promise} data - data.page - number of page
         *                         data.num_pages - total pages
         */
        function setPager(data) {
          // set the pager
          paginator.setPage(data.page);
          paginator.setPrevious(data.page === 1);
          paginator.setNext(!data.num_pages || data.page === data.num_pages);
        };

        /**
         *  @function getPostersByFiltered
         *  @description
         *  called after dragging a poster inside the calendar and updates the date of this poster
         *  @param {Number} _page - the page number on which we pass a function call nextPage()/previousPage(). or get the current page from the service paginator
         *  @param {String} _type - current PresentationType
         *  @param {Boolean} _assigned - current assigned
         *  @param {String} _search - the string entered by the user, is being searched
         *
         *  @return {Array} response.result - promise Posters
         */
        function getPostersByFiltered(_page, _type, _assigned, _canceled, _search) {
          if (!_page) _page = paginator.getPage();
//          if (!_type ) _type = (self.selectedPresentationType == '-- all (any type) --') ? null : self.selectedPresentationType ;
          if (!_assigned) _assigned = self.assigned;
          if (!_canceled) _canceled = self.canceled;
//          if (!_search) _search = self.search;

          return Posters.query({page : _page, presentationType: _type, assigned: _assigned, canceled: _canceled, search: _search}).$promise.then(function(response) {
            var body = response;

            self.setPager(body);
            return body.result;
          });
        }

        /*
         * TODO: Is this function related to "posters-export" or "schedule posters-export"
         *       It has been added in #357 branch
         */
        function exportToFile (){
          var query={};
          query.delimiter=self.currentDelimiter;

          return PostersExport.getPosters(query).$promise.then(function(response) {
            window.open(response.url, '_blank', '');
            var delQuery = {};
            delQuery.delUrl = response.url;
            PostersExport.remove(delQuery).$promise.then(function (response) {
            });
          })
        }

      }
    ]);
