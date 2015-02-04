(function () {
	"use strict";

	var restApiModule = angular.module('rest-api-module', []);

  restApiModule.factory('restApi', ["$http", function($http) {
    var restApi = {};

    restApi.getClusters = function () {
      return $http.get('/api/clusters');
    };
    restApi.getUsers = function () {
      return $http.get('/api/users');
    };

    //----------methods----------------------------//
    restApi.getIinstances = function () {
      return $http.get('/api/items');
    };
    restApi.getItemInstances = function (itemName) {
      return $http.get('/api/items/' + itemName);
    };
    restApi.postItem= function (item) {
      return $http.post('/api/item/', item);
    };
    //----------------------------------------------//
    return restApi;
  }]);

}());
