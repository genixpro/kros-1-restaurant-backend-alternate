String.prototype.fulltrim=function(){
  return this
      .replace(/(?:(?:^|\n)\s+(?:$|\n)+|\r+$)/g,'').replace(/[^\w\s]/g, '');
//      .replace(/\s+/g,' ');  //use for remove whitespace in the end string
};
/**
 * @class angular_module.newsApp.CheckStruct
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs service.
 * verify the compliance passed string (extracts from her header) with a predetermined pattern
 *
 */
angular
    .module('newsApp')
    .factory('CheckStruct',checkStruct);
function checkStruct(){
    return {
        check:check
    };
//    function trim (str, charlist) {
//        charlist = !charlist ? ' \\s\\xA0' : charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\$1');
//        var re = new RegExp('^[' + charlist + ']+|[' + charlist + ']+$', 'g');
//        return str.replace(re, '');
//    }

    function check(str,delimiter){
      var structure=[
           'code',
           'abstract title',
           'topic',
           'subtopic',
           'session',
           'presenter firstname',
           'presenter lastname',
           'presenter affiliation',
           'presenter email',
           'corresponding author firstname',
           'corresponding author lastname',
           'corresponding author affiliation',
           'corresponding author email',
           'author firstname',
           'author lastname',
           'author affiliation',
           'author email'
        ]
        , limit_mandatory_columns = structure.length;

      str=str.substr(0,str.indexOf('\n'));
      str=str.toLowerCase();
      var arr=str.split(delimiter,limit_mandatory_columns);
      var flag=true;
      if(arr.length < limit_mandatory_columns) {return false}
      _.some(arr, function(el){
        el=el.fulltrim();
        if(structure.indexOf(el)===-1){
          flag=false;
          return true;
        }
      });
      return flag;
    }

}