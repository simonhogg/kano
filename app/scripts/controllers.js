'use strict';
/* global angular */
/* global $location */
/* global google */

google.load('visualization', '1', {
    packages: ['corechart']
});

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
            if(survey.$value === $scope.Page.surveyId()){
                $scope.Page.setSurveyId('');
            }
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

surveyControllers.controller('AnalysisCtrl', ['$scope', '$route', '$anchorScroll', '$location', 'Survey', 'Page', 'currentUser',
    function($scope, $route, $anchorScroll, $location, Survey, Page, currentUser) {
        //TODO this code is copied and pasted from EditSurveyCtrl --> refactor

        $scope.Page = Page;
        $scope.$route = $route;
        $scope.Page.setSurveyId($route.current.params.surveyId);

        // Set a nicer title
        $scope.Page.setTitle('Kano Surveyor | Analysis');

        $scope.scrollTo = function(id) {
            var old = $location.hash();
            $location.hash(id);
            $anchorScroll();
            $location.hash(old);
        };


        // Bind to the appropriate database items
        $scope.header = Survey.keyRef($scope.Page.surveyId(), 'header').$asObject();
        $scope.header.$bindTo($scope, 'header');
        $scope.qualifyingQuestions = Survey.keyRef($scope.Page.surveyId(), 'qualifyingQuestions').$asArray();
        $scope.kanoQuestions = Survey.keyRef($scope.Page.surveyId(), 'kanoQuestions').$asArray();
        $scope.responses = Survey.keyRef($scope.Page.surveyId(), 'responses').$asArray();



        // iterate through $scope.results and tally the count of votes for each question

        $scope.kanoKeys = [];
        // Create an array of all the short versions of the Kano Questions
        $scope.kanoQuestions.$loaded().then(function() {
            for (var i = 0; i < $scope.kanoQuestions.length; i++) {
                $scope.kanoKeys.push({
                    'key': $scope.kanoQuestions[i].short,
                    'O': 0,
                    'M': 0,
                    'I': 0,
                    'A': 0,
                    'R': 0,
                    'Q': 0,
                    'iS': 0, //sum of importance votes
                    'iN': 0, //number of importance votes
                    'classification': '', // kano classification
                    'positiveInfluence': 0.0,
                    'negativeInfluence': 0.0
                });
            }
        });

        // Loop through all the responses and tally votes
        $scope.responses.$loaded().then(function() {
            for (var i = 0; i < $scope.responses.length; i++) {
                //foreach response
                var r = $scope.responses[i].kano;
                for (var j = 0; j < $scope.kanoKeys.length; j++) {
                    //foreach question, increment the property which matches the kano classification
                    $scope.kanoKeys[j][r.k[$scope.kanoKeys[j].key]]++;
                    if (parseInt(r.i[$scope.kanoKeys[j].key], 10) > 0) {
                        //if Importance was specified then update the running total
                        $scope.kanoKeys[j].iS += parseInt(r.i[$scope.kanoKeys[j].key], 10);
                        $scope.kanoKeys[j].iN++;
                    }

                }
            }
            // Loop through all the tallied kanoKeys and compute the rest of the values
            for (var k = 0; k < $scope.kanoKeys.length; k++) {
                var denominator = $scope.kanoKeys[k].A + $scope.kanoKeys[k].O + $scope.kanoKeys[k].M + $scope.kanoKeys[k].I;
                $scope.kanoKeys[k].positiveInfluence = ($scope.kanoKeys[k].A + $scope.kanoKeys[k].O) / denominator;
                $scope.kanoKeys[k].negativeInfluence = -($scope.kanoKeys[k].O + $scope.kanoKeys[k].M) / denominator;
                var maxValue = 0;
                var letters = ['A', 'O', 'M', 'I', 'R', 'Q'];
                for (var w = 0; w < letters.length; w++) {
                    if ($scope.kanoKeys[k][letters[w]] >= maxValue) {
                        maxValue = $scope.kanoKeys[k][letters[w]];
                        $scope.kanoKeys[k].classification = letters[w];
                    }
                }
                console.log($scope.kanoKeys[k]);
            }

            // plot some charts
            var preChartData = [
                ['ID', 'Dissatisfaction', 'Satisfaction', 'Importance' ,'']
            ];
            
            for (var z = 0; z < $scope.kanoKeys.length; z++) {
                var kz = $scope.kanoKeys[z];
                preChartData.push([kz.key, kz.negativeInfluence, kz.positiveInfluence, kz.classification, kz.iS / kz.iN]);
            }
            //$scope.preChartData = preChartData;

            console.log(preChartData);
            var chartData = google.visualization.arrayToDataTable(preChartData);
            var chartOptions = {
                sortBubblesBySize: true,
                height: 800,
                width: 800,
                sizeAxis: {maxSize: 30, minSize: 5},
                hAxis: {title: 'Potential to Drive Dissatisfaction', direction:-1, maxValue:-1.0, minValue:0},
                vAxis: {title: 'Potential to Drive Satisfaction', maxValue:1.0, minValue:0},
                bubble: {
                    textStyle: {
                        auraColor: 'none'
                    }
                }
            };
            var chart = new google.visualization.BubbleChart(document.getElementById('chartdiv'));

            chart.draw(chartData, chartOptions);

            var preBarChartData = [
                ['ID', 'Dissatisfaction', 'Satisfaction']
            ];
            
            for (z = 0; z < $scope.kanoKeys.length; z++) {
                var k2z = $scope.kanoKeys[z];
                preBarChartData.push([k2z.key, k2z.negativeInfluence, k2z.positiveInfluence]);
            }
            var barChartData = google.visualization.arrayToDataTable(preBarChartData);
            var baroptions = {
                isStacked: true
            };
            var barChart = new google.visualization.BarChart(document.getElementById('barchartdiv'));
            barChart.draw(barChartData, baroptions);


        });


        $scope.hoggFactorFunction = function(kanoKey) {
            return (kanoKey.positiveInfluence - kanoKey.negativeInfluence) * (kanoKey.iS / kanoKey.iN);
        };

    }
]);

surveyControllers.controller('MainCtrl', ['$scope', '$location', 'Page', 'simpleLogin',
    function($scope, $location, Page, simpleLogin) {
        $scope.Page = Page;
        $scope.getLinkClass = function(){
            console.log($scope.Page.surveyId());
            if($scope.Page.surveyId() === ''){
                return 'disabled';
            }
        };

        $scope.auth = simpleLogin;
    }
]);