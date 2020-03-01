'use strict';

var _ = require('lodash'),
  S3Download = require('./s3-download.model');

exports.index = function (req, res) {
  var _query = {};

  var _regex = {$regex: req.query.search, $options: 'i'};
  if (req.query.search) {
    _query =
      {
        $or: [
          {productId: _regex},
          {name: _regex}
        ]
      };
  }

  console.log('paginate: ' + JSON.stringify(_query));

  S3Download.paginate({
    query: _query,
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sort: {
      date: -1
    }
  }, function(err, provider) {
    if (err) {
      return handleError(res, err);
    }
    res.json(200, {
      page: provider.page,
      page_size: provider.limit,
      total: provider.docs.length,
      num_pages: provider.pages,
      result: provider.docs
    });
  });

};

exports.show = function (req, res) {
  S3Download.findById(req.params.id, function (err, result) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, {
      result: result
    });
  });

};

exports.create = function (req, res) {

  S3Download.create(req.body, function (err, doc) {
    if (err) {
      return handleError(res, err);
    }

    return res.json(201, {
      result: doc
    });
  });

};

exports.update = function (req, res) {
  S3Download.findOneAndUpdate({
    _id: req.params.id
  }, req.body, function (err, result) {
    if (err) {
      return handleError(res, err);
    } else {
      return res.json(200, {
        result: result
      });
    }

  });

};

exports.destroy = function (req, res) {
  S3Download.remove({_id: req.params.id}, function (err, result) {
    if (err) {
      return handleError(res, err);
    }
    if (!result) {
      return res.send(404);
    }
    return res.send(200, {result: result});

  });

};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
