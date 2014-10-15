define(['angular', 'restangular'], function(ng) {
    'use strict';
    return ng.module('app.directives', ['restangular'])
         .constant('templateBaseUrl', 'scripts/directives');
});
