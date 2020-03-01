  'use strict';
  /**
   * @class angular_module.newsApp.PostersMonitorsCtrl
   * @memberOf angular_module.newsApp
   *
   * @description This is an angularjs controller.
   * It displays room with monitors in which you can drag posters
   *
   */
  angular.module('newsApp')
    .controller('PostersMonitorsCtrl', ['$scope', 'Posters', 'preLoadRooms', 'paginator', 'preLoadPresentationType', 'preLoadFilteredPosters', '$state', '$timeout', 'preLoadCategories', 'PostersLintSummary', 'Rooms',
        /**
         * @function PostersMonitorsCtrl
         *
         * @description all @params should be comply Injection Dependency
         *
         * @param $scope - angularjs $scope
         * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
         * @param {Object} preLoadRooms: {Array} preLoadRooms.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
         * @param paginator - This is an angularjs service - angular_module.newsApp.paginator.
         * @param {Object} preLoadPresentationType:
         *            {Array} preLoadPresentationType.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
         *                                              preLoadPresentationType.result._id - the name of the type for which a request was made [_id=PresentationType]
         *                                              preLoadPresentationType.result.count - the number of posters with this type
         *
         * @param {Object} preLoadFilteredPosters: {Array} preLoadFilteredPosters.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
         * @param $state - angularjs $state
         * @param $timeout - angularjs $timeout
         * @param {Object} preLoadCategories: {Array} preLoadCategories.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
         * @param {Object} PostersLintSummary: This is an angularjs service - angular_module.newsApp.PostersLintSummary.
         * @param {Object} Rooms: This is an angularjs service - angular_module.newsApp.Rooms.
         */
    function($scope, Posters, preLoadRooms, paginator, preLoadPresentationType, preLoadFilteredPosters, $state, $timeout, preLoadCategories, PostersLintSummary, Rooms) {
          /**
           * @this - all the properties of this object will be used in templates with the prefix 'postersMonitors'
           * (described in angular_module.newsApp.config.$stateProvider  property: controllerAs)
           * @example this.paginator - in the template should be used as a - postersMonitors.paginator
           *
           */
      var self = this;
          /**
           * functions and variables used in the controller
           */
      self.Rooms = preLoadRooms.result;
      self.uniquePresentationType = preLoadPresentationType.result;
          /**
           * add a string to the top of the array to select all types
           */
      self.uniquePresentationType.unshift({_id: '-- all (any type) --'});
          /**
           * The first PresentationType of the array of uniquePresentationType equals '-- all (any type) --'
           */
      var firstPresentationType = self.uniquePresentationType[0];
      self.selectedPresentationType = firstPresentationType;

      self.filteredPostersList = preLoadFilteredPosters.result;
      self.assigned = true;
      self.canceled = false;
      self.categories = preLoadCategories.result;
          /**
           * add a string to the top of the array to select all
           */
      self.categories.unshift('-- all --');
          /**
           * The first category of the array of categories equals '-- all --'
           */
      var firstCategory = self.categories[0];
      self.selectedCategory = firstCategory;

      self.statesRoom = ['-- all (any state) --', 'Empty', 'Overflown'];
          /**
           * The first statesRoom of the array of statesRoom equals '-- all (any state) --'
           */
      var firstStatesRoom = self.statesRoom[0];
      self.selectedStateRoom = firstStatesRoom;
      self.checkState = checkState;
      self.getRoomsByFiltered = getRoomsByFiltered;
      self.updateRooms = updateRooms;

      self.onDropMonitor = onDropMonitor;
      self.currentEventsLog = currentEventsLog;
      self.countPosters = countPosters;
      self.selectionOnRoom = selectionOnRoom;
      self.onDropRoom = onDropRoom;
      self.onDropTrash = onDropTrash;
//      self.datepicker = datepicker;
      self.filteringByAssigned = filteringByAssigned;
      self.isPosterAssigned = isPosterAssigned;
      self.getPostersByRoomId = getPostersByRoomId;
      self.getPostersByFiltered = getPostersByFiltered;
      self.selectionMonitors = selectionMonitors;
      self.previousPage = previousPage;
      self.nextPage = nextPage;
      self.filteringByPresentationType = filteringByPresentationType;
      self.filteringBySearch = filteringBySearch;
      self.setPager = setPager;
      self.updateSorted = updateSorted;
      self.saveUpdatePosters = saveUpdatePosters;
      self.checkOverflow = checkOverflow;
      self.localUpdatePostersList = localUpdatePostersList;
      self.changeSelectedRoom = changeSelectedRoom;
      self.changeSelectedState = changeSelectedState;

      self.monitorOverflow = [];
      self.eventMonitor = [];
          /**
           * The first room of the array of rooms
           */
      var firstRoom = self.Rooms[0];
          /**
           * If we pass on the link to the room this room must be current. by default, the first of an array of rooms
           */
      self.currentRoom =  _.findWhere(self.Rooms, {_id: $state.params.room}) || firstRoom || {};
      self.selectedPoster = $state.params.poster;

      // pagination
      self.firstPage = 1; // get the 1st page

      self.posterDynamicPopover = {
        templateUrl: 'posterPopoverTemplate.html',
      };

      /*
      * I'm not sure whether this variable is needed but until leave
      */
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
        self.selectionOnRoom();
//        self.datepicker();
      }

          /**
           * option to sort the posters inside the monitor
           */
      self.sortableOptions = {
        update: function(e, ui) {
          console.log("Monitor updated:", e, e.target.dataset.index);
//          var monitor = angular.element(e.target).data('index');
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
          , monitor_index = angular.element(event.target).data('index')
          , sortOnly = false
          , el
          ,old_monitor;

          /**
           * receives from the database dragged poster for his ID
           */
        Posters.get({id: _id}).$promise.then(function(response) {
          el = response;
          old_monitor = _.clone(el.monitor)
          /**
           * exit from the function if the poster could not be found
           */
          if (!el) return;

          //check on sortable
          if(el.monitor == monitor_index && el.room == self.currentRoom._id) sortOnly = true;
          /**
           * exit from the function if this sort
           */
          if(sortOnly) {
            self.updateSorted(monitor_index);
            return;
          }

          el.monitor = monitor_index;
          el.room = self.currentRoom._id;
          el.duration = self.currentRoom.presentationDuration;

          /**
           * counting time is already assigned to other posters
           */
          var busyTime = self.eventMonitor[monitor_index] ? self.eventMonitor[monitor_index].length * self.currentRoom.presentationDuration * 60*1000 : 0;
          el.startDate = self.currentRoom.availability[0].startDate + busyTime;

          el.$save(function(el){
            if(old_monitor != -1){
              self.eventMonitor[old_monitor].splice(el, 1)
              self.updateSorted(old_monitor, el.res[0]);
            }else{
              self.localUpdatePostersList(el.res);
            }
          });
        })
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
          , el
          ,old_monitor;

          /**
           * receives from the database dragged poster for his ID
           */
        Posters.get({id: _id}).$promise.then(function(response) {
          el = response;
          old_monitor = _.clone(el.monitor)

          /**
           * exit from the function if this sort
           */
          if (!el) return;

          el.monitor = -1;
          el.room = self.currentRoom._id;

          el.$save(function(el){
            if(old_monitor != -1){
              self.eventMonitor[old_monitor].splice(el, 1)
              self.updateSorted(old_monitor, el.res[0]);
            }else{
              self.localUpdatePostersList(el.res);
            }
          });
        })
      }

    /**
           *  @function onDropTrash
           *  @description
           *  called when posters is dropped on room and not on monitor
           *
           *  @param {Object} event
           *  @param {Object} element - dragged poster
           */
      function onDropTrash(event, element) {
        var _id = angular.element(element.draggable).data('id')
          , el
          , old_monitor;

          /**
           * receives from the database dragged poster for his ID
           */
        Posters.get({id: _id}).$promise.then(function(response) {
          el = response;
          old_monitor = _.clone(el.monitor)

          /**
           * exit from the function if this sort
           */
          if (!el) return;

          el.monitor = -1;
          el.room = null;
          el.startDate = null;
          el.duration = 0;

          el.$save(function(el){
            if(old_monitor != -1){
              self.eventMonitor[old_monitor].splice(el, 1)
              self.updateSorted(old_monitor, el.res[0]);
            }else{
              self.localUpdatePostersList(el.res);
            }
          });
        })
      }

          /**
           * @function currentEventsLog
           * @deprecated outputs posters in console
           */
      function currentEventsLog() {
        console.log('currentEventsLog', Posters.get());
      }

          /**
           *  @function selectionOnRoom
           *  @description
           *  called when changing the current room
           *  getting room for her ID and setup relating to the data room
           */
      function selectionOnRoom() {
        self.getPostersByRoomId().then(function(result){
          self.selectedRoomPostersList = result;

          self.selectionMonitors();
          self.checkOverflow();
          self.countPosters();
        });
      }

          /**
           *  @function localUpdatePostersList
           *  @description
           *  called after an update any a poster
           *  remove from the list of posters altered poster and add to that list updated poster
           *
           *  @param {Array} result - updated poster
           */
      function localUpdatePostersList(result) {
        result.forEach(function(el){
          var deletedElementIndex = _.indexOf(self.selectedRoomPostersList, _.findWhere(self.selectedRoomPostersList, {_id: el._id}))
          if(deletedElementIndex !== -1){
            self.selectedRoomPostersList.splice(deletedElementIndex, 1)
          }
          self.selectedRoomPostersList.push(el);
        });
        /**
         * update the list of unassigned posters
         */
        self.getPostersByFiltered().then(function(result) {
          self.filteredPostersList = result;
        });

        self.selectionMonitors();
        self.checkOverflow();
        self.countPosters();
        self.updateRooms();

      }

          /**
           *  @function selectionMonitors
           *  @description
           *  called after an update any a poster
           *  remove from the list of posters altered poster and add to that list updated poster
           *  sorting posters inside the monitor on the field 'startDate'
           */
      function selectionMonitors(){
        self.eventMonitor = [];

        if (self.currentRoom) {
          _.each(self.currentRoom.monitors, function(monitor, index) {
            self.eventMonitor[index] = [];
          });
        }

            /**
             *  Each poster assigned to monitor saves an array of monitors, where the index of the array - is appointed monitor
             */
        self.selectedRoomPostersList.forEach(function (item) {
          if(item.room) {
            self.eventMonitor[item.monitor] = self.eventMonitor[item.monitor] || [];
            self.eventMonitor[item.monitor].push(item);

          }
        });
            /**
             * sorting posters on the field 'startDate'
             */
        self.eventMonitor.forEach(function(monitor, index){
          var _arr = _.sortBy(monitor, function(n){
            return n.startDate;
          })
          self.eventMonitor[index] = _arr;
        })
      }

          /**
           *  @function countPosters
           *  @description
           *  called when changing the current room
           *  It counts the number of posters assigned room but not assigned to any monitor
           *
           */
      function countPosters() {
        self.PostersOnRoomWithoutMonitor = _.where(self.selectedRoomPostersList, {monitor: -1}).length;
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
           *  @function filteringByAssigned
           *  @description It is called when change variable self.assigned, and updates the data in accordance with this change
           */
      function filteringByAssigned() {
        self.getPostersByFiltered().then(function(result) {
          self.filteredPostersList = result;
        })

      }

//      function datepicker() {
//        angular.element("#datepicker").datepicker();
//      }

          /**
           * @function getPostersByRoomId
           * @description requests room by id
           *
           * @return {Array} response.result - promise Rooms
           */
      function getPostersByRoomId() {
        return Posters.query({room_id: self.currentRoom._id}).$promise.then(function(response) {
          return response.result;
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
           * @function filteringByPresentationType
           * @description It is called when change variable self.selectedPresentationType, and updates the data in accordance with this change
           */
      function filteringByPresentationType() {
        self.getPostersByFiltered().then(function(result) {
          self.filteredPostersList = result;
        })
      };

          /**
           * @function filteringBySearch
           * @description It is called when change variable self.search, and updates the data in accordance with this change
           */
      function filteringBySearch() {
        self.getPostersByFiltered().then(function(result) {
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
           * @function saveUpdatePosters
           * @description called when you need to save an array of altered posters
           * It saves the changes made in the posters, and updates the local list of posters
           *
           * @param {Array} posterArray - array of altered posters
           *
           */
      function saveUpdatePosters(posterArray) {
        Posters.update(posterArray).$promise.then(function onSuccess(request){
          // notify the listener when the record is added
          console.log('=======', arguments[0]);
          var _resArray = request.res
          self.localUpdatePostersList(_resArray)

//          _resArray.forEach(function(el){
//            self.localUpdatePostersList(el)
//          })
        })
      };

          /**
           * @function updateSorted
           * @description called when the inside of the monitor are sorted posters
           * It updates sorted posters
           *
           * @param {Object} monitor - monitor
           * @param {Object} transferred_poster - poster which was transferred to another monitor
           *
           */
      function updateSorted(monitor, transferred_poster) {
         $timeout(function(){
          var startDate = self.currentRoom.availability[0].startDate
              , endDate = self.currentRoom.availability[0].endDate
              , presentationDuration = self.currentRoom.presentationDuration
              , posterArray = [];

          self.eventMonitor[monitor].forEach(function(el, index){
            posterArray.push({
              _id: el._id,
              startDate: startDate,
              duration: presentationDuration,
              room: el.room._id
            })
            startDate += presentationDuration*60*1000;
          })
           if (transferred_poster) posterArray.push(transferred_poster)
           self.saveUpdatePosters(posterArray);
         },0)
      };

          /**
           * @function checkOverflow
           * @description called when the inside of the monitor are sorted posters
           * checks the total amount of time the monitor, with the number of posters assigned to that monitor.
           * allocates monitor if posters more than the allotted time
           */
      function checkOverflow() {
        var startDate = self.currentRoom.availability ? self.currentRoom.availability[0].startDate : 0
          , endDate = self.currentRoom.availability ? self.currentRoom.availability[0].endDate : 0
          , duration = self.currentRoom.presentationDuration * 60 * 1000;

        self.eventMonitor.forEach(function (monitor, index) {
          var capacity = (endDate - startDate) / duration;
          if (capacity < monitor.length) {
            self.monitorOverflow[index] = 'overflow';
          } else if (capacity === monitor.length) {
            self.monitorOverflow[index] = 'filled';
          } else {
            self.monitorOverflow[index] = 'empty';
          }
        })

//        PostersLintSummary.summaryData().then(function(result){
//          self.summary = result
//        });
      };

          /**
           * @function changeSelectedRoom
           * @description called when the selected room category
           * change the current room on the first appropriate for the selected category
           */
      function changeSelectedRoom() {
        self.getRoomsByFiltered().then(function(result){
          if(self.selectedCategory != '-- all --') self.currentRoom =  {};
          if(result.length){
            self.Rooms = result;
            if(!self.currentRoom._id) self.currentRoom =  self.Rooms[0];
            self.selectionOnRoom();
          }
        });
      }

          /**
           * @function changeSelectedState
           * @description called when the selected room state
           * change the current room on the first appropriate for the selected state
           */
      function changeSelectedState() {
        self.getRoomsByFiltered().then(function(result){
          if(self.selectedStateRoom != '-- all (any state) --') self.currentRoom =  {};
          if(result.length){
            self.Rooms = result;
            if(!self.currentRoom._id) self.currentRoom =  self.Rooms[0];
            self.selectionOnRoom();
          }
        });
      }


          /**
           * @function checkState
           * @deprecated doing on server
           * @description
           * checks the state the room(emty or overflown)
           */
      function checkState(room, type) {
        var _state = '';
        if(self.summary){
          if(type.toLowerCase() == 'overflown'){
            _state = _.findWhere(self.summary.stateRoom.overflown, {room: room._id})
          }
          if(type.toLowerCase() == 'empty'){
            _state = _.findWhere(self.summary.stateRoom.empty, {room: room._id})
          }
        }
        if(_state) return type

      };

        /**
         *  @function getRoomsByFiltered
         *  @description called when one of the parameters is changed to update the data in accordance with the changes
         *
         *  @param {String} _category - current selectedCategory
         *  @param {String} _state - current selectedStateRoom
         *
         *  @return {Array} response.result - promise Posters
         */
        function getRoomsByFiltered(_category, _state) {
          if (!_category) _category = (self.selectedCategory == '-- all --') ? null : self.selectedCategory;
          if (!_state ) _state = (self.selectedStateRoom == '-- all (any state) --') ? null : self.selectedStateRoom ;

          return Rooms.query({category : _category, state: _state}).$promise.then(function(response) {
            var body = response;

            return body.result;
          });
        }

          /**
           *  @function updateRooms
           *  @description
           *  called after an update any a poster
           *  updat romms list (self.Rooms)
           *
           */
        function updateRooms(){
          self.getRoomsByFiltered().then(function(result){
            if(result.length){
              self.Rooms = result;
              self.currentRoom = _.findWhere(self.Rooms, {_id: self.currentRoom._id})
            }else{
              self.currentRoom ={};
            }
          });
        }

    }
  ]);
