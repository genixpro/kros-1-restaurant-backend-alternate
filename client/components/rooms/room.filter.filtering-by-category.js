'use strict'

/**
 * @class angular_module.newsApp.roomByCategory
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs filter.
 * filter rooms by category
 *
 */
angular.module('newsApp')
  .filter('roomByCategory', function() {
    return function (rooms, category) {
      if(category == "-- all --") return rooms;
      var data=[];
      angular.forEach(rooms, function(room){
        if(room.category == category){
            data.push(room);
        }
      });
      return data;
    }
  })
