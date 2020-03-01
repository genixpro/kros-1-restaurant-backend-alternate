'use strict';

angular.module('newsApp')
  .controller('ItemsListCtrl', ['$scope', '$rootScope', '$http',
    'Items', 'Categories', '$log', '$translate', '$stateParams', '$state',
    function($scope, $rootScope, $http, Items, Categories, $log, $translate, $stateParams, $state) {

      /*jshint unused: false */
      $scope.changeselectedCategory = function() {
        var category = $scope.selectedCategory ? $scope.selectedCategory.name : 'all'
        if (category && category != $stateParams.category) {
          $state.transitionTo('items', {
            category: category
          }, {reload: false});
        }
      }

      /*jshint unused: true */

      $scope.order = {
        isDirty: false
      };

      $scope.data = {
        records: []
      };


      $scope.fetchItems = function() {
          // fetch the items
        Items.get({
          page: 1
        }).then(function(response) {
          var body = response.data;
          $scope.data.records = [];
          $scope.data.records = body.result;
        });
      };

      $scope.fetchItemsByCategory = function() {
        Items.getByCategory($scope.selectedCategory._id).then(function(response) {
          var body = response.data;
          $scope.data.records = [];
          $scope.data.records = body.result;
          $scope.data.records.forEach(function(record) {
            record.category = $scope.selectedCategory;
          })
        });
      };

      $scope.selectStateCategory = function() {
        if ($scope.selectedCategory) {
          return
        }
        else {
           $scope.selectedCategory = $stateParams.category != 'all' ? $stateParams.category : $scope.selectedCategory
        }

        $scope.selectedCategory = $stateParams.category
        if ($stateParams.category == 'all') {
          $scope.selectedCategory = undefined;
          $scope.fetchItems()
        }
        else {
          $scope.categories.forEach(function(category) {
            if (category.name == $stateParams.category) {
              $scope.selectedCategory = category;
            }
          })
          if ($scope.selectedCategory) {
            $scope.fetchItemsByCategory()
          }
        }

      };


//      $scope.fetchItems();

      // listen for app selection
      $rootScope.$on('app:selected', function() {
//        $scope.fetchItems(); // refresh items
//        $scope.fetchCategories();
      });

      $scope.fetchCategories = function() {
        Categories.query().$promise.then(function onSuccess(response) {
          $scope.categories = response;
          $scope.selectStateCategory()
          // $scope.selectedCategory = $scope.categories[0];
        }, function(error) {
          console.error('Failed to fetch the categories', error);
        });
      };
      $scope.fetchCategories();
      // initialization
      (function() {
        //$scope.fetchCategories();
      })();

      // listen to list updated event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {
        $scope.fetchItems();
      });

      /*jshint unused: false */
      $scope.sortableOptions = {
        update: function(e, ui) {
          $scope.order.isDirty = true;

          console.log('Order updated.');
          console.log('........... e. %o', e);
          console.log('.......... ui. %o', ui);
          console.log('........records. %o', $scope.data.records);
        },
        change: function(e, ui) {
          console.log('Order change.');
        }
      };
      /*jshint unused: true */

      var updateRecord = function(id, data) {
        return Items.update(id, data)
          .then(function onSuccess() {
            $scope.order.isDirty = false;
          }, function onError(response) {
            $log.error('response', response);
          });
      };

      $scope.saveOrder = function() {
        for(var i in $scope.data.records) {
          $scope.data.records[i].weight = i;

          console.log('$scope.data.records[i]', $scope.data.records[i])


          var data = {
            name: $scope.data.records[i].name,
            intro: $scope.data.records[i].intro,
            description: $scope.data.records[i].description,
            category: $scope.data.records[i].category,
            prices: $scope.data.records[i].prices,
            media: $scope.data.records[i].media,
            weight: $scope.data.records[i].weight,
            tax: $scope.data.records[i].tax,
            preparation: $scope.data.records[i].preparation,
            link: $scope.data.records[i].link,
            outOfStock: $scope.data.records[i].outOfStock
          };

          $scope.order.isDirty = true;

          updateRecord($scope.data.records[i]._id, data);
        }
        console.log('........records. %o', $scope.data.records);
      };

      $scope.cancelOrder = function() {
        $scope.order.isDirty = false;
        // notify the listener when the category is added
        $scope.$emit('list_updated');
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
  .controller('ItemsItemCtrl', ['$scope', '$log',
    'modalDeleteItem', 'Items', '$state', 'Media', '$stateParams',
    function($scope, $log, modalDeleteItem, Items, $state, Media, $stateParams) {

      /**
       * Delete item from the list
       */
      $scope.deleteItem = function(item) {
        modalDeleteItem.open(function() {
          // Get the record and delete the image associated to it
          Items.findOne(item._id)
            .then(function(response) {
              var body = response.data;
              $scope.record = body.result;

              if($scope.record.media.length > 0) {
                var medias = [];
                for(var i = 0; i < $scope.record.media.length; i++) {
                  medias.push($scope.record.media[i]._id);
                }

                return Media.deleteList(medias);
              }

              return null;
            })
            .then(function() {
              return Items.delete(item._id);
            })
            .then(function() {
              $state.transitionTo('items', {
                category: $stateParams.category
              }, {
                reload: true
              });
            })
            .catch(function(error) {
              $log.error('Failed to delete record', error);
            });
        });
      };
    }
  ]);

angular.module('newsApp')
  .controller('ItemsAddFormCtrl', ['$scope', 'Items', '$log',
    '$state', 'Categories', 'Media', 'Taxes', 'PreparationTimes',
    'ImageUploader', '$rootScope', '$stateParams',
    function($scope, Items, $log, $state, Categories, Media, Taxes,
             PreparationTimes, ImageUploader, $rootScope, $stateParams) {

      $scope.data = {
        file: null,
        categories: [],
        taxes: Taxes.get(),
        times: PreparationTimes.get(),
        preparation: 0,
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the contols are binded to.
        // Its fields are coresponding to our record fields
        model: {
          prices: [ ],
          optionsGroups: [
            {
              title: 'Basic Ingredients',
              defaultPrice: 0,
              defaultPreselected: true,
              optionItems: [],
              fixedPrice: true
            },
            {
              title: 'Extra Ingredients',
              defaultPrice: 0,
              defaultPreselected: false,
              optionItems: [],
              fixedPrice: false
            }
          ]
        }
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

      /**
       * Add price inputs with empty values
       */
      $scope.addPriceInputs = function() {
        $scope.data.model.prices.push({
          name: '',
          value: '',
          weight: 0,
          children: []
        });
      };

      /**
       * Add price inputs with empty values
       */
      $scope.addPriceChildInputs = function(index) {
        $scope.data.model.prices[index].children.push({
          name: '',
          value: '',
          weight: 0
        });
      };

      $scope.removePriceInputs = function(index) {
        $scope.data.model.prices.splice(index, 1);
      };

      $scope.removePriceChildInputs = function(parentIndex, index) {
        $scope.data.model.prices[parentIndex].children.splice(index, 1);
      };

      /**
       * Add Basic Option inputs with empty/default values
       */
      $scope.addOptionInputs = function(index) {
        var item = {
          title: '',
          price: $scope.data.model.optionsGroups[index].defaultPrice,
          preselected: $scope.data.model.optionsGroups[index].defaultPreselected
        };
        $scope.data.model.optionsGroups[index].optionItems.push(item);
      };

      $scope.removeOptionInputs = function(group,index) {
        console.log('Remove [%o] [%s]', group, index);
        group.optionItems.splice(index, 1);
        // $scope.data.optionsGroups[parentIndex].optionItems.splice(index, 1);
      };


      $scope.sortableOptions = {
        update: function(e, ui) {
          console.log('Order updated.');
        }
      };

      // initialization
      (function() {
        $scope.addPriceInputs();
      })();

      // get the category list from DB
      $scope.fetchCategories = function() {
        Categories.query().$promise.then(function(data) {
          $scope.data.categories = data;
          // $scope.selectedCategory = $scope.categories[0];
        }, function(error) {
          // FIXME better use .catch()
          $log.error('Failed to load the categories', error);
        });
      };

      $scope.fetchCategories();

      // listen for app selection
      $rootScope.$on('app:selected', function() {
        $scope.fetchCategories();
      });

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
       * Handle the form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if(!$scope.addForm.$valid) {
          return;
        }

        progressStart();

        function saveItem(mediaIds) {
          $scope.data.model.prices.forEach(function(price, i) {
            price.weight = i
          })

          var data = {
            name: $scope.data.model.name,
            intro: $scope.data.model.intro,
            description: $scope.data.model.description,
            categoryId: (($scope.data.model.category) ? $scope.data.model.category._id : null),
            tax: (($scope.data.model.tax) ? $scope.data.model.tax.value : 0),
            preparation: (($scope.data.model.preparation) ? $scope.data.model.preparation.value : 0),
            prices: $scope.data.model.prices,
            link: $scope.data.model.link,
            outOfStock: $scope.data.model.outOfStock,
            media: mediaIds,
            optionsGroups: $scope.data.model.optionsGroups
          };

          Items.create(data)
            .then(function onSuccess() {
              // notify the listener when the list is updated
              $scope.$emit('list_updated');


              // display the updated form
              $state.transitionTo($state.current, {category: 'all'}, {
                reload: true
              });
            }, function onError(response) {
              // FIXME better use .catch()
              $log.error('failed to add photo', response);
            });
        } //saveItem()

        function saveMedia() {
          // Move the uploaded images in its final possition
          // and create the related database entry.
          // TODO: a check for an empty array is required
          Media.create($scope.data.uploadedImages[0]).then(
            function onSuccess(responce) {
              console.log(responce);
              // Media is saved.
              // Saving item
              var mediaIds = [];
              mediaIds.push(responce.data.result._id);
              saveItem(mediaIds);
            },

            function onError(responce) {
              // FIXME better use .catch()
              console.log(responce);
            }
          );
        } //saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of item
        if($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveItem([]);
        }
      };
    }
  ]);

angular.module('newsApp')
  .controller('ItemsUpdateFormCtrl', [
    '$scope', '$rootScope', 'Items', '$log', '$stateParams',
    '$state', 'Categories', 'Media', 'Taxes', 'PreparationTimes',
    'ImageUploader',
    function($scope, $rootScope, Items, $log, $stateParams,
             $state, Categories, Media, Taxes, PreparationTimes, ImageUploader) {

      // When the user removes an image we are placing it in our thrash bin.
      // The content of this bin will be used during the from's save process.
      $scope.trashbin = [];

      $scope.data = {
        file: null,
        filePath: '',
        updated: {},
        categories: [],
        taxes: Taxes.get(),
        tax: 0,
        times: PreparationTimes.get(),
        preparation: 0,
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

      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      /**
       * Add price inputs with empty values
       */
      $scope.addPriceInputs = function() {
        $scope.data.model.prices.push({
          name: '',
          value: '',
          weight: 0
        });
      };

      /**
       * Add price inputs with empty values
       */
      $scope.addPriceChildInputs = function(index) {
        $scope.data.model.prices[index].children.push({
          name: '',
          value: '',
          weight: 0
        });
      };

      $scope.removePriceInputs = function(index) {
        $scope.data.model.prices.splice(index, 1);
      };

      $scope.removePriceChildInputs = function(parentIndex, index) {
        $scope.data.model.prices[parentIndex].children.splice(index, 1);
      };

      /**
       * Add Basic Option inputs with empty/default values
       */
      $scope.addOptionInputs = function(index) {
        $scope.data.model.optionsGroups[index].optionItems.push({
          title: '',
          price: $scope.data.model.optionsGroups[index].defaultPrice,
          preselected: $scope.data.model.optionsGroups[index].defaultPreselected
        });
      };

      $scope.removeOptionInputs = function(parentIndex, index) {
        $scope.data.model.optionsGroups[parentIndex].optionItems.splice(index, 1);
      };

      $scope.sortableOptions = {
        update: function(e, ui) {
          console.log('Order updated.');
        }
      };


      // fetch single item
      Items.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;
        $scope.data.model.prices.sort(function (a, b) {
          (a.weight > b.weight) ? 1 : (a.weight == b.weight) ? 0 : -1;
        });

        // get the category list from DB
        $scope.fetchCategories = function() {
          Categories.query().$promise.then(function(data) {
            $scope.data.categories = data;
            var selectedCategoryIndex = _.findIndex($scope.data.categories, {
              // _id: $scope.data.model.categoryId
              _id: (($scope.data.model.category) ? $scope.data.model.category._id : null)
            });
            $scope.data.model.category = $scope.data.categories[selectedCategoryIndex];

          }, function(error) {
              // FIXME better use .catch()
              $log.error('Failed to load the categories', error);
          });
        };

        $scope.fetchCategories();

        // listen for app selection
        $rootScope.$on('app:selected', function() {
          $scope.fetchCategories();
        });

        // fetch the image
        if($scope.data.model.media.length > 0) {
          $scope.data.model.picture = $scope.data.model.media[0].uri;
        }

        // Set the selected tax
        var selectedTaxIndex = _.findIndex($scope.data.taxes, {
          value: $scope.data.model.tax
        });
        $scope.data.tax = $scope.data.taxes[selectedTaxIndex];

        // Set the selected preparation time
        var selectedTimeIndex = _.findIndex($scope.data.times, {
          value: $scope.data.model.preparation
        });
        $scope.data.preparation = $scope.data.times[selectedTimeIndex];

      });

      /**
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForUpdate($scope);

      function deleteImage() {
        // Store the media id in order to delete
        // this entry in the future
        var mediaID;
        if($scope.data.model.media.length > 0) {
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
        if(!$scope.updateForm.$valid) {
          return;
        }

        $scope.data.model.prices.forEach(function(price, i) {
          price.weight = i
        })


        progressStart();

        var toBeUpdateItemId = $scope.data.model._id;

        function saveItem(mediaIds) {
          var existingIds = $scope.data.model.media;
          var mergedIds = existingIds.concat(mediaIds);

          var data = {
            name: $scope.data.model.name,
            intro: $scope.data.model.intro,
            description: $scope.data.model.description,
            prices: $scope.data.model.prices,
            weight: $scope.data.model.weight,
            //categoryId: (($scope.data.model.category) ? $scope.data.model.category._id : null),
            category: $scope.data.model.category._id || $scope.data.model.category || null,
            tax: (($scope.data.model.tax) ? $scope.data.model.tax.value : 0),
            preparation: (($scope.data.model.preparation) ? $scope.data.model.preparation.value : 0),
            link: $scope.data.model.link,
            outOfStock: $scope.data.model.outOfStock,
            media: mergedIds,
            optionsGroups: $scope.data.model.optionsGroups
          };

          Items.update($scope.data.model._id, data)
            .then(function onSuccess() {
              $scope.data.model.picture = $scope.data.filePath;
              // notify the listener when the list is updated
              $rootScope.$emit('list_updated');
              // display the updated form
              $state.transitionTo('items.details', {
                category: 'all',
                id: toBeUpdateItemId
              });
            }, function onError(response) {
              // FIXME better use .catch()
              $log.error('response', response);
              progressEnd();
            });
        }

        function saveMedia() {
          // Move the uploaded images in its final possition
          // and create the related database entry.
          // TODO: a check for an empty array is required
          Media.create($scope.data.uploadedImages[0]).then(
            function onSuccess(responce) {
              console.log(responce);
              // Media is saved.
              // Saving Item
              var mediaIds = [];
              mediaIds.push(responce.data.result._id);
              saveItem(mediaIds);
            },

            function onError() {
              // FIXME better use .catch()
              progressEnd();
            }
          );
        }

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of item
        if($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveItem([]);
        }

        // Clean up media placed in the trash bin
        function deleteMedia(id) {
          Media.delete(id).then(
            function onSuccess(responce) {
              console.log(responce);
            },

            function onError(responce) {
              // FIXME better use .catch()
              console.log(responce);
            }
          );
        }

        for(var key in $scope.trashbin) {
          deleteMedia($scope.trashbin[key]);
        }

      };
    }
  ]);

angular.module('newsApp')
  .controller('ItemsDetailsCtrl', ['$scope', '$stateParams',
    'Items',
    function($scope, $stateParams, Items) {
      /// hold the details data
      $scope.data = {
        model: {}
      };
      // fetch single data
      Items.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;

        // fetch the image
        if($scope.data.model.media.length > 0) {
          $scope.data.model.picture = $scope.data.model.media[0].uri;
        }
      });
    }
  ]);
