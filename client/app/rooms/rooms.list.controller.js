'use strict';

angular.module('newsApp')
  .controller('RoomsListCtrl', ['$scope', '$rootScope', 'paginator', 'Rooms', 'preLoadRooms', 'preLoadCategories',
    function ($scope, $rootScope, paginator, Rooms, preLoadRooms, preLoadCategories) {

      $scope.uniqueCategories = _.clone(preLoadCategories.result);
      $scope.uniqueCategories.unshift('-- all (any type) --');

      var firstPage = 1; // get the 1st page

      $scope.data = {
        records : preLoadRooms.result,
        category : $scope.uniqueCategories[0]
      };

      // pagination
//      $scope.pagination = {
//        next: false,
//        previous: false,
//        page: 0,
//        page_size: 0,
//        total: 0,
//        num_pages: 0
//      };

      $scope.paginator = paginator;

      /**
       * Browse the previous page of records
       */
      $scope.previousPage = function() {
        var page = paginator.getPage() - 1;
        // fetch the pages
        $scope.getPostersByFiltered(page).then(function(result) {
          $scope.data.records = result;
        });
      };

      /**
       * Browse the next page of records
       */
      $scope.nextPage = function() {
        var page = paginator.getPage() + 1;
        // fetch the pages
        $scope.getPostersByFiltered(page).then(function(result) {
          $scope.data.records = result;
        });
      };

      $scope.filteringByCategories = function() {
        $scope.getPostersByFiltered().then(function(result) {
          $scope.data.records = result;
        })
      };
      $scope.filteringBySearch = function() {
        $scope.getPostersByFiltered().then(function(result) {
          $scope.data.records = result;
        })
      };

      $scope.getPostersByFiltered = function(_page, _category, _search) {
        if (!_page) _page = paginator.getPage();
        if (!_category) _category = ($scope.data.category == '-- all (any type) --') ? null : $scope.data.category ;
        if (!_search) _search = $scope.search;

        return Rooms.query({page : _page, category: _category, search: _search}).$promise.then(function(response) {
          var body = response;

          $scope.setPager(body);

          return body.result;
        });
      };

      $scope.setPager = function(data) {
        // set the pager
        paginator.setPage(data.page);
        paginator.setPrevious(data.page === 1);
        paginator.setNext(!data.num_pages || data.page === data.num_pages);
        paginator.setPages(data.num_pages);
      };

      $scope.setPager(preLoadRooms);

    }]);
