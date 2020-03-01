// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'client/bower_components/jquery/jquery.js',
      'client/bower_components/angular/angular.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-cookies/angular-cookies.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-route/angular-route.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/bower_components/lodash/lodash.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/bower_components/angular-ui-calendar/src/calendar.js',
      'client/bower_components/angular-dragdrop/src/angular-dragdrop.js',
      'client/bower_components/ng-file-upload/angular-file-upload-shim.js',
      'client/bower_components/ng-file-upload/angular-file-upload.js',
      'client/bower_components/angular-translate/angular-translate.js',
      'client/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'client/bower_components/angular-youtube-mb/src/angular-youtube-embed.js',
      'client/bower_components/jquery-ui/ui/jquery.ui.datepicker.js',
      'client/bower_components/angular-ui-select/dist/select.js',
      'client/bower_components/angular-ui-utils/ui-utils.js',
      'client/bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.js',
      'client/thirdparty/ui-sortable/src/sortable.js',
      'client/bower_components/ng-csv/build/ng-csv.js',
      'client/bower_components/angular-filter/dist/angular-filter.js',
      'client/bower_components/underscore/underscore.js',
      'client/bower_components/moment/moment.js',
      'client/bower_components/angular-timezone-selector/dist/angular-timezone-selector.js',
      'client/bower_components/ngstorage/ngStorage.js',
      'client/bower_components/angular-ui-grid/ui-grid.js',
      'client/app/app.js',
      'client/app/app.coffee',
      'client/app/**/*.js',
      'client/app/**/*.coffee',
      'client/components/**/*.js',
      'client/components/**/*.coffee',
      'client/app/**/*.jade',
      'client/components/**/*.jade',
      'client/app/**/*.html',
      'client/components/**/*.html'
    ],

    preprocessors: {
      '**/*.jade': 'ng-jade2js',
      '**/*.html': 'html2js',
      '**/*.coffee': 'coffee',
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    ngJade2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};