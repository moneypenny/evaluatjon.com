'use strict';

$(function() {
  $('body').tooltip({selector: '[data-toggle="tooltip"]'});
});

/**
 * @ngdoc overview
 * @name evaluatjonApp
 * @description
 * # evaluatjonApp
 *
 * Main module of the application.
 */
var app = angular.module('evaluatjonApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularMoment',
    'Devise'
  ]);

app.config(function(AuthProvider) {
  AuthProvider.loginPath('/api/users/sign_in');
  AuthProvider.loginMethod('POST');
  AuthProvider.logoutPath('/api/users/sign_out.json');
  AuthProvider.logoutMethod('DELETE');
});

app.config(function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/ratings.html',
    controller: 'RatingsCtrl'
  });
  $routeProvider.otherwise({redirectTo: '/'});
});

app.factory('Rating', ['$resource', function ($resource) {
  return $resource('/api/ratings/:id.json',
                   {id: '@id'},
                   {'update': {method: 'PUT'}});
}]);

app.factory('Reply', ['$resource', function ($resource) {
  return $resource('/api/ratings/:rating_id/replies/:id.json',
                   {id: '@id', rating_id: '@rating_id'},
                   {'update': {method: 'PUT'}});
}]);

app.directive('starRating', function() {
  return {
    restrict: 'A',
    template: '<ul class="star-rating">' +
              ' <li ng-repeat="star in stars" ng-class="star">' +
              '  <span class="star"></span>' +
              ' </li>' +
              '</ul>',
    scope: {
      ratingValue: '=',
      max: '='
    },
    link: function(scope) {
      var update_rating = function() {
        scope.stars = [];
        var num_stars = scope.ratingValue;
        for (var i=0; i<scope.max; i++) {
          scope.stars.push({
            filled: i < num_stars,
            half: i - 0.5 === num_stars
          });
        }
      };
      scope.$watch('ratingValue',
        function(old_value, new_value) {
          if (new_value) {
            update_rating();
          }
        }
      );
    }
  };
});

app.directive('starRater', function() {
  return {
    restrict: 'A',
    template: '<ul class="star-rating mutable">' +
              ' <li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
              '  <span class="star"></span>' +
              ' </li>' +
              '</ul>',
    scope: {
      ratingValue: '=',
      max: '=',
      onRatingSelected: '&'
    },
    link: function(scope) {
      var update_rating = function() {
        scope.stars = [];
        for (var i=0; i<scope.max; i++) {
          scope.stars.push({
            filled: i < scope.ratingValue,
            half: i - 0.5 === scope.ratingValue
          });
        }
      };
      update_rating();
      scope.toggle = function(index) {
        if (scope.ratingValue === index + 1) {
          scope.ratingValue = 0;
        } else {
          scope.ratingValue = index + 1;
        }
        scope.onRatingSelected({rating: scope.ratingValue});
      };
      scope.$watch('ratingValue',
        function(new_value, old_value) {
          if (new_value !== old_value) {
            update_rating();
          }
        }
      );
    }
  };
});
