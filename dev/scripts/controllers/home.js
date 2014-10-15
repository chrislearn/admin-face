 define(['./module'], function(module) {
     'use strict';
     module
         .constant('fileUrl', 'files')
         .controller('HomeCtrl', ['$scope', 'Restangular', 'fileUrl',
             function($scope, ra, fileUrl) {
                var rest_repositories = ra.all('repositories');
                rest_repositories.getList().then(function(data){
                    $scope.repositories = data;
                });

                $scope.addRepository = function(repo){
                    rest_repositories.post(repo).then(function(repo){
                        $scope.repo = angular.copy({});
                        $scope.repositories.push(repo);
                    });
                };

                $scope.repo = angular.copy({});
             }
         ]);
 });
