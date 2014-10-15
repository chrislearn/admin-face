define(['angular', 'scripts/app'], function(ng, app) {
    'use strict';
    return app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/home");
            $stateProvider
                .state('home', {
                  url: "/home",
                  templateUrl: "partials/home.html"
                })
                .state('calendar', {
                  url: "/calendar",
                  templateUrl: "partials/calendar.html"
                });
        }
    ]);
});
