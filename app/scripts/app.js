'use strict';
/* global angular */
/* global Firebase */

var surveyApp = angular.module('surveyApp', [
    'firebase',
    'ngRoute',
    'surveyControllers'
]);

surveyApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'templates/select.tmp.html',
            controller: 'SelectSurveyCtrl'
        }).
        when('/edit/:surveyId', {
            templateUrl: 'templates/edit_survey.tmp.html',
            controller: 'EditSurveyCtrl'
        }).
        when('/enter_results/:surveyId', {
            templateUrl: 'templates/enter_results.tmp.html',
            controller: 'EnterResultsCtrl'
        }).
        when('/view_results/:surveyId', {
            templateUrl: 'templates/view_results.tmp.html',
            controller: 'ViewResultsCtrl'
        }).
        when('/analysis/:surveyId', {
            templateUrl: 'templates/analysis.tmp.html',
            controller: 'AnalysisCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

surveyApp.factory('Survey', ['$firebase',
    function($firebase) {
        var baseURL = 'https://blistering-fire-8182.firebaseio.com';
        return {
            keyRef: function(surveyname, key) {
                // create a reference to the appropriate survey
                var ref = new Firebase(baseURL + '/surveys/').child(surveyname).child(key);
                return $firebase(ref);
            },
            ref: function(surveyname) {
                // create a reference to the appropriate survey
                var ref = new Firebase(baseURL + '/surveys/').child(surveyname);
                return $firebase(ref);
            },
            surveyIdRef: function() {
                var ref = new Firebase(baseURL + '/surveyIds');
                return $firebase(ref);
            },
            surveysRoot: function() {
                var ref = new Firebase(baseURL + '/surveys');
                return ref;
            }
        };
    }
]);

surveyApp.factory('Page', function() {
    var title = 'Kano Surveyor';
    var header = 'Simon\'s Kano Surveyor';
    var surveyId = 'sample';
    return {
        title: function() {
            return title;
        },
        setTitle: function(newTitle) {
            title = newTitle;
        },
        surveyId: function() {
            return surveyId;
        },
        setSurveyId: function(newSurveyId) {
            surveyId = newSurveyId;
        },
        header: function() {
            return header;
        },
        setHeader: function(newHeader) {
            header = newHeader;
        }
    };
});