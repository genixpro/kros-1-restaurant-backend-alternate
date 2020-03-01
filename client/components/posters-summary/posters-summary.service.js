'use strict';

/**
 * Factory PostersSummary service
 * provide PostersSummary insight related to the information we are having in our database.
 */
angular
    .module('newsApp')
    .factory('PostersSummary', postersSummary);

/**
 *  inject dependencies
 */
postersSummary.$inject = ['Posters', 'Rooms'];

/**
 * @function postersSummary
 *
 * @description all @param should be comply Injection Dependency
 *
 * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
 * @param Rooms - This is an angularjs service - angular_module.newsApp.Rooms.
 * @return -methods to receive information, that we are having in our database.
 */
function postersSummary(Posters, Rooms) {
  return {
    totalNumber_posters: totalNumber_posters,
    totalNumber_presentationTypes: totalNumber_presentationTypes,
    totalNumber_posters_by_presentationType: totalNumber_posters_by_presentationType,
    totalNumber_rooms: totalNumber_rooms,
    totalNumber_categories: totalNumber_categories,
    totalNumber_rooms_by_categories: totalNumber_rooms_by_categories,
    summaryPosters: summaryPosters,
    summaryRooms: summaryRooms
  };

  /**
   *  @function totalNumber_posters
   *  @description returns the total number of posters of the current user
   *  @return {Object} count - total number of posters
   */
  function totalNumber_posters(){
    return Posters.query({total_number: 'all'}).$promise.then(function(response){
      var _count = response.result.length ? response.result[0].count : 0;
      return {count: _count}
    })
  }
  /**
   *  @function totalNumber_presentationTypes
   *  @description returns the total number of presentationTypes of posters
   *  @return {Object} count - total number of presentationTypes of posters
   */
  function totalNumber_presentationTypes(){
    return Posters.query({total_number: 'presentationType'}).$promise.then(function(response) {
      var _count = response.result.length;
      return {count: _count}
    })
  }
  /**
   *  @function totalNumber_posters_by_presentationType
   *  @description returns the total number of posters with current presentationType
   *  @param {String} presentationType - name of the current presentationType
   *  @return {Object|Array} count (@param exists) - total number of posters with current presentationType
   *                        or [{_id, count}, ...] (@param not exists) - where _id - name of the current presentationType; count - total number of posters with current presentationType
   */
  function totalNumber_posters_by_presentationType(presentationType){
    return Posters.unique({field: 'presentationType', count: 'all'}).$promise.then(function(response) {
      var _result = response;

      if (presentationType){
        var _resultCount = {count: 0};
        response.result.forEach(function(el){
          if (el._id === presentationType){
            _resultCount.count = el.count;
          }
        })
        _result = _resultCount;
      }

      return _result
    })
  }

  /**
   *  @function totalNumber_rooms
   *  @description returns the total number of rooms of the current user
   *  @return {Object} count - total number of rooms
   */
  function totalNumber_rooms(){
    return Rooms.query({total_number: 'all'}).$promise.then(function(response){
      var _count = response.result.length ? response.result[0].count : 0;
      return {count: _count}
    })
  }
  /**
   *  @function totalNumber_categories
   *  @description returns the total number categories of rooms of the current user
   *  @return {Object} count - total number categories of rooms
   */
  function totalNumber_categories(){
    return Rooms.query({total_number: 'category'}).$promise.then(function(response){
      var _count = response.result.length;
      return {count: _count}
    })
  }
  /**
   *  @function totalNumber_rooms_by_categories
   *  @description returns the total number of rooms with current category
   *  @param {String} category - name of the current category
   *  @return {Object|Array} count (@param exists)- total number of rooms with current category
   *                        or [{_id, count}, ...] (@param not exists) - where _id - name of the current category; count - total number of rooms with current category
   */
  function totalNumber_rooms_by_categories(category){
    return Rooms.unique({total_number: 'category', count: 'all'}).$promise.then(function(response) {
      var _result = response;

      if (category){
        var _resultCount = {count: 0};
        response.result.forEach(function(el){
          if (el._id === category){
            _resultCount.count = el.count;
          }
        })
        _result = _resultCount;
      }

      return _result
    })
  }

  /**
   *  @function summaryPosters
   *  @description returns the all summary posters data
   *  @return {Object} result - {Object} totalNumber_posters - total number of posters of the current user
   *                            {Object} totalNumber_presentationTypes - total number of presentationTypes of posters
   *                            {Object|Array} totalNumber_posters_by_presentationType - total number of posters with current presentationType
   */
  function summaryPosters(){
    return Posters.query({summary: 3}).$promise.then(function(response){
      var _result = {
        totalNumber_posters: {},
        totalNumber_presentationTypes: {},
        totalNumber_posters_by_presentationType: {}
      }
      _result.totalNumber_posters.count = response.result.totalNumber_posters.length ? response.result.totalNumber_posters[0].count : 0;
      _result.totalNumber_presentationTypes.count = response.result.totalNumber_presentationTypes.length ;
      _result.totalNumber_presentationTypes.result = response.result.totalNumber_presentationTypes;
      _result.totalNumber_posters_by_presentationType = response.result.totalNumber_posters_by_presentationType;
      return _result
    })
  }


  /**
   *  @function summaryRooms
   *  @description returns the all summary rooms data
   *  @return {Object} result - {Object} totalNumber_rooms - total number of rooms of the current user
   *                            {Object} totalNumber_categories - total number categories of rooms of the current user
   *                            {Object|Array} totalNumber_rooms_by_categories - total number of rooms with current category
   */
  function summaryRooms(){
    return Rooms.query({summary: 3}).$promise.then(function(response){
      var _result = {
        totalNumber_rooms: {},
        totalNumber_categories: {},
        totalNumber_rooms_by_categories: {}
      }
      _result.totalNumber_rooms.count = response.result.totalNumber_rooms.length ? response.result.totalNumber_rooms[0].count : 0;
      _result.totalNumber_categories.count = response.result.totalNumber_categories.length;
      _result.totalNumber_categories.result = response.result.totalNumber_categories;
      _result.totalNumber_rooms_by_categories = response.result.totalNumber_rooms_by_categories;
      return _result
    })
  }
}
