'use strict';

var config = require('../../config/environment');
var async = require('async');
// var _ = require('lodash');
// var striptags = require('striptags');

var Application = require('./../../api/application/application.model');

var email = require('../../components/email');

var SubmissioncodesOrder = require('../submissioncodes-order/submissioncodes-order.model');

var mysql = require('mysql');

exports.index = function(req, res) {
  return res.json(200,
    {
      result: true
    });
}

/*
 * TODO: Enable this code. Isolate it within a method

// Stage DB
var connectionInfo = {
  host     : config.submissionCode.mySQL.host,
  port     : config.submissionCode.mySQL.port,
  user     : config.submissionCode.mySQL.user,
  password : config.submissionCode.mySQL.password,
  database : config.submissionCode.mySQL.database
}

// load Conferences that support payments
var supportsPayment = config.submissionCode.supportsPayment.split(',');
var supportsPayment = supportsPayment.map(function(str){
  return str.trim();
});


// load ProductID-Conferences into a map
// map key value should be equal to confKey value retrieved from DB
var productIDMap = new Map();
var array = config.submissionCode.confProductID.split(',');
for (var i=0; i < array.length; i++) {
  var s = array[i].split(':');
  productIDMap.set(s[0].trim().toLowerCase(), s[1].trim().toLowerCase()); //what if the product id must distinguish lower from uppercase?
}

*
*/

function prepareConnectionInfo(conferenceKey){
  var info = connectionInfo;
  info.database = conferenceKey + '_confmanager';
  return info;
}

function selectSubmissionCodes(conferenceKey, recipient,callback){
  var connection = mysql.createConnection(prepareConnectionInfo(conferenceKey));
  connection.connect();
  connection.query("SELECT * from submissioncodes WHERE email='" + recipient + "'", function(err, rows, fields) {
    console.log("quering..");
    callback(err, rows, fields);
  });
  connection.end();
}

function selectConferenceTitle(conferenceKey, callback){

  var connection = mysql.createConnection(prepareConnectionInfo(conferenceKey));
  connection.connect();
  connection.query("SELECT * from conference", function(err, rows, fields) {
    callback(err, rows, fields);
  });
  connection.end();
}

/**
 * checks if the conferenceKey exists in the environment var supportsSubmissioncode
 * @param {String} conferenceKey
 */
function isConfSupported(conferenceKey) {
  var array = config.submissionCode.supportsSubmissioncode.split(',');
  var supportsSubmissioncode = array.map(function (str) {
    console.log(str)
    return str.trim().toLowerCase();
  });

  if (supportsSubmissioncode.indexOf(conferenceKey.toLowerCase()) === -1) {
    console.log('Submission Code does not support this conference key');
    return false;
  } else {
    return true;
  }
}

/**
 *  called from  angular preLoadConferenceName, part of the request: get('api/submissioncodes/confKey')
 *  as request parameter takes the conferenceKey and checks if it is an active conference
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 */
exports.conference = function (req, res) {
  var conferenceKey = req.query.key;
  console.log('Submission Code: Selected conference key: ' + conferenceKey);

  if (!isConfSupported(conferenceKey)) {
    return res.json(200,
      {
        result: 'UNSUPPORTED'
      });
  }


  selectConferenceTitle(conferenceKey, function (err, rows, fields) {

    var name = '';
    if (!err) {
      if (rows.length > 0) {
        name = rows[0].name;
      }
    }

    return res.json(200,
      {
        result: name
      });

  })
};

function createEmailBody(submissionCode, posterTitle, abstractID, productID, conferenceName, purchases, conferenceKey){

  /**
   * @function isPurchased
   * @param {String} code
   */
  function isPurchased(code){
    if (!purchases) return true;  //null means that the conf doesnt have payments

    // return the value of purchased for a code
    return purchases.find(function(el){
      return el.code == code.toLowerCase();
    }).purchased;
  }

  var body = '';
  var purchaseLink = '';

  console.log('submissioncode.controller::createEmailBody: Length of submissionCode:', submissionCode.length);
  for (var i = 0; i < submissionCode.length; i++) {

    // In the case of more that ONE submission codes, create Sections
    if (submissionCode.length > 1) {
      var index = i + 1;
      body += '<h2>' + index + '. ' + posterTitle[i] + '</h2>';
    }

    body += '<p>You recently requested the unique ePoster Submission Code associated with your accepted ePoster with title</p>'+
           '<p align="center"><b>' + posterTitle[i] + '</b></p>' +
           '<p>to the</p>' +
           '<p align="center"><b>' + conferenceName[i] + '</b></p>' +
           '<p>Your ePoster Submission Code is: <p>';

    if (isPurchased(submissionCode[i])){
      body += '<p align="center"><b>' + submissionCode[i] + '</b></p>' +
              '<p>Use the ePoster Submission Code to submit your ePoster at the ePoster Submission system for <b>' + conferenceName[i] + '</b></p>'
    } else {
      // backlink needs improvement
      purchaseLink = 'https://secure.shareit.com/shareit/checkout.html?cart=1&PRODUCT[' + productID + ']=1&hidecoupon=1&HADD[' + productID + '][ADDITIONAL1]=' + abstractID[i] + '&backlink=http%3A%2F%2F'+conferenceKey+'.epostersubmission.com&showcart=1&pc=50206&pts=CCA,DBC,DDB,PAL,WTR&csp=0&usp=0'
      console.log(">> purchase link: "+purchaseLink);
      body += '<p align="center"><b> This Submission Code is not purchased yet. <a href="' + purchaseLink + '" targe="_blank">Proceed with the purchase »</a></b></p>';
    }
  }

  body +='<p>For any questions, please do not hesitate to take a look at our Support Center or contact us at support@scigentech.com</p>'+
        '<p>Thank you,</p>'+
        '<p>The ePostersLive® team</p>';

  return body;
}


/**
 *  retrieves submission codes and sends it through mail called when a valid mail is given at get('api/submissioncodes/confKey')
 *  if the conference supportsPayment checks if there are purchases linked to the email given.
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 */
exports.sendemail = function (req, res) {
  var conferenceKey = req.query.key; //'asa2016'
  var checkPurchases = false;

  if (supportsPayment.indexOf(conferenceKey) > -1) { // == 'asa2016'){
    checkPurchases = true;
    console.log("Conference supports payment");

    // find conf ProductID
    var productID = productIDMap.get(conferenceKey.toLowerCase()); //'300753014'

    if (!productID) {
      return handleError(res,'ProductID is missing');
    }
    console.log('ProductID: '+productID);
  }

  var recipient = req.query.email; //'jeffrey_kroin@rush.edu';
  var conferenceName = '';
  var inProduction = parseInt(config.submissionCode.inProduction.trim(), 10); //convert 1 or 0 to into

  console.log('submissioncode.contoller::sendmail: Set who will be the recipient of the email.');
  console.log('submissioncode.contoller::sendmail: inProduction: ', inProduction+' === '+ typeof inProduction);

  var to = '';
  if (inProduction) {
    console.log('submissioncode.contoller::sendmail: Set recipients for production.');
    to = recipient;
  } else {
    console.log('submissioncode.contoller::sendmail: Set recipients for development.');
    to = config.submissionCode.recipients.trim();
  }
  console.log('submissioncode.contoller::sendmail: to: ', to);

  var _sendemail = function (submissionCode, posterTitle, abstractID, conferenceName, purchases, conferenceKey) {
    console.log('Sending Email to ', to);
    var from = 'support@scigentech.com';
    var subject = 'Your ePoster Submission Code';
    var html = createEmailBody(submissionCode, posterTitle, abstractID, productID, conferenceName, purchases, conferenceKey);
    if (html != 'ERROR') { // δεν ξερω πως ειναι δυνατον η createEmailBody να επιστρεψει 'ERROR'
      email.sendEmail(from, to, subject, html);
      return true;
    } else {
      console.log('ERROR in createEmailBody')
      return false;
    }
  }

  async.parallel({
    confName: function (callback) {
      selectConferenceTitle(conferenceKey, function (err, rows, fields) {
        console.log("calling selectConferenceTitle ...");
        if (!err) {
          if (rows.length > 0) {
            conferenceName = rows[0].name;
            console.log("setting conferenceName ...", conferenceName);
          }
        }
        callback(err, conferenceName);
      });
    },
    rows: function (callback) {
      selectSubmissionCodes(conferenceKey, recipient, function (err, rows, fields) {
        console.log("calling selectSubmissionCodes ...");
        callback(null, rows);
      });
    }
  },
    function (err, results) {
      var submissionCodes = [];
      var posterTitles = [];
      var conferenceNames = [];
      var abstractIDs = [];

      // console.log(err)

      console.log('submissioncode.contoller::sendmail: Parallel results:' + JSON.stringify(results));
      if (results.rows && results.rows.length > 0) {
        console.log(results.rows.length);

        for (var i = 0; i < results.rows.length; i++) {
          submissionCodes.push(results.rows[i].unique_identifier)
          posterTitles.push(results.rows[i].abstract_title);
          conferenceNames.push(conferenceName);
          abstractIDs.push(results.rows[i].abstract_id)
        }
        var purchases = null;

        if (checkPurchases) {
          console.log('Calling findBySumbissionCodes...')
          findBySumbissionCodes(submissionCodes, function (value) {
            purchases = value;
            console.log("purchases: " + purchases);

            return res.json(200,
              {
                result: _sendemail(submissionCodes, posterTitles, abstractIDs, conferenceNames, purchases, conferenceKey)
              });
          });
        } else {
          return res.json(200,
            {
              result: _sendemail(submissionCodes, posterTitles, abstractIDs, conferenceNames, purchases, conferenceKey)
            });
        }

      } else {

        console.log('Cannot find email');
        return res.json(200,
          {
            result: false
          });
      } // results.rows && results.rows.length > 0
    });
}

/**
 * creates {findBySumbissionCode} functions dynamically and uses async to make parallel calls to MONGO.
 *
 * @function findBySumbissionCodes
 * @param {Array} codes - array of submission codes.
 * @param {Object} callback - responds with HTTP 200 when successful and sends the mail with the codes to the recipients.
 */
function findBySumbissionCodes(codes, callback) {
  // Parallel call of findBySumbissionCode
  var fs = [];

  //closure to call findBySumbissionCode dynamically
  function createFunction(cs, i){
    return function(callback){
      findBySumbissionCode(cs[i], function(value) {
        callback(null, value);
      });
    }
  }

  for (var i=0; i < codes.length;i++){
    fs.push(createFunction(codes, i))
  }

  async.parallel(
    fs,
    function(err, results) {
      console.log("Submission Codes purchases: \n", results)
      callback(results);
    });

}


 /**
  * searches in MONGO if the submissionCode {isPurchased}
  * @function findBySumbissionCode
  * @param {String} submissionCode
  * @param {Object} callback
  */
function findBySumbissionCode(submissionCode, callback) {
  console.log("findBySumbissionCode for code: "+submissionCode);
  SubmissioncodesOrder.find({submissionCode: submissionCode}, function(err, purchase) {
    console.log("MONGO: "+JSON.stringify(purchase));

    if (err) {
      return handleError(err);
    }
    if (purchase.length > 0) {
      console.log("Purchased Submission Code: " + purchase[0].submissionCode);
      callback({code: submissionCode, purchased: true});
    } else { // returning as an array
      console.log("Not Purchased: "+ submissionCode);
      callback({code: submissionCode, purchased: false});
    }

  });
}


function handleError(res, err) {
  console.log('HANDLE_ERROR: '+err);
  return res.json(500, {result: err});
}
