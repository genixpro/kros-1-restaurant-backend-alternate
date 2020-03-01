'use strict';

angular.module('newsApp')
  .directive('dashboardConference', function () {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/main/conference/conference.main.html',
      scope: {},
      controller: function($scope, $filter, $rootScope, PostersLintSummary, PostersSummary) {
      
        console.log('Dashboard confernrce controller')
        var summary = {};
        $scope.summary = summary;
        
        PostersSummary.summaryPosters().then(function (data) {
          $scope.summary.totalNumber_posters = data.totalNumber_posters.count
          $scope.summary.totalNumber_presentationTypes = data.totalNumber_presentationTypes
          $scope.summary.totalNumber_posters_by_presentationType = data.totalNumber_posters_by_presentationType
        })
        
        PostersSummary.summaryRooms().then(function (data) {
          $scope.summary.totalNumber_rooms = data.totalNumber_rooms.count
          $scope.summary.totalNumber_categories = data.totalNumber_categories.count
          $scope.summary.totalNumber_rooms_by_categories = data.totalNumber_rooms_by_categories
        })
        
        PostersSummary.summaryRooms().then(function (data) {
          $scope.summary.totalNumber_rooms = data.totalNumber_rooms.count
          $scope.summary.totalNumber_categories = data.totalNumber_categories.count
          $scope.summary.totalNumber_rooms_by_categories = data.totalNumber_rooms_by_categories
        })
        
        PostersLintSummary.summaryData().then(function (data) {
          $scope.summary.totalNumber_empty_sessions = data.SessionsEmpty
          $scope.summary.totalNumber_overflown_sessions = data.SessionsOverflown
          $scope.summary.totalNumber_non_assigned_posters = data.PostersNonAssigned
        })

        
        $scope.dateDay = $filter('date')(new Date(), 'EEE');
        $scope.dateShort = $filter('date')(new Date(), 'MMMM d, y');

        var check = function(){
          PostersLintSummary.summaryData().then(function(result){
            console.log('result', result)
            $scope.summary.totalNumber_empty_sessions = result.SessionsEmpty;
            $scope.summary.totalNumber_overflown_sessions =  result.SessionsOverflown;
            $scope.summary.totalNumber_non_assigned_posters = result.PostersNonAssigned;
          });
        };

        $scope.check = check;
        
        
      }
    }
  
  })
