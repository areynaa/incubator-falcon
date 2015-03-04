/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  /***
   * @ngdoc controller
   * @name app.controllers.feed.FeedController
   * @requires EntityModel the entity model to copy the feed entity from
   * @requires Falcon the falcon service to talk with the Falcon REST API
   */
  var clusterModule = angular.module('app.controllers.view', [ 'app.services' ]);

  clusterModule.controller('EntityDetailsCtrl', [
    "$scope", "$interval", "Falcon", "EntityModel", "$state", "X2jsService", 'EntitySerializer',
    function ($scope, $interval, Falcon, EntityModel, $state, X2jsService, serializer) {

      $scope.entity = EntityModel;

      if($scope.entity.type === "feed"){
        $scope.feed = serializer.preDeserialize($scope.entity.model, "feed");
        $scope.feed.name = $scope.entity.name;
        $scope.feed.type = $scope.entity.type;
      }else{
        $scope.process = serializer.preDeserialize($scope.entity.model, "process");
        $scope.process.name = $scope.entity.name;
        $scope.process.type = $scope.entity.type;
      }

      $scope.capitalize = function(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
      };

      $scope.refreshInstanceList = function (type, name) {
        $scope.instancesList = [];
        $scope.loading = true;
        Falcon.logRequest();
        Falcon.getInstances(type, name, 0).success(function (data) {
          Falcon.logResponse('success', data, false, true);
          if (data !== null) {
            $scope.instancesList = data.instances;
          }
        }).error(function (err) {
          Falcon.logResponse('error', err);
        });
      };

      $scope.instanceDetails = function (type, name) {
        console.log("details" + type + "" + name);
      };

      $scope.suspendInstance = function (type, name, start, end) {
        console.log("suspend" + type + ", " + name + "," + start + "," + end);
        //Falcon.logRequest();
        //Falcon.postSuspendEntity(type, name)
        //    .success(function (message) {
        //      Falcon.logResponse('success', message, type);
        //      $scope.$parent.refreshList($scope.searchEntityType, $scope.tags);
        //    })
        //    .error(function (err) {
        //      Falcon.logResponse('error', err, type);
        //
        //    });
      };
      
    }
  ]);
  
  clusterModule.filter('titleCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  });
  
})();



