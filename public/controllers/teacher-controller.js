'use strict';

(function(){
    angular
    .module('myApp')
    .controller('TeacherCtrl',['$scope', '$parse', 'TeacherService', function ($scope, $parse, TeacherService) {

        $scope.sortType     = 'employeeId'; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.searchTeacher   = '';     // set the default search/filter term

        $scope.teachers=[];
        $scope.editTeacher = {};
        $scope.editUser = {};
        $scope.addT = false;
        $scope.editT = false;

        TeacherService.GetAll()
        .then(function(data){
            $scope.teachers = data;
        });

        $scope.AddTeacher = function(){
            if($scope.privilege==3){    // check if admin
                TeacherService.AddUser($scope.newUser)
                .then(function(data1){
                    $scope.newTeacher.id=data1.id;
                    TeacherService.AddTeacher($scope.newTeacher)
                    .then(function(data2){
                        $scope.teachers.push(angular.extend(data1, data2));
                        $scope.addT = !$scope.addT;
                    });
                });
            }
        };

        // populate control fields in edit form
        $scope.ViewTeacher = function(id){
            if($scope.privilege==3){    // check if admin
                $scope.editT = !$scope.editT;

                $scope.teachers.forEach(function(teacher) {
                    if(teacher.id === id) {
                        $scope.editTeacher.employeeId = teacher.employeeId;
                        $scope.editUser.lastName = teacher.lastName;
                        $scope.editUser.firstName = teacher.firstName;
                        $scope.editUser.middleName = teacher.middleName;
                        $scope.editUser.emailAddress = teacher.emailAddress;
                        $scope.editTeacher.unit = teacher.unit;
                        $scope.editTeacher.position = teacher.position;
                        $scope.editUser.id = id;

                        return;
                    }
                });
            }
        };

        $scope.EditTeacher = function(){
            if($scope.privilege==3){    // check if admin
                TeacherService.EditUser($scope.editUser, $scope.editUser.id)
                .then(function(data1){
                    TeacherService.EditTeacher($scope.editTeacher, data1.id)
                    .then(function(data2){
                        TeacherService.GetAll()
                        .then(function(data){
                            $scope.teachers = data;
                        });

                        $scope.editTeacher.employeeId = "";
                        $scope.editUser.lastName = "";
                        $scope.editUser.firstName = "";
                        $scope.editUser.middleName = "";
                        $scope.editUser.emailAddress = "";
                        $scope.editTeacher.unit = "";
                        $scope.editTeacher.position = "";
                        $scope.editUser.id = "";
                        $scope.editT = !$scope.editT;
                    });
                });
            }
        };

        $scope.DeleteTeacher = function(id){
            if($scope.privilege==3){    // check if admin
                var r = confirm("Are you sure you want to delete this teacher?");
                if(r == true){
                    TeacherService.DeleteUser(id)
                    .then(function(data1){
                        TeacherService.DeleteTeacher(id)
                        .then(function(data2){
                            TeacherService.GetAll()
                            .then(function(data){
                                $scope.teachers = data;
                            });
                        });
                    });
                }
            }
        };

    }]);

})();