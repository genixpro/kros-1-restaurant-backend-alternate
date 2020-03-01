'use strict';

/**
 * @class angular_module.newsApp.PostersFormCtrl
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs controller.
 * It draws form to create or update a poster
 *
 */
angular.module('newsApp')
  .controller('PostersFormCtrl', ['$scope', '$filter', '$rootScope', '$state', 'Rooms', 'Posters',
      /**
       * @function PostersFormCtrl
       *
       * @description all @params should be comply Injection Dependency
       *
       * @param $scope - angularjs $scope
       * @param $filter - angularjs filter
       * @param $rootScope - angularjs $rootScope
       * @param $state - angularjs $state
       * @param Rooms - This is an angularjs service - angular_module.newsApp.Rooms.
       * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
       *
       */
    function ($scope, $filter, $rootScope, $state, Rooms, Posters) {

        /**
         * variables used in the controller
         */
      $scope.Add_Update = 'add';
      $scope.roomId = '';
      $scope.selects = {
        room: null,
        rooms: [],
        monitor: null
      };

      if ($state.params != null && typeof $state.params.id !== 'undefined') {
        $scope.posterId = $state.params.id;
        $scope.Add_Update = 'update';
      }

      $scope.data = {
        model: {
          title  : '',
          code : '',
          presentationType : '',
          room : [],
          monitor : -1,
          startDate : null,
          duration : 0,
          authors: []
        }
      };
        /**
         * loader used in the controller
         */
      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

        /**
         * loading rooms for select
         */
      Rooms.query().$promise.then(function(response) {
        $scope.selects.rooms = response.result;
        $scope.selects.rooms.unshift({
          title: 'No room'
          , _id: null
          ,monitors: []
        });
        $scope.selects.room = $scope.selects.rooms[0];

        /**
         * loading poster if update an existing
         */
        if ($scope.Add_Update == 'update') {
          Posters.get({id: $scope.posterId}).$promise.then(function(response) {
            var body = response;
            $scope.data.model = response;
            $scope.dt = $scope.data.model.startDate;
            angular.forEach($scope.selects.rooms, function(item, index) {
              if (item._id == $scope.data.model.room) {
                $scope.selects.room = item;
                $scope.selects.room.monitors.unshift({
                  title: 'No monitor'
                  , _id: null
                });
                return false;
              }
            });

            $scope.selects.monitor = $scope.selects.room.monitors[$scope.data.model.monitor +1];
            //check whether there is in room the selected monitor, and if not, select "no monitor"(first in array)
            if(!$scope.selects.monitor) {
              $scope.selects.monitor = $scope.selects.room.monitors[0];
            }
            $scope.selects.monitor.index = $scope.data.model.monitor +1 || 0;
          });
        } else {
          $scope.onselectRoom();
        }
      });

        /**
         *  @function today
         *  @description sets the current date
         */
      $scope.today = function() {
        $scope.dt = new Date();
      };
//      $scope.today();

        /**
         *  @function clear
         *  @description clears the variable current date
         */
      $scope.clear = function () {
        $scope.dt = null;
      };

        /**
         *  @function open
         *  @description prevent the action of the default browser and stop the bubbling event
         *  sets variable opened in true
         *
         *  @param $event
         */
      $scope.open = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };

      $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
      };

        /**
         *  @function onselectRoom
         *  @description called when the select rooms in the 'SELECT'
         *  pulls up monitors belonging to a selected room
         *
         */
      $scope.onselectRoom = function() {
        if(!$scope.selects.room.monitors[0] || $scope.selects.room.monitors[0]._id){
          $scope.selects.room.monitors.unshift({
            title: 'No monitor'
            , _id: null
          })
        }
        $scope.selects.monitor = $scope.selects.room.monitors[0];
        $scope.selects.monitor.index = 0;
        $scope.data.model.room = $scope.selects.room._id;
       }

        /**
         *  @function progressStart
         *  @description launches a loader
         */
      function progressStart() {
        $scope.ui.inProgress = true;
      }

        /**
         *  @function progressEnd
         *  @description stops the loader
         */
      function progressEnd() {
        $scope.ui.inProgress = false;
      }

        /**
         *  @function addAuthorsInput
         *  @description adds question inputs with empty values
         */
        $scope.addAuthorsInput = function() {
          $scope.data.model.authors.push({
            firstName  : '',
            lastName : ''
          });
        };

        /**
         *  @function save
         *  @description  Handle the add form submission
         */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) return;

        progressStart();

        $scope.data.model.monitor =$scope.selects.monitor.index -1;
        $scope.data.model.presentationType = ($scope.data.model.presentationType=='')?null:$scope.data.model.presentationType;
        $scope.data.model.startDate = new Date($scope.dt).getTime() || $scope.data.model.startDate;

        if ($scope.Add_Update == 'update') {

          // update room data

          $scope.data.model.$save(function onSuccess(response) {
            // notify the listener when the record is added
            $scope.$emit('list_updated');

            $state.transitionTo('posters.details', {id:$scope.posterId}, {
              reload: true
            });
          },function onError() {
            progressEnd();
          });

        }
        else {

          // save new room data

          Posters.save($scope.data.model).$promise.then(function onSuccess(){
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

      /**
       * option to sort the author inside the listForm
       */
      $scope.authorSortableOptions = {
        update: function(e, ui) {
          console.log("Author updated:", e, ui);
        },
        change: function(e, ui) {
          console.log("Author change:", e, ui);
        }
      };

    }]);
