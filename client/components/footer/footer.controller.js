'use strict';

angular.module('newsApp')
    .controller('FooterCtrl', function($scope) {

      angular.element(document).ready(function () {
        $(window).trigger('resize');
      });

    });
