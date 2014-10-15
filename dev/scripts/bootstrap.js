define([
    'require',
    'angular',
    'scripts/app',
    'scripts/routes'
], function(require, ng) {
    'use strict';
    require(['domReady!'], function(document) {
        ng.bootstrap(document, ['app']);
    });
});
