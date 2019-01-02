'use strict';

var env = {};
// Import variables if present (from env.js)
if(window){  
  Object.assign(env, window.__env);
}

var ironcladsApp = angular.module("ironcladsApp", ['ngRoute', 'ngResource', 'ui.bootstrap', 'ngTable']);
// Register environment in AngularJS as constant
ironcladsApp.constant('__env', env);
var globalShipsArray = [];
var shotnumber = 1;
var turn = 1;
var gameName = "testgame1";
var playerName = "chris";
var sound = new Audio();
//var domainName = "critpen.com";
//var domainName = "localhost";

ironcladsApp
.config(
    [ '$routeProvider', function ($routeProvider) {
       $routeProvider
           .when('/myshipsview', {
               controller: 'MyShipsController',
               templateUrl: 'views/myships.html'
           }).when('/mapsview', {
               controller: 'MapsController',
               templateUrl: 'views/maps.html'
               
           }).when('/shipsview', {
               controller: 'ShipsController',
               templateUrl: 'views/ships.html'
           })
           .otherwise({ redirectTo: '/myshipsview'});
        }
    ])
.controller('MyShipsController', function($scope, $http, __env) {
    $scope.shipsArray = globalShipsArray;
    $scope.lastShotResponse = {};
    $scope.shotParams = {};
    $scope.shotParams.shotnumber = shotnumber;
    $scope.shotParams.turn = turn;
    $scope.shotParams.range = 1;
    $scope.shotParams.target = "";
    $scope.shotParams.rightLeft = "right";
    $scope.shipsToTarget = [];
    $scope.gameName = gameName;
    $scope.playerName = playerName;
    $scope.targetShips = [];
    
    $scope.shipIsWV = function(currentShip) {
        let isWV = false;
        if (currentShip.vesselType === "WoodenVessel") {
            isWV = true;
        }
        return isWV;
    };
    $scope.shipIsMonitor = function(currentShip) {
        let isMonitor = false;
        if (currentShip.vesselType === "Monitor") {
            isMonitor = true;
        }
        return isMonitor;
    };
    
    $scope.shipIsCasemate = function(currentShip) {
        let isCM = false;
        if (currentShip.vesselType === "Casemate") {
            isCM = true;
        }
        return isCM;
    };
    
    $scope.getTargetShips = function() {
        return $scope.targetShips;
    };
    
    $scope.getMyShips = function() {
        $scope.targetShips = [];
        $scope.shipsArray = [];
        $http.get(__env.apiUrl + '/games/gamemeta/' + $scope.gameName, {})
        .then(function(response){
            let shipsInGame = response.data.ships;
            for (let s=0; s<shipsInGame.length; s++) {
                let shipName = shipsInGame[s].name;
                shipName = shipName.replace(".json", "");
                if (shipsInGame[s].player !== $scope.playerName) {
                    $scope.targetShips.push(shipName);
                } else {
                    $http.get(__env.apiUrl + '/games/ship/' + gameName + '/' + turn + '/' + shipName, {})
                    .then(function(response){
                        $scope.shipsArray.push(response.data);
                        globalShipsArray = $scope.shipsArray;    
                    });
                    
                }
            }
        });
    };
    
    $scope.gunInSection = function(ship, sectionName, side) {
        let gunInSection = false;
        if (ship.armament[sectionName][side]["first"] !== undefined) {
            gunInSection = true;
        }
        return gunInSection;
    };
    
    
    
    $scope.fireShot = function(ship, gun) {
        let shotParams = {
            "shotParams": {
                "gameName": "testgame1",
                "target": $scope.shotParams.target,
                "attacker": ship.shipname,
                "gun": gun.name,
                "fireType": "direct",
                "shotType": "solidshot",
                "hitEffectivenessPenaltyFromFires": 0,
                "rightLeft": $scope.shotParams.rightLeft,
                "range": $scope.shotParams.range,
                "targetAspect": "broadside",
                "gunDamaged": false,
                "turn": $scope.shotParams.turn,
                "shotnum": $scope.shotParams.shotnumber
            }
        };

        $http.post(__env.apiUrl + '/fireShot', shotParams, {})
                .then(function(response) {
                    $scope.lastShotResponse = response;
        });
        shotnumber++;
        sound.src = './sounds/cannon1.mp3'; 
        sound.play();
        
    };
})
.controller('MapController', function($scope, $http, $route, ngTableParams) {
    
       
}).controller('ShipsController', function ($scope) {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.slides = [];
    var slides    = $scope.slides,
        currIndex = 0;
    $scope.slides.push({
        image: __env.apiUrl + '/shipImages/columbia.JPG',
        text: [''][slides.length % 0],
        id: currIndex++
    });
    $scope.slides.push({
        image: __env.apiUrl + '/shipImages/onondaga.JPG',
        text: [''][slides.length % 0],
        id: currIndex++
    });
    $scope.slides.push({
        image: __env.apiUrl + '/shipImages/ossipee.JPG',
        text: [''][slides.length % 0],
        id: currIndex++
    });
    
});



