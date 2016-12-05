(function() {
  'use strict';

  angular
    .module('inspinia')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('index', {
        abstract: true,
        url: "/index",

        templateUrl: "app/components/common/content.html"
      })
      .state('index.main', {
        url: "/main",
        controller: "MainController",
        templateUrl: "app/main/main.html",
        data: { pageTitle: 'Main' }
      })
      .state('index.demo', {
        url: "/demo",
        controller: "DemoController",
        templateUrl: "app/main/demo.html",
        data: { pageTitle: 'Demonstration' },
        resolve: {
          loadPlugin: function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              {
                files: ['bower_components/dropzone/dist/basic.css','bower_components/dropzone/dist/dropzone.css','bower_components/dropzone/dist/dropzone.js']
              }
            ]);
          }
        }
      })
      .state('index.source', {
        url: "/source",
        templateUrl: "app/main/source.html",
        data: { pageTitle: 'Source Code' }
      })
      .state('index.docs', {
        url: "/docs",
        templateUrl: "app/main/docs.html",
        data: { pageTitle: 'Documentation' }
      });

    $urlRouterProvider.otherwise('/index/main');
  }

})();
