'use strict';

angular
    .module('newsApp')
    .directive('backupJson', backupJson);

backupJson.$inject = ['$parse', '$q', '$document', '$timeout'];
    function backupJson($parse, $q, $document, $timeout) {
      return {
        restrict:'A',
        scope:{
          data:'&backupJson',
          filename: '@filename'
        },
        controller: [
          '$scope',
          '$element',
          '$attrs',
          '$transclude',
          function ($scope, $element, $attrs, $transclude) {
            $scope.json = '';

            $scope.getFilename = function () {
              return $scope.filename || 'backup.json';
            };

            /**
             * Creates the JSON and updates the scope
             * @returns {*}
             */
            $scope.buildJSON = function () {
              var deferred = $q.defer();

              $scope.json = angular.toJson($scope.data())
              deferred.resolve( $scope.json);

              return deferred.promise;
            };
          }
        ],
        link:function (scope, element, attrs) {
          function doClick() {
            var blob = new Blob([scope.json], {type: "application/json"});

            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, scope.getFilename());
            } else {

              var downloadLink = angular.element('<a></a>');
              downloadLink.attr('href', window.URL.createObjectURL(blob));
              downloadLink.attr('download', scope.getFilename());
              downloadLink.attr('target', '_blank');

              $document.find('body').append(downloadLink);
              $timeout(function () {
                downloadLink[0].click();
                downloadLink.remove();
              }, null);
            }
          }

          element.bind('click', function (e) {
            scope.buildJSON().then(function (backupJson) {
              doClick();
            });
            scope.$apply();
          });
        }

      }
    }

