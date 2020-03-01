'use strict';

/**
 * @class angular_module.newsApp.PostersCalendarCtrl
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs controller.
 * It draws a calendar with all assigned posters and displays a list of unassigned posters
 *
 */
angular.module('newsApp')
  .controller('PostersCalendarCtrl', ['$scope', 'Posters', 'preLoadPresentationType', 'paginator', 'preLoadFilteredPosters', 'preLoadPostersByDate', '$timeout',
      /**
       * @function PostersCalendarCtrl
       *
       * @description all @params should be comply Injection Dependency
       *
       * @param $scope - angularjs $scope
       * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
       * @param {Object} preLoadPresentationType:
       *            {Array} preLoadPresentationType.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       *                                              preLoadPresentationType.result._id - the name of the type for which a request was made [_id=PresentationType]
       *                                              preLoadPresentationType.result.count - the number of posters with this type
       *
       * @param paginator - This is an angularjs service - angular_module.newsApp.paginator.
       * @param {Object} preLoadFilteredPosters: {Array} preLoadFilteredPosters.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       * @param {Object} preLoadPostersByDate: {Array} preLoadPostersByDate.result - This is function from resolve angular_module.newsApp.config.$stateProvider.
       * @param $timeout - angularjs $timeout
       *
       */
    function ($scope, Posters, preLoadPresentationType, paginator, preLoadFilteredPosters, preLoadPostersByDate, $timeout) {
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
      self.uniquePresentationType = preLoadPresentationType.result;
        /**
         * add a string to the top of the array to select all types
         */
      self.uniquePresentationType.unshift({_id: '-- all (any type) --'});
      self.selectedPresentationType = self.uniquePresentationType[0];
      self.assigned = true;
      self.canceled = false;
      self.filteredPostersList = preLoadFilteredPosters.result; //for ssearch panel
      self.postersList = preLoadPostersByDate.result; //for calendar

      self.currentEventsLog = currentEventsLog;
      self.calendarOuterDrop = calendarOuterDrop;
      self.eventsReload = eventsReload;
      self.getPosterById = getPosterById;
      self.calendarInnerDrop = calendarInnerDrop;
      self.currentEvents = [];
      self.filteringByAssigned = filteringByAssigned;
      self.getPostersByFiltered = getPostersByFiltered;
      self.previousPage = previousPage;
      self.nextPage = nextPage;
      self.filteringByPresentationType = filteringByPresentationType;
      self.filteringBySearch = filteringBySearch;
      self.isPosterAssigned = isPosterAssigned;
      self.setPager = setPager;
      self.filteringByDate = filteringByDate;
      self.updatePosters = updatePosters;
      self.addClickEvents = addClickEvents;
      self.setTimeSlot = setTimeSlot;
      self.clickEventsAdded = false;
      self.eventSources = [];
      self.timer = null;

      // pagination
      self.firstPage = 1; // get the 1st page
      self.paginator = paginator;
        /**
         * end enumeration functions and variables used in the controller
         */

        /**
         * @function activate
         * It runs all the functions that need to be running when the controller is initialized
         */
      activate();
      function activate() {
        self.setPager(preLoadFilteredPosters);
        self.eventsReload();
      }

      /**
       *  calendar config object
       */
      self.uiConfig = {
        calendar: {
          height: 450,
          editable: true,
          header: {
            left: 'month,agendaWeek,agendaDay',
            center: 'title',
            right: 'today prev,next'
          },
          droppable: true,
          /**
           *  @function
           *  @description called after pulling a poster from the outside into the calendar
           *  @param {Date} date - format [Sun Jul 05 2015 00:00:00 GMT+0300 (FET)]
           *  @param {Boolean} allDay - true if event lasts all day
           *  @param {Object} event
           */
          drop: function (date, allDay, event) {
            return self.calendarOuterDrop(date, allDay, event)
          },
          eventClick: function () {
          },
          /**
           *  @function
           *  @description called after dragging a poster inside the calendar
           *  @param {Object} - Data returned a calendar
           */
          eventDrop: function (e) {
            self.calendarInnerDrop(e._id, e._start)
          },
          eventResize: function () {
          },
          updateEvent: function () {
          },
          /**
           *  @function
           *  @description called after the change calendar view
           */
          viewDisplay: function () {
            if(!self.clickEventsAdded){
              self.addClickEvents();
            }
          }
        }
      };

        /**
         *  @function calendarOuterDrop
         *  @description
         *  called after pulling a poster from the outside into the calendar and updates the data of this poster
         *  @param {Date} date - format [Sun Jul 05 2015 00:00:00 GMT+0300 (FET)]
         *  @param {Boolean} allDay - true if event lasts all day
         *  @param {Object} event
         */
      function calendarOuterDrop(date, allDay, event) {
        // this function is called when something is dropped
        var _id = angular.element(event.target).data('id')
          , el;

        self.getPosterById(_id).then(function(response) {
          el = response;
          // if something went wrong, abort
          if (!el) return;
          if (el.start != date) {
            el.startDate = new Date(date).getTime();
          }
          el.start = date;
          el.allDay = allDay;
          el.$save();

          self.updatePosters();
        })
      }

        /**
         *  @function eventsReload
         *  @description
         *  update calendar data if you change posters(dragging) or changed the calendar view (ex: select another month, day, week)
         */
      function eventsReload() {

        if (self.timer) {
          self.timer.cancel();
        }

          /**
           *  @function $timeout
           *  @description
           *  It is used to get rid of the flicker and to speed up the display when there is a large number Poster (~ 1000)
           */
        self.timer = $timeout(function() {
          self.postersList.forEach(function (item) {
            item.start = new Date(item.startDate);
            self.currentEvents.push(item)
          });
          self.eventSources.push(self.currentEvents);
          self.timer = null;
        }, 0);
      }

        /**
         *  @function getPosterById
         *  @description requests poster by id
         *  @param {String} _id - ID dragged poster
         *  @return {Object} response - promise Poster
         */
      function getPosterById(_id) {
        return Posters.get({id: _id}).$promise.then(function(response) {
          return response
        })
      }

        /**
         *  @function calendarInnerDrop
         *  @description
         *  called after dragging a poster inside the calendar and updates the date of this poster
         *  @param {String} _id - ID dragged poster
         *  @param {Date} _date - format [Sun Jul 05 2015 00:00:00 GMT+0300 (FET)]
         */
      function calendarInnerDrop(_id, _date) {
        self.getPosterById(_id).then(function(response) {
          var body = response;
          body.startDate = (new Date(_date)).getTime();
          body.$save();

          self.updatePosters();
        });
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
         * @function isPosterAssigned
         * @deprecated check whether the assigned poster transferred to the server and now this function is not used
         * It can be used to highlight the desired poster in 'ng-class'
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

        return (hasRoom && hasMonitor);
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
         * @function filteringByDate
         * @description It is called when change variable self.search, and updates the data in accordance with this change
         * @param {Date} start - format [Sat Aug 01 2015 00:00:00 GMT+0300 (FET)]
         * @param {Date} end - format [Sat Aug 01 2015 00:00:00 GMT+0300 (FET)]
         * @return {Array} response.result - promise Posters
         */
      function filteringByDate(start, end) {
        var _start = start.getTime()
            , _end = end.getTime()
        return Posters.query({date_start : _start, date_end: _end}).$promise.then(function(response) {
          return response.result;
        });
      };

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
      };

        /**
         * @function currentEventsLog
         * @deprecated outputs posters in console
         */
      function currentEventsLog() {
        console.log('currentEventsLog', Posters.query());
      }

        /**
         * @function addClickEvents
         * @description when you update the calendar adds to the calendar click event
         */
      function addClickEvents() {
        self.setTimeSlot();
        self.clickEventsAdded = true;

        $('.fc-button-prev').click(function(){
          self.setTimeSlot();
          self.updatePosters();
        });

        $('.fc-button-next').click(function(){
          self.setTimeSlot();
          self.updatePosters();
        });

        $('.fc-button-today').click(function(){
          self.setTimeSlot();
          self.updatePosters();
        });

        $('.fc-button-agendaWeek').click(function(){
          self.setTimeSlot();
          self.updatePosters();
        });

        $('.fc-button-agendaDay').click(function(){
          self.setTimeSlot();
          self.updatePosters();
        });

        $('.fc-button-month').click(function(){
          self.setTimeSlot();
          self.updatePosters();
        });
      }

        /**
         * @function updatePosters
         * @description updates the calendar according to the selected time Range (month, week, day)
         * Range of time, is set variables: $scope.timeslot.startDate, $scope.timeslot.endDate
         */
      function updatePosters(){
        self.eventSources.splice(0, 1); //remove the event source, there is only one, to ensure all directive tracking is removed
        self.currentEvents = [];

        self.filteringByDate($scope.timeslot.startDate, $scope.timeslot.endDate).then(function(result) {
          self.postersList = result;
          self.eventsReload();
        })
      }

        /**
         * @function setTimeSlot
         * @description set range of time
         * @default timeslot.startDate the first day of the current month
         * @default timeslot.endDate the last day of the current month
         */
      function setTimeSlot(){
        var _t = angular.element('#calendar').fullCalendar( 'getView' );
        $scope.timeslot= {
          startDate : _t.start,
          endDate : _t.end
        };
      }

  }]);
