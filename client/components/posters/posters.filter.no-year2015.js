'use strict'

/**
 * @class angular_module.newsApp.csvToObj
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs filter.
 * converts the file CSV into an object using transmitted delimiter. It uses the first line as a header
 *
 */
angular.module('newsApp')
  .filter('postersNoYear', function() {
    return function(input) {
      if (input== '-- all (any type) --') return 'all the presentation types';

      var result = input.replace('2015 ', '');
      return result;
    };
  });
