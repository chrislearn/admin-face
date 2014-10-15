require.config({
    baseUrl: ".",
    waitSeconds: 0,
    paths: {
        "jquery": "vendors/jquery/dist/jquery.min",
        "modernizr": "vendors/modernizr/modernizr",
        "domReady": "vendors/requirejs-domready/domReady",
        "bootstrap": "vendors/bootstrap/dist/js/bootstrap.min",
        "angular": "vendors/angular/angular",
        "ui.router": "vendors/angular-ui-router/release/angular-ui-router",
        // "ngRoute": "vendors/angular-route/angular-route",
        // "ngResource": "vendors/angular-resource/angular-resource",
        "ngAnimate": "vendors/angular-animate/angular-animate",
        "lodash": "vendors/lodash/dist/lodash",
        "restangular": "vendors/restangular/dist/restangular"
    },
    shim: {
        "angular": { exports: 'angular' },
        "ngRoute": ['angular'],
        // "ngResource": ['angular'],
        "ngAnimate": ['angular'],
        'ui.router': ['angular'],
        'restangular': ['angular', 'lodash'],
        "bootstrap": ['jquery']
    },
    deps:['scripts/bootstrap']
});
define('jquery', function() {
    return jQuery;
});
// require(['angular', 'app', 'routes'], function(ng, app, routes) {
//     ng.element(document).ready(function() {
//         ng.bootstrap(document, [app['name']]);
//     });
// });
