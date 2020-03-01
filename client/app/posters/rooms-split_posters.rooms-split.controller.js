
  'use strict';

  /**
   * @class angular_module.newsApp.PostersRoomsSplitCtrl
   * @memberOf angular_module.newsApp
   *
   * @description This is an angularjs controller.
   * It displays two monitors between which you can drag posters
   *
   */
  angular.module('newsApp')
  .controller('PostersRoomsSplitCtrl', ['$scope', 'Posters', 'preLoadRooms', '$state', '$timeout', 'preLoadCategories',
        /**
         * @function PostersRoomsSplitCtrl
         *
         * @description all @params should be comply Injection Dependency
         *
         * @param $scope - angularjs $scope
         * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
         * @param {Object} preLoadRooms: {Array} preLoadRooms.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
         * @param $state - angularjs $state
         * @param $timeout - angularjs $timeout
         * @param {Object} preLoadCategories: {Array} preLoadCategories.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
         */
    function ($scope, Posters, preLoadRooms, $state, $timeout, preLoadCategories) {
          /**
           * @this - all the properties of this object will be used in templates with the prefix 'postersRoomsSplit'
           * (described in angular_module.newsApp.config.$stateProvider  property: controllerAs)
           * @example this.categories - in the template should be used as a - postersRoomsSplit.categories
           *
           */
      var self = this;
          /**
           * functions and variables used in the controller
           */
      self.Rooms = preLoadRooms.result;
      self.categories = preLoadCategories.result;
          /**
           * add a string to the top of the array to select all
           */
      self.categories.unshift('-- all --');
      self.selectedCategory = {
        left: self.categories[0],
        right: self.categories[0]
      };

      self.onDropMonitor = onDropMonitor;
      self.eventsUpdate = eventsUpdate;
      self.countPosters = countPosters;
      self.selectionOnRoom = selectionOnRoom;
      self.onDropRoom = onDropRoom;
//      self.datepicker = datepicker;
      self.updateEventMonitor = updateEventMonitor;
      self.updateSorted = updateSorted;
      self.saveUpdatePosters = saveUpdatePosters;
      self.getPostersByRoomId = getPostersByRoomId;
      self.checkOverflow = checkOverflow;
      self.localUpdatePostersList = localUpdatePostersList;
      self.changeSelectedRoom = changeSelectedRoom;

      self.PostersOnRoomWithoutMonitor ={};

      self.posterDynamicPopover = {
        templateUrl: 'split_posterPopoverTemplate.html',
      };

      self.currentRoom = {
        left: _.findWhere(self.Rooms, {_id: $state.params.room}) || _.clone(self.Rooms[0]) || []
        ,right: _.clone(self.Rooms[1]) || []
      };

      self.eventMonitor = {
        left: []
        , right: []
      };

      self.postersList = {
        left: []
        , right: []
      };
      self.monitorOverflow = {
        left: []
        , right: []
      };
      self.selectedPoster = $state.params.poster;
          /**
           * end enumeration functions and variables used in the controller
           */

          /**
           * @function activate
           * It runs all the functions that need to be running when the controller is initialized
           */
      activate();
      function activate(){
        self.selectionOnRoom();
//        self.datepicker();
      }

          /**
           * option to sort the posters inside the monitor
           */
      self.sortableOptions = {
        update: function(e, ui) {
          console.log("Monitor updated:", e, ui);
//          var monitor = angular.element(e.target).data('index');
//          var position = angular.element(e.target).data('position');
//          self.updateSorted(monitor, position);
        },
        change: function(e, ui) {
          console.log("Monitor change:", e, ui);
        }
      };

          /**
           *  @function onDropMonitor
           *  @description
           *  called when posters is dropped on monitor
           *
           *  @param {Object} event
           *  @param {Object} element - dragged poster
           */
      function onDropMonitor(event, element) {
        var _id = angular.element(element.draggable).data('id')
          , el
          , old_monitor
          , old_position = 'left'
          , monitor_index = angular.element(event.target).data('index')
          , position = angular.element(event.target).data('position')
          , sortOnly = false
          , _currentRoom = self.currentRoom.left
          , _currentMonitors = self.eventMonitor.left;

            /**
             * receives from the database dragged poster for his ID
             */
        Posters.get({id: _id}).$promise.then(function(response) {
          el = response;
          old_monitor = _.clone(el.monitor)
          if(self.currentRoom.right._id == el.room) old_position = 'right';
          /**
           * exit from the function if the poster could not be found
           */
          if (!el) return;

          /**
           * choosing the right room and the monitor according to the position
           */
          if (position == 'right'){
            _currentRoom = self.currentRoom.right;
            _currentMonitors = self.eventMonitor.right;
          }
          //only for sortable
          if(el.monitor == monitor_index && el.room == _currentRoom._id) sortOnly = true;
          /**
           * exit from the function if this sort
           */
          if(sortOnly) {
            self.updateSorted(monitor_index, position);
            return;
          }

          el.monitor = monitor_index;
          el.room = _currentRoom._id;

          /**
           * counting time is already assigned to other posters
           */
          var busyTime = _currentMonitors[monitor_index] ? _currentMonitors[monitor_index].length * _currentRoom.presentationDuration * 60*1000 : 0;
          el.startDate = _currentRoom.availability[0].startDate + busyTime;

          el.$save(function(el){
//            if(old_monitor != -1){
            self.eventMonitor[old_position][old_monitor].splice(el, 1)
            self.updateSorted(old_monitor, old_position, el.res[0]);
//            }else{
//              self.localUpdatePostersList(el.res[0], position)
//            }
          });
        })
      }

          /**
           *  @function localUpdatePostersList
           *  @description
           *  called after an update any a poster
           *  remove from the list of posters altered poster and add to that list updated poster
           *
           *  @param {Object} el - updated poster
           *  @param {String} position - 'right' or 'left'
           */
      function localUpdatePostersList(el, position) {
        el.room = _.findWhere(self.Rooms, {_id: el.room});
          /**
           *  del element
           */
        var deletedElementIndex = {
          left: _.indexOf(self.postersList.left, _.findWhere(self.postersList.left, {_id: el._id})),
          right: _.indexOf(self.postersList.right, _.findWhere(self.postersList.right, {_id: el._id}))
        };
        if(deletedElementIndex.right !== -1){
          self.postersList.right.splice(deletedElementIndex.right, 1);
        }
        if(deletedElementIndex.left !== -1){
          self.postersList.left.splice(deletedElementIndex.left, 1);
        }
            /**
             *  add el in room
             */
        if (position == 'right'){
          self.postersList.right.push(el);
        }
        if (position == 'left'){
          self.postersList.left.push(el);
        }

        self.selectionOnRoom()
      }

          /**
           *  @function eventsUpdate
           *  @description
           *  updates the list posters by the ID of the room (right and left)
           *
           */
      function eventsUpdate() {
        self.getPostersByRoomId(self.currentRoom.left).then(function(result){
          self.postersList.left = result;

          self.getPostersByRoomId(self.currentRoom.right).then(function(result){
            self.postersList.right = result;

            self.selectionOnRoom(true)
          })
        })
      }

          /**
           *  @function selectionOnRoom
           *  @description setup relating to the data rooms (right and left)
           *  Called without parameters or with the parameter false, update lists posters
           *
           *  @param {Boolean} no_update - If the parameter is false or missing: update the list posters
           */
      function selectionOnRoom(no_update) {
        if(!no_update){
          self.eventsUpdate();
          return;
        }
        self.eventMonitor.left = [];
        self.eventMonitor.right = [];

        if(self.currentRoom.left.length == 0 ||
          self.currentRoom.right.length == 0) return;

        var _leftRoom = self.currentRoom.left.title
          , _rightRoom = self.currentRoom.right.title
          , _dataInLeftRoom = _.findWhere(self.Rooms, {title: _leftRoom.trim()})
          , _dataInRightRoom = _.findWhere(self.Rooms, {title: _rightRoom.trim()});


        self.currentRoom.left = _.clone(_dataInLeftRoom);
        self.currentRoom.right = _.clone(_dataInRightRoom);

        self.eventMonitor.left = self.updateEventMonitor(_dataInLeftRoom, self.postersList.left);
        self.eventMonitor.right = self.updateEventMonitor(_dataInRightRoom, self.postersList.right);

        self.checkOverflow('left');
        self.checkOverflow('right');
        self.countPosters();
      }

          /**
           *  @function updateEventMonitor
           *  @description setup relating to the data rooms (right and left)
           *  receiving room and an array of posters and returns an array where each poster assigned to monitor saves an array of monitors,
           *  where the index of the array - is appointed monitor.
           *  sorting posters inside the monitor on the field 'startDate'
           *
           *  @param {Obgect} room - room
           *  @param {Array} posters - list of posters
           *
           *  @return {Array} eventMonitor - array of posters, where the index of the array - is appointed monitor
           */
      function updateEventMonitor(room, posters){
        var eventMonitor = [];

        _.each(room.monitors, function(monitor, index) {
          eventMonitor[index] = [];
        });

            /**
             *  Each poster assigned to monitor saves an array of monitors, where the index of the array - is appointed monitor
             */
        _.each(posters, function(el){
          if(el.room && el.room._id == room._id) {
            eventMonitor[el.monitor] = eventMonitor[el.monitor] || [];
            eventMonitor[el.monitor].push(el);
          }
        });
            /**
             * sorting posters on the field 'startDate'
             */
        eventMonitor.forEach(function(monitor, index){
          var _arr = _.sortBy(monitor, function(n){
            return n.startDate;
          })
          eventMonitor[index] = _arr;
        })
        return eventMonitor;
      }

          /**
           *  @function countPosters
           *  @description
           *  called when changing the room
           *  It counts the number of posters assigned room but not assigned to any monitor
           *
           */
      function countPosters() {
        var _leftRoom = self.currentRoom.left
          , _rightRoom = self.currentRoom.right;

        self.PostersOnRoomWithoutMonitor.left = _.where(self.postersList.left, {monitor: -1, room: _leftRoom._id}).length;
        self.PostersOnRoomWithoutMonitor.right = _.where(self.postersList.right, {monitor: -1, room: _rightRoom._id}).length;
      }

          /**
           *  @function onDropRoom
           *  @description
           *  called when posters is dropped on room and not on monitor
           *
           *  @param {Object} event
           *  @param {Object} element - dragged poster
           */
      function onDropRoom(event, element) {
        var _id = angular.element(element.draggable).data('id')
          , position = angular.element(event.target).data('position')
          , _currentRoom = self.currentRoom.left
          , _currentMonitors = self.eventMonitor.left
          , el
          , old_position = 'left'
          ,old_monitor;

            /**
             * receives from the database dragged poster for his ID
             */
        Posters.get({id: _id}).$promise.then(function(response) {
          el = response;
          old_monitor = _.clone(el.monitor)
          if(self.currentRoom.right._id == el.room) old_position = 'right';
          /**
          * exit from the function if this sort
          */
          if (!el) return;

          if (position == 'right'){
            _currentRoom = self.currentRoom.right;
            _currentMonitors = self.eventMonitor.right;
          }

          el.room = _currentRoom._id;
          el.monitor = -1;
          el.$save(function(el){
//            if(old_monitor != -1){
            self.eventMonitor[old_position][old_monitor].splice(el, 1)
            self.updateSorted(old_monitor, old_position, el.res[0]);
//            }else{
//              self.localUpdatePostersList(el.res[0], position)
//            }
          });
        })

      }

          /**
           * @function saveUpdatePosters
           * @description called when you need to save an array of altered posters
           * It saves the changes made in the posters, and updates the local list of posters
           *
           * @param {Array} posterArray - array of altered posters
           * @param {String} position - 'right' or 'left'
           *
           */
      function saveUpdatePosters(posterArray, position) {
        Posters.update(posterArray).$promise.then(function onSuccess(request){
          // notify the listener when the record is added
          console.log('=======', arguments[0]);
          var _resArray = request.res
          _resArray.forEach(function(el){
            self.localUpdatePostersList(el, position)
          })
        })
      };


          /**
           * @function updateSorted
           * @description called when the inside of the monitor are sorted posters
           * It updates sorted posters
           *
           * @param {Object} monitor - monitor
           * @param {String} position - 'right' or 'left'
           *
           */
      function updateSorted(monitor, position, transferred_poster) {
        var _room = self.currentRoom.left
            , _monitor = self.eventMonitor.left;
        if(position == 'right'){
          _room = self.currentRoom.right;
          _monitor = self.eventMonitor.right;
        }
        $timeout(function(){
          var startDate = _room.availability[0].startDate
              , endDate = _room.availability[0].endDate
              , presentationDuration = _room.presentationDuration
              , posterArray = [];

            _monitor[monitor].forEach(function(el, index){
//            if(startDate <= endDate){
              posterArray.push({
                _id: el._id,
                startDate: startDate,
                duration: presentationDuration,
                room: el.room._id
              })
              startDate += presentationDuration*60*1000;
//            }
          })
          if (transferred_poster) posterArray.push(transferred_poster);
          self.saveUpdatePosters(posterArray, position);
        },0)
      };

          /**
           * @function getPostersByRoomId
           * @description requests room by id
           *
           * @param {Object} room - room
           *
           * @return {Array} response.result - promise Rooms
           */
      function getPostersByRoomId(room) {
        return Posters.query({room_id: room._id}).$promise.then(function(response) {
          return response.result;
        });
      }

          /**
           * @function checkOverflow
           * @description called when the inside of the monitor are sorted posters
           * checks the total amount of time the monitor, with the number of posters assigned to that monitor.
           * allocates monitor if posters more than the allotted time
           *
           * @param {String} position - 'right' or 'left'
           */
      function checkOverflow(position) {
        var _room = self.currentRoom.left
            , _monitor = self.eventMonitor.left
            , _monitorOverflow = self.monitorOverflow.left;
        if(position == 'right'){
          _room = self.currentRoom.right;
          _monitor = self.eventMonitor.right;
          _monitorOverflow = self.monitorOverflow.right;
        }

        var startDate = _room.availability[0].startDate
            , endDate = _room.availability[0].endDate
            , duration = _room.presentationDuration *60*1000;

        _monitor.forEach(function(monitor, index) {
          var capacity = (endDate - startDate) / duration;
          if (capacity < monitor.length) {
            _monitorOverflow[index] = 'overflow';
          } else if (capacity === monitor.length) {
            _monitorOverflow[index] = 'filled';
          } else {
            _monitorOverflow[index] = 'empty';
          }
        });
      };

          /**
           * @function changeSelectedRoom
           * @description called when the selected room category
           * change the current room(according to the position) on the first appropriate for the selected category
           *
           * @param {String} position - 'right' or 'left'
           */
      function changeSelectedRoom(position) {
        var _firstFind = false
            , _category = self.selectedCategory.left;
        if(position == 'right'){
          _category = self.selectedCategory.right;
        }
        self.Rooms.forEach(function(room){
          if(room.category == _category && !_firstFind){
            _firstFind = true;
            if(position == 'left'){
              self.currentRoom.left = room;
            }
            if(position == 'right'){
              self.currentRoom.right = room;
            }
            self.selectionOnRoom();
          }
        })
      };

//      function datepicker() {
//        angular.element("#left-datepicker").datepicker();
//        angular.element("#right-datepicker").datepicker();
//      }
    }

  ]);
