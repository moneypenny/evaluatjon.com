'use strict';

/**
 * @ngdoc function
 * @name evaluatjonApp.controller:RatingsCtrl
 * @description
 * # RatingsCtrl
 * Controller of the evaluatjonApp
 */
angular.module('evaluatjonApp')
  .controller('RatingsCtrl', ['$scope', 'Rating', 'Auth', function ($scope, Rating, Auth) {
    $scope.ratings = Rating.query();
    $scope.new_rating = {stars: 0, error_messages: []};
    $scope.auth_status = {logged_in: Auth.isAuthenticated(),
                          user: {}};
    $scope.credentials = {email: '', password: ''};
    $scope.toggle = {show_login_form: false};

    $scope.login = function() {
      Auth.login($scope.credentials);
    };

    $scope.$on('devise:login', function(event, current_user) {
      $scope.auth_status.logged_in = true;
      $scope.auth_status.user = current_user;
      console.log('logged in as', current_user);
    });

    $scope.set_new_rating_stars = function(stars) {
      $scope.new_rating.stars = stars;
    };

    $scope.create_rating = function() {
      var on_success = function (rating) {
        $scope.ratings.unshift(rating);
        $scope.new_rating.stars = 0;
        $scope.new_rating.error_messages.length = 0;
        $scope.new_rating.dimension = '';
        $scope.new_rating.comment = '';
        $scope.new_rating.rater = '';
      };
      var on_error = function (response) {
        $scope.new_rating.error_messages = response.data;
      };
      Rating.save({rating: $scope.new_rating}, on_success, on_error);
    };
  }]);
