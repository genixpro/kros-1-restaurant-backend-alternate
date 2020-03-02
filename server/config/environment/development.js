'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost/news-dev'
  },
  // AWS S3 storage configurations
  s3: {
    bucket: 'skounis-dev',
    uploadDir: 'news-app/',
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY
  },
  bitbucket:{
    isEnabled: process.env.BITBUCKET_IS_ENABLED,
    username: process.env.BITBUCKET_USER,
    password: process.env.BITBUCKET_PASSWORD,
    slug: process.env.BITBUCKET_SLUG, //'asa-2015-logs',
    owner: 'sknodejs'
  },
  emailDomain: 'appseed.io',
  mailgun: {
    login: 'postmaster@mg.appseed.io',
    password: '',
    cc: process.env.MAILGUN_CC,
    bcc: process.env.MAILGUN_BCC || 'skounis@gmail.com'
  },
  publicAppId : process.env.APPSEED_PUBLIC_APP_ID,
  refreshInterval: 5 || process.env.APPSEED_REFRESH_INTERVAL,
  // mysql: {
  //   host     : 'localhost',
  //   port     : 8889,
  //   user     : 'root',
  //   password : 'root',
  //   database : null //'iti2016_eabstracts'
  // },

  // eposters
  mysql: {
    host     : '',
    port     : 3306,
    user     : '',
    password : '',
    database : null
  },
  baseUrl: process.env.APPSEED_BASE_URL,
  appName: process.env.APPSEED_APP_NAME,
  submissionCode: {
    inProduction: '0',
    recipients  : '',
    mySQL:  {
      host    : '',
      port    : 3306,
      user    : '',
      password: '',
      database: ''
    },
    whiteIPList: '',
    whiteIPRanges: '',
    supportsPayment: '',
    supportsSubmissioncode: '',
    confProductID: '',
    cmUrl: '',
    cpUrl: ''
  },
  reportsURL: '',
  reportsURLToken: '',

  seedDB: true,

};
