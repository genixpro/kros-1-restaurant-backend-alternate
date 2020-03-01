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
  .filter('csvToObj', function() {
    return function(input, delimiter, _header) {
      var rows = input.split('\n');
      var result = [];
      var start = 0;
      var columnCount = rows[0].split(delimiter).length;

      var headers = [];
//      if (_header) {
        headers=rows[0].split(delimiter);
        start = 1;
//      }

      for (var i=start; i<rows.length; i++) {
        var obj = {};
        var currentline=rows[i].split(delimiter);
        if ( currentline.length === columnCount ) {
//          if (_header) {
            for (var j=0; j<headers.length; j++) {
              headers[j]=headers[j].replace(/[^\w\s]/g, '');
              obj[headers[j]] = currentline[j].replace(/[^\w\s]/g, '');
            }
//          } else {
//            for (var k=0; k<currentline.length; k++) {
//              obj[k] = currentline[k];
//            }
//          }
          result.push(obj);
        }
      }
      return result;
    };
  });

  /**
   *
   * if the parameter  _header will be used manually,
   * then use it in the else
   *
   *
   */
//      var rows = input.split('\n');
//      var obj = [];
//      angular.forEach(rows, function(val) {
//        var o = val.split(delimiter);
//        obj.push({
//          code: o[0],
//          title: o[1],
//          topic: o[2],
//          subtopic: o[3],
//          session: o[4],
//          presenter:{
//            firstName: o[5],
//            lastName: o[6],
//            affiliation: o[7],
//            email: o[8]
//          },
//          correspondingAuthor:{
//            firstName: o[9],
//            lastName: o[10],
//            affiliation: o[11],
//            email: o[12]
//          },
//          author:{
//            firstName: o[13],
//            lastName: o[14],
//            institution: o[15],
//            email: o[16],
//            isCorresponding: false,
//            isPresenter: false
//          },
//          presentationType: 'MCC'
//        });
//      });
