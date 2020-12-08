'use strict';

angular
  .module('newsApp')
  .controller('OffersCtrl', [ '$scope', '$log', 'Offers', 'Accounts', '$translate',
  function ($scope, $log, Offers, Accounts, $translate) {

    setTimeout(() =>
    {
      var page = null;
      page.fetchOffers();
    })

    $scope.account = {};

    // fetch the list
    Accounts.get().then(function(response) {
      var body = response.data;
      $scope.account = body.result[0];
      console.log('Accounts: %o', body.result);
    });

      $scope.changeLanguage = function(key) {
        $translate.use(key);
      };

  }]);


angular
  .module('newsApp')
  .controller('OffersListCtrl', ['$scope', '$rootScope', '$http', 'paginator', 'Offers',
    function($scope, $rootScope, $http, paginator, Offers) {

      $scope.data = {
        records: []
      };

      /*
      // pagination
      $scope.pagination = {
        next: false,
        previous: false,
        page: 0,
        pageSize: 0,
        total: 0,
        numPages: 0
      };

      $scope.paginator = paginator;
      */

      // fetch the list
      $scope.fetchOffers = function() {
        Offers.get(1).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          console.log('body', body)

          /*
          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
          */
        });
      };

      $scope.fetchActiveOffers = function(){
        Offers.active().then(function(response){
          var body = response.data;
          $scope.active = body.result;
          console.log('There are %o active Offers', $scope.active);
        });
      };

      $scope.fetchOffers();
      $scope.fetchActiveOffers();

      // listen for app selection
      $rootScope.$on('app:selected', function() {
        $scope.fetchOffers();
        $scope.fetchActiveOffers();
      });

      /*
      // Browse the previous page of list
      $scope.previousPage = function() {
        // fetch the list
        Offers.get(paginator.getPage() - 1).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      };
      */

      /*
      //Browse the next page of list
      $scope.nextPage = function() {

        // fetch the list
        Offers.get(paginator.getPage() + 1).then(function(response) {
          var body = response.data;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      };
      */

      // listen to hide list update event
      var listUpdatedListener = $rootScope.$on('list_updated', function() {
        $scope.fetchOffers();
        $scope.fetchActiveOffers();
      });

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');
    }
  ]);

angular.module('newsApp')
  .controller('OffersItemCtrl', ['$scope','$log', 'modalDeleteItem',
    'Offers', '$state', 'Media',
    function($scope, $log, modalDeleteItem, Offers, $state, Media) {

      /**
       * Delete item from the list
       */
      // rename deleteOffer to `deleteItem`
      $scope.deleteOffer = function(item) {
        modalDeleteItem.open(function() {
          // Get the record and delete the image associated to it
          Offers.findOne(item._id)
            .then(function(response) {
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
            .then(function() {
              return Offers.delete(item._id);
            })
            .then(function() {
              $state.transitionTo('offers', {}, {
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
  .controller('OffersAddFormCtrl', ['$scope', 'Items', '$log',
    '$timeout', '$state', 'Offers', 'Media', 'ImageUploader', '$rootScope',
    function($scope, Items, $log, $timeout, $state, Offers, Media,
      ImageUploader, $rootScope) {

      $scope.data = {
        file: null,
        items: [],
        prices: [],
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the controls are binded to.
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

      /**
       * Add price inputs with empty values
       */
      $scope.addPriceInputs = function() {
        $scope.data.prices.push({
          name: '',
          value: ''
        });
      };

      $scope.removePriceInputs = function(index) {
        $scope.data.prices.splice(index, 1);
      };

      // initialization
      (function() {
        $scope.addPriceInputs();
      })();

      // get the item list from DB
      $scope.fetchItems = function() {
        Items.get().then(function onSuccess(response) {
          $scope.data.items = response.data.result;
        }, function onError() {
          // FIXME better use .catch()
          $log.error('Failed to load the items');
        });
      };
      $scope.fetchItems();

      // listen for app selection
      $rootScope.$on('app:selected', function() {
        $scope.fetchItems(); // refresh items
      });

      /*
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForAdd($scope);

      /*
       * Delete temporary uploaded image
       */
       $scope.deleteImage = function(){
         $scope.data.uploadedImages = [];
         $scope.ui.progress = 0;
       };

      /*
       * Handle the add offer form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) {
          return;
        }

        progressStart();

        function saveOffer(mediaIds){

          var data = {
            name: $scope.data.model.name,
            intro: $scope.data.model.intro,
            description: $scope.data.model.description,
            active: $scope.data.model.active,
            // There are cases where an Offer has no
            // reference to a particular Item
            // itemId: (($scope.data.model.item) ? $scope.data.model.item._id : null),
            // itemId is changed to item since we are using references
            item: (($scope.data.model.item) ? $scope.data.model.item._id : null),
            prices: $scope.data.prices,
            media: mediaIds
          };

          Offers.create(data).then(function onSuccess() {

            // notify the listener when the offer is added
            $scope.$emit('list_updated');

            // display the updated form
            $state.transitionTo($state.current, {}, {
              reload: true
            });
          }, function onError() {
            $log.error('failed to add offer');
          });
        } // saveOffer()

        function checkOffers(mediaIds){
          Offers.active().then(function(response){
            var body = response.data;
            var activeOffers = body.result;
            //
            // Remove the ckeck for enabling the existence of multiple active offer
            //
            //  if ($scope.data.model.active && (activeOffers>0)){
            //    $.notify('There is already an active offer. This offers is saved as inactive.', {'status':'warning'} || {});
            //    $scope.data.model.active = false;
            //  }
            //
              saveOffer(mediaIds);
          });
        }

        function saveMedia(){
          // Move the uploaded images in its final possition
          // and create the related database entry.
          // TODO: a check for an empty array is required
          Media.create($scope.data.uploadedImages[0]).then(
            function onSuccess(responce){
              console.log(responce);
              // Media is saved.
              // Saving item
              var mediaIds = [];
              mediaIds.push(responce.data.result._id);
              checkOffers(mediaIds);
            },

            function onError(responce){
              console.log(responce);
            }
          );
        } //saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of item
        if ($scope.data.uploadedImages.length > 0){
          saveMedia();
        }else{
          checkOffers([]);
        }

      };
    }
  ]);

angular.module('newsApp')
  .controller('OffersUpdateFormCtrl', [
    '$scope', '$rootScope', 'Offers', '$log', '$stateParams',
    '$state', 'Items', 'Media', 'ImageUploader',
    function($scope, $rootScope, Offers, $log, $stateParams,
      $state, Items, Media, ImageUploader) {

      // When the user removes an image we are placing it in our thrash bin.
      // The content of this bin will be used during the from's save process.
      $scope.trashbin = [];

      $scope.data = {
        // file: null,
        // filePath: '',
        items: [],
        // Keeps track of the images
        // that are uploaded while the form is still
        // dirty. These images should be serialized or deleted
        uploadedImages: [],
        // The model the controls are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      function progressStart(){
        $scope.ui.inProgress = true;
      }

      function progressEnd(){
        $scope.ui.inProgress = false;
      }

      /**
       * Add price inputs with empty values
       */
      $scope.addPriceInputs = function() {
        $scope.data.model.prices.push({
          name: '',
          value: ''
        });
      };

      $scope.removePriceInputs = function(index) {
        $scope.data.model.prices.splice(index, 1);
      };

      // fetch single data
      Offers.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;

        // get the item list from DB
        $scope.fetchItems = function() {
          Items.get(1).then(function onSuccess(response) {
            $scope.data.items = response.data.result;

            var selectedItemIndex = _.findIndex($scope.data.items, {
              // _id: $scope.data.model.itemId
              // itemId is changed to item since we are using references
              _id: (($scope.data.model.item) ? $scope.data.model.item._id : null)
            });

            $scope.data.model.item = $scope.data.items[selectedItemIndex];
          }, function onError() {
            // FIXME better use .catch()
            $log.error('Failed to load the items');
          });
        };
        $scope.fetchItems();

        // listen for app selection
        $rootScope.$on('app:selected', function() {
          $scope.fetchItems(); // refresh items
        });

        // fetch the image
        if ($scope.data.model.media.length > 0){
          $scope.data.model.picture = $scope.data.model.media[0].uri;
        }
      });

      /**
       * Listen on file select
       */
      $scope.onFileSelect = ImageUploader.onFileSelectForUpdate($scope);

      function deleteImage() {
        // Store the media id in order to delete
        // this entry in the future
        var mediaID;
        if ($scope.data.model.media.length > 0){
          mediaID = $scope.data.model.media[0]._id;

          $scope.trashbin.push(mediaID);
          // Remove the image reference for the categories object
          $scope.data.model.media.splice(0,1);
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

        var toBeUpdateOfferId = $scope.data.model._id;

        function saveOffer(mediaIds){
          var existingIds = $scope.data.model.media;
          var mergedIds    = existingIds.concat(mediaIds);

          var data = {
            name: $scope.data.model.name,
            intro: $scope.data.model.intro,
            description: $scope.data.model.description,
            active: $scope.data.model.active,
            // There are cases where an Offer has no
            // reference to a particular Item
            // itemId: (($scope.data.model.item) ? $scope.data.model.item._id : null),
            // itemId is changed to item since we are using references
            item: (($scope.data.model.item) ? $scope.data.model.item._id : null),
            prices: $scope.data.model.prices,
            media: mergedIds
          };

          Offers.update($scope.data.model._id, data).then(function onSuccess() {
            progressEnd();
            // notify the listener when the list is updated
            $rootScope.$emit('list_updated');
            // display the updated form
            $state.transitionTo('offers.details', {
              id: toBeUpdateOfferId
            });
          }, function onError(response) {
            $log.error('response', response);
            progressEnd();
          });

        }// saveOffer()

        function checkOffers(mediaIds){
          Offers.active().then(function(response){
            var body = response.data;
            var activeOffers = body.result;
            //
            // Remove the ckeck for enabling the existence of multiple active offers
            //
            //  if ($scope.data.model.active && (activeOffers>0)){
            //    $.notify('There is already an active offer. This offers is saved as inactive.', {'status':'warning'} || {});
            //    $scope.data.model.active = false;
            //  }
            //
              saveOffer(mediaIds);
          });
        }

        function saveMedia(){
          // Move the uploaded images in its final possition
          // and create the related database entry.
          // TODO: a check for an empty array is required
          Media.create($scope.data.uploadedImages[0]).then(
            function onSuccess(responce){
              console.log(responce);
              // Media is saved.
              // Saving Category
              var mediaIds = [];
              mediaIds.push(responce.data.result._id);
              checkOffers(mediaIds);
            },

            function onError(responce){
              console.log(responce);
              progressEnd();
            }
          );
        }// saveMedia()

        // If a media is given and uploaded, save the media, get its id
        // and proceed with the save of category
        if ($scope.data.uploadedImages.length > 0){
          saveMedia();
        }else{
          checkOffers([]);
        }

        // Clean up media placed in the trash bin
        function deleteMedia(id){
          Media.delete(id).then(
            function onSuccess(responce){
              console.log(responce);
            },

            function onError(responce){
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
  .controller('OffersDetailsCtrl', ['$scope', '$stateParams',
    'Offers',
    function($scope, $stateParams, Offers) {
      // hold the details data
      $scope.data = {
        model : {}
      };

      // fetch single data
      Offers.findOne($stateParams.id).then(function(response) {
        var body = response.data;
        $scope.data.model = body.result;

        // fetch the image
        if ($scope.data.model.media.length > 0){
          $scope.data.model.picture = $scope.data.model.media[0].uri;
        }
      });
    }
  ]);
