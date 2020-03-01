/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model'),
    Client = require('../api/client/client.model'),
    RestaurantOrder = require('../api/restaurant-order/restaurant-order.model'),
    Account = require('../api/account/account.model'),
    Media = require('../api/media/media.model'),
    Category = require('../api/category/category.model'),
    CatalogueCategory = require('../api/catalogue-category/catalogue-category.model'),
    Application = require('../api/application/application.model'),
    Item = require('../api/item/item.model'),
    Download = require('../api/download/download.model'),
    PlatformOrder = require('../api/platform-order/platform-order.model'),
    mongoose = require('mongoose');

// will be used by dummy orders
var METHOD_TAKEAWAY = 'METHOD_TAKEAWAY';
var METHOD_DELIVERY = 'METHOD_DELIVERY';
// will be used by dummy orders
var STATUS_NEW_UNREAD = 'STATUS_NEW_UNREAD';
var STATUS_NEW = 'STATUS_NEW';
var STATUS_IN_PROGRESS = 'STATUS_IN_PROGRESS';
var STATUS_SHIPPED = 'STATUS_SHIPPED';
var STATUS_DELIVERED = 'STATUS_DELIVERED';
var STATUS_CANCELED = 'STATUS_CANCELED';

var userId1 = mongoose.Types.ObjectId();
var userId2 = mongoose.Types.ObjectId();
var userAdmin = mongoose.Types.ObjectId();

var appId1 = mongoose.Types.ObjectId();
var appId2 = mongoose.Types.ObjectId();

var mediaId1 = mongoose.Types.ObjectId();
var mediaId2 = mongoose.Types.ObjectId();
var mediaId3 = mongoose.Types.ObjectId();
var mediaId4 = mongoose.Types.ObjectId();
var mediaId5 = mongoose.Types.ObjectId();
var mediaId6 = mongoose.Types.ObjectId();
var mediaId11 = mongoose.Types.ObjectId();

var categoryId1 = mongoose.Types.ObjectId();
var categoryId2 = mongoose.Types.ObjectId();
var categoryId3 = mongoose.Types.ObjectId();
var categoryId4 = mongoose.Types.ObjectId();
var categoryId5 = mongoose.Types.ObjectId();
var categoryId6 = mongoose.Types.ObjectId();

var downloadId1 = mongoose.Types.ObjectId();
var downloadId2 = mongoose.Types.ObjectId();

var platformOrderId1 = mongoose.Types.ObjectId();
var platformOrderId2 = mongoose.Types.ObjectId();

Client.find({}).remove(function() {
  Client.create({
    // for development purposes we set the clientId and clientSecret manually
    name: 'Test client',
    clientId: 'b9acdae5-d525-4b07-941a-53e980ff225b',
    clientSecret: '123',
    createdBy: userId1
  }, function() {
    console.log('finished populating clients');
  });
});

User.find({}).remove(function() {
  var dummyUsers = [{
    _id: userId1,
    provider: 'local',
    name: 'Test User1',
    email: 'test1@test.com',
    password: 'test1',
    active: false,
    expiration: Date.now()
  }, {
    _id: userId2,
    provider: 'local',
    name: 'Test User2',
    email: 'test2@test.com',
    password: 'test2',
    active: false,
    expiration: Date.now()
  }, {
    _id: userAdmin,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin',
    active: false,
    expiration: Date.now()
  }];

  User.create(dummyUsers, function() {
    console.log('finished populating users');
  });
});

Application.find({}).remove(function() {
  var dummyApps = [
  {
    _id: appId1,
    name: 'My Restaurant', //Χειροποίητο
    description: 'Traditional Greek Restaurant', //Παραδοσιακό Σουβλάκι Χειροποίητο
    type: 'restaurant',
    createdBy: userId1,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    owners: [userId1]
  },
  {
    _id: appId2,
    name: 'Test catalogue',
    description: 'Test description',
    type: 'catalogue',
    createdBy: userId1,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    owners: [userId1]
  }];

  Application.create(dummyApps, function() {
    console.log('finished populating applications');
  });
});

Account.find({}).remove(function() {
  var dummyAccounts = [{
    createdBy: userId1,
    business: {
      name:         'Edesia Restaurant',
      description:  'In 2013, Thomas Carter and Ignacio Mattos took over the intimate space that once housed the Knitting Factory music venue and turned it into Edesia. Set above Houston Street, the lively restaurant serves food inspired by the Mediterranean, cooked with a personal approach that incorporates the distinct flavors of New York—from the stalls of Chinatown to the bakeries of Brooklyn. There is a deep wine list, as well as a bar serving cocktails late into every evening.',
      email:        'info@edesia.com',
      address:      '47 E Houston St',
      addressExtra: 'New York',
      zipcode:      'NY 10012',
      latlong:      '40.724678, -73.994741',
      zoom:         '15'
    },
    contact: {
      phone:          '2122197693',
      email:          'info@edesia.com'
    }
  }];

  Account.create(dummyAccounts, function() {
    console.log('finished populating accounts');
  });

});

Media.find({}).remove(function() {
  var dummyMedia = [{
    _id: mediaId1,
    createdBy: userId1,
    uri: 'http://appseed.io.s3.amazonaws.com/dev/restaurant-backend-placeholder-750x500.png'
  },{
    _id: mediaId2,
    createdBy: userId1,
    uri: 'http://appseed.io.s3.amazonaws.com/dev/restaurant-backend-placeholder-750x500.png'
  },{
    _id: mediaId3,
    createdBy: userId1,
    uri: 'http://appseed.io.s3.amazonaws.com/dev/restaurant-backend-placeholder-750x500.png'
  },{
    _id: mediaId4,
    createdBy: userId1,
    uri: 'http://appseed.io.s3.amazonaws.com/dev/restaurant-backend-placeholder-750x500.png'
  },{
    _id: mediaId5,
    createdBy: userId1,
    uri: 'http://appseed.io.s3.amazonaws.com/dev/restaurant-backend-placeholder-750x500.png'
  },{
    _id: mediaId6,
    createdBy: userId1,
    uri: 'http://appseed.io.s3.amazonaws.com/dev/restaurant-backend-placeholder-750x500.png'
  },{
    _id: mediaId11,
    createdBy: userId1,
    uri: 'http://skounis-dev.s3.amazonaws.com/mobile-apps/restaurant-demo/assets/cat-a-1-thumb.jpg'
  }];

  Media.create(dummyMedia, function() {
    console.log('finished populating Media');
  });

});


// CatalogueCategory.find({}).remove(function() {
//   var dummyCategories = [{
//     _id: categoryId1,
//     createdBy: userId1,
//     name: 'Main',
//     media: mediaId1,
//     application: appId1
//   },{
//     _id: categoryId2,
//     createdBy: userId1,
//     name: 'Salads',
//     media: mediaId2,
//     application: appId1
//   },{
//     _id: categoryId3,
//     createdBy: userId1,
//     name: 'Build to order',
//     media: mediaId3,
//     application: appId1
//   },{
//     _id: categoryId4,
//     createdBy: userId1,
//     name: 'Sides',
//     media: mediaId4,
//     application: appId1
//   },{
//     _id: categoryId5,
//     createdBy: userId1,
//     name: 'Sandwich ',
//     media: mediaId5,
//     application: appId1
//   },{
//     _id: categoryId6,
//     createdBy: userId1,
//     name: 'Starters',
//     media: mediaId6,
//     application: appId1
//   }];
//
//   CatalogueCategory.create(dummyCategories, function() {
//     console.log('finished populating Categories');
//   });
//
// });

Category.find({}).remove(function() {
  var dummyCategories = [{
    _id: categoryId1,
    createdBy: userId1,
    name: 'Main',
    media: mediaId1,
    application: appId1
  },{
    _id: categoryId2,
    createdBy: userId1,
    name: 'Salads',
    media: mediaId2,
    application: appId1
  },{
    _id: categoryId3,
    createdBy: userId1,
    name: 'Build to order',
    media: mediaId3,
    application: appId1
  },{
    _id: categoryId4,
    createdBy: userId1,
    name: 'Sides',
    media: mediaId4,
    application: appId1
  },{
    _id: categoryId5,
    createdBy: userId1,
    name: 'Sandwich ',
    media: mediaId5,
    application: appId1
  },{
    _id: categoryId6,
    createdBy: userId1,
    name: 'Starters',
    media: mediaId6,
    application: appId1
  }];

  Category.create(dummyCategories, function() {
    console.log('finished populating CatalogueCategory');
  });

});


Download.find({}).remove(function() {
  var dummyDownloads = [{
    _id: downloadId1,
    createdBy: userId1,
    identifier: '300664323',
    name: 'Corporate+ - Pro',
    demo: '',
    wiki: '',
    info: '',
    s3Keys: [{
      isLatest: true,
      version: '2.1.0',
      key: "corporateplus-pro_2.1.0.zip",
      updateInstructions: ''
    }, {
      version: '2.0.1',
      key: "corporateplus/corporateplus-pro_2.0.1.zip",
      updateInstructions: ''
    }]
  }, {
    _id: downloadId2,
    createdBy: userId1,
    identifier: '300664444',
    name: 'New 2',
    demo: '',
    wiki: '',
    info: '',
    s3Keys: [{
      isLatest: true,
      version: '2.1.0',
      key: "corporateplus-pro_2.1.0.zip",
      updateInstructions: ''
    }, {
      version: '2.0.1',
      key: "corporateplus/corporateplus-pro_2.0.1.zip",
      updateInstructions: ''
    }]
  }];

  Download.create(dummyDownloads, function() {
    console.log('finished populating Downloads');
  });
});

PlatformOrder.find({}).remove(function() {
  var dummyPlatformOrders = [{
    createdBy: userId1,
    purchaseId: "FS472774745",
    runningNo: "FS123490",
    purchaseDate: {
      date: new Date()
    },
    productId: "300777440",
    quantity: 1,
    name: "Kayley Banks",
    email: "kayley.banks@gmail.com",
    additionalEmails: [
      "foo@bar.com",
      "baz@bar.com",
      "test1@test.com"
    ],
    company: "ABC Co",
    street: "Mikras Asias 26",
    country: "Greece",
    city: "Xanthi",
    zip: "67100",
    notes: "Foo bar, baz ..."
  },
  {
    createdBy: userId1,
    purchaseId: "FS472774743445",
    runningNo: "FS123490",
    purchaseDate: {
      date: new Date()
    },
    productId: "300777440",
    quantity: 1,
    name: "Test 1",
    email: "test1@test.com",
    additionalEmails: [
      "foo@bar.com",
      "baz@bar.com"
    ],
    company: "ABC Co",
    street: "Mikras Asias 26",
    country: "Greece",
    city: "Xanthi",
    zip: "67100",
    notes: "Foo bar, baz ..."
  },
  {
    createdBy: userId1,
    purchaseId: "FS4727747few45",
    runningNo: "FS123490",
    purchaseDate: {
      date: new Date()
    },
    productId: "300777440",
    quantity: 1,
    name: "Test 2",
    email: "test2@test.com",
    additionalEmails: [
      "foo@bar.com",
      "baz@bar.com",
      "test1@test.com"
    ],
    company: "ABC Co",
    street: "Mikras Asias 26",
    country: "Greece",
    city: "Xanthi",
    zip: "67100",
    notes: "Foo bar, baz ..."
  },
  {
    createdBy: userId1,
    purchaseId: "FS472774we5",
    runningNo: "FS123490",
    purchaseDate: {
      date: new Date()
    },
    productId: "300777440",
    quantity: 1,
    name: "Test 3",
    email: "test1@test.com",
    additionalEmails: [
      "foo@bar.com",
      "baz@bar.com",
      "test2@test.com"
    ],
    company: "ABC Co",
    street: "Mikras Asias 26",
    country: "Greece",
    city: "Xanthi",
    zip: "67100",
    notes: "Foo bar, baz ..."
  },
  {
    createdBy: userId1,
    purchaseId: "FS472774we5",
    runningNo: "FS123490",
    purchaseDate: {
      date: new Date()
    },
    productId: "300777440",
    quantity: 1,
    name: "Test 4",
    email: "admin@admin.com",
    additionalEmails: [],
    company: "ABC Co",
    street: "Mikras Asias 26",
    country: "Greece",
    city: "Xanthi",
    zip: "67100",
    notes: "Foo bar, baz ..."
  },
  {
    createdBy: userId2,
    purchaseId: "FS472774we5",
    runningNo: "FS123490",
    purchaseDate: {
      date: new Date()
    },
    productId: "300777440",
    quantity: 1,
    name: "Test 5",
    email: "test2@test.com",
    additionalEmails: [],
    company: "ABC Co",
    street: "Mikras Asias 26",
    country: "Greece",
    city: "Xanthi",
    zip: "67100",
    notes: "Foo bar, baz ..."
  }]

  PlatformOrder.create(dummyPlatformOrders, function(model) {
    console.log('finished populating PlatformOrder');
  });
});

Item.find({}).remove(function() {
  var dummyItems = [{
    createdBy: userId1,
    category: categoryId1,
    application: appId1,
    name:         'Bites of Pork meet', //'Σουβλάκι Χοιρινό',
    description:  'with seasons salad and freid and fried potatoes', //'συνοδεόνται από σαλάτα εποχής και πατατοσαλάτα χειροποίητο.',
    prices: [{
      name: '3 pc', //"3 τεμ.",
      value: 4.90
    },{
      name: '2 pc', //"2 τεμ.",
      value: 3.30
    },{
      name: '1 pc', //"1 τεμ.",
      value: 1.70
    }],
    optionsGroups:[{
      title: 'Basic Ingredients', //'Βασικά Συστατικά',
      defaultPrice: 0,
      defaultPreselected: true,
      fixedPrice: true,
      optionItems:[{
        title: 'Seasons salad', //'Σαλάτα εποχής',
        price: 0,
        preselected: true
      },{
        title: 'Fried potatoes', //'Πατατοσαλάτα χειροποίητο',
        price: 0,
        preselected: true
      }]
    },{
      title: 'Extra Ingredients', //'Έξτρα Συστατικά',
      defaultPrice: 0,
      defaultPreselected: false,
      optionItems:[{
        title: 'Greek Salad', //'Χωριάτικη',
        price: 3.60,
        preselected: true
      },{
        title: 'Green Salad', //'Μαρουλοσαλάτα',
        price: 2.30,
        preselected: false
      }]
    }],
    media: mediaId11
  }]

  Item.create(dummyItems, function() {
    console.log('finished populating items');
  });
});

RestaurantOrder.find({}).remove(function() {
  var dummyRestaurantOrders = [{
    userId: userId1.toString(),
    // order was made on 22 January 2014
    date: 1390323600000,
    status: STATUS_NEW_UNREAD,
    deliveryMethod: METHOD_TAKEAWAY,
    application: appId1,
    notes: 'Test notes 1',
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      country: 'US',
      notes: 'Lorem ipsum'
    },
    shipping: {
      email: 'email@email.com',
      fullname: 'John Smith',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      country: 'UK',
      notes: 'Lorem ipsum',
      phone: '555-55-55'
    },
    items: [{
      name: 'Item 1',
      description: "Test description",
      quantity: 1,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 10,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 12.20,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId1.toString(),
    // order was made on 22 January 2014
    date: 1390323600000,
    status: STATUS_IN_PROGRESS,
    deliveryMethod: METHOD_TAKEAWAY,
    application: appId1,
    notes: 'Test notes 2',
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      country: 'US',
      notes: 'Lorem ipsum'
    },
    shipping: {
      email: 'email@email.com',
      fullname: 'John Smith',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      country: 'UK',
      notes: 'Lorem ipsum',
      phone: '555-55-55' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      description: "Test description",
      quantity: 1,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 10,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 12.20,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId1.toString(),
    // order was made on 22 January 2014
    date: 1390323600000,
    status: STATUS_DELIVERED,
    deliveryMethod: METHOD_TAKEAWAY,
    application: appId1,
    notes: 'Test notes 3',
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      country: 'US',
      notes: 'Lorem ipsum'
    },
    shipping: {
      email: 'email@email.com',
      fullname: 'John Smith',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      country: 'UK',
      notes: 'Lorem ipsum',
      phone: '555-55-55' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      description: "Test description",
      quantity: 1,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 10,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 12.20,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId1.toString(),
    // order was made on 22 January 2014
    date: 1390323600000,
    status: STATUS_SHIPPED,
    deliveryMethod: METHOD_TAKEAWAY,
    application: appId1,
    notes: 'Test notes 4',
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      country: 'US',
      notes: 'Lorem ipsum'
    },
    shipping: {
      email: 'email@email.com',
      fullname: 'John Smith',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      country: 'UK',
      notes: 'Lorem ipsum',
      phone: '555-55-55' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      description: "Test description",
      quantity: 1,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 10,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 12.20,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId1.toString(),
    // order was made on 22 January 2014
    date: 1390323600000,
    status: STATUS_CANCELED,
    deliveryMethod: METHOD_TAKEAWAY,
    application: appId1,
    notes: 'Test notes 5',
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      country: 'US',
      notes: 'Lorem ipsum'
    },
    shipping: {
      email: 'email@email.com',
      fullname: 'John Smith',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      country: 'UK',
      notes: 'Lorem ipsum',
      phone: '555-55-55' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      description: "Test description",
      quantity: 1,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 10,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 12.20,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId1.toString(),
    // order was made on 22 January 2014
    date: 1390323600000,
    status: STATUS_IN_PROGRESS,
    deliveryMethod: METHOD_TAKEAWAY,
    application: appId1,
    notes: 'Test notes 6',
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      country: 'US',
      notes: 'Lorem ipsum'
    },
    shipping: {
      email: 'email@email.com',
      fullname: 'John Smith',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      country: 'UK',
      notes: 'Lorem ipsum',
      phone: '555-55-55' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      description: "Test description",
      quantity: 1,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 10,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 12.20,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId1.toString(),
    // order was made on 22 January 2014
    date: 1390323600000,
    status: STATUS_SHIPPED,
    deliveryMethod: METHOD_TAKEAWAY,
    application: appId1,
    notes: 'Test notes 7',
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      country: 'US',
      notes: 'Lorem ipsum'
    },
    shipping: {
      email: 'email@email.com',
      fullname: 'John Smith',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      country: 'UK',
      notes: 'Lorem ipsum',
      phone: '555-55-55' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      description: "Test description",
      quantity: 1,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 10,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 12.20,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId1.toString(),
    // order was made on 22 January 2015
    date: 1421859600000,
    status: STATUS_NEW_UNREAD,
    deliveryMethod: METHOD_DELIVERY,
    application: appId2,
    notes: 'Test notes 7',
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      country: 'US',
      notes: 'Lorem ipsum'
    },
    shipping: {
      email: 'email@email.com',
      fullname: 'Jennifer Garner',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      country: 'UK',
      notes: 'Lorem ipsum',
      phone: '555-55-55' //Delivery notes
    },
    items: [{
      name: 'Item 1',
      description: "Test description",
      quantity: 4,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 40,
      preparationTime: 15,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }, {
      name: 'Item 2',
      description: "Test description 2",
      quantity: 2,
      variant: 'M',
      unitPrice: 30,
      totalPrice: 60,
      preparationTime: 20,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 123,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  }, {
    userId: userId2.toString(),
    date: Date.now(),
    status: STATUS_NEW,
    deliveryMethod: METHOD_TAKEAWAY,
    application: appId2,
    notes: 'Test notes 8',
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      country: 'US',
      notes: 'Lorem ipsum'
    },
    shipping: {
      email: 'email@email.com',
      fullname: 'Jennifer Garner',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      country: 'UK',
      notes: 'Lorem ipsum',
      phone: '555-55-55' //Delivery notes
    },
    items: [{
      name: 'Hamburger Regular',
      description: "✖️ Without: Μουστάρδα \n➕ Extras: \nNotes: ",
      quantity: 4,
      variant: 'M',
      unitPrice: 10,
      totalPrice: 40,
      preparationTime: 10,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }, {
      name: 'Yoghurt Burger Double',
      description: "✖️ Without: Κρεμμύδι \n➕ Extras: Πατάτες-$1.00 \nNotes: Καλοψημένο",
      quantity: 2,
      variant: 'M',
      unitPrice: 20,
      totalPrice: 40,
      preparationTime: 5,
      tax: {
        percentage: 0.23,
        value: 23
      }
    }],
    grandTotal: 123,
    // we use this field when the first time news created
    createdAt: Date.now(),
    // we use this field when the news is updated
    modifiedAt: Date.now()
  },
    {
      userId: userId2.toString(),
      // order was made on 22 January 2015
      date: 1421859600000,
      status: STATUS_NEW,
      deliveryMethod: METHOD_TAKEAWAY,
      application: appId1,
      notes: 'Test notes 9',
      restaurant: {
        name: 'ABCD Restaurant',
        address: '900 Tchoupitoulas St.',
        zip: 'LA 70130',
        city: 'New Orleans',
        country: 'US',
        notes: 'Lorem ipsum restaurant'
      },
      shipping: {
        email: 'email@email.com',
        fullname: 'Jennifer Millian',
        address: '500 Google Parkway',
        zip: 'CA 94065',
        city: 'Redwood City',
        country: 'US',
        notes: 'Lorem ipsum shipping notes',
        phone: '555-55-55' //Delivery notes
      },
      items: [{
        name: 'Item 1',
        description: "Test description",
        quantity: 4,
        variant: 'M',
        unitPrice: 10,
        totalPrice: 40,
        preparationTime: 10,
        tax: {
          percentage: 0.23,
          value: 23
        }
      }, {
        name: 'Item 2',
        description: "Test description 2",
        quantity: 2,
        variant: 'M',
        unitPrice: 20,
        totalPrice: 40,
        preparationTime: 5,
        tax: {
          percentage: 0.23,
          value: 23
        }
      }],
      grandTotal: 123,
      // we use this field when the first time news created
      createdAt: Date.now(),
      // we use this field when the news is updated
      modifiedAt: Date.now()
    }, {
      userId: userId1.toString(),
      date: Date.now(),
      status: STATUS_NEW,
      deliveryMethod: METHOD_DELIVERY,
      application: appId1,
      notes: 'Test notes 10',
      restaurant: {
        name: 'ABC Restaurant',
        address: '800 Tchoupitoulas St.',
        zip: 'LA 70130',
        city: 'New Orleans',
        country: 'US',
        notes: 'Lorem ipsum'
      },
      shipping: {
        email: 'email@email.com',
        fullname: 'Jennifer Garner',
        address: '500 Oracle Parkway',
        zip: 'CA 94065',
        city: 'Redwood City',
        country: 'UK',
        notes: 'Lorem ipsum',
        phone: '555-55-55' //Delivery notes
      },
      items: [{
        name: 'Item 1',
        description: "Test description",
        quantity: 4,
        variant: 'M',
        unitPrice: 10,
        totalPrice: 40,
        preparationTime: 16,
        tax: {
          percentage: 0.15,
          value: 15
        }
      }, {
        name: 'Item 2',
        description: "Test description 2",
        quantity: 3,
        variant: 'M',
        unitPrice: 20,
        totalPrice: 60,
        preparationTime: 20,
        tax: {
          percentage: 0.23,
          value: 23
        }
      }],
      grandTotal: 123,
      // we use this field when the first time news created
      createdAt: Date.now(),
      // we use this field when the news is updated
      modifiedAt: Date.now()
    }, {
      userId: userId1.toString(),
      date: Date.now(),
      status: STATUS_CANCELED,
      deliveryMethod: METHOD_DELIVERY,
      application: appId1,
      notes: 'Test notes 11',
      restaurant: {
        name: 'ABC Restaurant',
        address: '800 Tchoupitoulas St.',
        zip: 'LA 70130',
        city: 'New Orleans',
        country: 'US',
        notes: 'Lorem ipsum'
      },
      shipping: {
        email: 'email@email.com',
        fullname: 'Jennifer Garner',
        address: '500 Oracle Parkway',
        zip: 'CA 94065',
        city: 'Redwood City',
        country: 'UK',
        notes: 'Lorem ipsum',
        phone: '555-55-55' //Delivery notes
      },
      items: [{
        name: 'Item 1',
        description: "Test description",
        quantity: 4,
        variant: 'M',
        unitPrice: 10,
        totalPrice: 40,
        preparationTime: 10,
        tax: {
          percentage: 0.23,
          value: 23
        }
      }, {
        name: 'Item 2',
        description: "Test description 2",
        quantity: 3,
        variant: 'M',
        unitPrice: 20,
        totalPrice: 60,
        preparationTime: 10,
        tax: {
          percentage: 0.15,
          value: 15
        }
      }],
      grandTotal: 123,
      // we use this field when the first time news created
      createdAt: Date.now(),
      // we use this field when the news is updated
      modifiedAt: Date.now()
    }, {
      userId: userId1.toString(),
      date: Date.now(),
      status: STATUS_DELIVERED,
      deliveryMethod: METHOD_DELIVERY,
      application: appId1,
      notes: 'Test notes 12',
      restaurant: {
        name: 'ABC Restaurant',
        address: '800 Tchoupitoulas St.',
        zip: 'LA 70130',
        city: 'New Orleans',
        country: 'Greece',
        notes: 'Lorem ipsum'
      },
      shipping: {
        email: 'email@email.com',
        fullname: 'Jennifer Garner',
        address: '500 Oracle Parkway',
        zip: 'CA 94065',
        city: 'Redwood City',
        country: 'Italy',
        notes: 'Lorem ipsum',
        phone: '555-55-55' //Delivery notes
      },
      items: [{
        name: 'Item 1',
        description: "Test description",
        quantity: 4,
        variant: 'M',
        unitPrice: 10,
        totalPrice: 40,
        preparationTime: 10,
        tax: {
          percentage: 0.23,
          value: 23
        }
      }, {
        name: 'Item 2',
        description: "Test description 2",
        quantity: 2,
        variant: 'M',
        unitPrice: 30,
        totalPrice: 60,
        preparationTime: 15,
        tax: {
          percentage: 0.15,
          value: 15
        }
      }],
      grandTotal: 123,
      // we use this field when the first time news created
      createdAt: Date.now(),
      // we use this field when the news is updated
      modifiedAt: Date.now()
    }];

  RestaurantOrder.create(dummyRestaurantOrders, function() {
    console.log('finished populating restaurant orders');
  });
});
