'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/news-test'
  },
  // AWS S3 storage configurations
  s3: {
    bucket: 'skounis-dev',
    uploadDir: 'news-app/'
  },
  bitbucket:{
    isEnabled: process.env.BITBUCKET_IS_ENABLED,
    username: process.env.BITBUCKET_USER,
    password: process.env.BITBUCKET_PASSWORD,
    slug: process.env.BITBUCKET_SLUG, //'asa-2015-logs',
    owner: 'sknodejs'
  },

  refreshInterval: process.env.APPSEED_REFRESH_INTERVAL,
  publicAppId : process.env.APPSEED_PUBLIC_APP_ID,
  mysql: {
    // host     : 'localhost',
    // port     : 8889,
    // user     : 'root',
    // password : 'root',
    // database : null //'iti2016_eabstracts'
    host     : 'eposterslivedbreadreplica.chjr3zgn6oxe.eu-west-1.rds.amazonaws.com',
    port     : 3306,
    user     : 'reports',
    password : 'r3p0rts!',
    database : null //'iti2016_eabstracts'
  },

  submissionCode: {
    inProduction : false,
    recipients   : 'george.chaitidis@scigentech.com, iliana.papamarkou@scigentech.com',
    mySQL:  {
      host     : 'eposterslivedbreadreplica.chjr3zgn6oxe.eu-west-1.rds.amazonaws.com',
      port     : 3306,
      user     : 'reports',
      password : 'r3p0rts!',
      database : 'sk_dev_submissioncodes'
      // database : 'ismics2016_confmanager'
    }
  },

  baseUrl: 'http://localhost:3000',

  reportsURL: 'http://ec2-54-216-165-84.eu-west-1.compute.amazonaws.com/birt/frameset?__report={DB_KEY}_eabstracts.rptdesign',
  reportsURLToken: '{DB_KEY}'
};
