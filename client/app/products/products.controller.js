'use strict';

angular.module('newsApp')
  .controller('ProductsListCtrl', [
    '$scope', '$rootScope', '$http', 'Products', 'CatalogueCategories', '$log',
    '$translate', '$stateParams', '$state',

    function ($scope, $rootScope, $http, Products, CatalogueCategories, $log,
      $translate, $stateParams, $state) {

      $scope.data = {
        records: []
      };

      /*jshint unused: false */
      $scope.changeselectedCategory = function () {
        var category = $scope.selectedCategory ? $scope.selectedCategory.name : 'all';
        if (category && category !== $stateParams.category) {
          $state.transitionTo('products', {
            category: category
          }, {reload: false});
        }
      };
      /*jshint unused: true */

      $scope.fetchProducts = function () {
        // fetch the products
        Products.get({
          page: 1
        }).then(function (response) {
          var body = response.data;
          $scope.data.records = [];
          $scope.data.records = body.result;
        });
      };

      $scope.fetchProductCustomFields = function () {
        Products.getCustomFields().then(function (response) {
          $scope.customFields = response.data;
        });
      };

      $scope.fetchProductCustomFields();

      $scope.fetchProductsByCategory = function () {
        Products.getByCategory($scope.selectedCategory._id).then(function (response) {
          var body = response.data;
          $scope.data.records = [];
          $scope.data.records = body.result;
          $scope.data.records.forEach(function (record) {
            record.category = $scope.selectedCategory;
          });
        });
      };

      $scope.selectStateCategory = function () {
        if ($scope.selectedCategory) {
          return;
        }
        else {
          $scope.selectedCategory = $stateParams.category !== 'all' ? $stateParams.category : $scope.selectedCategory;
        }

        $scope.selectedCategory = $stateParams.category;

        if ($stateParams.category === 'all') {
          $scope.selectedCategory = undefined;
          $scope.fetchProducts();
        }
        else {
          $scope.categories.forEach(function (category) {
            if (category.name === $stateParams.category) {
              $scope.selectedCategory = category;
            }
          });
          if ($scope.selectedCategory) {
            $scope.fetchProductsByCategory();
          }
        }

      };

      $scope.fetchProducts();

      // listen for app selection
      $rootScope.$on('app:selected', function () {
        // refresh products
        $scope.fetchProducts();
        // $scope.fetchCategories();
      });

      $scope.fetchCategories = function () {
        CatalogueCategories.query().$promise.then(function onSuccess(response) {
          response.map(function (e) {
            var deepName = '';
            if (e.parentCategory) {
              deepName += e.parentCategory.name + ' :: ';
            }
            deepName += e.name;

            e.deepName = deepName;
            return e;
          });

          $scope.categories = response;
          $scope.selectStateCategory();
          // $scope.selectedCategory = $scope.categories[0];
        }, function (error) {
          console.error('Failed to fetch the categories', error);
        });
      };
      $scope.fetchCategories();

      // initialization
      (function () {
        //$scope.fetchCategories();
      })();

      // listen to list updated event
      var listUpdatedListener = $rootScope.$on('list_updated', function () {
        $scope.fetchProducts();
      });

      $scope.getProductsByFiltered = function (_page, _fieldName, _searchValue,_categorySearch) {
        // if (!_page) _page = paginator.getPage();
        if (!_searchValue) {
          _searchValue = $scope.search;
        }
        if (!_fieldName) {
          _fieldName = $scope.fieldName;
        }
        if (!_fieldName) {
          _categorySearch = $scope.categorySearch;
        }

        return Products.query({
          page: _page,
          fieldName: _fieldName,
          searchValue: _searchValue,
          category:_categorySearch
        }).then(function (response) {
          return response.data.result;
        });
      };

      $scope.filteringBySearch = function () {
        $scope.getProductsByFiltered().then(function (result) {
          $scope.data.records = result;
        });
      };

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');

      $scope.changeLanguage = function (key) {
        $translate.use(key);
      };

    }
  ]);

angular.module('newsApp')
  .controller('ProductsItemCtrl', ['$scope', '$log',
    'modalDeleteItem', 'Products', '$state', 'Media', '$stateParams',
    function ($scope, $log, modalDeleteItem, Products, $state, Media, $stateParams) {

      /**
       * Delete product from the list
       */
      $scope.deleteProduct = function (product) {
        modalDeleteItem.open(function () {
          // Get the record and delete the image associated to it
          Products.findOne(product._id)
            .then(function (response) {
              var body = response.data;
              $scope.record = body.result;

              if ($scope.record.media.length > 0) {
                var medias = [];
                for (var i = 0; i < $scope.record.media.length; i++) {
                  medias.push($scope.record.media[i]._id);
                }

                return Media.deleteList(medias);
              }

              return null;
            })
            .then(function () {
              return Products.delete(product._id);
            })
            .then(function () {
              $state.transitionTo('products', {
                category: $stateParams.category
              }, {
                reload: true
              });
            })
            .catch(function (error) {
              $log.error('Failed to delete record', error);
            });
        });
      };
    }
  ]);

angular.module('newsApp')
  .controller('ProductsAddFormCtrl', [
    '$scope', 'Products', '$log', '$state', 'CatalogueCategories',
    'SimpleLists', 'Media', 'ImageUploader', '$q', '$rootScope', '$stateParams',
    function ($scope, Products, $log, $state, CatalogueCategories,
              SimpleLists, Media, ImageUploader, $q, $rootScope, $stateParams) {

      $scope.data = {
        file: null,
        simpleLists: [],
        categories: [],
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the contols are binded to.
        // Its fields are coresponding to our record fields
        model: {
          featured: false,
          customFields: []
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


      // get the category list from DB
      $scope.fetchCategories = function () {
        CatalogueCategories.query().$promise.then(function (data) {
          $scope.data.categories = data;
          // $scope.selectedCategory = $scope.categories[0];
        }, function (error) {
          // FIXME better use .catch()
          $log.error('Failed to load the categories', error);
        });
      };

      $scope.fetchCategories();

      SimpleLists.query(function (records) {
        var lists = records.map(function (e) {
          e.options = _.uniq(e.body.split('\n'));
          return e;
        });
        lists.unshift({name: 'Numeric'});
        lists.unshift({name: 'String'});
        $scope.simpleLists = lists;
      });

      // listen for app selection
      $rootScope.$on('app:selected', function () {
        $scope.fetchCategories();
      });

      /*
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForAdd($scope);

      /*
       * Delete temporary uploaded image
       */
      $scope.deleteImage = function (index) {
        $scope.data.uploadedImages.splice(index, 1);
        $scope.ui.progress = 0;
      };
      $scope.findOptions = function (valueType,index) {
        var elem = _.findWhere($scope.simpleLists, {name: valueType});
        $scope.data.model.customFields[index].value='';
        $scope.data.model.customFields[index].currentOptions=elem.options;

      };


      /**
       * Add custom fields inputs with empty values
       */
      $scope.addCustomFieldInputs = function () {
        $scope.data.model.customFields.push({
          label: '',
          value: '',
          valueType: 'String',
          weight: 0
        });
      };

      $scope.removeCustomFieldInputs = function (index) {
        $scope.data.model.customFields.splice(index, 1);
      };

      /*
       * Handle the form submission
       */
      $scope.save = function () {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) {
          return;
        }

        progressStart();

        function saveProduct(mediaIds) {

          var data = {
            title: $scope.data.model.title,
            description: $scope.data.model.description,
            price: $scope.data.model.price,
            url: $scope.data.model.url,
            categoryId: (($scope.data.model.category) ? $scope.data.model.category._id : null),
            pdfUrl: $scope.data.model.pdfUrl,
            featured: $scope.data.model.featured,
            media: mediaIds,
            customFields: $scope.data.model.customFields
          };

          Products.create(data)
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
              progressEnd();

            });
        } //saveProduct()

        function saveMedia() {
          var proms = [];

          for (var i in $scope.data.uploadedImages) {
            proms.push(Media.create($scope.data.uploadedImages[i]));
          }

          $q.all(proms)
            .then(function (values) {

              var mediaIds = [];
              for (var i in values) {
                mediaIds.push(values[i].data.result._id);
              }
              saveProduct(mediaIds);
            });
        }


        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of product
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveProduct([]);
        }
      };
    }
  ]);

angular.module('newsApp')
  .controller('ProductsUpdateFormCtrl', [
    '$scope', '$rootScope', 'Products', '$log', '$q', '$stateParams',
    '$state', 'CatalogueCategories', 'SimpleLists', 'Media', 'ImageUploader',
    function ($scope, $rootScope, Products, $log, $q, $stateParams,
              $state, CatalogueCategories, SimpleLists, Media, ImageUploader) {

      // When the user removes an image we are placing it in our thrash bin.
      // The content of this bin will be used during the from's save process.
      $scope.trashbin = [];

      $scope.data = {
        file: null,
        filePath: '',
        updated: {},
        simpleLists: [],
        categories: [],
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

      // fetch single product
      Products.findOne($stateParams.id).then(function (response) {
        var body = response.data;
        $scope.data.model = body.result;
        if($scope.data.model&&$scope.data.model.customFields){
          var parsedCustomFields = $scope.data.model.customFields.map(function (elem) {
            if (elem.valueType === 'Numeric') {
              elem.value = Number(elem.value);
            }
            return elem;

          });
          $scope.data.model.customFields = parsedCustomFields;
        }
        $scope.ui.pictures = [];

        // get the category list from DB
        $scope.fetchCategories = function () {
          CatalogueCategories.query().$promise.then(function (data) {
            $scope.data.categories = data;
            var selectedCategoryIndex = _.findIndex($scope.data.categories, {
              // _id: $scope.data.model.categoryId
              _id: (($scope.data.model.category) ? $scope.data.model.category._id : null)
            });
            $scope.data.model.category = $scope.data.categories[selectedCategoryIndex];

          }, function (error) {
            // FIXME better use .catch()
            $log.error('Failed to load the categories', error);
          });
        };

        $scope.fetchCategories();

        SimpleLists.query(function (records) {
          var lists = records.map(function (e) {
            e.options = _.uniq(e.body.split('\n'));
            return e;
          });
          lists.unshift({name: 'Numeric'});
          lists.unshift({name: 'String'});
          $scope.simpleLists = lists;
        });

        $scope.findOptions = function (valueType,index) {
          if(!valueType&&!index) return;
          var elem = _.findWhere($scope.simpleLists, {name: valueType});
          $scope.data.model.customFields[index].value='';
          $scope.data.model.customFields[index].currentOptions=elem.options;

        };

        // listen for app selection
        $rootScope.$on('app:selected', function () {
          $scope.fetchCategories();
        });

        // fetch the image
        //if($scope.data.model.media.length > 0) {
        //  $scope.data.model.picture = $scope.data.model.media[0].uri;
        //}

        for (var i in $scope.data.model.media) {
          // fetch the image
          //var mediaID;
          //mediaID = $scope.data.model.media[i];
          $scope.ui.pictures.push($scope.data.model.media[i].uri);
        }

      });


      /**
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForUpdateMulti($scope);

      function deleteImage(index) {
        // Store the media id in order to delete
        // this entry in the future
        var mediaID;
        if ($scope.data.model.media.length > 0) {
          mediaID = $scope.data.model.media[index]._id;

          $scope.trashbin.push(mediaID);
          // Remove the image reference for the categories object
          $scope.data.model.media.splice(index, 1);
          $scope.ui.pictures.splice(index, 1);
        }

        // Remove the image preview
        $scope.data.model.picture = '';
        // Set the progress bar
        $scope.ui.progress = 0;
      }

      /**
       * Delete the current image
       */
      $scope.deleteImage = function (index) {
        deleteImage(index);
      };

      /**
       * Add custom fields inputs with empty values
       */
      $scope.addCustomFieldInputs = function () {
        $scope.data.model.customFields.push({
          name: '',
          value: '',
          valueType: 'String',
          weight: 0
        });
      };

      $scope.removeCustomFieldInputs = function (index) {
        $scope.data.model.customFields.splice(index, 1);
      };

      /*
       * Handle the form submission
       */
      $scope.update = function () {
        // if the form is not valid then cut the flow
        if (!$scope.updateForm.$valid) {
          return;
        }

        progressStart();

        var toBeUpdateProductId = $scope.data.model._id;

        function saveProduct(mediaIds) {
          var existingIds = $scope.data.model.media;
          var mergedIds = existingIds.concat(mediaIds);
          var totalMediaIDs = $scope.data.model.media.concat((mediaIds));

          var data = {
            title: $scope.data.model.title,
            description: $scope.data.model.description,
            category: $scope.data.model.category._id || $scope.data.model.category || null,
            price: $scope.data.model.price,
            url: $scope.data.model.url,
            pdfUrl: $scope.data.model.pdfUrl,
            featured: $scope.data.model.featured,
            media: totalMediaIDs,
            customFields: $scope.data.model.customFields

          };

          Products.update($scope.data.model._id, data)
            .then(function onSuccess() {
              $scope.data.model.picture = $scope.data.filePath;
              // notify the listener when the list is updated
              $rootScope.$emit('list_updated');
              // display the updated form
              $state.transitionTo('products.details', {
                category: 'all',
                id: toBeUpdateProductId
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
              // Saving Product
              var mediaIds = [];
              mediaIds.push(responce.data.result._id);
              saveProduct(mediaIds);
            },

            function onError() {
              // FIXME better use .catch()
              progressEnd();
            }
          );
        }

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of product
        if ($scope.data.uploadedImages.length > 0) {
          saveMedia();
        } else {
          saveProduct([]);
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

        for (var key in $scope.trashbin) {
          deleteMedia($scope.trashbin[key]);
        }

      };
    }
  ]);

angular.module('newsApp')
  .controller('ProductsDetailsCtrl', ['$scope', '$stateParams', 'Products',
    function ($scope, $stateParams, Products) {
      /// hold the details data
      $scope.data = {
        model: {}
      };
      // fetch single data
      Products.findOne($stateParams.id).then(function (response) {
        var body = response.data;
        $scope.data.model = body.result;
        $scope.data.model.pictures = [];

        for (var i in $scope.data.model.media) {
          // fetch the image
          $scope.data.model.pictures.push($scope.data.model.media[i].uri);
        }
      });
    }
  ]);
