'use strict'

/**
 * @class angular_module.newsApp.fileChange
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs directive.
 * It allows you to upload files to a format CSV and JSON
 *
 */
angular.module('newsApp')
  .directive('fileChange',['$parse', function($parse){
    return{
      restrict:'A',
      link:function($scope,element,attrs,ngModel){
        var attrHandler=$parse(attrs['fileChange']);
        var handler=function(e){
          $scope.$apply(function(){
            attrHandler($scope,{$event:e,files:e.target.files});
          });
        };
        element[0].addEventListener('change',handler,false);
      }
    }
  }]);