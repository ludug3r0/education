'use strict';

angular.module('myApp.students', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/students', {
            templateUrl: 'students/students.html',
            controller: 'StudentsCtrl'
        });
    }])

    .controller('StudentsCtrl', ['$http', '$scope', function ($http, $scope) {
        $scope.students = [];

        //TODO: Change studentService End-Point
        $http.get('data/studentService.json')
            .success(function (data) {
                var students = data;

                //TODO: Change studentGradeService End-Point
                $http.get('data/studentGradeService.json')
                    .success(function (data) {
                        var grades = _.chain(data)
                            .map(function (grade) {
                                return {
                                    id: grade.id,
                                    studentId: grade.student.id,
                                    value: grade.grade,
                                    courseId: grade.course.id
                                };
                            })
                            .groupBy(function (grade) {
                                return grade.studentId;
                            })
                            .value();


                        _.each(students, function (student) {
                            var studentId = student.id;
                            var studentGrades = grades[studentId] || [];
                            student.grades = studentGrades;
                            student.averageGrade = _.reduce(studentGrades, function (acc, grade) {
                                return acc + parseInt(grade.value);
                            }, 0) / studentGrades.length;

                        });
                        console.log(students);
                        $scope.students = students;
                    });
            });


    }]);