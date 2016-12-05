'use strict';

angular.module('inspinia')
  .controller('DemoController', function ($scope) {

    var vm = this;

    vm.userName = 'Example user';
    vm.helloText = 'Openstack Swift Image Compression';
    vm.descriptionText = 'This is the project of SJSU CMPE 297 Group 8\'s project to implement the image compression policy of Openstack Swift';

    $scope.fileUpload = function(data) {
      alert(data);
    }

    Dropzone.options.dropzone = {
      paramName: "file", // The name that will be used to transfer the file
      maxFilesize: 2, // MB
      accept: function(file, done) {
        if (file.name == "justinbieber.jpg") {
          done("Naha, you don't.");
        }
        else { done(); }
      }
    };

  });
