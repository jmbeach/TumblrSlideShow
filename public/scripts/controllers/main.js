//#region DEFINITION
var master = angular.module('master', ['ngRoute', 'ngAnimate', 'ui.router', 'vcRecaptcha']);
//#endregion

// #region ROUTING
master.config(['$urlMatcherFactoryProvider', '$routeProvider', '$locationProvider', '$stateProvider',
  function ($urlMatcherFactory, $routeProvider, $locationProvider, $stateProvider) {
      $urlMatcherFactory.caseInsensitive(true);
      $urlMatcherFactory.strictMode(false);
      $locationProvider.html5Mode({
          enabled: true
      });
      $stateProvider
          // #region DEFAULT
        .state(
          "Default", {
              url: "/",
              views: {
                  "master": {
                      templateUrl: 'views/slides.html',
                      controller: 'slides',
                      controllerAs: 'slides'
                  }

              }
          })
        .state(
          "template", {
              url: "/login",
              views: {
                  "master": {
                      templateUrl: 'views/login.html',
                      controller: 'main',
                      controllerAs: 'main'
                  }
              }
          }
        )
        //.state(
        //  "template.specific", {
        //      url: "/:name",
        //      views: {
        //          "doc@docs": {
        //              templateUrl: 'views/subviews/sub_template.html',
        //              controller: 'template',
        //              controllerAs: 'template'
        //          }
        //      }
        //  }
      //#endregion
      ;
  }
]);
// #endregion

// #CONFIG_MAIN_CONTROLLER
master.controller('body', ['$route', '$routeParams', '$location',
  function ($route, $routeParams, $location) {
      this.$route = $route;
      this.$location = $location;
      this.$routeParams = $routeParams;
  }
]);
function Main() { }
master.controller('main', Main);
// #endregion

//#region MORE_CONTROLLERS
master.controller('nav', Navbar);
master.controller('slides', ['$route','$routeParams',
	function($route,$routeParams) {

	}
]);
