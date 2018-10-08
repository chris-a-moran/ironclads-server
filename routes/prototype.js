"use strict";
var express = require('express');
var prototypeRouter = express.Router();

let getWoodenVessel = function() {
    let ship = {
      shipname: 'U.S.S. Ossipee',
      vesselType: 'WoodenVessel',
      fileName: 'ossipee.json',
      hullArmor: {
          bow: {
              left: 6,
              right: 6
          },
          foreship: {
              left: 6,
              right: 6
          },
          midship: {
              left: 7,
              right: 7
          },
          aftership: {
              left: 6,
              right: 6
          },
          stern: {
              left: 6,
              right: 6
          }
      },
      waterline: {
          bow: {
              left: 6,
              right: 6
          },
          foreship: {
              left: 6,
              right: 6
          },
          midship: {
              left: 7,
              right: 7
          },
          aftership: {
              left: 6,
              right: 6
          },
          stern: {
              left: 6,
              right: 6
          }
      },
      deck: {
          bow: 4,
          foreship: 4,
          midship: 4,
          aftership: 4,
          stern: 4
      },
      originalHull: 37,
      hull: 37,
      hullDamage: [
          [19, 2, 1],
          [27, 2, 2],
          [33, 3, 2],
          [37, 3, 2]
      ],
      originalFloatation: 12,
      floatation: 12,
      floatationDamage: [
          [3, 1],
          [6, 2],
          [9, 4]
      ],
      originalStack: 4,
      stack: 4,
      stackDamage: [
          [3, 1],
          [4, 1]
      ],
      crew: 28,
      ram: [12,6,2],
      originalMaxSpeed: 9,
      forwardSpeed: [1,2,3,4,5,5,6,6,7,8,9],
      reverseSpeed: [1,2,3,4],
      engineCapacity: 2,
      emergencyEngineCapacity: 3,
      fires: [],
      hptFromFires: 0,
      hitEffectivenessPenaltyFromFires: 0,
      damageReport: [],
      armament: {
          bow: {
              left: [],
              pivot: [{name: 'parrot30', status: 'good'}],
              right: []
          },
          foreship: {
              left: [{name: 'parrot30', status: 'good'}],
              pivot: [{name: 'parrot100', status: 'good'}],
              right: [{name: 'parrot30', status: 'good'}]
          },
          midship: {
              left: [{name: 'smoothbore32', status: 'good'}, {name: 'smoothbore32', status: 'good'}, {name: 'smoothbore32', status: 'good'}],
              pivot: [],
              right: [{name: 'smoothbore32', status: 'good'}, {name: 'smoothbore32', status: 'good'}, {name: 'smoothbore32', status: 'good'}]
          },
          aftership: {
              left: [],
              pivot: [{name: 'dahlgren11', status: 'good'}],
              right: []
          },
          stern: {
              left: [],
              pivot: [],
              right: []
          }
      }
    };
    return ship;
};

let getFederalIronclad = function() {
    let ship = {
      shipname: 'U.S.S. Onondaga',
      vesselType: 'Monitor',
      fileName: 'onondaga.json',
      waterline: {
          bow: {
              left: 24,
              right: 24
          },
          foreship: {
              left: 21,
              right: 21
          },
          midship: {
              left: 21,
              right: 21
          },
          aftership: {
              left: 21,
              right: 21
          },
          stern: {
              left: 21,
              right: 21
          }
      },
      turretA: {
        foreship: 24,
        midship: {
            left: 24,
            right: 24
        },
        aftership: 24
      },
      turretZ: {
        foreship: 24,
        midship: {
            left: 24,
            right: 24
        },
        aftership: 24
      },
      deck: {
          bow: 14,
          foreship: 14,
          midship: 14,
          aftership: 14,
          stern: 14
      },
      originalHull: 52,
      hull: 52,
      hullDamage: [
          [26, 1, 2],
          [39, 2, 2],
          [47, 2, 2],
          [52, 3, 2]
      ],
      originalFloatation: 14,
      floatation: 14,
      floatationDamage: [
          [4, 2],
          [7, 2],
          [11, 3]
      ],
      originalStack: 16,
      stack: 16,
      stackDamage: [
          [8, 1],
          [16, 2]
      ],
      crew: 30,
      ram: [30,15,5],
      originalMaxSpeed:7,
      forwardSpeed: [1,2,3,4,5,6,6,7,7],
      reverseSpeed: [1,2,3,4],
      engineCapacity: 2,
      emergencyEngineCapacity: 3,
      fires: [],
      hptFromFires: 0,
      hitEffectivenessPenaltyFromFires: 0,
      damageReport: [],
      armament: {
          turretA: {
              left: {name: 'dahlgren15', status: 'good'},
              right:{name: 'parrot150', status: 'good'}
          },
          turretZ: {
              left:{name: 'dahlgren15', status: 'good'},
              right:{name: 'parrot150', status: 'good'}
          }
      }
    };
    
    return ship; 
};

let getConfederateIronclad = function() {
    let ship = {
      shipname: 'C.S.S. Columbia',
      vesselType: 'Casemate',
      fileName: 'columbia.json',
      casemate: {
          bow: 27,
          foreship: {
              left: 27,
              right: 27
          },
          midship: {
              left: 27,
              right: 27
          },
          aftership: {
              left: 27,
              right: 27
          },
          stern: 27
      },
      waterline: {
          bow: {
              left: 33,
              right: 33
          },
          foreship: {
              left: 27,
              right: 27
          },
          midship: {
              left: 27,
              right: 27
          },
          aftership: {
              left: 27,
              right: 27
          },
          stern: {
              left: 27,
              right: 27
          }
      },
      deck: {
          bow: 10,
          foreship: 10,
          midship: 10,
          aftership: 10,
          stern: 10
      },
      originalHull: 52,
      hull: 52,
      hullDamage: [
          [26, 2, 0],
          [39, 2, 1],
          [47, 3, 2],
          [52, 3, 3]
      ],
      originalFloatation: 15,
      floatation: 15,
      floatationDamage: [
          [4, 1],
          [7, 1],
          [11, 2]
      ],
      originalStack: 4,
      stack: 4,
      stackDamage: [
          [3, 1],
          [4, 1]
      ],
      crew: 36,
      ram: [100,75,50,25],
      originalMaxSpeed: 5,
      forwardSpeed: [1,2,3,3,4,4,5,5],
      reverseSpeed: [1,2,3,3],
      engineCapacity: 1,
      emergencyEngineCapacity: 2,
      fires: [],
      hptFromFires: 0,
      hitEffectivenessPenaltyFromFires: 0,
      damageReport: [],
      armament: {
          bow: {
              left: {},
              pivot: {first: {name: 'brook10', status: 'good'}},
              right: {}
          },
          foreship: {
              left: {first: {name: 'brook2b7', status: 'good'}},
              pivot: {},
              right: {first: {name: 'brook2b7', status: 'good'}}
          },
          midship: {
              left: {first: {name: 'brook2b6', status: 'good'}},
              pivot: {},
              right: {first: {name: 'brook2b6', status: 'good'}}
          },
          aftership: {
              left: {},
              pivot: {},
              right: {}
          },
          stern: {
              left: {},
              pivot: {first: {name: 'brook2b7', status: 'good'}},
              right: {}
          }
      }
    };
    
    return ship; 
};

let getGun = function() {
    let gun = {
        gunType: "dahlgren15",
        ROF: 1,
        pfShot: 20,
        pfShell: 12,
        rangeSS: [
            ['range 1',2,3],
            ['range 2',3,3],
            ['range 3',3,3],
            ['range 4',4,3],
            ['range 5',5,2],
            ['range 6',5,2],
            ['range 7',6,2],
            ['range 8',6,1],
            ['range 9',6,1],
            ['range 10',7,1],
            ['range 11',7,1],
            ['range 12',8,1],
            ['range 13',9,1],
            ['range 14',10,1],
            ['range 15',10,1],
            ['range 16',10,1]
        ],
        rangeGS: [
            ['range 1',5,3],
            ['range 2',4,3],
            ['range 3',2,3]
        ]
    };
    
    return gun;
};

let getShotParams = function() {
    let shotParams = {
        gameName: "testgame1",
        target: "columbia",
        attacker: "onondaga",
        gun: "dahlgren15",
        fireType: "direct",
        shotType: "solidshot",
        hitEffectivenessPenaltyFromFires: 0,
        rightLeft: "right",
        range: 3,
        targetAspect: "broadside",
        gunDamaged: false,
        turn: 1,
        shotnum: 1
    };
    return shotParams;
};

let getGameMeta = function() {
    let gameMeta = {
        players: ['chris', 'connor'],
        turn: 0,
        ships: [
            {name: 'columbia', player: 'chris'},
            {name: 'onondaga', player: 'connor'} ],
        /** The player who can write to the gameMeta file */
        controllingPlayer: 'chris'
    };
    return gameMeta;
};

prototypeRouter.get('/prototype/gamemeta', function (req, res, next) {
    res.json(getGameMeta());
});

prototypeRouter.get('/prototype/woodenvessel', function (req, res, next) {
    res.json(getWoodenVessel());
});

prototypeRouter.get('/prototype/confederateIronclad', function (req, res, next) {
    res.json(getConfederateIronclad());
});

prototypeRouter.get('/prototype/federalIronclad', function (req, res, next) {
    res.json(getFederalIronclad());
});

prototypeRouter.get('/prototype/gun', function(req, res, next) {
  res.json(getGun());  
});

prototypeRouter.get('/prototype/shotParams', function(req, res, next) {
  res.json(getShotParams());  
});

prototypeRouter.get('/prototype/fireEvent', function(req, res, next) {
  let fireEvent = {
      target: getConfederateIronclad(),
      gun: getGun()
  };
  res.json(fireEvent);  
});

module.exports = prototypeRouter;


