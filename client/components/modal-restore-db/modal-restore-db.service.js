'use strict';

angular.module('newsApp')
  .controller('RestoreModalInstanceCtrl', [
    '$scope', '$modalInstance', 'modalData', '$log',
    function($scope, $modalInstance, modalData) {

      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $modalInstance.result.then(modalData.cb, modalData.err);
    }
  ]);

angular.module('newsApp')
  .factory('modalRestoreDB', ['$modal', function($modal) {

    // Public API here
    return {
      // `record` to be deleted
      // `cb` callback function for delete logic
      open: function(cb, err) {
        $modal.open({
          templateUrl: 'components/modal-restore-db/modal-restore-db.html',
          controller: 'RestoreModalInstanceCtrl',
          resolve: {
            // `modalData` will be injected to `DeleteModalInstanceCtrl`
            //  dependencies
            modalData: function() {
              return {
                cb: cb,
                err: err
              }
            }
          }
        });
      }
    };
  }]);