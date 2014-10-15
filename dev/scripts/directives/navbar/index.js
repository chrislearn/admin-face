define(['../module'], function(module) {
    'use strict';
    module
        .directive('afNavbar', ['templateBaseUrl',
            function(templateBaseUrl) {
                return {
                    restrict: 'E',
                    templateUrl: templateBaseUrl + '/navbar/index.html',
                    scope:{
                    },
                    controller: ['$scope',
                        function($scope) {
                        }
                    ]
                };
            }
        ]);
});
