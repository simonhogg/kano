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
            controller: 'AnalysisCtrl',
            resolve: {
                // controller will not be invoked until getCurrentUser resolves
                'currentUser': ['simpleLogin',
                    function(simpleLogin) {
                        // simpleLogin refers to our $firebaseSimpleLogin wrapper in the example above
                        // since $getCurrentUser returns a promise resolved when auth is initialized,
                        // we can simple return that here to ensure the controller waits for auth before
                        // loading
                        return simpleLogin.$getCurrentUser();
                    }
                ]
            }
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

var baseURL = 'https://blistering-fire-8182.firebaseio.com';

surveyApp.factory('Survey', ['$firebase', '$firebaseSimpleLogin',
    function($firebase, $firebaseSimpleLogin) {

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
            },
        };
    }
]);

// let's create a re-usable factory that generates the $firebaseSimpleLogin instance
surveyApp.factory('simpleLogin', ['$firebaseSimpleLogin',
    function($firebaseSimpleLogin) {
        var ref = new Firebase(baseURL);
        return $firebaseSimpleLogin(ref);
    }
]);

surveyApp.factory('Page', function() {
    var title = 'Kano Surveyor';
    var header = 'Simon\'s Kano Surveyor';
    var surveyId = '';
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