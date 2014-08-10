var surveyControllers = angular.module("surveyControllers", []);

surveyControllers.controller('EditSurveyCtrl', ["$scope", "$route", "Survey", "Page",
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
        $scope.Page.setTitle("Kano Surveyor | Edit Survey");

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

surveyControllers.controller('SelectSurveyCtrl', ["$scope", "Survey", "Page",
    function($scope, Survey, Page) {
        $scope.surveyIds = Survey.surveyIdRef().$asArray();

        $scope.createSurvey = function() {
            //TODO ensure that a given name is available
            $scope.surveyIds.$add($scope.shortName);
            Survey.surveysRoot().child($scope.shortName).set({header: {name: $scope.shortName}});
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

surveyControllers.controller('EnterResultsCtrl', ["$scope", "$route", "Survey", "Page",
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
        $scope.Page.setTitle("Kano Surveyor | Enter Data");
    }
]);

surveyControllers.controller('ViewResultsCtrl', ["$scope", "Survey",
    function($scope, Survey) {
        //placeholder
    }
]);

surveyControllers.controller('MainCtrl', ["$scope", "Page",
    function($scope, Page) {
        $scope.Page = Page;
    }
]);