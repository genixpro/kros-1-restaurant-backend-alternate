'use strict';

/**
 * Factory PostersLintSummary service
 * provide PostersLintSummary insight related to the information we are having in our database.
 */
angular
  .module('newsApp')
  .factory('PostersLintSummary', PostersLintSummary);

/**
 *  inject dependencies
 */
PostersLintSummary.$inject = ['PostersLint'];

/**
 * @function PostersLintSummary
 *
 * @description all @param should be comply Injection Dependency
 *
 * @param PostersLint - This is an angularjs service - angular_module.newsApp.PostersLint.
 * @return -methods to receive information, that we are having in our database.
 */
function PostersLintSummary(PostersLint) {
  return {
    totalNumber_empty_sessions: totalNumber_empty_sessions,
    totalNumber_overflown_sessions: totalNumber_overflown_sessions,
    totalNumber_non_assigned_posters: totalNumber_non_assigned_posters,
    summaryData:summaryData
  };

  /**
  *  @function totalNumber_empty_sessions
  *  @description returns the total number of empty sessions of the current user
  *  @return {Object} result - total number of empty sessions
  */
  function totalNumber_empty_sessions(){
    return PostersLint.empty_sessions().$promise.then(function(response){
      return {result: response.result}
    })
  }


  /**
  *  @function totalNumber_overflown_sessions
  *  @description returns the total number of overflown sessions of the current user
  *  @return {Object} result - total number of overflown sessions
  */
  function totalNumber_overflown_sessions(){
    return PostersLint.overflown_sessions().$promise.then(function(response){
      return {result: response.result}
    })
  }
  /**
  *  @function totalNumber_non_assigned_posters
  *  @description returns the total number of non assigned posters of the current user
  *  @return {Object} result - total number of non assigned posters
  */
  function totalNumber_non_assigned_posters(){
    return PostersLint.non_assigned_posers().$promise.then(function(response){
      return {result: response.result}
    })
  }


//  function getCheckResult(){
//    var _result = {
//      empty:0,
//      overflown:0,
//      non_assigned:0
//    };
//    return totalNumber_empty_sessions()
//      .then(function(response){_result.empty = response.result;})
//      .then(totalNumber_overflown_sessions)
//      .then(function(response){_result.overflown = response.result;})
//      .then(totalNumber_non_assigned_posters)
//      .then(function(response){_result.non_assigned = response.result;})
//      .then(function(){return _result;});
//  }

  /**
   *  @function summaryData
   *  @description returns the all summary data
   *  @return {Object} result - {Number} PostersNonAssigned - total number of non assigned posters
   *                            {Number} SessionsOverflown - total number of overflown sessions
   *                            {Number} SessionsEmpty - total number of empty sessions
   *                            {Object} stateRoom - {Array} empty - Id rooms that have a empty monitor
   *                                                 {Array} overflown - Id rooms that have a overflown monitor
   */
  function summaryData(){
    return PostersLint.summaryData().$promise.then(function(response){
      return response.result
    })
  }
}
