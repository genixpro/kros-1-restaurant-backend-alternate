/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model'),
    Client = require('../api/client/client.model'),
    RestaurantOrder = require('../api/restaurant-order/restaurant-order.model'),
    Application = require('../api/application/application.model'),
    Item = require('../api/item/item.model'),
    Poster = require('../api/poster/poster.model'),
    Room = require('../api/room/room.model'),
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
var appId3 = mongoose.Types.ObjectId();
var appId4 = mongoose.Types.ObjectId();

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

var roomId1 = mongoose.Types.ObjectId();
var roomId2 = mongoose.Types.ObjectId();
var roomId3 = mongoose.Types.ObjectId();
var roomId4 = mongoose.Types.ObjectId();
var roomId5 = mongoose.Types.ObjectId();
var roomId6 = mongoose.Types.ObjectId();
var roomId7 = mongoose.Types.ObjectId();
var roomId8 = mongoose.Types.ObjectId();
var roomId9 = mongoose.Types.ObjectId();
var roomId10 = mongoose.Types.ObjectId();
var roomId11 = mongoose.Types.ObjectId();
var roomId12 = mongoose.Types.ObjectId();
var roomId13 = mongoose.Types.ObjectId();
var roomId14 = mongoose.Types.ObjectId();
var roomId15 = mongoose.Types.ObjectId();
var roomId16 = mongoose.Types.ObjectId();
var roomId17 = mongoose.Types.ObjectId();
var roomId18 = mongoose.Types.ObjectId();
var roomId19 = mongoose.Types.ObjectId();
var roomId20 = mongoose.Types.ObjectId();
var roomId21 = mongoose.Types.ObjectId();
var roomId22 = mongoose.Types.ObjectId();
var roomId23 = mongoose.Types.ObjectId();
var roomId24 = mongoose.Types.ObjectId();
var roomId25 = mongoose.Types.ObjectId();
var roomId26 = mongoose.Types.ObjectId();
var roomId27 = mongoose.Types.ObjectId();
var roomId28 = mongoose.Types.ObjectId();
var roomId29 = mongoose.Types.ObjectId();
var roomId30 = mongoose.Types.ObjectId();
var roomId31 = mongoose.Types.ObjectId();
var roomId32 = mongoose.Types.ObjectId();
var roomId33 = mongoose.Types.ObjectId();
var roomId34 = mongoose.Types.ObjectId();
var roomId35 = mongoose.Types.ObjectId();
var roomId36 = mongoose.Types.ObjectId();
var roomId37 = mongoose.Types.ObjectId();
var roomId38 = mongoose.Types.ObjectId();
var roomId39 = mongoose.Types.ObjectId();
var roomId40 = mongoose.Types.ObjectId();
var roomId41 = mongoose.Types.ObjectId();
var roomId42 = mongoose.Types.ObjectId();
var roomId43 = mongoose.Types.ObjectId();
var roomId44 = mongoose.Types.ObjectId();
var roomId45 = mongoose.Types.ObjectId();
var roomId46 = mongoose.Types.ObjectId();
var roomId47 = mongoose.Types.ObjectId();
var roomId48 = mongoose.Types.ObjectId();
var roomId49 = mongoose.Types.ObjectId();
var roomId50 = mongoose.Types.ObjectId();
var roomId51 = mongoose.Types.ObjectId();
var roomId52 = mongoose.Types.ObjectId();
var roomId53 = mongoose.Types.ObjectId();
var roomId54 = mongoose.Types.ObjectId();
var roomId55 = mongoose.Types.ObjectId();
var roomId56 = mongoose.Types.ObjectId();
var roomId57 = mongoose.Types.ObjectId();
var roomId58 = mongoose.Types.ObjectId();
var roomId59 = mongoose.Types.ObjectId();
var roomId60 = mongoose.Types.ObjectId();
var roomId61 = mongoose.Types.ObjectId();
var roomId62 = mongoose.Types.ObjectId();
var roomId63 = mongoose.Types.ObjectId();
var roomId64 = mongoose.Types.ObjectId();
var roomId65 = mongoose.Types.ObjectId();
var roomId66 = mongoose.Types.ObjectId();
var roomId67 = mongoose.Types.ObjectId();
var roomId68 = mongoose.Types.ObjectId();
var roomId69 = mongoose.Types.ObjectId();
var roomId70 = mongoose.Types.ObjectId();
var roomId71 = mongoose.Types.ObjectId();
var roomId72 = mongoose.Types.ObjectId();
var roomId73 = mongoose.Types.ObjectId();
var roomId74 = mongoose.Types.ObjectId();
var roomId75 = mongoose.Types.ObjectId();
var roomId76 = mongoose.Types.ObjectId();
var roomId77 = mongoose.Types.ObjectId();
var roomId78 = mongoose.Types.ObjectId();
var roomId79 = mongoose.Types.ObjectId();
var roomId80 = mongoose.Types.ObjectId();
var roomId81 = mongoose.Types.ObjectId();
var roomId82 = mongoose.Types.ObjectId();
var roomId83 = mongoose.Types.ObjectId();
var roomId84 = mongoose.Types.ObjectId();
var roomId85 = mongoose.Types.ObjectId();
var roomId86 = mongoose.Types.ObjectId();
var roomId87 = mongoose.Types.ObjectId();
var roomId88 = mongoose.Types.ObjectId();
var roomId89 = mongoose.Types.ObjectId();
var roomId90 = mongoose.Types.ObjectId();
var roomId91 = mongoose.Types.ObjectId();
var roomId92 = mongoose.Types.ObjectId();

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
  var dummyApps = [{
    _id: appId1,
    name: 'My restaurant - 1',
    description: 'My awesome restaurant description',
    type: 'restaurant',
    createdBy: userId1,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    owners: [userId1]
  },{
    _id: appId2,
    name: 'My restaurant - 2',
    description: 'My awesome restaurant description',
    type: 'restaurant',
    createdBy: userId1,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    owners: [userId1]
  }, {
    _id: appId3,
    name: 'My lectures',
    description: 'My awesome lectures description',
    type: 'lectures',
    createdBy: userId1,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    owners: [userId1, userId2]
  }, {
    _id: appId4,
    name: 'ASA 2015',
    description: 'My awesome conference description',
    type: 'conference',
    createdBy: userId1,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    owners: [userId1]
  }];

  Application.create(dummyApps, function() {
    console.log('finished populating applications');
  });
});

Item.find({}).remove(function() {
  console.log('finished populating items');
});

RestaurantOrder.find({}).remove(function() {
  var dummyRestaurantOrders = [{
    userId: userId1.toString(),
    // order was made on 22 January 2014
    date: 1390323600000,
    status: STATUS_NEW_UNREAD,
    deliveryMethod: METHOD_TAKEAWAY,
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      notes: 'Lorem ipsum'
    },
    shipping: {
      fullname: 'John Smith',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      notes: 'Lorem ipsum' //Delivery notes
    },
    items: [{
      name: 'Item 1',
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
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      notes: 'Lorem ipsum'
    },
    shipping: {
      fullname: 'Jennifer Garner',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      notes: 'Lorem ipsum' //Delivery notes
    },
    items: [{
      name: 'Item 1',
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
    restaurant: {
      name: 'ABC Restaurant',
      address: '800 Tchoupitoulas St.',
      zip: 'LA 70130',
      city: 'New Orleans',
      notes: 'Lorem ipsum'
    },
    shipping: {
      fullname: 'Jennifer Garner',
      address: '500 Oracle Parkway',
      zip: 'CA 94065',
      city: 'Redwood City',
      notes: 'Lorem ipsum' //Delivery notes
    },
    items: [{
      name: 'Item 1',
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
      restaurant: {
        name: 'ABCD Restaurant',
        address: '900 Tchoupitoulas St.',
        zip: 'LA 70130',
        city: 'New Orleans',
        notes: 'Lorem ipsum restaurant'
      },
      shipping: {
        fullname: 'Jennifer Millian',
        address: '500 Google Parkway',
        zip: 'CA 94065',
        city: 'Redwood City',
        notes: 'Lorem ipsum shipping notes' //Delivery notes
      },
      items: [{
        name: 'Item 1',
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
      restaurant: {
        name: 'ABC Restaurant',
        address: '800 Tchoupitoulas St.',
        zip: 'LA 70130',
        city: 'New Orleans',
        notes: 'Lorem ipsum'
      },
      shipping: {
        fullname: 'Jennifer Garner',
        address: '500 Oracle Parkway',
        zip: 'CA 94065',
        city: 'Redwood City',
        notes: 'Lorem ipsum' //Delivery notes
      },
      items: [{
        name: 'Item 1',
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
      restaurant: {
        name: 'ABC Restaurant',
        address: '800 Tchoupitoulas St.',
        zip: 'LA 70130',
        city: 'New Orleans',
        notes: 'Lorem ipsum'
      },
      shipping: {
        fullname: 'Jennifer Garner',
        address: '500 Oracle Parkway',
        zip: 'CA 94065',
        city: 'Redwood City',
        notes: 'Lorem ipsum' //Delivery notes
      },
      items: [{
        name: 'Item 1',
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
      restaurant: {
        name: 'ABC Restaurant',
        address: '800 Tchoupitoulas St.',
        zip: 'LA 70130',
        city: 'New Orleans',
        notes: 'Lorem ipsum'
      },
      shipping: {
        fullname: 'Jennifer Garner',
        address: '500 Oracle Parkway',
        zip: 'CA 94065',
        city: 'Redwood City',
        notes: 'Lorem ipsum' //Delivery notes
      },
      items: [{
        name: 'Item 1',
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
    console.log('finished populating orders');
  });
});

Poster.find({}).remove(function() {
  var dummyPosters = [{
    title: 'Quantitative Urine Toxicology Can Help in Improving Compliance and Opioid Dose Adjustment in Chronic Pain Patients',
    presentationType: 'MCC',
    code: 'MCC-01',
    // room: roomId1.toString(),
    // monitor: 0,
    startDate: 1430157600000,
    duration: 300000,
    createdBy: appId4.toString(),
    createdAt: 1424165760000,
    modifiedAt:1424165796860
  }, {
    title: 'Changes in RNA Expression in Patients With Chronic Pain After Total Knee Replacement',
    presentationType: 'Poster discussion',
    code:'PP-01',
    // room: roomId2.toString(),
    // monitor: 0,
    startDate: 1430157600000,
    duration: 600000,
    createdBy: appId4.toString(),
    createdAt: 1424163760000,
    modifiedAt:1424164796860
  }, {
    title: 'An International Survey to Understand Infection Control Practices for Neuromodulation',
    presentationType: 'Poster discussion',
    code:'PP-02',
    // room: roomId1.toString(),
    // monitor: 1,
    startDate: 1430157600000,
    duration: 600000,
    createdBy: appId4.toString(),
    createdAt: 1424063760000,
    modifiedAt:1424074796860
  }, {
    title: 'Outcome of Percutaneous Lumbar Synovial Cyst Rupture in Patients with Lumbar Radiculopathy: A Case Series',
    presentationType: 'MCC',
    code:'MCC-02',
    // room: roomId2.toString(),
    // monitor: 1,
    startDate: 1430156500000,
    duration: 600000,
    createdBy: appId4.toString(),
    createdAt: 1423063760000,
    modifiedAt:1424074706860
  }, {
    title: 'Prolonged Relief of Chronic Extreme PTSD and Depression Symptoms in Veterans Following a Stellate Ganglion Block',
    presentationType: 'MCC',
    code:'MCC-03',
    // room: roomId3.toString(),
    // monitor: 0,
    startDate: 1430156500000,
    duration: 600000,
    createdBy: appId4.toString(),
    createdAt: 1423063660000,
    modifiedAt:1424074716860
  }, {
    title: 'Time to Cessation of Postoperative Opioids: A National-level Cross-sectional Analysis of the Veterans Affairs Healthcare System',
    presentationType: 'Poster discussion',
    code:'PP-03',
    // room: roomId3.toString(),
    // monitor: 1,
    startDate: 1430156500000,
    duration: 600000,
    createdBy: appId4.toString(),
    createdAt: 1423063870000,
    modifiedAt:1424074786860
  }, {
    title: 'Systematic Review and Meta-Analysis of Comparative Studies for Lumbosacral Radicular Pain: Transforaminal Versus Interlaminar Approaches to Epidural Steroid Injections',
    presentationType: 'Poster discussion',
    code:'PP-04',
    // room: roomId1.toString(),
    // monitor: 1,
    startDate: 1430156500000,
    duration: 300000,
    createdBy: appId4.toString(),
    createdAt: 1423063770900,
    modifiedAt:1424074786899
  }, {
    title: 'Goal-Directed Fluid Therapy With Closed-loop Assistance During Moderate Risk Surgery Using Noninvasive Cardiac Output Monitoring',
    presentationType: 'Poster discussion',
    code:'PP-05',
    // room: roomId1.toString(),
    // monitor: 0,
    startDate: 1430156500000,
    duration: 600000,
    createdBy: appId4.toString(),
    createdAt: 1423063769999,
    modifiedAt:1424074779999
  }, {
    title: 'A Randomized Study Comparing a Novel Needle Guidance Technology for Cannulation of a Simulated Internal Jugular Vein',
    presentationType: 'Poster discussion',
    // code:'PP-06',
    // room: roomId2.toString(),
    monitor: 1,
    startDate: 1430156500000,
    duration: 600000,
    createdBy: appId4.toString(),
    createdAt: 1423063777000,
    modifiedAt:1424074799860
  }, {
    code : "A1053",
    title : "The Benefits and Risks of Intraoperative Transesophageal Echocardiography During Liver Transplantation",
    createdAt : 1432030507349,
    modifiedAt : 1432030507349,
    createdBy: appId4.toString(),
    authors : [
      {
        "firstName" : "Sher-Lu",
        "lastName" : "Pai",
        "institution" : "Mayo Clinic",
        "email" : "pai.sherlu@mayo.edu",
        "isPresenter" : true
      },
      {
        "firstName" : "Stephen",
        "lastName" : "Aniskevich",
        "institution" : "Mayo Clinic",
        "email" : "",
        "isPresenter" : false
      },
      {
        "firstName" : "Timothy",
        "lastName" : "Shine",
        "institution" : "Mayo Clinic",
        "email" : "",
        "isPresenter" : false
      },
      {
        "firstName" : "Beth",
        "lastName" : "Ladlie",
        "institution" : "Mayo Clinic",
        "email" : "",
        "isPresenter" : false
      },
      {
        "firstName" : "Prith",
        "lastName" : "Peiris",
        "institution" : "Mayo Clinic",
        "email" : "",
        "isPresenter" : false
      },
      {
        "firstName" : "Claudia",
        "lastName" : "Crawford",
        "institution" : "Mayo Clinic",
        "email" : "",
        "isPresenter" : false
      },
      {
        "firstName" : "Klaus",
        "lastName" : "Torp",
        "institution" : "Mayo Clinic",
        "email" : "",
        "isPresenter" : false
      },
      {
        "firstName" : "Neil",
        "lastName" : "Feinglass",
        "institution" : "Mayo Clinic",
        "email" : "",
        "isPresenter" : false
      }
    ],

  },


    {
      title: 'Response to Noxious Stimuli During Closed-Loop Controlled Propofol Anesthesia at Different Remifentanil Effect Site Concentrations',
      presentationType: 'Poster discussion',
      code:'PP-07',
      monitor: -1,
      startDate: 1430156500000,
      duration: 600000,
      createdBy: appId4.toString(),
      createdAt: 1423064760000,
      modifiedAt:1424074999999,
      authors: [
        {
          "firstName" : "Asokumar",
          "lastName" : "Buvanendran",
          "institution" : "Rush University Medical Center",
          "email" : "asokumar@aol.com",
          "isPresenter" : true
        },
        {
          "firstName" : "Hyung-Suk",
          "lastName" : "Kim",
          "institution" : "National Institute of Nursing Research",
          "email" : "",
          "isPresenter" : false
        },
        {
          "firstName" : "Mario",
          "lastName" : "Moric",
          "institution" : "Rush University Medical Center",
          "email" : "",
          "isPresenter" : false
        },
        {
          "firstName" : "Youping",
          "lastName" : "Deng",
          "institution" : "Rush University Medical Center",
          "email" : "",
          "isPresenter" : false
        },
        {
          "firstName" : "Yan",
          "lastName" : "Li",
          "institution" : "Rush University Medical Center",
          "email" : "",
          "isPresenter" : false
        },
        {
          "firstName" : "Kenneth",
          "lastName" : "Tuman",
          "institution" : "Rush University Medical Center",
          "email" : "",
          "isPresenter" : false
        },
        {
          "firstName" : "Jeffrey",
          "lastName" : "Kroin",
          "institution" : "Rush University Medical Center",
          "email" : "",
          "isPresenter" : false
        }
      ]

    }];

  Poster.create(dummyPosters, function() {
     console.log('finished populating posters');
  });
});

Room.find({}).remove(function() {
  var dummyRooms = [{
    _id: roomId1,
    title: 'MCC - Day 1: Sunday 8:00-9:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1424161760000,
    modifiedAt:1424161999987,
    presentationDuration: 10,
    availability : [{
      startDate : 1444575600000,
      endDate : 1444581000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    } ]
  }, {
    _id: roomId2,
    title: 'MCC - Day 1: Sunday 10:30-12:00',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1424061760000,
    modifiedAt:1424091999987,
    presentationDuration: 10,
    availability : [{
      startDate : 1444584600000,
      endDate : 1444590000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    } ]
  }, {
    _id: roomId3,
    title: 'MCC - Day 1: Sunday 13:00-14:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1424061760000,
    modifiedAt:1424091999987,
    presentationDuration: 10,
    availability : [{
      startDate : 1444593600000,
      endDate : 1444599000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    } ]
  }, {
    _id: roomId4,
    title: 'MCC - Day 1: Sunday 15:00-16:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1424061760000,
    modifiedAt:1424091999987,
    presentationDuration: 10,
    availability : [{
      startDate : 1444600800000,
      endDate : 1444606200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    } ]
  }, {
    _id: roomId5,
    title: 'MCC - Day 2: Monday 8:00-9:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1424061860000,
    modifiedAt:1424092999987,
    presentationDuration: 10,
    availability : [{
      startDate : 1444662000000,
      endDate : 1444667400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    } ]
  }, {
    _id: roomId6,
    title: 'MCC - Day 2: Monday 10:30-12:00',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1430417621000,
    modifiedAt:1430418621000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444671000000,
      endDate : 1444676400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    } ]
  }, {
    _id: roomId7,
    title: 'MCC - Day 2: Monday 13:00-14:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1430417621000,
    modifiedAt:1430418621000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444680000000,
      endDate : 1444685400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    } ]
  }, {
    _id: roomId8,
    title: 'MCC - Day 2: Monday 15:00-16:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444687200000,
      endDate : 1444692600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }]
  }, {
    _id: roomId9,
    title: 'MCC - Day 3: Tuesday 08:00 - 09:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444748400000,
      endDate : 1444753800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }]
  }, {
    _id: roomId10,
    title: 'MCC - Day 3: Tuesday 10:30 - 12:00',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444757400000,
      endDate : 1444762800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }]
  }, {
    _id: roomId11,
    title: 'MCC - Day 3: Tuesday 13:00 - 14:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444766400000,
      endDate : 1444771800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }]
  }, {
    _id: roomId12,
    title: 'MCC - Day 3: Tuesday 15:00 - 16:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444773600000,
      endDate : 1444779000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }]
  }, {
    _id: roomId13,
    title: 'PD - Day 1: Sunday 10:00 - 11:30',
    category: 'Poster Discussion',
    roomName: 'Room 1',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444582800000,
      endDate : 1444588200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId14,
    title: 'PD - Day 1: Sunday 10:00 - 11:30',
    category: 'Poster Discussion',
    roomName: 'Room 2',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444582800000,
      endDate : 1444588200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId15,
    title: 'PD - Day 1: Sunday 15:00 - 16:30',
    category: 'Poster Discussion',
    roomName: 'Room 2',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444600800000,
      endDate : 1444606200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId16,
    title: 'PD - Day 1: Sunday 10:00 - 11:30',
    category: 'Poster Discussion',
    roomName: 'Room 3',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444582800000,
      endDate : 1444588200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId17,
    title: 'PD - Day 1: Sunday 15:00 - 16:30',
    category: 'Poster Discussion',
    roomName: 'Room 3',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444600800000,
      endDate : 1444606200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId18,
    title: 'PD - Day 2: Monday 10:00 - 11:30',
    category: 'Poster Discussion',
    roomName: 'Room 1',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444669200000,
      endDate : 1444674600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId19,
    title: 'PD - Day 2: Monday 13:00 - 14:30',
    category: 'Poster Discussion',
    roomName: 'Room 1',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444680000000,
      endDate : 1444685400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId20,
    title: 'PD - Day 2: Monday 08:00 - 09:30',
    category: 'Poster Discussion',
    roomName: 'Room 2',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444662000000,
      endDate : 1444667400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId21,
    title: 'PD - Day 2: Monday 13:00 - 14:30',
    category: 'Poster Discussion',
    roomName: 'Room 2',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444680000000,
      endDate : 1444685400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId22,
    title: 'PD - Day 2: Monday 13:00 - 14:30',
    category: 'Poster Discussion',
    roomName: 'Room 3',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444680000000,
      endDate : 1444685400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId23,
    title: 'PD - Day 3: Tuesday 08:00 - 09:30',
    category: 'Poster Discussion',
    roomName: 'Room 1',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444748400000,
      endDate : 1444753800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId24,
    title: 'PD - Day 3: Tuesday 10:00 - 11:30',
    category: 'Poster Discussion',
    roomName: 'Room 1',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444755600000,
      endDate : 1444761000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId25,
    title: 'PD - Day 3: Tuesday 15:00 - 16:30',
    category: 'Poster Discussion',
    roomName: 'Room 1',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444773600000,
      endDate : 1444779000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId26,
    title: 'PD - Day 3: Tuesday 10:00 - 11:30',
    category: 'Poster Discussion',
    roomName: 'Room 2',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444755600000,
      endDate : 1444761000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  },  {
    _id: roomId27,
    title: 'PD - Day 3: Tuesday 15:00 - 16:30',
    category: 'Poster Discussion',
    roomName: 'Room 2',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444773600000,
      endDate : 1444779000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId28,
    title: 'PD - Day 3: Tuesday 13:00 - 14:30',
    category: 'Poster Discussion',
    roomName: 'Room 3',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444766400000,
      endDate : 1444771800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId29,
    title: 'PD - Day 3: Tuesday 15:00 - 16:30',
    category: 'Poster Discussion',
    roomName: 'Room 3',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444773600000,
      endDate : 1444779000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId30,
    title: 'PD - Day 4: Wednesday 08:00 - 09:30',
    category: 'Poster Discussion',
    roomName: 'Room 1',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444834800000,
      endDate : 1444840200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId31,
    title: 'PD - Day 4: Wednesday 10:00 - 11:30',
    category: 'Poster Discussion',
    roomName: 'Room 2',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444842000000,
      endDate : 1444847400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId32,
    title: 'PD - Day 4: Wednesday 10:00 - 11:30',
    category: 'Poster Discussion',
    roomName: 'Room 3',
    body: 'Building A - 2st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444842000000,
      endDate : 1444847400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }]
  }, {
    _id: roomId33,
    title: 'eP - Day 1: Sunday 08:00 - 08:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444575600000,
      endDate : 1444577400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId34,
    title: 'eP - Day 1: Sunday 08:30 - 09:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444577400000,
      endDate : 1444579200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId35,
    title: 'eP - Day 1: Sunday 09:00 - 09:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444579200000,
      endDate : 1444581000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId36,
    title: 'eP - Day 1: Sunday 09:30 - 10:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444581000000,
      endDate : 1444582800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId37,
    title: 'eP - Day 1: Sunday 10:00 - 10:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444582800000,
      endDate : 1444584600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId38,
    title: 'eP - Day 1: Sunday 10:30 - 11:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444584600000,
      endDate : 1444586400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId39,
    title: 'eP - Day 1: Sunday 11:00 - 11:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444586400000,
      endDate : 1444588200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId40,
    title: 'eP - Day 1: Sunday 11:30 - 12:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444588200000,
      endDate : 1444590000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId41,
    title: 'eP - Day 1: Sunday 12:00 - 12:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444590000000,
      endDate : 1444591800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId42,
    title: 'eP - Day 1: Sunday 12:30 - 13:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444591800000,
      endDate : 1444593600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId43,
    title: 'eP - Day 1: Sunday 13:00 - 13:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444593600000,
      endDate : 1444595400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId44,
    title: 'eP - Day 1: Sunday 13:30 - 14:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444595400000,
      endDate : 1444597200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId45,
    title: 'eP - Day 1: Sunday 14:00 - 14:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444597200000,
      endDate : 1444599000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId46,
    title: 'eP - Day 1: Sunday 14:30 - 15:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area A',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444599000000,
      endDate : 1444600800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId47,
    title: 'eP - Day 2: Monday 08:00 - 08:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444662000000,
      endDate : 1444663800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId48,
    title: 'eP - Day 2: Monday 08:30 - 09:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444663800000,
      endDate : 1444665600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId49,
    title: 'eP - Day 2: Monday 09:00 - 09:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444665600000,
      endDate : 1444667400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId50,
    title: 'eP - Day 2: Monday 09:30 - 10:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444667400000,
      endDate : 1444669200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId51,
    title: 'eP - Day 2: Monday 10:00 - 10:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444669200000,
      endDate : 1444671000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId52,
    title: 'eP - Day 2: Monday 10:30 - 11:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444671000000,
      endDate : 1444672800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId53,
    title: 'eP - Day 2: Monday 11:00 - 11:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444672800000,
      endDate : 1444674600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId54,
    title: 'eP - Day 2: Monday 11:30 - 12:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444674600000,
      endDate : 1444676400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId55,
    title: 'eP - Day 2: Monday 12:00 - 12:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444676400000,
      endDate : 1444678200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId56,
    title: 'eP - Day 2: Monday 12:30 - 13:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444678200000,
      endDate : 1444680000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId57,
    title: 'eP - Day 2: Monday 13:00 - 13:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444680000000,
      endDate : 1444681800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId58,
    title: 'eP - Day 2: Monday 13:30 - 14:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444681800000,
      endDate : 1444683600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId59,
    title: 'eP - Day 2: Monday 14:00 - 14:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444683600000,
      endDate : 1444685400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId60,
    title: 'eP - Day 2: Monday 14:30 - 15:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area B',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444685400000,
      endDate : 1444687200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId61,
    title: 'eP - Day 3: Tuesday 08:00 - 08:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444748400000,
      endDate : 1444750200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId62,
    title: 'eP - Day 3: Tuesday 08:30 - 09:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444750200000,
      endDate : 1444752000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId63,
    title: 'eP - Day 3: Tuesday 09:00 - 09:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444752000000,
      endDate : 1444753800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId64,
    title: 'eP - Day 3: Tuesday 09:30 - 10:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444753800000,
      endDate : 1444755600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId65,
    title: 'eP - Day 3: Tuesday 10:00 - 10:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444755600000,
      endDate : 1444757400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId66,
    title: 'eP - Day 3: Tuesday 10:30 - 11:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444757400000,
      endDate : 1444759200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId67,
    title: 'eP - Day 3: Tuesday 11:00 - 11:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444759200000,
      endDate : 1444761000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId68,
    title: 'eP - Day 3: Tuesday 11:30 - 12:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444761000000,
      endDate : 1444762800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId69,
    title: 'eP - Day 3: Tuesday 12:00 - 12:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444762800000,
      endDate : 1444764600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId70,
    title: 'eP - Day 3: Tuesday 12:30 - 13:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444764600000,
      endDate : 1444766400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId71,
    title: 'eP - Day 3: Tuesday 13:00 - 13:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444766400000,
      endDate : 1444768200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId72,
    title: 'eP - Day 3: Tuesday 13:30 - 14:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444768200000,
      endDate : 1444770000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId73,
    title: 'eP - Day 3: Tuesday 14:00 - 14:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444770000000,
      endDate : 1444771800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId74,
    title: 'eP - Day 3: Tuesday 14:30 - 15:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area C',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444771800000,
      endDate : 1444773600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId75,
    title: 'eP - Day 4: Wednesday 08:00 - 08:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area D',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444834800000,
      endDate : 1444836600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId76,
    title: 'eP - Day 4: Wednesday 08:30 - 09:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area D',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444836600000,
      endDate : 1444838400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId77,
    title: 'eP - Day 4: Wednesday 09:00 - 09:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area D',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444838400000,
      endDate : 1444840200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId78,
    title: 'eP - Day 4: Wednesday 09:30 - 10:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area D',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444840200000,
      endDate : 1444842000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId79,
    title: 'eP - Day 4: Wednesday 10:00 - 10:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area D',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444842000000,
      endDate : 1444843800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId80,
    title: 'eP - Day 4: Wednesday 10:30 - 11:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area D',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444843800000,
      endDate : 1444845600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId81,
    title: 'eP - Day 4: Wednesday 11:00 - 11:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area D',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444845600000,
      endDate : 1444847400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId82,
    title: 'eP - Day 4: Wednesday 11:30 - 12:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area E',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444847400000,
      endDate : 1444849200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId83,
    title: 'eP - Day 4: Wednesday 12:00 - 12:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area E',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444849200000,
      endDate : 1444851000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId84,
    title: 'eP - Day 4: Wednesday 12:30 - 13:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area E',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444851000000,
      endDate : 1444852800000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId85,
    title: 'eP - Day 4: Wednesday 13:00 - 13:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area E',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444852800000,
      endDate : 1444854600000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId86,
    title: 'eP - Day 4: Wednesday 13:30 - 14:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area E',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444854600000,
      endDate : 1444856400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId87,
    title: 'eP - Day 4: Wednesday 14:00 - 14:30',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area E',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444856400000,
      endDate : 1444858200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId88,
    title: 'eP - Day 4: Wednesday 14:30 - 15:00',
    category: 'Electronic Posters',
    roomName: 'Room 1',
    body: 'Hall B1 - Area E',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444858200000,
      endDate : 1444860000000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }, {
      title: "Monitor 13",
      body: ""
    }, {
      title: "Monitor 14",
      body: ""
    }, {
      title: "Monitor 15",
      body: ""
    }, {
      title: "Monitor 16",
      body: ""
    }, {
      title: "Monitor 17",
      body: ""
    }, {
      title: "Monitor 18",
      body: ""
    }, {
      title: "Monitor 19",
      body: ""
    }, {
      title: "Monitor 20",
      body: ""
    }]
  }, {
    _id: roomId89,
    title: 'MCC - Day 4: Wednesday 08:00 - 09:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444834800000,
      endDate : 1444840200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, , {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }]
  }, {
    _id: roomId90,
    title: 'MCC - Day 4: Wednesday 10:30 - 12:00',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444843800000,
      endDate : 1444849200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, , {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }]
  }, {
    _id: roomId91,
    title: 'MCC - Day 4: Wednesday 13:00 - 14:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444852800000,
      endDate : 1444858200000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, , {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }]
  }, {
    _id: roomId92,
    title: 'MCC - Day 4: Wednesday 15:00 - 16:30',
    category: 'MCC',
    roomName: 'Room 1',
    body: 'Building A - 1st floor',
    createdBy: appId4.toString(),
    createdAt: 1430419502000,
    modifiedAt:1430419902000,
    presentationDuration: 10,
    availability : [{
      startDate : 1444860000000,
      endDate : 1444865400000
    }],
    monitors: [{
      title: "Monitor 1",
      body: ""
    }, {
      title: "Monitor 2",
      body: ""
    }, {
      title: "Monitor 3",
      body: ""
    }, {
      title: "Monitor 4",
      body: ""
    }, {
      title: "Monitor 5",
      body: ""
    }, {
      title: "Monitor 6",
      body: ""
    }, {
      title: "Monitor 7",
      body: ""
    }, {
      title: "Monitor 8",
      body: ""
    }, , {
      title: "Monitor 9",
      body: ""
    }, {
      title: "Monitor 10",
      body: ""
    }, {
      title: "Monitor 11",
      body: ""
    }, {
      title: "Monitor 12",
      body: ""
    }]
  }

    /*
     , {
     _id: roomId6,
     title: 'MCC - Tuesday morning',
     roomName: 'Hall A',
     body: 'Body room 6',
     createdBy: appId4.toString(),
     createdAt: 1430485509000,
     modifiedAt:1430419999000,
     presentationDuration: 10,
     availability : [{
     startDate : 1441695600000,
     endDate : 1441706400000
     }],
     monitors: [{
     title: "Monitor 1",
     body: "Body monitor 1"
     }, {
     title: "Monitor 2",
     body: "Body monitor 2"
     }, {
     title: "Monitor 3",
     body: "Body monitor 3"
     }, {
     title: "Monitor 4",
     body: "Body monitor 4"
     }, {
     title: "Monitor 5",
     body: "Body monitor 5"
     }, {
     title: "Monitor 6",
     body: "Body monitor 6"
     }, {
     title: "Monitor 7",
     body: "Body monitor 7"
     }, {
     title: "Monitor 8",
     body: "Body monitor 8"
     }]
     }, {
     _id: roomId7,
     title: 'MCC - Tuesday evening',
     roomName: 'Hall A',
     body: 'Body room 7',
     createdBy: appId4.toString(),
     createdAt: 1430564759000,
     modifiedAt:1430565859000,
     presentationDuration: 10,
     availability : [{
     startDate : 1441717200000,
     endDate : 1441724400000
     }],
     monitors: [{
     title: "Monitor 1",
     body: "Body monitor 1"
     }, {
     title: "Monitor 2",
     body: "Body monitor 2"
     }, {
     title: "Monitor 3",
     body: "Body monitor 3"
     }, {
     title: "Monitor 4",
     body: "Body monitor 4"
     }, {
     title: "Monitor 5",
     body: "Body monitor 5"
     }, {
     title: "Monitor 6",
     body: "Body monitor 6"
     }, {
     title: "Monitor 7",
     body: "Body monitor 7"
     }, {
     title: "Monitor 8",
     body: "Body monitor 8"
     }]
     }, {
     _id: roomId8,
     title: 'Electronic Posters - Tuesday morning',
     roomName: 'Hall B',
     body: 'Body room 8',
     createdBy: appId4.toString(),
     createdAt: 1430580092000,
     modifiedAt:1430581992000,
     presentationDuration: 10,
     availability : [{
     startDate : 1441695600000,
     endDate : 1441706400000
     }],
     monitors: [{
     title: "Monitor 1",
     body: "Body monitor 1"
     }, {
     title: "Monitor 2",
     body: "Body monitor 2"
     }, {
     title: "Monitor 3",
     body: "Body monitor 3"
     }, {
     title: "Monitor 4",
     body: "Body monitor 4"
     }, {
     title: "Monitor 5",
     body: "Body monitor 5"
     }, {
     title: "Monitor 6",
     body: "Body monitor 6"
     }, {
     title: "Monitor 7",
     body: "Body monitor 7"
     }, {
     title: "Monitor 8",
     body: "Body monitor 8"
     }]
     }, {
     _id: roomId9,
     title: 'Poster Discussion - Tuesday morning',
     roomName: 'Room 101',
     body: 'Body room 9',
     createdBy: appId4.toString(),
     createdAt: 1430590092000,
     modifiedAt: 1430590792000,
     presentationDuration: 10,
     availability : [{
     startDate : 1441695600000,
     endDate : 1441706400000
     }],
     monitors: [{
     title: "Monitor 1",
     body: "Body monitor 1"
     }, {
     title: "Monitor 2",
     body: "Body monitor 2"
     }, {
     title: "Monitor 3",
     body: "Body monitor 3"
     }, {
     title: "Monitor 4",
     body: "Body monitor 4"
     }, {
     title: "Monitor 5",
     body: "Body monitor 5"
     }, {
     title: "Monitor 6",
     body: "Body monitor 6"
     }, {
     title: "Monitor 7",
     body: "Body monitor 7"
     }, {
     title: "Monitor 8",
     body: "Body monitor 8"
     }]
     }
     */
  ];

  Room.create(dummyRooms, function() {
    console.log('finished populating rooms');
  });
});

exports.app_id = appId4
