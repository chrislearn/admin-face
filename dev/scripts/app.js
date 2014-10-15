define([
    'angular',
    'ui.router',
    './controllers/index',
    './directives/index',
    './filters/index',
    './services/index'
], function(ng) {
    'use strict';

    return ng.module('app', [
        'ui.router',
        'app.services',
        'app.controllers',
        'app.filters',
        'app.directives'
    ]);
});
