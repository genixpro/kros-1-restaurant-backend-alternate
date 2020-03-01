'use strict';

angular.module('newsApp')
  .controller('SubmissioncodeCtrl', ['$scope', '$rootScope', '$sce', 'SubmissionCodes', 'conferenceName', '$stateParams', '$state',
    function($scope, $rootScope, $sce, SubmissionCodes, conferenceName, $stateParams, $state) {

      console.log('sub.ctlr');
      var conferenceKey = $stateParams.key;

      if (!conferenceKey) {
        $state.go('submissioncode_404');
      }


      var MSG_EMAIL_SENT     = '<p>An email with your submission code(s) is sent to you. ' +
                               'Please check your inbox.</p>';
      var MSG_EMAIL_NOT_SENT = '<p>The email address you provided is not associated'+
                               ' with any accepted abstracts submitted to ' + conferenceName + '. This may be due to the fact that you used'+
                               ' another email address for correspondence, during Abstract submission.</p>'+
                               '<p>Please make sure that you try with the same email address you used during abstract submission.</p>';
      var MSG_EMAIL_INVALID  = 'Invalid email address:'+' This does not seem to be a valid email address. Please make sure that you enter a valid email address.';

      var MSG_EMAIL_SHORT    = 'Please enter a valid mail address with more than five characters!';
      var MSG_ERROR          = 'An unexpected error occured.'

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      $scope.data = {};
      $scope.data.model = {};
      $scope.inbox = '';

      $scope.trust = $sce.trustAsHtml;

      $scope.data.model.isSupported = false;
      if (conferenceName != 'UNSUPPORTED') {
        console.log('true');
        $scope.data.model.isSupported = true;
        $scope.data.model.conferenceName = conferenceName;
      }


      /*jshint unused: false */
      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        setTimeout(function(){
          console.log('Hide loader');
          console.log('before: ', $scope.ui);
          $scope.ui.inProgress = false;
          console.log('before: ', $scope.ui);
          $(window).trigger('resize');
        }, 1000);

      }

      $scope.sendSubmissionCode = function(){

        if (!$scope.submissionForm.$valid) {
          alert(MSG_EMAIL_INVALID);
          return
        }

        var email = $scope.data.model.email;

        if (email.length < 6){
          alert(MSG_EMAIL_SHORT);
          return
        }

        $scope.ui.inProgress = true;
        $scope.inboxShow = false;
        $scope.inbox = '';

        SubmissionCodes.get(conferenceKey, email).then(function (response) {
            if (response.data.result) {
              $scope.inboxSuccess = true;
              $scope.inbox = MSG_EMAIL_SENT;
              $scope.inboxShow = true;
            } else {
              $scope.inboxSuccess = false;
              $scope.inbox = MSG_EMAIL_NOT_SENT;
              $scope.inboxShow = true;
            }

            $scope.data.model.email = '';
            $scope.ui.inProgress = false;
            console.log('Email sent with response: ', response);

          }, function (response) {
            if (response.status === 500) {  // when product id is not set
              $scope.inboxSuccess = false;
              $scope.inbox = MSG_ERROR;
              $scope.inboxShow = true;
            }

            $scope.data.model.email = '';
            $scope.ui.inProgress = false;
          });

        console.log('Email for submission code: ' + email);
      }

      $(window).trigger('resize');
    }
  ]);
