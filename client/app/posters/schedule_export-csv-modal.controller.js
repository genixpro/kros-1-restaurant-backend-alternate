angular.module('newsApp')
  .controller('ExportModalInstanceCtrl', [
    '$scope', '$modalInstance', '$log','exportQuery','PostersExport',
    function($scope, $modalInstance, $log, exportQuery,PostersExport) {
      var self = this;
      var query=exportQuery;

      self.delimiterOptions=[',',';','^'];
      self.currentDelimiter=',';

      $scope.ok = function() {
        query.delimiter=self.currentDelimiter;

        return PostersExport.getSchedule(query).$promise.then(function(response) {
          window.open(response.url, '_blank', '');
          var delQuery={};
          delQuery.delUrl=response.url;
          PostersExport.remove(delQuery).$promise.then(function(response) {
          });
          $modalInstance.close();
        });

      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

    }
  ]);
