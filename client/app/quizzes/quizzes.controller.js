'use strict';

angular.module('newsApp')
  .controller('QuizzesListCtrl', ['$scope', '$rootScope', '$http', 'paginator',
    'Quizzes', 'Lectures', '$log',
    function($scope, $rootScope, $http, paginator, Quizzes, Lectures, $log) {

      /*jshint unused: false */
      $scope.$watch('selectedLecture', function(newValue, oldValue) {
        if (newValue) {
          Quizzes.getByLecture($scope.selectedLecture._id)
            .then(function(response) {
              var body = response.data;
              $scope.data.records = [];
              $scope.data.records = body.result;

              // set the pager
              paginator.setPage(body.page);
              paginator.setPrevious(body.page === 1);
              paginator.setNext(body.page === body.numPages);
            });
        } else {
          $scope.fetchQuizzes();
        }
      });

      $scope.order = {
        isDirty: false
      };

      var firstPage = 1; // get the 1st page

      $scope.data = {
        records: []
      };

      // pagination
      $scope.pagination = {
        next: false,
        previous: false,
        page: 0,
        pageSize: 0,
        total: 0,
        numPages: 0
      };

      $scope.paginator = paginator;

      $scope.fetchLectures = function() {
        // fetch the required records
        Lectures
          .get()
          .then(function(response) {
            $scope.lectures = response.data.result;

            return Quizzes.get(firstPage);
          })
          .then(function(response) {
            var body = response.data;
            $scope.data.records = body.result;

            // set the pager
            paginator.setPage(body.page);
            paginator.setPrevious(body.page === 1);
            paginator.setNext(body.page === body.numPages);
          })
          .catch(function(response) {
            console.log('failed to retch records', response);
          });
      };
      $scope.fetchLectures();

      $scope.fetchQuizzes = function() {
        // fetch the items
        Quizzes.get({
          page: 1
        }).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.numPages);
        });
      };
      $scope.fetchQuizzes();

      // listen for app selection
      $rootScope.$on('app:selected', function() {
        $scope.fetchLectures();
        $scope.fetchQuizzes();
      });

      /**
       * Browse the previous page of records
       */
      $scope.previousPage = function() {
        // fetch the pages
        Quizzes.get(paginator.getPage() - 1).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.numPages);
        });
      };

      /**
       * Browse the next page of records
       */
      $scope.nextPage = function() {
        // fetch the records
        Quizzes.get(paginator.getPage() + 1).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.numPages);
        });
      };

      // listen to hide pages list update event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {
        $scope.fetchQuizzes();
      });

      /*jshint unused: false */
      $scope.sortableOptions = {
        update: function(e, ui) {
          $scope.order.isDirty = true;

          console.log('Order updated.');
          console.log('........... e. %o', e);
          console.log('.......... ui. %o', ui);
          console.log('........items. %o', $scope.data.records);
        },
        change: function(e, ui) {
          console.log('Order change.');
        }
      };

      var updateRecord = function (id, data) {
        return Quizzes.update(id, data)
          .then(function onSuccess() {
            $scope.order.isDirty = false;
          }, function onError(response) {
            $log.error('response', response);
          });
      };

      $scope.saveOrder = function() {
        for (var i in $scope.data.records) {
          $scope.data.records[i].weight = i;

          var data = {
            title: $scope.data.records[i].title,
            body: $scope.data.records[i].body,
            questions: $scope.data.records[i].questions,
            lectureId: (($scope.data.records[i].lecture) ? $scope.data.records[i].lecture : null),
            weight: $scope.data.records[i].weight
          };

          $scope.order.isDirty = true;

          updateRecord($scope.data.records[i]._id, data);
        }
        console.log('........items. %o', $scope.data.records);
      };

      $scope.cancelOrder = function() {
        $scope.order.isDirty = false;
        // notify the listener when the grade is added
        $scope.$emit('list_updated');
      };

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');
    }
  ]);

angular.module('newsApp')
  .controller('QuizzesAddFormCtrl', ['$scope', '$rootScope', 'Quizzes', '$log', '$state', 'Lectures',
    function($scope, $rootScope, Quizzes, $log, $state, Lectures) {
      $scope.data = {
        // hold the lectures for selector in form-add view
        lectures: [],
        // The model the controls are binded to.
        // Its fields are coresponding to our record fields
        model: {
          questions: []
        }
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      $scope.fetchLectures = function() {
        // fetch the records
        Lectures.get().then(function(response) {
          var body = response.data;
          $scope.data.lectures = body.result;
        });
      };
      $scope.fetchLectures();

      // listen for app selection
      $rootScope.$on('app:selected', function() {
        $scope.fetchLectures();
      });

      /**
       * Add question inputs with empty values
       */
      $scope.addQuestionInputs = function() {
        $scope.data.model.questions.push({
          question: '',
          answers: []
        });
      };

      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      /*
       * Handle the add form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) {
          return;
        }

        progressStart();

        var data = {
          title: $scope.data.model.title,
          body: $scope.data.model.body,
          questions: $scope.data.model.questions,
          lectureId: (($scope.data.model.lecture) ? $scope.data.model.lecture._id : null),
        };

        Quizzes.create(data).then(function onSuccess() {
          // notify the listener when the record is added
          $scope.$emit('list_updated');

          // display the updated form
          $state.transitionTo($state.current, {}, {
            reload: true
          });
        }, function onError() {
          progressEnd();
        });
      };
    }
  ]);

angular.module('newsApp')
  .controller('QuizzesItemCtrl', ['$scope', '$log', 'modalDeleteItem',
    'Quizzes', '$state',
    function($scope, $log, modalDeleteItem, Quizzes, $state) {

      /**
       * Delete item from the list
       */
      $scope.deleteItem = function(record) {
        modalDeleteItem.open(function() {
          Quizzes.delete(record._id)
            .then(function onSuccess() {
              // reload the list view
              $state.transitionTo('quizzes', {}, {
                reload: true
              });
            }, function onError(response) {
              console.log('An error occured while deleting record ', response);
            });
        });
      };
    }
  ]);

angular.module('newsApp')
  .controller('QuizzesUpdateFormCtrl', [
    '$scope', '$rootScope', 'Quizzes', '$log', '$stateParams', '$state',
    'Lectures',
    function($scope, $rootScope, Quizzes, $log, $stateParams, $state,
      Lectures) {
      $scope.data = {
        // hold the lectures for selector in form-update view
        lectures: [],
        // The model the controls are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      /**
       * Add question inputs with empty values
       */
      $scope.addQuestionInputs = function() {
        $scope.data.model.questions.push({
          question: '',
          answers: []
        });
      };

      /*jshint unused: false */
      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }
      /*jshint unused: true */

      // fetch single record
      Quizzes.findOne($stateParams.id)
        .then(function(response) {
          var body = response.data;
          $scope.data.model = body.result;

          $scope.fetchLectures();
        })
        .catch(function(response) {
          console.log('failed to fetch records', response);
        });

      $scope.fetchLectures = function() {
        // fetch the records
        Lectures.get()
          .then(function(response) {
            var body = response.data;
            $scope.data.lectures = body.result;

            var selectedLectureIndex = _.findIndex($scope.data.lectures, {
              _id: (($scope.data.model.lecture) ? $scope.data.model.lecture._id : null)
            });
            $scope.data.model.lecture = $scope.data.lectures[selectedLectureIndex];
          })
          .catch(function(response) {
            console.log('failed to fetch records', response);
          });
      };
      $scope.fetchLectures();

      // listen for app selection
      $rootScope.$on('app:selected', function() {
        $scope.fetchLectures();
      });

      /*
       * Handle the form submission
       */
      $scope.update = function() {
        // if the form is not valid then cut the flow
        if (!$scope.updateForm.$valid) {
          return;
        }

        progressStart();

        var toBeUpdateRecordId = $scope.data.model._id;

        var data = {
          title: $scope.data.model.title,
          body: $scope.data.model.body,
          questions: $scope.data.model.questions,
          lectureId: (($scope.data.model.lecture) ? $scope.data.model.lecture._id : null),
          weight: $scope.data.model.weight,
        };

        Quizzes.update($scope.data.model._id, data)
          .then(function onSuccess() {
            // notify the listener when the record is added
            $rootScope.$emit('list_updated');
            // display the updated form
            $state.transitionTo('quizzes.details', {
              id: toBeUpdateRecordId
            });
          }, function onError(response) {
            $log.error('response', response);
          });
      };
    }
  ]);

angular.module('newsApp')
  .controller('QuizzesDetailsCtrl', ['$scope', '$stateParams', '$log',
    'Quizzes',
    function($scope, $stateParams, $log, Quizzes) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      // fetch single page
      Quizzes.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;
      });
    }
  ]);


angular.module('newsApp')
  .controller('QuestionItemCtrl', ['$scope', function($scope) {
    $scope.addAnswerInputs = function(answers) {
      answers.push({
        text: '',
        correct: false
      });
    };

    /**
     * Remove question inputs by the element index
     */
    $scope.removeQuestion = function(index) {
      $scope.data.model.questions.splice(index, 1);
    };
  }]);

angular.module('newsApp')
  .controller('AnswerItemCtrl', ['$scope', function($scope) {
    /**
     * Remove question inputs by the element index
     */
    $scope.removeAnswerInputs = function(answers, index) {
      answers.splice(index, 1);
    };
  }]);
