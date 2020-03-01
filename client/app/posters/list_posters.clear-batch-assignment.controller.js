'use strict'

/**
 * @class angular_module.newsApp.ClearBatchAssignmentCtrl
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs controller.
 * posters assigns rooms, cleans assigned posters, and remove all posters
 *
 */
angular.module('newsApp')
    .controller('ClearBatchAssignmentCtrl', ['$scope', '$stateParams', 'Posters', 'Rooms', '$state', 'preLoadCategories', 'preLoadPresentationType', 'preLoadCountPostersByPresentationType', 'toastr', 'Modal',
      /**
       * @function ClearBatchAssignmentCtrl
       *
       * @description all @params should be comply Injection Dependency
       *
       * @param $scope - angularjs $scope
       * @param $stateParams - angularjs $stateParams
       * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
       * @param Rooms - This is an angularjs service - angular_module.newsApp.Rooms.
       * @param $state - angularjs $state
       * @param {Object} preLoadCategories: {Array} preLoadCategories.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       * @param {Object} preLoadPresentationType:
       *            {Array} preLoadPresentationType.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       *                                              preLoadPresentationType.result._id - the name of the type for which a request was made [_id=PresentationType]
       *                                              preLoadPresentationType.result.count - the number of posters with this type only "non assigned"
       *
       * @param {Object} preLoadCountPostersByPresentationType:
       *             {Array} preLoadCountPostersByPresentationType.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       *                                              preLoadCountPostersByPresentationType.result._id - the name of the type for which a request was made [_id=PresentationType]
       *                                              preLoadCountPostersByPresentationType.result.count - the number of posters with this type "all posters"
       */
      function($scope, $stateParams, Posters, Rooms, $state, preLoadCategories, preLoadPresentationType, preLoadCountPostersByPresentationType, toastr, Modal) {
        /**
         * @this - all the properties of this object will be used in templates with the prefix 'postersCalendar'
         * (described in angular_module.newsApp.config.$stateProvider  property: controllerAs)
         * @example this.paginator - in the template should be used as a - postersCalendar.paginator
         *
         */
        var self = this;

        /**
         * functions and variables used in the controller
         */
        self.categories = _.clone(preLoadCategories.result);
        /**
         * add a string to the top of the array to select all types
         */
        self.categories.unshift('-- all --');
        self.selectedCategories = self.categories[0];

        self.presentationType = _.clone(preLoadCountPostersByPresentationType.result);
        /**
         * add a string to the top of the array to select all types
         */
        self.presentationType.unshift({_id: '-- all --'});
        self.selectedPresentationType = self.presentationType[0];

        /**
         *
         * TODO: check whether you need a variable " self.countPostersByPresentationType" and "preLoadPresentationType"
         */
        self.countPostersByPresentationType = preLoadCountPostersByPresentationType.result;

        self.loadAllPosters = loadAllPosters;
        self.loadAllRooms = loadAllRooms;
        self.postersUpdate = postersUpdate;
        self.assignment = assignment;
        self.savePosters = savePosters;
        self.progressStart = progressStart;
        self.progressEnd = progressEnd;
        self.onBatchAssignment = onBatchAssignment;
        self.onClearAssignment = onClearAssignment;
        self.onDelete = onDelete;

        self.posterCounter = 0;
        self.ui = {};
        self.ui.progress = 0;
        self.ui.inProgress = false;
        self.arrayUpdatedPosters = [];
        self.mode = $stateParams.mode;


        /**
         * end enumeration functions and variables used in the controller
         */

        /**
         * @function activate
         * It runs all the functions that need to be running when the controller is initialized
         */
        activate();
        function activate(){
          self.loadAllRooms().then(function(data){
            self.rooms = data.result;
          })
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
         *  @function loadAllPosters
         *  @description gets all posters
         *  @return {Object} response - promise Poster
         */
        function loadAllPosters(){
          return Posters.query().$promise.then(function(response) {
            return response;
          })
        }

        /**
         *  @function loadAllRooms
         *  @description gets all rooms
         *  @return {Object} response - promise Rooms
         */
        function loadAllRooms(){
          return Rooms.query().$promise.then(function(response) {
            return response;
          })
        }

        /**
         *  @function postersUpdate
         *  @description appoints the room and the monitor for the poster. itself called if the poster is already assigned
         *
         *  @param {String} room - id room where to assigned poster
         *  @param {Number} monitor - of a specified number of the monitor in the room
         *  @param {Number} startDate - date format [1432962000000]
         *  @param {Number} duration - in minutes
         */
        function postersUpdate(room, monitor, startDate, duration){
          /**
           *  unassigned posters does not remain
           */
          if(self.posters.length <= self.posterCounter) return
          /**
           *  poster has already been assigned, move to the next the poster
           */
          if(self.posters[self.posterCounter].room
              || self.posters[self.posterCounter].monitor != -1
              || (self.selectedPresentationType._id == '-- all --' ? false : self.selectedPresentationType._id != self.posters[self.posterCounter].presentationType)) {
            self.posterCounter ++;
            return postersUpdate(room, monitor, startDate, duration);
          }
          self.posters[self.posterCounter].room = room;
          self.posters[self.posterCounter].monitor = monitor;
          self.posters[self.posterCounter].startDate = startDate;
          self.posters[self.posterCounter].duration = duration;
          self.arrayUpdatedPosters.push(self.posters[self.posterCounter])
          self.posterCounter ++;
        }

        /**
         *  @function assignment
         *  @description for every room by the selected category and for each monitor in the room:
         *      assigned poster from startDate ending endDate with an interval duration
         */
        function assignment(){
          self.rooms.forEach(function(room){
            if(room.category == self.selectedCategories || self.selectedCategories == '-- all --'){

              room.monitors.forEach(function(monitor, index){
                var startDate = room.availability[0].startDate
                    , endDate = room.availability[0].endDate
                    , duration = room.presentationDuration
                    , _room = room._id
                    , _monitor = index;

                while(startDate < endDate && self.posters.length > self.posterCounter){
                  self.postersUpdate(_room, _monitor, startDate, duration);
                  startDate += duration*60*1000; //translating into millisecond
                }
              })
            }
          })
        }

        /**
         *  @function savePosters
         *  @description saves the modified posters, and after his return promises reloads the page
         */
        function savePosters(){
          Posters.update(self.arrayUpdatedPosters).$promise.then(function onSuccess(){
            // notify the listener when the record is added
            console.log('=======', arguments[0]);
            self.arrayUpdatedPosters = [];
            self.progressEnd();
            $state.go($state.current, {}, {reload: true});
            toastr.success('Posters have been assigned successfully.');
          })
        }

        /**
         *  @function onBatchAssignment
         *  @description load all posters, and then calls the function to assign. called by clicking on the button
         */
        function onBatchAssignment(){
          var message = "Are you sure you want to assign posters of <code>"+self.selectedPresentationType._id+"</code> type to sessions of <code>"+ self.selectedCategories +"</code> type?",
            title = 'Proced with the assignment';
          Modal.confirm({
            message:message ,
            title:title
          }).then(function() {
            self.progressStart();
            self.loadAllPosters().then(function (data) {
              self.posters = data.result;
              self.assignment();
              self.savePosters();
              self.posterCounter = 0;
            })
          })
        }

        /**
         *  @function onClearAssignment
         *  @description load all posters, and then calls the function to clear assign posters. called by clicking on the button
         */
        function onClearAssignment(){
          var message = '  Are you sure you want to clear all the assignments to rooms-monitors?',
              title = "Clear assignments";
          Modal.confirm({
            message: message,
            title:title
          }).then(function(){
            self.progressStart();
            Posters.clearAssignments().$promise.then(function onSuccess(){
              self.progressEnd();
              $state.go($state.current, {}, {reload: true});
              toastr.success('Posters have been assigned successfully.');
            })
          })
        }

        /**
         *  @function onDelete
         *  @description remove all posters and after his return promises reloads the page. called by clicking on the button
         */
        function onDelete(){
          var message = 'Are you sure you want to delete all the posters?',
              title = "Delete posters";
          Modal.confirm({
            message: message,
            title:title
          }).then(function(){
            self.progressStart();
            Posters.removeAll().$promise.then(function onSuccess(){
              console.log('=======', arguments[0]);
              self.progressEnd();
              toastr.success('Posters deleted successfully.');
              $state.go($state.current, {}, {reload: true});
            })
          })
        }

      }
    ]);
