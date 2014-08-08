/*!
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
(function() {
    'use strict';

    var querySelector = document.querySelector.bind(document);

    var navdrawerContainer = querySelector('.navdrawer-container');
    var body = document.body;
    var appbarElement = querySelector('.app-bar');
    var menuBtn = querySelector('.menu');
    var main = querySelector('main');

    function closeMenu() {
        body.classList.remove('open');
        appbarElement.classList.remove('open');
        navdrawerContainer.classList.remove('open');
    }

    function toggleMenu() {
        body.classList.toggle('open');
        appbarElement.classList.toggle('open');
        navdrawerContainer.classList.toggle('open');
        navdrawerContainer.classList.add('opened');
    }

    main.addEventListener('click', closeMenu);
    menuBtn.addEventListener('click', toggleMenu);
    navdrawerContainer.addEventListener('click', function(event) {
        if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
            closeMenu();
        }
    });
})();


var app = angular.module("surveyApp", ["firebase"]);

app.factory("Survey", ["$firebase", function($firebase) {
  return function(surveyname) {
    // create a reference to the appropriate survey
    var ref = new Firebase("https://blistering-fire-8182.firebaseio.com/surveys/").child(surveyname);
    // return it as a sync'ed object
    return $firebase(ref);
  }
}]);

app.controller('SurveyController', ["$scope", "Survey", 
    function($scope, Survey) {

      $scope.sync = Survey('sample');

      $scope.data = $scope.sync.$asObject();

        $scope.addQuestion = function() {
            $scope.data.kanoQuestions.push({
                functional: $scope.qFunctional,
                dysfunctional: $scope.qDysfunctional,
                importance: $scope.qImportance,
                short: $scope.qShort
            });
            $scope.qFunctional = '';
            $scope.qDysfunctional = '';
            $scope.qImportance = '';
            $scope.qShort = '';
        };

        $scope.saveSurvey = function() {
          $scope.sync.$update('kanoQuestions', angular.copy($scope.data.kanoQuestions));
        };
    }]
);