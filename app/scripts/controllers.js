'use strict';
/* global angular */
/* global $location */

var surveyControllers = angular.module('surveyControllers', []);

surveyControllers.controller('EditSurveyCtrl', ['$scope', '$route', 'Survey', 'Page',
    function($scope, $route, Survey, Page) {

        $scope.Page = Page;
        $scope.$route = $route;

        $scope.Page.setSurveyId($route.current.params.surveyId);

        // Bind to the appropriate database items
        $scope.header = Survey.keyRef($scope.Page.surveyId(), 'header').$asObject();
        $scope.header.$bindTo($scope, 'header');
        $scope.qualifyingQuestions = Survey.keyRef($scope.Page.surveyId(), 'qualifyingQuestions').$asArray();
        $scope.kanoQuestions = Survey.keyRef($scope.Page.surveyId(), 'kanoQuestions').$asArray();

        // Set a nicer title
        $scope.Page.setTitle('Kano Surveyor | Edit Survey');

        $scope.addKanoQuestion = function() {
            $scope.kanoQuestions.$add({
                functional: $scope.kqFunctional,
                dysfunctional: $scope.kqDysfunctional,
                importance: $scope.kqImportance,
                short: $scope.kqShort
            });
            $scope.kqFunctional = '';
            $scope.kqDysfunctional = '';
            $scope.kqImportance = '';
            $scope.kqShort = '';
        };

        $scope.addQualifyingQuestion = function() {
            $scope.qualifyingQuestions.$add({
                text: $scope.qqText,
                short: $scope.qqShort
            });
            $scope.qqText = '';
            $scope.qqShort = '';
        };

        $scope.removeKanoQuestion = function(id) {
            $scope.kanoQuestions.$remove(id);
        };
    }
]);

surveyControllers.controller('SelectSurveyCtrl', ['$scope', 'Survey', 'Page',
    function($scope, Survey, Page) {
        $scope.surveyIds = Survey.surveyIdRef().$asArray();

        $scope.createSurvey = function() {
            //TODO ensure that a given name is available
            $scope.surveyIds.$add($scope.shortName);
            Survey.surveysRoot().child($scope.shortName).set({
                header: {
                    name: $scope.shortName
                }
            });
            Page.setSurveyId($scope.shortName);
            $location.path('#/edit/$scope.shortName');
        };

        $scope.deleteSurvey = function(survey) {
            //TODO add confirmation
            $scope.surveyIds.$remove(survey);
            Survey.surveysRoot().child(survey.$value).remove();
        };
    }
]);

surveyControllers.controller('EnterResultsCtrl', ['$scope', '$route', 'Survey', 'Page',
    function($scope, $route, Survey, Page) {
        //TODO this code is copied and pasted from EditSurveyCtrl --> refactor

        $scope.Page = Page;
        $scope.$route = $route;

        $scope.Page.setSurveyId($route.current.params.surveyId);

        // Bind to the appropriate database items
        $scope.header = Survey.keyRef($scope.Page.surveyId(), 'header').$asObject();
        $scope.header.$bindTo($scope, 'header');
        $scope.qualifyingQuestions = Survey.keyRef($scope.Page.surveyId(), 'qualifyingQuestions').$asArray();
        $scope.kanoQuestions = Survey.keyRef($scope.Page.surveyId(), 'kanoQuestions').$asArray();

        // Set a nicer title
        $scope.Page.setTitle('Kano Surveyor | Enter Data');

        $scope.clearForm = function() {
            $scope.formData = {};
            $scope.formData.qualifiers = {};
            $scope.formData.kano = {};
            $scope.formData.kano.f = {};
            $scope.formData.kano.d = {};
            $scope.formData.kano.i = {};
            $scope.formData.kano.k = {};
        };
        $scope.clearForm();


        $scope.addResults = function() {
            $scope.responses = Survey.keyRef($scope.Page.surveyId(), 'responses').$asArray();
            $scope.calculateKano();
            $scope.responses.$add($scope.formData);
            $scope.clearForm();
        };

        $scope.calculateKano = function() {
            for (var i = 0; i < $scope.kanoQuestions.length; i++) {
                $scope.formData.kano.k[$scope.kanoQuestions[i].short] = $scope.kanoize(
                    $scope.formData.kano.f[$scope.kanoQuestions[i].short],
                    $scope.formData.kano.d[$scope.kanoQuestions[i].short]);
            }
        };

        $scope.kanoize = function(functional, dysfunctional) {
            // console.log('kanoize: %s %s', functional, dysfunctional);
            var lut = [
                ['Q', 'A', 'A', 'A', 'O'],
                ['R', 'I', 'I', 'I', 'M'],
                ['R', 'I', 'I', 'I', 'M'],
                ['R', 'I', 'I', 'I', 'M'],
                ['R', 'R', 'R', 'R', 'Q']
            ];
            return lut[functional - 1][dysfunctional - 1];
        };
    }
]);

surveyControllers.controller('ViewResultsCtrl', ['$scope', '$route', 'Survey', 'Page',
    function($scope, $route, Survey, Page) {
        //TODO this code is copied and pasted from EditSurveyCtrl --> refactor

        $scope.Page = Page;
        $scope.$route = $route;

        $scope.Page.setSurveyId($route.current.params.surveyId);

        // Bind to the appropriate database items
        $scope.header = Survey.keyRef($scope.Page.surveyId(), 'header').$asObject();
        $scope.header.$bindTo($scope, 'header');
        $scope.qualifyingQuestions = Survey.keyRef($scope.Page.surveyId(), 'qualifyingQuestions').$asArray();
        $scope.kanoQuestions = Survey.keyRef($scope.Page.surveyId(), 'kanoQuestions').$asArray();
        $scope.results = Survey.keyRef($scope.Page.surveyId(), 'responses').$asArray();

        // Set a nicer title
        $scope.Page.setTitle('Kano Surveyor | View Results');
    }
]);

surveyControllers.controller('AnalysisCtrl', ['$scope', '$route', 'Survey', 'Page',
    function($scope, $route, Survey, Page) {
        //TODO this code is copied and pasted from EditSurveyCtrl --> refactor

        $scope.Page = Page;
        $scope.$route = $route;

        $scope.Page.setSurveyId($route.current.params.surveyId);

        // Bind to the appropriate database items
        $scope.header = Survey.keyRef($scope.Page.surveyId(), 'header').$asObject();
        $scope.header.$bindTo($scope, 'header');
        $scope.qualifyingQuestions = Survey.keyRef($scope.Page.surveyId(), 'qualifyingQuestions').$asArray();
        $scope.kanoQuestions = Survey.keyRef($scope.Page.surveyId(), 'kanoQuestions').$asArray();
        $scope.responses = Survey.keyRef($scope.Page.surveyId(), 'responses').$asArray();

        // Set a nicer title
        $scope.Page.setTitle('Kano Surveyor | Analysis');

        // iterate through $scope.results and tally the count of votes for each question

        $scope.kanoKeys = [];
        // Create an array of all the short versions of the Kano Questions
        $scope.kanoQuestions.$loaded().then(function(){
            for(var i=0; i<$scope.kanoQuestions.length; i++) {
                $scope.kanoKeys.push({
                    'key':$scope.kanoQuestions[i].short, 
                    'O':0, 'M':0, 'I':0, 'A':0, 'R':0, 'Q':0,
                    'iS':0, //sum of importance votes
                    'iN':0, //number of importance votes
                    'classification':'', // kano classification
                    'positiveInfluence': 0.0,
                    'negativeInfluence': 0.0
                });
            }
        });

        // Loop through all the responses and tally votes
        $scope.responses.$loaded().then(function(){
            for(var i=0; i<$scope.responses.length; i++) {
                //foreach response
                var r = $scope.responses[i].kano;
                for(var j=0; j<$scope.kanoKeys.length; j++){
                    //foreach question, increment the property which matches the kano classification
                    $scope.kanoKeys[j][r.k[$scope.kanoKeys[j].key]]++;
                    console.log('r.i | %d', r.i[$scope.kanoKeys[j].key]);
                    if(r.i[$scope.kanoKeys[j].key]>0)
                    {
                        //if Importance was specified then update the running total
                        $scope.kanoKeys[j].iS += r.i[$scope.kanoKeys[j].key];
                        $scope.kanoKeys[j].iN++;
                    }
                    
                }
            }
            // Loop through all the tallied kanoKeys and compute the rest of the values
            for(var k=0; k<$scope.kanoKeys.length; k++){
                var denominator = $scope.kanoKeys[k].A+$scope.kanoKeys[k].O+$scope.kanoKeys[k].M+$scope.kanoKeys[k].I;
                $scope.kanoKeys[k].positiveInfluence = ($scope.kanoKeys[k].A+$scope.kanoKeys[k].O)/denominator;
                $scope.kanoKeys[k].negativeInfluence = ($scope.kanoKeys[k].O+$scope.kanoKeys[k].M)/denominator;
                var maxValue = 0;
                var letters = ['A','O','M','I','R','Q'];
                for(var w=0; w<letters.length; w++){
                    if($scope.kanoKeys[k][letters[w]]>=maxValue){
                        maxValue = $scope.kanoKeys[k][letters[w]];
                        $scope.kanoKeys[k].classification = letters[w];
                    }
                }

                console.log($scope.kanoKeys[k]);
            }

        }
        );


        // calculate the importance weight for each question

    }
]);

surveyControllers.controller('MainCtrl', ['$scope', 'Page',
    function($scope, Page) {
        $scope.Page = Page;
    }
]);