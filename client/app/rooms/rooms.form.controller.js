
'use strict';

angular.module('newsApp')
  .controller('RoomsFormCtrl', ['$scope', '$rootScope', '$state', 'Rooms', '$filter',
    function ($scope, $rootScope, $state, Rooms, $filter) {

      $scope.Add_Update = 'add';
      $scope.roomId = '';

      if ($state.params != null && typeof $state.params.id !== 'undefined') {
        $scope.roomId = $state.params.id;
        $scope.Add_Update = 'update';
      }

      $scope.data = {
        model: {
          title  : '',
          body : '',
          monitors: [],
          presentationDuration: 0,
          availability : []
        }
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      if ($scope.Add_Update == 'update') {

        // fetch single record
        Rooms.get({id: $scope.roomId}).$promise.then(function(response) {
          var body = response;
          $scope.data.model = response;


        });
      }

      /**
       * Add question inputs with empty values
       */
      $scope.addMonitorInputs = function() {
        $scope.data.model.monitors.push({
          title  : '',
          body : ''
        });
      };

      //initialize the first monitor input when there are no monitors
      (function() {
        if ($scope.data.model.monitors && $scope.data.model.monitors.length < 1)
        $scope.addMonitorInputs();
      })();

      $scope.addTimeSlot = function() {
        $scope.data.model.availability.push( {
          startDate : new Date(),
          endDate : new Date()
        });
      };


      //initialize the first availability input when there are no availability
      (function() {
        if ($scope.data.model.availability.length < 1)
          $scope.addTimeSlot();
      })();


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
        if (!$scope.addForm.$valid) return;
        if (!$scope.data.model.availability[0]) return;
        var duration = $scope.data.model.presentationDuration * 60 * 1000;
        if ($scope.data.model.availability[0].startDate + duration >= $scope.data.model.availability[0].endDate) return;

        progressStart();

        angular.forEach($scope.data.model.availability, function(item, index) {
          $scope.data.model.availability[index] ={
            startDate : new Date(item.startDate).getTime(),
            endDate : new Date(item.endDate).getTime()
          };
        });

        if ($scope.Add_Update == 'update') {

          // update room data
          $scope.data.model.$save(function onSuccess(response) {
            // notify the listener when the record is added
            $scope.$emit('list_updated');

            $state.transitionTo('rooms.details', {id:response._id}, {
              reload: true
            });
          },function onError() {
            progressEnd();
          });

        }
        else {

          // save new room data
          Rooms.save($scope.data.model).$promise.then(function onSuccess(){
            // notify the listener when the record is added
            $scope.$emit('list_updated');

            $state.transitionTo($state.current, {}, {
              reload: true
            });
          },function onError() {
            progressEnd();
          });

        }
      };


    }]);
