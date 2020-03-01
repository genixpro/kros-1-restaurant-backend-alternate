
  'use strict';
  /**
   * @class angular_module.newsApp.config
   * @memberOf angular_module.newsApp
   *
   * @description This is an angularjs config.
   * sets the configuration application when we turn on the urls:
   * '/posters', '/posters/..', '/monitor', '/calendar', '/rooms-split',
   * '/upload-csv', '/export-csv', '/backup-restore'
   *
   */
  angular.module('newsApp')
    .config(Config);
  /**
   *  inject dependencies for @function Config
   */
  Config.$inject = ['$stateProvider'];
  /**
   * @function Config
   *
   * @description all @params should be comply Injection Dependency
   *
   * @param $stateProvider - angularjs $stateProvider
   *
   */
  function Config($stateProvider) {
    var states = {

      posters: {
        list : {
          url: '/posters-{mode}',
          views: {
            '': {
              templateUrl: 'app/posters/list_posters.html',
              controller: 'ClearBatchAssignmentCtrl',
              controllerAs: 'clearBatchAssignment',
              resolve: {
                preLoadCategories: preLoadCategories,
                preLoadCountPostersByPresentationType: preLoadCountPostersByPresentationType
              },
            },
            'leftPane@posters': {
              templateUrl: 'app/posters/list_view-list.html',
              controller: 'PostersListCtrl',
              controllerAs: 'listCtrl',
              resolve: {
                preLoadFilteredPosters: preLoadFilteredPosters(true,false)
              },
            }
          },
          resolve: {
            preLoadPresentationType: preLoadPresentationType
          },
          authenticate: true
        },
        add: {
          views: {
            'rightPane@posters': {
              templateUrl: 'app/posters/list_form.html',
              controller: 'PostersFormCtrl'
            }
          },
          authenticate: true
        },
        update: {
          url: '/:id/edit',
          views: {
            'rightPane@posters': {
              templateUrl: 'app/posters/list_form.html',
              controller: 'PostersFormCtrl'
            }
          },
          authenticate: true
        },
        details: {
          url: '/:id',
          views: {
            'rightPane@posters': {
              templateUrl: 'app/posters/list_view-details.html',
              controller: 'PostersDetailsCtrl'
            }
          },
          authenticate: true
        }
      },
      //// Calendar Screen
      calendar: {
        url: '/calendar',
        templateUrl: 'app/posters/calendar_calendar.html',
        controller: 'PostersCalendarCtrl',
        controllerAs: 'postersCalendar',
        resolve: {
          preLoadPostersByDate: preLoadPostersByDate,
          preLoadPresentationType: preLoadPresentationType,
          preLoadFilteredPosters: preLoadFilteredPosters(true,false)
        },
        authenticate: true
      },
      //// Rooms / Monitors Screen
      monitors: {
        url: '/monitors',
        templateUrl: 'app/posters/monitors_monitors.html',
        controller: 'PostersMonitorsCtrl',
        controllerAs: 'postersMonitors',
        resolve: {
          preLoadCategories: preLoadCategories,
          preLoadRooms: preLoadRooms,
          preLoadPresentationType: preLoadPresentationType,
          preLoadFilteredPosters: preLoadFilteredPosters(true,false)
        },
        params: {
          room : '',
          poster : ''
        },
        authenticate: true
      },
      //// Rooms Split Screen
      roomsSplit: {
        url: '/rooms-split',
        templateUrl: 'app/posters/rooms-split_rooms-split.html',
        controller: 'PostersRoomsSplitCtrl',
        controllerAs: 'postersRoomsSplit',
        resolve: {
          preLoadCategories: preLoadCategories,
//          preLoadPosters: preLoadPosters,
          preLoadRooms: preLoadRooms
        },
        params: {
          room : '',
          poster : ''
        },
        authenticate: true
      },
      //// Upload csv file screen
      uploadCsv: {
        url: '/upload-csv',
        templateUrl: 'app/posters/upload-csv.html',
        controller: 'UploadCsvCtrl',
        controllerAs: 'uploadCsv',
        authenticate: true
      },
      //// Upload csv file screen
      exportCsv: {
        url: '/export-csv',
        templateUrl: 'app/posters/export/export-csv.html',
        controller: 'ExportCsvCtrl',
        controllerAs: 'exportCsv',
        authenticate: true,
        resolve: {
          preLoadPosters: preLoadPosters
        }
      },
      //// Backup and Restore screen
      backupRestore: {
        url: '/backup-restore',
        templateUrl: 'app/posters/backup-restore_backup-restore.html',
        controller: 'BackupRestoreCtrl',
        controllerAs: 'backupRestore',
        authenticate: true
      },
      //// Schedule posters screen
      schedule: {
        url: '/schedule',
        templateUrl: 'app/posters/schedule_schedule.html',
        controller: 'ScheduleCtrl',
        controllerAs: 'schedule',
        authenticate: true,
        resolve: {
          preLoadRooms: preLoadRooms,
          preLoadPresentationType: preLoadPresentationType,
          preLoadFilteredPosters: preLoadFilteredPosters(true,false,true),
          preLoadDateLinks:preLoadDateLinks
        }
      },
      schedulePublic: {
        url: '/welcome',
        templateUrl: 'app/posters/schedule_schedule-public.html',
        // templateUrl: 'app/account/login/login.html',
        controller: 'ScheduleCtrl',
        controllerAs: 'schedule',
        // authenticate: true,
        resolve: {
          preLoadRooms: preLoadRooms,
          preLoadPresentationType: preLoadOnlyPresentationType,
          preLoadFilteredPosters: preLoadFilteredPosters(true,false,true),
          preLoadDateLinks:preLoadDateLinks
        }
      }
    };

    ////resolve function
    /**
     *  inject dependencies for @function preLoadPosters
     */
    preLoadPosters.$inject = ['Posters'];
    /**
     * @function preLoadPosters
     * @description all @params should be comply Injection Dependency
     * requests all posters
     *
     * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
     * @return {Array} response.result - promise Posters
     */
    function preLoadPosters(Posters){
      return Posters.query().$promise.then(function(response) {
        return response
      })
    }

    /**
     * @function preLoadFilteredPosters
     * @description sets the input parameters for the function 'filteredPostersByAssigned'
     *
     * @param {Boolean} assigned - option to request a poster: if it is 'true' - that will return all the posters,
     *                                                        if it is 'false' - it will return the posters are not "assigned"
     * @param {Boolean} canceled - option to request a poster: if it is 'true' - that will return all the posters,
     *                                                        if it is 'false' - it will return the posters are not "canceled"
     * @param {Boolean} no_empty - option to request a poster: if it is 'true' - that will return all the posters,
     *                                                        if it is 'false' - it will return the posters are not "empty" in name og the presentationType
     * @return {Function} - filteredPostersByAssigned
     */
    function preLoadFilteredPosters(assigned,canceled,no_empty){
      /**
       *  inject dependencies for @function filteredPostersByAssigned
       */
      filteredPostersByAssigned.$inject = ['Posters'];
      /**
       * @function filteredPostersByAssigned
       * @description all @params should be comply Injection Dependency
       * requests first ten of not assigned posters
       *
       * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
       * @return {Array} response.result - promise Posters
       */
      function filteredPostersByAssigned(Posters){
        return Posters.query({page : 1, assigned: assigned,canceled:canceled, no_empty: no_empty}).$promise.then(function(response) {
          return response
        })
      }
      return filteredPostersByAssigned;
    }

    /**
     *  inject dependencies for @function preLoadRooms
     */
    preLoadRooms.$inject = ['Rooms'];
    /**
     * @function preLoadRooms
     * @description all @params should be comply Injection Dependency
     * requests all rooms
     *
     * @param Rooms - This is an angularjs service - angular_module.newsApp.Rooms.
     * @return {Array} response.result - promise Rooms
     */
    function preLoadRooms(Rooms){
      return Rooms.query().$promise.then(function(response) {
        return response
      })
    }

    /**
     *  inject dependencies for @function preLoadPresentationType
     */
    preLoadPresentationType.$inject = ['Posters'];
    /**
     * @function preLoadPresentationType
     * @description all @params should be comply Injection Dependency
     * requests the names of all the unique presentationType
     *
     * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
     * @return {Array} response.result - promise Posters
     */
    function preLoadPresentationType(Posters){
      return Posters.unique({field: 'presentationType'}).$promise.then(function(response) {
        return response
      })
    }

    /**
     * inject dependencies for @function preLoadOnlyPresentationType
     */
    preLoadOnlyPresentationType.$inject = ['Posters'];
    /**
     * @function preLoadOnlyPresentationType
     * @description Gets a distinct list of the Presention Types of the posters
     *              in our database.
     *              Its a simplified version of "preLoadPresentationType" method.
     *
     * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
     * @return {Array} response.result - promise Posters
     */
    function preLoadOnlyPresentationType(Posters){
      return Posters.presentationTypes().$promise.then(function(response) {
        return response
      })
    }

    /**
     *  inject dependencies for @function preLoadCountPostersByPresentationType
     */
    preLoadCountPostersByPresentationType.$inject = ['PostersSummary'];
    /**
     * @function preLoadCountPostersByPresentationType
     * @description all @params should be comply Injection Dependency
     * requests the total number posters by presentationType
     *
     * @param PostersSummary - This is an angularjs service - angular_module.newsApp.PostersSummary.
     * @return {Object} response - promise Posters
     */
    function preLoadCountPostersByPresentationType(PostersSummary){
      return PostersSummary.totalNumber_posters_by_presentationType();
    }

    /**
     *  inject dependencies for @function preLoadCategories
     */
    preLoadCategories.$inject = ['Rooms'];
    /**
     * @function preLoadCategories
     * @description all @params should be comply Injection Dependency
     * requests the names of all the unique category
     *
     * @param Rooms - This is an angularjs service - angular_module.newsApp.Rooms.
     * @return {Array} response.result - promise Rooms
     */
    function preLoadCategories(Rooms){
      return Rooms.unique({field: 'category'}).$promise.then(function(response) {
        return response
      })
    }

    /**
     *  inject dependencies for @function preLoadPostersByDate
     */
    preLoadPostersByDate.$inject = ['Posters'];
    /**
     * @function preLoadPostersByDate
     * @description all @params should be comply Injection Dependency
     * requests all posters are assigned to the current month
     *
     * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
     * @return {Array} response.result - promise Posters
     */
    function preLoadPostersByDate(Posters){
      var today = new Date()
          ,month = today.getMonth()
          ,year = today.getFullYear()
          ,first_this_month = new Date(year, month, 1).getTime()
          ,first_next_month = new Date(year, month+1, 1).getTime();
      return Posters.query({date_start: first_this_month, date_end: first_next_month}).$promise.then(function(response) {
        return response
      })

    }
    preLoadDateLinks.$inject = ['Posters'];

    function preLoadDateLinks(Posters){
      /**
       * TODO: function "mongo.aggregate" does not work with non-registered users
       */
      //return Posters.unique({field: 'startDate'}).$promise.then(function(response) {
      //  return response.result
      //})
    return Posters.query().$promise.then(function(result) {
      return result.result
    });



    }

    $stateProvider
      .state('posters', states.posters.list)
      .state('posters.add', states.posters.add)
      .state('posters.update', states.posters.update)
      .state('posters.details', states.posters.details)

      .state('calendar', states.calendar)
      .state('monitors', states.monitors)
      .state('rooms-split', states.roomsSplit)
      .state('upload-csv', states.uploadCsv)
      .state('export-csv', states.exportCsv)
      .state('backup-restore', states.backupRestore)
      .state('schedule', states.schedule)
      .state('welcome', states.schedulePublic)
  }
