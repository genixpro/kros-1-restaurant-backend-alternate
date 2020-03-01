'use strict';

var _ = require('lodash'),
  Product = require('./product.model'),
  CatalogueCategory = require('../catalogue-category/catalogue-category.model');
var Promise = require('bluebird');


var accessibleData = {
  index: function (req, res) {
    Product.find({
      createdBy: req.params.createdBy
    })
      .populate({
        path: 'createdBy category',
        select: '-hashedPassword -salt -provider -__v'
      })
      .populate('media')
      .exec(function (err, products) {
        if (err) {
          return handleError(res, err);
        }

        return res.json(200, {
          result: products
        });
      })
  },

  indexByCategory: function (req, res) {
    Product.find({
      category: req.params.category
    })
      .populate({
        path: 'createdBy category',
        select: '-hashedPassword -salt -provider -__v'
      })
      .populate('media')
      .exec(function (err, products) {
        if (err) {
          return handleError(res, err);
        }

        return res.json(200, {
          result: products
        });
      });
  }
};


// Get list of products
exports.index = function (req, res) {
  var _query = {
    $and: [{
      application: req.app
    }]

  };
  Promise.all([getCustomFieldsQuery(req), getCategoryQuery(req)]).then(function (values) {
    values.forEach(function (newQuery) {
      if (newQuery) {
        _query.$and.push(newQuery);
      }
    });
    console.log('Serching for :' + JSON.stringify(_query));

    Product.find(_query)
      .populate({
        path: 'createdBy category',
        select: '-hashedPassword -salt -provider -__v'
      })
      .populate('media')
      .exec(function (err, products) {
        if (err) {
          return handleError(res, err);
        }

        return res.json(200, {
          result: products
        });
      });
  }, function (reject) {
    return handleError(res, reject);
  });


};

// Get list of products by category
exports.indexByCategory = function (req, res) {
  Product.getByCategory(req.params.id, function (err, docs) {
    return res.json(200, {
      result: docs
    });
  });
};

// Get a single product
exports.show = function (req, res) {
  Product
    .findById(req.params.id)
    .populate({
      path: 'createdBy category',
      select: '-hashedPassword -salt -provider -__v'
    })
    .populate('media')
    .exec(function (err, product) {
      if (err) {
        return handleError(res, err);
      }
      if (!product) {
        return res.send(404);
      }

      return res.json(200, {
        result: product
      });
    });
};

// Get list of all the names of the custom fields
exports.customFieldNameIndex = function (req, res) {
  Product.find({application: req.app, customFields: {$exists: true, $not: {$size: 0}}}, function (err, result) {
    if (err) {
      return handleError(res, err);
    }
    var resultArr = [];
    result.forEach(function (item) {
      var oneElemField = item.customFields.map(function (filed) {
        return filed.name;
      });
      resultArr.push(oneElemField);
    });
    resultArr = _.union(_.flatten(resultArr));
    return res.json(200, resultArr);

  });

};

// Creates a new product in the DB.
exports.create = function (req, res) {
  if (req.body) {
    var data = {
      createdBy: req.user._id,
      title: req.body.title,
      description: req.body.description,
      category: req.body.categoryId || req.body.category,
      price: req.body.price,
      url: req.body.url,
      pdfUrl: req.body.pdfUrl,
      featured: req.body.featured,
      media: req.body.media,
      customFields: req.body.customFields,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      application: req.app
    };

    Product.create(data, function (err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, {
        result: doc
      });
    });
  }
};

// Updates an existing product in the DB.
exports.update = function (req, res) {
  if (req.body && req.params.id) {
    var data = req.body;
    data.category = req.body.category._id || req.body.category;
    data.modifiedAt = Date.now();
    data.application = req.app;


    Product.findOneAndUpdate({
      _id: req.params.id
    }, data, function (err, doc) {
      if (err) {
        return handleError(res, err);
      } else {
        return res.json(200, {
          url: 'http://localhost/api/products/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a product from the DB.
exports.destroy = function (req, res) {
  Product.findById(req.params.id, function (err, product) {
    if (err) {
      return handleError(res, err);
    }
    if (!product) {
      return res.send(404);
    }
    product.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}

function getCustomFieldsQuery(req) {
  return new Promise(function (resolve, reject) {
    var fieldQuery = {
      $and: []
    };
    if (req.query.fieldName) {
      fieldQuery.$and.push({
        name: req.query.fieldName
      });
    }
    if (req.query.searchValue) {
      var _regex2 = {$regex: req.query.searchValue, $options: 'i'};
      fieldQuery.$and.push({
        value: _regex2
      });
    }
    if (req.query.fieldName || req.query.searchValue) {
      resolve({customFields: {$elemMatch: fieldQuery}});
    } else {
      resolve(null);
    }
  });


}

function getCategoryQuery(req) {
  return new Promise(function (resolve, reject) {
    if (!req.query.category) {
      resolve(null);
    }
    var categoryQuery = {
      $or: []
    };
    categoryQuery.$or.push({category: req.query.category});
    CatalogueCategory.find({parentCategory: req.query.category}, function (err, categories) {
      if (err) {
        reject(err);
      }
      categories.forEach(function (elem) {
        categoryQuery.$or.push({category: elem._id});
      });
      resolve(categoryQuery);


    });
  });


}
