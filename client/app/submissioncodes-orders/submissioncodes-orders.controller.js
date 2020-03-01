'use strict';

angular.module('newsApp')
  .controller('SubmissioncodesOrdersListCtrl', ['$scope', '$rootScope', '$http',
      '$location', 'paginator', 'SubmissioncodesOrders', '$log', '$translate',
      function ($scope, $rootScope, $http, $location, paginator, SubmissioncodesOrders, $log, $translate) {

        var self = this;

        self.firstPage = firstPage;
        self.lastPage = lastPage;
        self.previousPage = previousPage;
        self.nextPage = nextPage;
        self.setPager = setPager;
        self.currentPage = currentPage;
        self.fetchSubmissioncodesOrders = fetchSubmissioncodesOrders;
        self.filteringBySearch = filteringBySearch;
        self.selectRecPerPage = selectRecPerPage;

        self.paginator = paginator;

        self.rec_per_page = [10, 25, 50, 100];
        self.limit = self.rec_per_page[0];


        $scope.data = {
          records: []
        };
        // keep previous result for reseting search
        var previousResults = $scope.data.result;

        /**
         * @function activate
         * It runs all the functions that need to be running when the controller is initialized
         */
        activate();

        function activate() {
          self.fetchSubmissioncodesOrders(1);
        }

        // listen to hide records list update event
        var listUpdatedListener = $rootScope.$on('list_updated', self.currentPage);
        // function (paginator.) {
        //     $scope.fetchSubmissioncodesOrders();
        // });

        // unregister the listener to avoid memory leak
        $scope.$on('$destroy', listUpdatedListener);

        $(window).trigger('resize');

        $scope.changeLanguage = function (key) {
          $translate.use(key);
        };

        function selectRecPerPage() {
          self.fetchSubmissioncodesOrders(1, self.limit);
        }

        // fetch the records
        function fetchSubmissioncodesOrders(_page, _limit, _search) {
          if (!_search) _search = self.search;
          if (!_limit) _limit = self.limit;

          SubmissioncodesOrders.query({page: _page, limit: _limit, search: _search}).$promise.then(function (response) {
            self.setPager(response);
            $scope.data.records = response.result;
          });
        };

        function filteringBySearch() {
          self.fetchSubmissioncodesOrders();
        }

        function currentPage() {
          var page = paginator.getPage();
          self.fetchSubmissioncodesOrders(page);
        }

        /**
         * @function firstPage
         * @description Browse the first page of records, and updates the data in accordance with this change
         */
        function firstPage() {
          var page = 1;
          self.fetchSubmissioncodesOrders(page);
        }

        /**
         * @function lastPage
         * @description Browse the last page of records, and updates the data in accordance with this change
         */
        function lastPage() {
          var page = paginator.getPages();
          self.fetchSubmissioncodesOrders(page);
        }

        /**
         * @function previousPage
         * @description Browse the previous page of records, and updates the data in accordance with this change
         */
        function previousPage() {
          var page = paginator.getPage() - 1;
          self.fetchSubmissioncodesOrders(page);
        }

        /**
         * @function nextPage
         * @description Browse the next page of records, and updates the data in accordance with this change
         */
        function nextPage() {
          var page = paginator.getPage() + 1;
          self.fetchSubmissioncodesOrders(page);
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
    ]
  );

angular.module('newsApp')
  .controller('SubmissioncodesOrdersItemCtrl', ['$scope', '$log',
      'modalDeleteItem', 'SubmissioncodesOrders', '$state',
      function ($scope, $log, modalDeleteItem, SubmissioncodesOrders, $state) {

        $scope.deleteSubmissioncodesOrder = function (submissioncodesOrder) {
          modalDeleteItem.open(function () {
            // Get the record and delete the image associated to it
            submissioncodesOrder.$delete()
            $state.transitionTo('submissioncodes_orders', {}, {
              reload: true
            });
          });
        }

      }
    ]
  );

angular.module('newsApp')
  .controller('SubmissioncodesOrdersAddFormCtrl', ['$scope', 'SubmissioncodesOrders',
      '$log', '$timeout', '$state',
      function ($scope, SubmissioncodesOrders, $log, $timeout, $state) {
        $scope.ui = {};
        $scope.ui.inProgress = false;

        function progressStart() {
          $scope.ui.inProgress = true;
        }

        function progressEnd() {
          $scope.ui.inProgress = false;
        }

        $scope.data = {
          model: {
            purchaseDate: {
              date: ''
            },
            additionalEmails: [],
            quantity: 1
          }
        };

        $scope.isOpen = false;

        $scope.openCalendar = function (e) {
          e.preventDefault();
          e.stopPropagation();
          $scope.isOpen = true;
        }


        $scope.addOptionInputs = function (index) {
          $scope.data.model.additionalEmails.push({val: ""});
        };

        $scope.removeOptionInputs = function (index) {
          $scope.data.model.additionalEmails.splice(index, 1);
        };

        $scope.save = function () {
          progressStart()

          function saveSubmissioncodesOrder() {
            var newSubmissioncodesOrder = new SubmissioncodesOrders($scope.data.model);
            newSubmissioncodesOrder.additionalEmails = newSubmissioncodesOrder.additionalEmails.map(function (d) {
              return d.val
            })
            newSubmissioncodesOrder.$save(function () {
              // notify the listener when the category is added
              $scope.$emit('list_updated');
              // display the updated form
              $state.transitionTo($state.current, {}, {
                reload: true
              });
            }, function (err) {
              $log.error('failed to add platform order');
            })
          }

          saveSubmissioncodesOrder()
        }

      }
    ]
  );

angular.module('newsApp')
  .controller('SubmissioncodesOrdersUpdateFormCtrl', ['$scope', '$rootScope', 'SubmissioncodesOrders', '$log',
      '$stateParams', '$state', '$location',
      function ($scope, $rootScope, SubmissioncodesOrders, $log, $stateParams,
                $state, $location) {

        $scope.data = {
          model: {
            purchaseDate: {
              date: ''
            },
            additionalEmails: [],
            quantity: 1
          }
        };

        $scope.ui = {};
        $scope.ui.inProgress = false;

        function progressStart() {
          $scope.ui.inProgress = true;
        }

        function progressEnd() {
          $scope.ui.inProgress = false;
        }

        $scope.isOpen = false;

        $scope.openCalendar = function (e) {
          e.preventDefault();
          e.stopPropagation();
          $scope.isOpen = true;
        };

        // fetch single document
        SubmissioncodesOrders.get({id: $stateParams.id}).$promise.then(function (response) {
          $scope.data.model = response;
          if ($scope.data.model.additionalEmails && $scope.data.model.additionalEmails.length) {
            $scope.data.model.additionalEmails = $scope.data.model.additionalEmails.map(function (d) {
              return {
                val: d
              };
            });
          }
        });

        $scope.addOptionInputs = function (index) {
          $scope.data.model.additionalEmails.push({val: ""});
        };

        $scope.removeOptionInputs = function (index) {
          $scope.data.model.additionalEmails.splice(index, 1);
        };

        $scope.update = function () {
          if (!$scope.updateForm.$valid) {
            return;
          }
          progressStart();
          var toBeUpdateDownloadId = $scope.data.model._id;

          function saveSubmissioncodesOrder() {
            $scope.data.model.$update(
              function () {
                progressEnd();
                $rootScope.$emit('list_updated');
                $state.transitionTo('submissioncodes_orders.details', {
                  id: toBeUpdateDownloadId
                }, {
                  reload: true
                });
              },
              function (error) {
                $log.error('error', error);
                progressEnd();
              }
            );
          }

          saveSubmissioncodesOrder()
        };

      }
    ]
  );


angular.module('newsApp')
  .controller('SubmissioncodesOrdersDetailsCtrl', ['$scope', '$stateParams',
      'SubmissioncodesOrders',
      function ($scope, $stateParams, SubmissioncodesOrders) {

        $scope.data = {
          model: {}
        };

        // fetch single category
        SubmissioncodesOrders.get({id: $stateParams.id}).$promise.then(function (response) {
          $scope.data.model = response;
        });

      }
    ]
  );

