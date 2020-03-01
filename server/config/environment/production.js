'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP ||
    process.env.IP ||
    undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT ||
    process.env.PORT ||
    8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URI ||
      process.env.MONGOHQ_URL ||
      process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME ||
      'mongodb://localhost/news'
  },

  // AWS S3 storage configurations
  s3: {
    bucket: process.env.AWS_BUCKET,
    uploadDir: process.env.AWS_UPLOAD_DIR,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY
  },
  bitbucket:{
    isEnabled: process.env.BITBUCKET_IS_ENABLED,
    username: process.env.BITBUCKET_USER,
    password: process.env.BITBUCKET_PASSWORD,
    slug: process.env.BITBUCKET_SLUG,
    owner: ''
  },
  emailDomain: process.env.EMAIL_DOMAIN,
  mailgun: {
    login: process.env.EMAIL_MAILGUN_LOGIN,
    password: process.env.EMAIL_MAILGUN_PASSWORD,
    cc: process.env.MAILGUN_CC,
    bcc: process.env.MAILGUN_BCC
  },
  publicAppId : process.env.APPSEED_PUBLIC_APP_ID,
  refreshInterval: process.env.APPSEED_REFRESH_INTERVAL,
  mysql: {
    host     : '',
    port     : 3306,
    user     : '',
    password : '',
    database : null
  },
  submissionCode: {
    inProduction : process.env.SUBMISSIONCODE_INPRODUCTION,
    recipients   : process.env.SUBMISSIONCODE_RECIPIENTS,
    mySQL:  {
      host     : process.env.SUBMISSIONCODE_MYSQL_HOST,
      port     : process.env.SUBMISSIONCODE_MYSQL_PORT,
      user     : process.env.SUBMISSIONCODE_MYSQL_USER,
      password : process.env.SUBMISSIONCODE_MYSQL_PASSWORD,
      database : process.env.SUBMISSIONCODE_MYSQL_DATABASE
    },
    whiteIPList: process.env.SUBMISSIONCODE_WHITE_IP_LIST,
    whiteIPRanges: process.env.SUBMISSIONCODE_WHITE_IP_RANGES,
    supportsPayment: process.env.SUBMISSIONCODE_SUPPORTS_PAYMENTS_LIST,
    supportsSubmissioncode: process.env.SUBMISSIONCODE_ACTIVE_CONFS,
    confProductID: process.env.SUBMISSIONCODE_PRODUCTS_SHAREIT,
    cmUrl: process.env.SUBMISSIONCODE_CM_URL,
    cpUrl: process.env.SUBMISSIONCODE_CP_URL
  },
  seedDB: false,

  baseUrl: process.env.APPSEED_BASE_URL,
  appName: process.env.APPSEED_APP_NAME
};
