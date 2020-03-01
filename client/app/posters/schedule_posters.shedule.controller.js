'use strict'

/**
 * @class angular_module.newsApp.ScheduleCtrl
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs controller.
 * It display a table with all the posters in our database.
 *
 */
angular.module('newsApp')

    .controller('ScheduleCtrl', ['$scope', 'Posters', 'paginator', 'preLoadFilteredPosters', 'preLoadRooms', 'preLoadPresentationType', 'preLoadDateLinks', '$timeout', '$rootScope', '$modal',

      /**
       * @function ExportCsvCtrl
       *
       * @description all @params should be comply Injection Dependency
       *
       * @param $scope - angularjs $scope
       * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
       * @param paginator - This is an angularjs service - angular_module.newsApp.paginator.
       * @param {Object} preLoadFilteredPosters : {Array} preLoadFilteredPosters.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       * @param {Object} preLoadRooms : {Array} preLoadRooms.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       * @param {Object} preLoadPresentationType :
       *            {Array} preLoadPresentationType.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       *                                              preLoadPresentationType.result._id - the name of the type for which a request was made [_id=PresentationType]
       *                                              preLoadPresentationType.result.count - the number of posters with this type
       * @param $timeout - angularjs $timeout
       */

      function($scope, Posters, paginator, preLoadFilteredPosters, preLoadRooms, preLoadPresentationType, preLoadDateLinks, $timeout, $rootScope, $modal) {

        /**
         * @this - all the properties of this object will be used in templates with the prefix 'exportCsv'
         * (described in angular_module.newsApp.config.$stateProvider  property: controllerAs)
         * @example this.postersList - in the template should be used as a - schedule.postersList
         *
         */
        var self = this;

        /**
         * functions and variables used in the controller
         */
        self.postersList = preLoadFilteredPosters.result;

        self.Rooms = preLoadRooms.result;
        /**
         * add a string to the top of the array to select all rooms
         */
        self.Rooms.unshift({_id: '-- all (any type) --', title: '-- all ', roomName: ' (any/no session) --'});
        self.selectedRoom = self.Rooms[0];

        self.uniquePresentationType = preLoadPresentationType.result;
        /**
         * add a string to the top of the array to select all types
         */
        self.uniquePresentationType.unshift({_id: '-- all (any type) --'});
        self.noEmpty = noEmpty;
        self.uniquePresentationType = self.noEmpty();
        self.selectedPresentationType = self.uniquePresentationType[0];
        self.selectedDateFriendly = 'all the days';
        self.previousPage = previousPage;
        self.nextPage = nextPage;
        self.setPager = setPager;
        self.getPostersByFiltered = getPostersByFiltered;
        self.filteringByPresentationType = filteringByPresentationType;
        self.filteringBySearch = filteringBySearch;
        self.filteringByRoom = filteringByRoom;
        self.onPrint = onPrint;
        self.onExport = onExport;
        self.openNewWindow = openNewWindow;
        self.preparingDataPrint = preparingDataPrint;
        self.getAllPosters = getAllPosters;

        self.ui = {};
        self.ui.progress = 0;
        self.ui.inProgress = false;
        self.progressStart = progressStart;
        self.progressEnd = progressEnd;

        // pagination
        self.firstPage = 1; // get the 1st page
        self.paginator = paginator;

        self.exportArray=[];

        self.dateLinks=preLoadDateLinks;
        self.setPosterDate=setPosterDate;
        self.dateForTimezone=dateForTimezone;

        self.clearPosterDate=clearPosterDate;

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
          preparationDates()
        }

        /**
         * TODO: requires a description
         */
        function preparationDates(){
          var res = [];
          self.dateLinks.forEach(function(e){
            if(e.startDate){
              var _date = self.dateForTimezone(e.startDate, 'in Timezone');
              res.push(moment(_date).format('YYYY MMM DD'))
            }
          })
          res=_.uniq(res);

          res.sort(function(a,b){
            return new Date(a) - new Date(b);
          });
          self.dateLinks = res;
        }

        /**
         * @function setPager
         * @description It is called when returning filtered posters and sets the correct pagination
         * @param {Promise} data - data.page - number of page
         *                         data.num_pages - total pages
         */
        function setPager(data) {
          // set the pager if will request for 'all' page
          data.page = data.page || 1;
          paginator.setPage(data.page);
          paginator.setPrevious(data.page === 1);
          paginator.setNext(!data.num_pages || data.page === data.num_pages);
          paginator.setPages(data.num_pages);
          //
          // Add the total number of records returns in paginator
          paginator.total = data.total_all;
        };

        /**
         * @function previousPage
         * @description Browse the previous page of records, and updates the data in accordance with this change
         */
        function previousPage() {
          var page = paginator.getPage() - 1;
          // fetch the pages
          self.getPostersByFiltered(page).then(function(result) {
            self.postersList = result;
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
            self.postersList = result;
          })
        };


        /**
         *  @function getPostersByFiltered
         *  @description called when one of the parameters is changed to update the data in accordance with the changes
         *
         *  @param {Number} _page - the page number on which we pass a function call nextPage()/previousPage(). or get the current page from the service paginator
         *  @param {String} _type - current selectedPresentationType
         *  @param {String} _room - current selectedRoom
         *  @param {String} _search - the string entered by the user, is being searched
         *
         *  @return {Array} response.result - promise Posters
         */
        function getPostersByFiltered(_page, _type, _room, _search) {
          var _date_start = null
              , _date_end = null
              , _timezone = null
              , query = {};
          _timezone = window.moment.tz($rootScope.timezone).utcOffset();

          if (!_page ) _page = paginator.getPage();
          if (!_type ) _type = (self.selectedPresentationType._id == '-- all (any type) --') ? null : self.selectedPresentationType._id ;
          if (!_search) _search = self.search;
          if (!_room) _room = (self.selectedRoom._id == '-- all (any type) --') ? null : self.selectedRoom._id ;
          query = {page : _page, presentationType: _type, room: _room, search: _search, timezone: _timezone};
          if ($scope.dt) {
            //console.log('$scope.td',$scope.dt);
            _date_start = moment($scope.dt).format('x');
            _date_end = new Date($scope.dt);
            _date_end.setDate(_date_end.getDate()+1);
            _date_end = _date_end.getTime();
            query.date_start =  _date_start;
            query.date_end =  _date_end;
          }

          /**
           * @description Schedule screens should never display "Canceled" posters
           */
          query.canceled = false;

          /**
           * @description Schedule screens should never display posters with presentationType with 'empty'
           */
          query.no_empty = true;

          return Posters.query(query).$promise.then(function(response) {
            var body = response;
            /**
             * does not call function 'setPager' if there was a request to print data
             * as we returned to the page for printing and the data do not change
             */
            if(query.page != 'all'){
              self.setPager(body);
            }
            return body.result;
          });
        }

        /**
         * @function filteringByPresentationType
         * @description It is called when change variable self.selectedPresentationType, and updates the data in accordance with this change
         */
        function filteringByPresentationType() {
          self.getPostersByFiltered().then(function(result) {
            self.postersList = result;
          })
        }

        /**
         * @function filteringBySearch
         * @description It is called when change variable self.search, and updates the data in accordance with this change
         */
        function filteringBySearch() {
          self.getPostersByFiltered().then(function(result) {
            self.postersList = result;
          })
        }

        /**
         * @function filteringByRoom
         * @description It is called when change variable self.selectedRoom, and updates the data in accordance with this change
         */
        function filteringByRoom() {
          self.getPostersByFiltered().then(function(result) {
            self.postersList = result;
          })
        }

        /**
         *  @function today
         *  @description sets the current date
         */
//        $scope.today = function() {
//          $scope.dt = new Date();
//        };
//      $scope.today();

        /**
         *  @function clear
         *  @description clears the variable current date
         */
//        $scope.clear = function () {
//          $scope.dt = null;
//        };

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

        /**
         *  @function changeDate
         *  @description prevent the action of the default browser and stop the bubbling event
         *  sets variable opened in true
         *
         */
        $scope.changeDate = function() {
          self.getPostersByFiltered().then(function(result) {
            self.postersList = result;
          })
        };

        $scope.dateOptions = {
          formatYear: 'yyyy',
          startingDay: 1
        };

        /**
         *  @function onPrint
         *  @description opens the page print the selected (filtered) posters
         *
         */
        function onPrint() {
          self.progressStart();
          self.getAllPosters().then(function(result) {
//            self.printData = result;
//            self.preparingDataPrint()
            self.progressEnd();
            var newWin = self.openNewWindow("print friendly version of the report");
            newWin.document.write(result);
//            $timeout(function(){
//              window.print();
//            },0)
          })
        }

        function onExport() {
          var query={};
          query.presentationType = (self.selectedPresentationType._id == '-- all (any type) --') ? null : self.selectedPresentationType._id ;
          query.room = (self.selectedRoom._id == '-- all (any type) --') ? null : self.selectedRoom._id ;
          query.search=self.search;
          query.timezone = window.moment.tz($rootScope.timezone).utcOffset();
          if ($scope.dt) {
            var _date_start =$scope.dt;
            var _date_end = new Date($scope.dt);
            _date_end.setDate(_date_end.getDate()+1);
            _date_end = _date_end.getTime();
            if(typeof(_date_start) != 'number'){
              _date_start = _date_start.getTime();
            }
            query.date_start =  _date_start;
            query.date_end =  _date_end;
          }

          var modalInstance = $modal.open({
            templateUrl: 'app/posters/schedule_export-csv-modal.partial.html',
            controller: 'ExportModalInstanceCtrl',
            controllerAs: 'exportModal',
            resolve: {
              exportQuery:function(){
               return query
             }
            }
          });

        }

        /**
         *  @function openNewWindow
         *  @description opens new empty window; if window with this name is already opened, closes it and opens a new one
         *
         * @param {String} name - the name of new window
         *
         * @return {Object} newWindow - window object of new opened window
         */
        function openNewWindow(name) {
          var name = name || "";
          var newWin = window.open("", name);
          if(newWin.document.head.childNodes.length) {
            newWin.window.close();
            newWin = window.open("", name);
          }
          return newWin;
        }

        /**
         *  @function preparingDataPrint
         *  @description prepears data for print
         *
         */
        function preparingDataPrint() {
          self.printData.forEach(function(e){
            var _date = new Date(e.startDate)
                ,_year = _date.getFullYear()
                ,_month = _date.getMonth()
                ,_day = _date.getDate()
                , _sortDate =new Date(_year, _month, _day);
            e.sortDate = _sortDate.getTime()
          })
        }

        /**
         *  @function getAllPosters
         *  @description get all filtered posters
         *
         *  @return {Array} result - promise Posters
         */
        function getAllPosters() {
          return self.getPostersByFiltered('all').then(function(result) {
           return result;
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

        function clearActiveDates(){
          var arr = $('#datestamps a');

          for (var i = 0; i < arr.length; i++) {
            var el = arr[i];
              $(el).removeClass('label-default');
              $(el).removeClass('label-primary');
              $(el).addClass('label-primary');
          }
        }

        function setActiveDate(el){
          $(el).removeClass('label-primary');
          $(el).addClass('label-default');
          console.log(el);
        }

        function setPosterDate(date,sender){

          clearActiveDates();
          setActiveDate(event.target);

          $scope.dt=self.dateForTimezone(date, 'out Timezone');

          self.selectedDateFriendly = date;
          self.filteringBySearch();
        }

        function clearPosterDate(){

          clearActiveDates();
          setActiveDate(event.target);

          $scope.dt='';
          self.selectedDateFriendly = 'all the days';
          self.filteringBySearch();
        }

        /**
         *  @function noEmpty
         *  @description deletes the records in which the name of the presentationType is present "empty"
         */
        function noEmpty(){
          return _.reject(self.uniquePresentationType, function(item){
            return item._id&&!!~item._id.toLowerCase().indexOf('empty')
          });
        }

        /**
         *
         * TODO: requires a more description
         *
         *  @function dateForTimezone
         *  @description returns the date corresponding to your time zone
         *
         *  @param {date} date - date of receipt from the server
         *  @param {process} string - 'in Timezone' || 'out Timezone'
         *  @return {date} date corresponding to your time zone
         */
        function dateForTimezone(date, process){
          var dt = new Date(date),
            _timezone = window.moment.tz(dt, $rootScope.timezone).utcOffset();

          if(process == 'in Timezone'){
            dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
            dt.setMinutes(dt.getMinutes() + _timezone);
          }
          if(process == 'out Timezone'){
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            dt.setMinutes(dt.getMinutes() - _timezone);
          }
          return dt;
        }

      }
    ]);
