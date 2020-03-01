'use strict';

/**
 * @class angular_module.newsApp.PostersListCtrl
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs controller.
 * It draws a list of posters
 *
 */
angular.module('newsApp')
  .controller('PostersListCtrl', ['$scope', '$rootScope', 'paginator', 'Posters', 'preLoadPresentationType', 'preLoadFilteredPosters',
      /**
       * @function PostersListCtrl
       *
       * @description all @params should be comply Injection Dependency
       *
       * @param $scope - angularjs $scope
       * @param $rootScope - angularjs $rootScope
       * @param paginator - This is an angularjs service - angular_module.newsApp.paginator.
       * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
       * @param {Object} preLoadPresentationType:
       *            {Array} preLoadPresentationType.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       *                                              preLoadPresentationType.result._id - the name of the type for which a request was made [_id=PresentationType]
       *                                              preLoadPresentationType.result.count - the number of posters with this type
       *
       * @param {Object} preLoadFilteredPosters: {Array} preLoadFilteredPosters.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       *
       */
    function ($scope, $rootScope, paginator,  Posters, preLoadPresentationType, preLoadFilteredPosters) {
        /**
         * @this - all the properties of this object will be used in templates with the prefix 'listCtrl'
         * (described in angular_module.newsApp.config.$stateProvider  property: controllerAs)
         * @example this.paginator - in the template should be used as a - listCtrl.paginator
         *
         */
      var self = this;
        /**
         * functions and variables used in the controller
         */
      self.uniquePresentationType = _.clone(preLoadPresentationType.result);
        /**
         * add a string to the top of the array to select all types
         */
      self.uniquePresentationType.unshift({_id: '-- all (any type) --'});
      self.selectedPresentationType = self.uniquePresentationType[0];
      self.filteredPostersList = preLoadFilteredPosters.result;
      self.firstPage = 1; // get the 1st page

      self.assigned = true;
      self.canceled = false;
      self.filteringByAssigned = filteringByAssigned;
      self.isPosterAssigned = isPosterAssigned;
      self.getPostersByFiltered = getPostersByFiltered;
      self.previousPage = previousPage;
      self.nextPage = nextPage;
      self.filteringByPresentationType = filteringByPresentationType;
      self.filteringBySearch = filteringBySearch;
      self.setPager = setPager;

      // pagination
//      self.pagination = {
//        next: false,
//        previous: false,
//        page: 0,
//        page_size: 0,
//        total: 0,
//        num_pages: 0
//      };

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
        self.setPager(preLoadFilteredPosters)
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
      }

        /**
         * @function nextPage
         * @description Browse the next page of records, and updates the data in accordance with this change
         */
      function nextPage() {
        var page = paginator.getPage() + 1;
        // fetch the pages
        self.getPostersByFiltered(page).then(function(result) {
          self.filteredPostersList = result;
        });
      }

        /**
         * @function filteringByAssigned
         * @description It is called when change variable self.assigned, and updates the data in accordance with this change
         */
      function filteringByAssigned() {
        self.getPostersByFiltered().then(function(result) {
          self.filteredPostersList = result;
        });
      }

        /**
         *  @function getPostersByFiltered
         *  @description called when one of the parameters is changed to update the data in accordance with the changes
         *
         *  @param {Number} _page - the page number on which we pass a function call nextPage()/previousPage(). or get the current page from the service paginator
         *  @param {String} _type - current PresentationType
         *  @param {Boolean} _assigned - current assigned
         *  @param {String} _search - the string entered by the user, is being searched
         *
         *  @return {Array} response.result - promise Posters
         */
      function getPostersByFiltered(_page, _type, _assigned, _canceled, _search) {
        if (!_page) _page = paginator.getPage();
        if (!_type ) _type = (self.selectedPresentationType._id == '-- all (any type) --') ? null : self.selectedPresentationType._id ;
        if (!_assigned) _assigned = self.assigned;
        if (!_canceled) _canceled = self.canceled;
        if (!_search) _search = self.search;

        return Posters.query({page : _page, presentationType: _type, assigned: _assigned, canceled: _canceled, search: _search}).$promise.then(function(response) {
          var body = response;

          self.setPager(body);

          return body.result;
        });
      }

        /**
         * @function filteringByPresentationType
         * @description It is called when change variable self.selectedPresentationType, and updates the data in accordance with this change
         */
      function filteringByPresentationType() {
        self.getPostersByFiltered().then(function(result) {
          self.filteredPostersList = result;
        })
      }

        /**
         * @function filteringBySearch
         * @description It is called when change variable self.search, and updates the data in accordance with this change
         */
      function filteringBySearch() {
        self.getPostersByFiltered().then(function(result) {
          self.filteredPostersList = result;
        })
      }

        /**
         * @function isPosterAssigned
         * @description used for 'ng-class'
         * determines the presence of a poster in the room and monitor
         *
         * @param {Object} poster - poster
         *
         * @return {Boolean}
         */
      function isPosterAssigned(poster){
        var hasRoom    = false;
        var hasMonitor = false;

        if (poster.room){
          hasRoom = true;
        }

        if (typeof poster.monitor != 'undefined' &&
            poster.monitor != null &&
            !isNaN(poster.monitor) &&
            poster.monitor > -1){
          hasMonitor = true;
        }

        return (hasRoom && hasMonitor)
      }

        /**
         * @function setPager
         * @description called when returning filtered posters and sets the correct pagination
         * @param {Promise} data - data.page - number of page
         *                         data.num_pages - total pages
         */
      function setPager(data) {
        // set the pager
        paginator.setPage(data.page);
        paginator.setPrevious(data.page === 1);
        paginator.setNext(!data.num_pages || data.page === data.num_pages);
        paginator.setPages(data.num_pages);
      };

    }

  ]);
