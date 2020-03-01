'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    preLoadConferenceName.$inject = ['$stateParams', 'SubmissionCodes'];
    function preLoadConferenceName($stateParams, SubmissionCodes){
      var key = $stateParams.key;

      console.log('preLoadConferenceName...');
      return SubmissionCodes.conference(key).then(function(response){
        return response.data.result;
      });
    }


    $stateProvider
      .state('submissioncode_404', {
        url: '/submissioncode',
        templateUrl: 'app/submissioncode/submissioncode-404.html'
      })
      .state('submissioncode', {
        url: '/submissioncode/:key',
        templateUrl: 'app/submissioncode/submissioncode.html',
        controller: 'SubmissioncodeCtrl',
        resolve: {
          conferenceName: preLoadConferenceName
        }
      });
  });
