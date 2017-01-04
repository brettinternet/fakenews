var angular = require('angular'),
    uiRouter = require('angular-ui-router'),
    moment = require('moment'),
    ngMoment = require('angular-moment'),
    ngSanitize = require('angular-sanitize');


angular.module('newsApp', [uiRouter, ngMoment, ngSanitize]);
