'use strict';

angular.module('inspinia')
  .controller('DemoController', function () {

    var vm = this;

    vm.userName = 'Example user';
    vm.helloText = 'Openstack Swift Image Compression';
    vm.descriptionText = 'This is the project of SJSU CMPE 297 Group 8\'s project to implement the image compression policy of Openstack Swift';

  });
