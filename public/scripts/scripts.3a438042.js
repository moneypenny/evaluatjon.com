"use strict";$(function(){$("body").tooltip({selector:'[data-toggle="tooltip"]'})});var app=angular.module("evaluatjonApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","angularMoment","Devise"]);app.config(["AuthProvider",function(a){a.loginPath("/api/users/sign_in"),a.loginMethod("POST"),a.logoutPath("/api/users/sign_out.json"),a.logoutMethod("DELETE")}]),app.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/ratings.html",controller:"RatingsCtrl"}),a.otherwise({redirectTo:"/"})}]),app.factory("Rating",["$resource",function(a){return a("/api/ratings/:id.json",{id:"@id"},{update:{method:"PUT"}})}]),app.factory("Reply",["$resource",function(a){return a("/api/ratings/:rating_id/replies/:id.json",{id:"@id",rating_id:"@rating_id"},{update:{method:"PUT"}})}]),app.directive("starRating",function(){return{restrict:"A",template:'<ul class="star-rating">  <li ng-repeat="star in stars" class="star" ng-class="{filled: star.filled, half: star.half}">    <span class="star"></span>  </li></ul>',scope:{ratingValue:"=",max:"="},link:function(a){a.stars=[];for(var b=0;b<a.max;b++)a.stars.push({index:b,filled:!1,half:!1});var c=function(){for(var b=0;b<a.max;b++)a.stars[b].filled=b+1<=a.ratingValue,a.stars[b].half=b+.5===a.ratingValue};a.$watch("ratingValue",function(a,b){b&&c()})}}}),app.directive("starRater",function(){return{restrict:"A",template:'<ul class="star-rating mutable">  <li ng-repeat="star in stars" class="star" ng-class="{hover: star.hover, filled: star.filled, half: star.half, active: star.active}" ng-click="toggle($event, star)" ng-mousemove="on_move($event, star)" ng-mouseover="on_hover($event, star)" ng-mouseleave="off_hover()">    <span class="star"></span>  </li>  <li ng-show="ratingValue && ratingValue > 0">    <button title="Clear" data-placement="right" data-toggle="tooltip" ng-click="clear_rating()" type="button" class="close">      <span aria-hidden="true">&times;</span>      <span class="sr-only">Clear</span>    </button>  </li></ul>',scope:{ratingValue:"=",max:"=",onRatingSelected:"&"},link:function(a,b){a.stars=[];for(var c=0;c<a.max;c++)a.stars.push({index:c,active:!1,hover:!1,filled:!1,half:!1});var d=function(){for(var b=0;b<a.max;b++)a.stars[b].filled=b+1<=a.ratingValue};d();var e=function(a,c){var d=a.offsetX,e=c.index+1,f=b.find("li.star:nth-child("+e+")"),g=f.width(),h=f.offset().left,i=h+g/2;c.half=i>h+d};a.on_hover=function(b,c){c.active=!0,c.filled||e(b,c);for(var d=0;d<=c.index;d++)a.stars[d].hover=!0;for(var f=c.index+1;f<a.max;f++)a.stars[f].hover=!1},a.on_move=function(a,b){b.filled||e(a,b)},a.off_hover=function(){for(var b=0;b<a.max;b++)a.stars[b].active=!1,a.stars[b].hover=!1,a.stars[b].half=b+.5===a.ratingValue},a.clear_rating=function(){a.ratingValue=0,a.onRatingSelected({rating:a.ratingValue})},a.toggle=function(b,c){e(b,c),a.ratingValue=c.index+(c.half?.5:1),a.onRatingSelected({rating:a.ratingValue})},a.$watch("ratingValue",function(a,b){a!==b&&d()})}}}),angular.module("evaluatjonApp").controller("RatingsCtrl",["$scope","$http","$window","Rating","Reply","Auth",function(a,b,c,d,e,f){a.ratings=d.query(),a.statistics={average:{}},a.new_rating={stars:0,error_messages:[]},a.auth_status={logged_in:f.isAuthenticated(),user:{}},a.credentials={email:"",password:""},a.toggle={show_reply_form:{}},a.new_reply={message:"",error_messages:[]},b.get("/api/ratings/statistics.json").success(function(b){a.statistics.average=parseFloat(b.average)}),a.login=function(){f.login(a.credentials)},a.$on("devise:login",function(b,c){a.auth_status.logged_in=!0,a.auth_status.user=c,console.log("logged in as",c)}),a.set_new_rating_stars=function(b){a.new_rating.stars=b},a.create_rating=function(){var b=function(b){a.ratings.unshift(b),a.new_rating.stars=0,a.new_rating.error_messages.length=0,a.new_rating.dimension="",a.new_rating.comment="",a.new_rating.rater=""},c=function(b){a.new_rating.error_messages=b.data};d.save({rating:a.new_rating},b,c)},a.delete_rating=function(b){var e=c.confirm("Are you sure you want to delete this rating?");if(e){var g=b.id,h=function(){for(var b=0;b<a.ratings.length;b++)a.ratings[b].id===g&&a.ratings.splice(b,1)},i=function(a){console.error("failed to delete rating",b,a)};f.currentUser().then(function(a){d.delete({email:a.email,token:a.auth_token,id:g},h,i)})}},a.create_reply=function(b){var c=b.id;for(var d in a.toggle.show_reply_form)d!==c&&(a.toggle.show_reply_form[d]=!1);var g=function(c){b.replies.unshift(c),a.new_reply.message="",a.new_reply.error_messages.length=0},h=function(b){a.new_reply.error_messages=b.data};f.currentUser().then(function(b){e.save({rating_id:c,reply:a.new_reply,email:b.email,token:b.auth_token},g,h)})},a.delete_reply=function(a,b){var d=c.confirm("Are you sure you want to delete this reply?");if(d){var g=a.id,h=b.id,i=function(){for(var b=0;b<a.replies.length;b++)a.replies[b].id===h&&a.replies.splice(b,1)},j=function(a){console.error("failed to delete reply",b,a)};f.currentUser().then(function(a){e.delete({rating_id:g,email:a.email,token:a.auth_token,id:h},i,j)})}}}]);