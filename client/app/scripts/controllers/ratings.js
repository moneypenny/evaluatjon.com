'use strict';

/**
 * @ngdoc function
 * @name evaluatjonApp.controller:RatingsCtrl
 * @description
 * # RatingsCtrl
 * Controller of the evaluatjonApp
 */
angular.module('evaluatjonApp')
  .controller('RatingsCtrl', ['$scope', 'Rating', function ($scope, Rating) {
    $scope.ratings = Rating.query();
    $scope.new_rating = {stars: 0};

    $scope.set_new_rating_stars = function(stars) {
      $scope.new_rating.stars = stars;
    };

    $scope.create_rating = function() {
      Rating.save({rating: $scope.new_rating}, function (rating) {
        $scope.ratings.unshift(rating);
      });
    };
  }]);