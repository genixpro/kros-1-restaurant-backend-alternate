'use strict';

angular.module('newsApp')
  .controller('CategoriesListCtrl', ['$scope', '$rootScope', '$http',
    '$location', 'paginator', 'Categories', '$log', '$translate',
    function($scope, $rootScope, $http, $location, paginator, Categories, $log, $translate) {

      $scope.order = {
        isDirty: false
      };

      $scope.data = {
        records: []
      };

      // fetch the records
      $scope.fetchCategories = function() {
        $scope.data.records = Categories.query()
      };

      $scope.fetchCategories();

      // listen for app selection
      $rootScope.$on('app:selected', function() {
        $scope.fetchCategories();
      });

      // listen to hide records list update event
      var listUpdatedListener = $rootScope.$on('list_updated',
        function() {
          $scope.fetchCategories();
        });

      /*jshint unused: false */
      $scope.sortableOptions = {
        update: function(e, ui) {
          $scope.order.isDirty = true;

          console.log('Order updated.');
          console.log('........... e. %o', e);
          console.log('.......... ui. %o', ui);
          console.log('........items. %o', $scope.data.records);
        },
        change: function(e, ui) {
          console.log('Order change.');
        }
      };
      /*jshint unused: true */


      $scope.saveOrder = function() {
        $scope.data.records.forEach(function(d, i) {
          $scope.data.records[i].weight = i;
          $scope.order.isDirty = true;
          $scope.data.records[i].$update(function() {
            $scope.order.isDirty = false;
          }, function(response) {
            $log.error('response', response);
          })
        })
        console.log('........items. %o', $scope.data.records);
      };

      // This method was arbitrarily renamed in order to test the js realignment / diffing mechanism
      $scope.renamedCancelOrder = function() {
        $scope.order.isDirtyBitches = false;
        // notify the listener when the category is added
        $scope.$emit('list_updated');
      };

      $scope.netNewTestingFunction = function() {
        console.log('I\'m an entirely new function!');
      };

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');

      $scope.changeLanguage = function(key) {
        $translate.use(key);
      };
    }
  ]);

angular.module('newsApp')
  .controller('CategoriesItemCtrl', ['$scope', '$log',
    'modalDeleteItem', 'Categories', 'Media', '$state',
    function($scope, $log, modalDeleteItem, Categories, Media, $state) {

      /**
       * Delete category item from the list
       */
      $scope.deleteCategory = function(category) {
        modalDeleteItem.open(function() {
          // Get the record and delete the image associated to it
          $scope.record = category
          if ($scope.record.media.length > 0) {
            var medias = [];
            for (var i = 0; i < $scope.record.media.length; i++) {
              medias.push($scope.record.media[i]._id);
            }
            Media.deleteList(medias);
          }
          $scope.record.$delete()
          $state.transitionTo('categories', {}, {
            reload: true
          });
        });
      };
    }
  ]);

angular.module('newsApp')
  .controller('CategoriesAddFormCtrl', ['$scope', 'Categories',
    '$log', '$timeout', '$state', 'Media', 'ImageUploader',
    function($scope, Categories, $log, $timeout, $state, Media, ImageUploader) {

      $scope.data = {
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the contols are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      /*jshint unused: false */
      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }
      /*jshint unused: true */

      /*
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForAdd($scope);

      /*
       * Delete temporary uploaded image
       */
      $scope.deleteImage = function() {
        $scope.data.uploadedImages = [];
        $scope.ui.progress = 0;
      };

      /*
       * Handle the add form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) {
          return;
        }

        progressStart();

        function saveCategory(mediaIds) {
          var data = {
            name: $scope.data.model.name,
            description: $scope.data.model.description,
            media: mediaIds
          };
          var newCategory = new Categories(data);
          newCategory.$save(function() {
            // notify the listener when the category is added
            $scope.$emit('list_updated');
            // display the updated form
            $state.transitionTo($state.current, {}, {
              reload: true
            });
          }, function(err) {
            $log.error('failed to add photo');
          })
        }

        function saveMedia() {
            // Move the uploaded images in its final possition
            // and create the related database entry.
            // TODO: a check for an empty array is required
            Media.create($scope.data.uploadedImages[0]).then(
              function onSuccess(responce) {
                console.log(responce);
                // Media is saved.
                // Saving Category
                var mediaIds = [];
                mediaIds.push(responce.data.result._id);
                saveCategory(mediaIds);
              },

              function onError(responce) {
                console.log(responce);
              }
            );
          } // saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of category
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveCategory([]);
        }
      };
    }
  ]);

angular.module('newsApp')
  .controller('CategoriesUpdateFormCtrl', [
    '$scope', '$rootScope', 'Categories', '$log',
    '$stateParams', '$state', '$location', 'Media', 'ImageUploader',
    function($scope, $rootScope, Categories, $log, $stateParams,
      $state, $location, Media, ImageUploader) {

      // When the user removes an image we are placing it in our thrash bin.
      // The content of this bin will be used during the from's save process.
      $scope.trashbin = [];

      $scope.data = {
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the controllers are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      // fetch single document

      Categories.get({id: $stateParams.id}).$promise.then(function(response) {
        $scope.data.model = response;
        // fetch the image
        if ($scope.data.model.media.length > 0) {
          $scope.data.model.picture = $scope.data.model.media[0].uri;
        }
      })

      /**
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForUpdate($scope);

      function deleteImage() {
        // Store the media id in order to delete
        // this entry in the future
        var mediaID;
        if ($scope.data.model.media.length > 0) {
          mediaID = $scope.data.model.media[0]._id;

          $scope.trashbin.push(mediaID);
          // Remove the image reference for the categories object
          $scope.data.model.media.splice(0, 1);
        }

        // Remove the image preview
        $scope.data.model.picture = '';
        // Set the progress bar
        $scope.ui.progress = 0;
      }

      /**
       * Delete the current image
       */
      $scope.deleteImage = function() {
        deleteImage();
      };

      /*
       * Handle the form submission
       */
      $scope.update = function() {
        // if the form is not valid then cut the flow
        if (!$scope.updateForm.$valid) {
          return;
        }

        progressStart();

        var toBeUpdateCategoryId = $scope.data.model._id;

        function saveCategory(mediaIds) {
          var existingIds = $scope.data.model.media;

          var mergedIds = existingIds.concat(mediaIds);
          $scope.data.model.media = mergedIds;

          console.log('$scope.data.model', $scope.data.model)


          $scope.data.model.$update(
            function() {
              progressEnd();
              // notify the listener when the category is added
              $rootScope.$emit('list_updated');
              // display the updated form
              $state.transitionTo('categories.details', {
                id: toBeUpdateCategoryId
              }, {
                reload: true
              });
            },
            function(error) {
              $log.error('error', error);
              progressEnd();
            })

        }

        function saveMedia() {
            // Move the uploaded images in its final possition
            // and create the related database entry.
            // TODO: a check for an empty array is required
            Media.create($scope.data.uploadedImages[0]).then(
              function onSuccess(responce) {
                console.log(responce);
                // Media is saved.
                // Saving Category
                var mediaIds = [];
                mediaIds.push(responce.data.result._id);
                saveCategory(mediaIds);
              },

              function onError(responce) {
                console.log(responce);
                progressEnd();
              }
            );
          } // saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of category
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveCategory([]);
        }

        // Clean up media placed in the trash bin
        function deleteMedia(id) {
          Media.delete(id).then(
            function onSuccess(responce) {
              console.log(responce);
            },

            function onError(responce) {
              console.log(responce);
            }
          );
        }

        for (var key in $scope.trashbin) {
          deleteMedia($scope.trashbin[key]);
        }

      };
    }
  ]);

angular.module('newsApp')
  .controller('CategoriesDetailsCtrl', ['$scope', '$stateParams',
    'Categories',
    function($scope, $stateParams, Categories) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      // fetch single category
      Categories.get({id: $stateParams.id}).$promise.then(function(response) {
        $scope.data.model = response;
        // fetch the image
        if ($scope.data.model.media.length > 0) {
          $scope.data.model.picture = $scope.data.model.media[0].uri;
        }
      })

    }
  ]);
