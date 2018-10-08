"use strict";

var express = require('express');
var fireRouter = express.Router();
//var multer = require('multer'); // v1.0.5
//var upload = multer(); // for parsing multipart/form-data
var fs = require('fs');
//let http = require("http");
var gunDataDir = "./gundata/";
var gameDataDir = "./gamedata/";
var criticalHitResolver = require('./criticalpenetration');
var specialHitResolver = require('./specialhit');
//var gameManagement = require('./gameMgmt');

/* GET home page. */
fireRouter.get('/fireShot', function(req, res, next) {
 
//    res.json(movement); 
});

/**
 * Determines results of a shot on a target vessel
 * The body of the request must contain a shotParams object that contains the following:
 * An example of the body is provided as the GET method at /prototype/shotparams.
 */
fireRouter.post('/fireShot', function (req, res, next) {  
    let gunName = req.body.shotParams.gun;
    let gun = readJSONFile(gunDataDir + gunName + ".json");
    let targetName = req.body.shotParams.target;
    let targetObj = readJSONFile(gameDataDir + req.body.shotParams.gameName + "/" + targetName + ".json");
    
    let results = {
        target: req.body.shotParams.target,
        gun: gun.gunType,
        rolls: {
            toHit: 0,
            hitEffect: 0,
            penetration: 0,
            criticalPenetration: 0,
            specialHit: 0
        },
        fireType: req.body.shotParams.fireType,
        shotType: req.body.shotParams.shotType,
        hitEffectivenessPenaltyFromFires: req.body.shotParams.hitEffectivenessPenaltyFromFires,
        rightLeft: req.body.shotParams.rightLeft,
        range: req.body.shotParams.range,
        penetrationFactor: 0,
        targetAspect: req.body.shotParams.targetAspect,
        gunDamaged: req.body.shotParams.gunDamaged,
        positionOfHit: "none",
        sectionOfHit: 'none',
        targetHit: false,
        turn: req.body.shotParams.turn,
        damage: {
            penetration: false,
            criticalPenetration: {message: "", gunDestroyed: 0, engineRestart: []},
            specialHit: {message: "", gunDestroyed: 0, gunDamaged: []},
            armor: 0,
            hull: 0,
            crew: 0,
            floatation: 0,
            speed: 0,
            ram: 0,
            stack: 0,
            fires: [],
            turningCapacity: 0
        }
    };
    
    results.penetrationFactor = calculatePenetrationFactor(results, gun);
    
    if (results.penetrationFactor > 0) {
        results.targetHit = true;
        results.positionOfHit = determinePositionOfHit(targetObj, results);
        // depending on the result of the position roll, this might be the special case of a turret hit
        if (results.positionOfHit === "turret" || 
            results.positionOfHit === "turretA" ||
            results.positionOfHit === "turretZ") {
            results.targetAspect = 'turret';  
        }
        results.sectionOfHit = determineSectionOfHit(results);
        results.penetrationDifferential = calculatePenetrationDifferential(targetObj, results);
        
        
        results = calculateDamage(targetObj, results);
        
    }
    
    if (fs.existsSync(gameDataDir + req.body.shotParams.gameName)){
        if (!fs.existsSync(gameDataDir + req.body.shotParams.gameName + "/turn_" + results.turn)){
            fs.mkdirSync(gameDataDir + req.body.shotParams.gameName + "/turn_" + results.turn);
        }
        if (!fs.existsSync(gameDataDir + req.body.shotParams.gameName + "/turn_" + results.turn + "/" + targetName)){
            fs.mkdirSync(gameDataDir + req.body.shotParams.gameName + "/turn_" + results.turn + "/" + targetName);
        }
        
        let damageFileName = gameDataDir + req.body.shotParams.gameName + "/turn_" + results.turn + "/" + targetName + 
                            "/" +  
                            req.body.shotParams.attacker +
                            "-shot-" +
                            req.body.shotParams.shotnum +
                            ".json";
         
        writeJSONFile(damageFileName, results);
    }
    
    res.json(results);
});


/**
 * Combat resolution functions
 */
let rolld6 = function() {
    let dieRoll = (Math.floor(Math.random() * 6) + 1);
    return dieRoll;
};
let roll2d6 = function() {
    let dieRoll = rolld6() + rolld6();
    return dieRoll;
};

/**
 * On a hit, returns a positive number for penetration
 * On a miss, returns -15
 */
let calculatePenetrationFactor = function(results, gun) {
    let penetrationFactor = -15;
    if (results.shotType === 'solidshot' || results.shotType === 'shell') {
        if (results.range <= gun.rangeSS.length) {
            let dieRoll = roll2d6();
            results.rolls.toHit = dieRoll;
            if (dieRoll >= gun.rangeSS[results.range - 1][1]) {
                let gunPF = gun.rangeSS[results.range - 1][2];
                if (results.gunDamaged) {
                    // damaged guns have half PF
                    gunPF = gunPF * .5;
                } 
                if (results.shotType === 'solidshot') {
                    penetrationFactor = gunPF * gun.pfShot;
                } else {
                    penetrationFactor = gunPF * gun.pfShell;
                }
            }
        }
    } else {
        if (results.range <= gun.rangeGS.length) {
            let dieRoll = roll2d6();
            if (dieRoll >= gun.rangeGS[results.range - 1][1]) {
                penetrationFactor = (gun.rangeGS[results.range - 1][2]) * gun.pfShot;
            }
        }
    }
    
    return penetrationFactor;
};

/**
 * fireType is either 'direct' or 'plunging'
 */
let determinePositionOfHit = function(ship, results) {
    let POH = 'hullArmor';
    let dieRoll = rolld6();
    switch(ship.vesselType) {
        case "Armored Frigate":
            if (results.fireType === "direct") {
                let position = ['waterline', 'waterline', 'hullArmor', 'hullArmor', 'turret', 'hullArmor'];
                POH =  position[dieRoll - 1];
            } else {
                let position = ['waterline', 'waterline', 'hullArmor', 'hullArmor', 'turret', 'deck'];
                POH =  position[dieRoll - 1];
            }
            break
        case "Monitor":
            if (results.fireType === "direct") {
                let position = ['waterline', 'turretA', 'turretA', 'turretZ', 'turretZ', 'waterline'];
                POH =  position[dieRoll - 1];
            } else {
                let position = ['waterline', 'turretA', 'turretA', 'turretZ', 'turretZ', 'deck'];
                POH =  position[dieRoll - 1];
            }
            break
        case "Casemate":
            if (results.fireType === "direct") {
                let position = ['waterline', 'waterline', 'casemate', 'casemate', 'casemate', 'casemate'];
                POH =  position[dieRoll - 1];
            } else {
                let position = ['waterline', 'waterline', 'casemate', 'casemate', 'casemate', 'deck'];
                POH =  position[dieRoll - 1];
            }
            break
        default:
            if (results.fireType === "direct") {
                let position = ['waterline', 'waterline', 'hullArmor', 'hullArmor', 'hullArmor', 'hullArmor'];
                POH =  position[dieRoll - 1];
            } else {
                let position = ['waterline', 'waterline', 'hullArmor', 'hullArmor', 'hullArmor', 'deck'];
                POH =  position[dieRoll - 1];
            }
    }
    return POH;
};
/**
 * Determines whether the target vessel was hit in the bow, foreship, midship, etc.
 * vesselType is either 'WV', 'Monitor', 'Casemate', or 'Armored Frigate'
 * targetApect indicates whether the ship was hit 'broadside', or 'bow_rake', or 'stern_rake', or 'turret'
 */
let determineSectionOfHit = function(results) {
    let SOF = 'midship';
    let dieRoll = rolld6();
    var section;
    switch (results.targetAspect) {
        case "broadside":
            if (results.vesselType === "Casemate") {
                section = ['foreship', 'foreship', 'midship', 'midship', 'aftership', 'aftership'];
                SOF = section[dieRoll - 1];
            } else {
                section = ['bow', 'foreship', 'midship', 'midship', 'aftership', 'stern'];
                SOF = section[dieRoll - 1];
            }
            break
        case "bow_rake":
            section = ['bow', 'bow', 'bow', 'bow', 'foreship', 'midship'];
            SOF = section[dieRoll - 1];
            break
        case "stern_rake":
            section = ['stern', 'stern', 'stern', 'stern', 'aftership', 'midship'];
            SOF = section[dieRoll - 1];
            break
        case "turret":
            section = ['foreship', 'foreship', 'foreship', 'left midship', 'right midship', 'aftership'];
            SOF = section[dieRoll - 1];
    }
    return SOF;
};

let calculatePenetrationDifferential = function(ship, results) {
    var penetrationDifferential = -15;
    if (results.targetAspect === "turret") {
        if (ship["turretZ"] === undefined) {
            if (results.sectionOfHit === "foreship" || results.sectionOfHit === "aftership") {
                let armorVal = ship["turret A"][results.sectionOfHit];
                penetrationDifferential = results.penetrationFactor - armorVal;
            } else if (results.sectionOfHit === "left midship"){
                let armorVal = ship["turret A"][results.sectionOfHit]["left"];
                penetrationDifferential = results.penetrationFactor - armorVal;
            } else if (results.sectionOfHit === "right midship"){
                let armorVal = ship["turret A"][results.sectionOfHit]["right"];
                penetrationDifferential = results.penetrationFactor - armorVal;
            }
        } else {
            let armorVal = ship[results.positionOfHit][results.sectionOfHit];
            penetrationDifferential = results.penetrationFactor - armorVal;
        }
        
    } else if (results.positionOfHit === "deck") {
        let armorVal = ship[results.positionOfHit][results.sectionOfHit];
        penetrationDifferential = results.penetrationFactor - armorVal;
    } else {
        let armorVal = ship[results.positionOfHit][results.sectionOfHit][results.rightLeft];
        penetrationDifferential = results.penetrationFactor - armorVal;
    }
    return penetrationDifferential;
};

let calculateDamage = function(ship, results) {
    let dieRoll = rolld6();
    // the hitEffectivenessPenaltyFromFires is added to the die roll. Not sure if this is the correct interpretation
    // of the effect of fire rules. The hitEffectivenessPenaltyFromFires comes from the attacking ship and is passed in
    // on the shotParams object
    results.rolls.hitEffect = dieRoll + results.hitEffectivenessPenaltyFromFires;
    let column = determineDamageColumn(results.penetrationDifferential);
    // now apply the effect of fires on the target ship (if any). The hptFromFires comes from the target ship.
    column = column + ship.hptFromFires;
    switch (dieRoll) {
        case 1:
            switch (column) {
                case 2:
                    results.damage.armor = results.damage.armor + 1;
                    break
                case 3:
                    results.damage.armor = results.damage.armor + 1;
                    break
                case 4:
                    results.damage.armor = results.damage.armor + 1;
                    results = penetration(ship, results);
                    break
                case 5:
                    results.damage.armor = results.damage.armor + 1;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 6:
                    results.damage.armor = results.damage.armor + 2;
                    results.damage.crew = results.damage.crew + 1;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 7:
                    results.damage.armor = results.damage.armor + 3;
                    results.damage.crew = results.damage.crew + 1;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 8:
                    results.damage.armor = results.damage.armor + 3;
                    results.damage.hull = results.damage.hull + 1;
                    results.damage.crew = results.damage.crew + 1;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 9:
                    results.damage.armor = results.damage.armor + 4;
                    results.damage.hull = results.damage.hull + 2;
                    results.damage.crew = results.damage.crew + 1;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 10:
                    results.damage.armor = results.damage.armor + 4;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 1;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 11:
                    results.damage.armor = results.damage.armor + 5;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 3;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 12:
                    results.damage.armor = results.damage.armor + 6;
                    results.damage.hull = results.damage.hull + 4;
                    results.damage.crew = results.damage.crew + 3;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 13:
                    results.damage.armor = results.damage.armor + 7;
                    results.damage.hull = results.damage.hull + 5;
                    results.damage.crew = results.damage.crew + 4;
                    results = criticalHitResolver.criticalPenetration(ship, results);
            }
            break
        case 2:
            switch (column) {
                case 3:
                    results.damage.armor = results.damage.armor + 1;
                    break
                case 4:
                    results.damage.armor = results.damage.armor + 1;
                    break
                case 5:
                    results.damage.armor = results.damage.armor + 1;
                    results = penetration(ship, results);
                    break
                case 6:
                    results.damage.armor = results.damage.armor + 1;
                    results = penetration(ship, results);
                    break
                case 7:
                    results.damage.armor = results.damage.armor + 2;
                    results = penetration(ship, results);
                    break
                case 8:
                    results.damage.armor = results.damage.armor + 2;
                    results.damage.crew = results.damage.crew + 1;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 9:
                    results.damage.armor = results.damage.armor + 3;
                    results.damage.hull = results.damage.hull + 2;
                    results.damage.crew = results.damage.crew + 1;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 10:
                    results.damage.armor = results.damage.armor + 3;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 1;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 11:
                    results.damage.armor = results.damage.armor + 4;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 3;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 12:
                    results.damage.armor = results.damage.armor + 5;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 3;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 13:
                    results.damage.armor = results.damage.armor + 6;
                    results.damage.hull = results.damage.hull + 4;
                    results.damage.crew = results.damage.crew + 4;
                    results = criticalHitResolver.criticalPenetration(ship, results);
            }
            break
        case 3:
            switch (column) {
                case 4:
                    results.damage.armor = results.damage.armor + 1;
                    break
                case 5:
                    results.damage.armor = results.damage.armor + 1;
                    break
                case 6:
                    results.damage.armor = results.damage.armor + 1;
                    results.damage.hull = results.damage.hull + 1;
                    break
                case 7:
                    results.damage.armor = results.damage.armor + 1;
                    results = penetration(ship, results);
                    break
                case 8:
                    results.damage.armor = results.damage.armor + 2;
                    results = penetration(ship, results);
                    break
                case 9:
                    results.damage.armor = results.damage.armor + 2;
                    results.damage.hull = results.damage.hull + 1;
                    results.damage.crew = results.damage.crew + 1;
                    results = penetration(ship, results);
                    break
                case 10:
                    results.damage.armor = results.damage.armor + 2;
                    results.damage.hull = results.damage.hull + 2;
                    results.damage.crew = results.damage.crew + 1;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 11:
                    results.damage.armor = results.damage.armor + 3;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 2;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 12:
                    results.damage.armor = results.damage.armor + 4;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 3;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 13:
                    results.damage.armor = results.damage.armor + 5;
                    results.damage.hull = results.damage.hull + 4;
                    results.damage.crew = results.damage.crew + 4;
                    results = criticalHitResolver.criticalPenetration(ship, results);
            }
            break
        case 4:
            switch (column) {
                case 5:
                    results.damage.hull = results.damage.hull + 1;
                    break
                case 6:
                    results.damage.armor = results.damage.armor + 1;
                    break
                case 7:
                    results.damage.armor = results.damage.armor + 1;
                    break
                case 8:
                    results.damage.armor = results.damage.armor + 2;
                    break
                case 9:
                    results.damage.armor = results.damage.armor + 1;
                    results.damage.hull = results.damage.hull + 1;
                    results.damage.crew = results.damage.crew + 1;
                    results = penetration(ship, results);
                    break
                case 10:
                    results.damage.armor = results.damage.armor + 2;
                    results.damage.hull = results.damage.hull + 2;
                    results.damage.crew = results.damage.crew + 1;
                    results = penetration(ship, results);
                    break
                case 11:
                    results.damage.armor = results.damage.armor + 3;
                    results.damage.hull = results.damage.hull + 2;
                    results.damage.crew = results.damage.crew + 2;
                    results = penetration(ship, results);
                    break
                case 12:
                    results.damage.armor = results.damage.armor + 3;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 2;
                    results = criticalHitResolver.criticalPenetration(ship, results);
                    break
                case 13:
                    results.damage.armor = results.damage.armor + 4;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 3;
                    results = criticalHitResolver.criticalPenetration(ship, results);
            }
            break
        case 5:
            switch (column) {
                case 6:
                    results.damage.hull = results.damage.hull + 1;
                    break
                case 7:
                    results.damage.armor = results.damage.armor + 1;
                    results.damage.hull = results.damage.hull + 1;
                    break
                case 8:
                    results.damage.armor = results.damage.armor + 1;
                    break
                case 9:
                    results.damage.armor = results.damage.armor + 2;
                    results.damage.crew = results.damage.crew + 1;
                    break
                case 10:
                    results.damage.armor = results.damage.armor + 2;
                    results.damage.hull = results.damage.hull + 1;
                    results.damage.crew = results.damage.crew + 1;
                    break
                case 11:
                    results.damage.armor = results.damage.armor + 2;
                    results.damage.hull = results.damage.hull + 2;
                    results.damage.crew = results.damage.crew + 2;
                    results = penetration(ship, results);
                    break
                case 12:
                    results.damage.armor = results.damage.armor + 3;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 2;
                    results = penetration(ship, results);
                    break
                case 13:
                    results.damage.armor = results.damage.armor + 3;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 2;
                    results = criticalHitResolver.criticalPenetration(ship, results);
            }
            break
           
        case 6:
            switch (column) {
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    results = specialHitResolver.specialHit(ship, results);
                    break
                case 7:
                    results.damage.hull = results.damage.hull + 1;
                    results = specialHitResolver.specialHit(ship, results);
                    break
                case 8:
                    results.damage.armor = results.damage.armor + 1;
                    results.damage.hull = results.damage.hull + 1;
                    results = specialHitResolver.specialHit(ship, results);
                    break
                case 9:
                    results.damage.armor = results.damage.armor + 1;
                    results.damage.hull = results.damage.hull + 1;
                    results.damage.crew = results.damage.crew + 1;
                    results = specialHitResolver.specialHit(ship, results);
                    break
                case 10:
                    results.damage.armor = results.damage.armor + 2;
                    results.damage.hull = results.damage.hull + 4;
                    results.damage.crew = results.damage.crew + 2;
                    break
                case 11:
                    results.damage.armor = results.damage.armor + 4;
                    results.damage.hull = results.damage.hull + 3;
                    results.damage.crew = results.damage.crew + 3;
                    break
                case 12:
                    results.damage.armor = results.damage.armor + 4;
                    results.damage.hull = results.damage.hull + 4;
                    results.damage.crew = results.damage.crew + 4;
                    break
                case 13:
                    results.damage.armor = results.damage.armor + 3;
                    results.damage.hull = results.damage.hull + 2;
                    results.damage.crew = results.damage.crew + 2;
                    results = penetration(ship, results);
            }
    }
    return results;
};

let penetration = function(ship, results) {
    let dieRoll = rolld6();
    results.rolls.penetration = dieRoll;
    if (results.positionOfHit === "deck") {
        switch (dieRoll) {
            case 1:
                results.damage.armor = results.damage.armor + 2;
                break
            case 2:
                results.damage.armor = results.damage.armor + 1;
                break
            case 3:
                results.damage.hull = results.damage.hull + 1;
                break
            case 4:
                results.damage.stack = results.damage.stack +1;
                break
            case 5:
                results.damage.crew = results.damage.crew + 2;
                break
            case 6:
                results.damage.stack = results.damage.stack +1;
                results.damage.armor = results.damage.armor + 1;
        };
    } else {
        switch (dieRoll) {
            case 1:
                results.damage.armor = results.damage.armor + 3;
                results.damage.hull = results.damage.hull + 2;
                results.damage.crew = results.damage.crew + 2;
                break
            case 2:
                results.damage.armor = results.damage.armor + 2;
                results.damage.hull = results.damage.hull + 2;
                results.damage.crew = results.damage.crew + 2;
                break
            case 3:
                results.damage.armor = results.damage.armor + 1;
                results.damage.hull = results.damage.hull + 2;
                results.damage.crew = results.damage.crew + 1;
                break
            case 4:
                results.damage.armor = results.damage.armor + 1;
                results.damage.hull = results.damage.hull + 1;
                results.damage.crew = results.damage.crew + 1;
                break
            case 5:
                results.damage.armor = results.damage.armor + 1;
                results.damage.hull = results.damage.hull + 1;
                break
            case 6:
                results = criticalHitResolver.criticalPenetration(ship, results);
        };
    }
  
    return results;
};



let determineDamageColumn = function(diff)
{
    let column = 1;
    if (diff >= 41) { column = 13; } 
    else if (diff >= 36) { column = 12; }
    else if (diff >= 31) { column = 11; }
    else if (diff >= 26) { column = 10; }
    else if (diff >= 21) { column = 9; }
    else if (diff >= 16) { column = 8; }
    else if (diff >= 11) { column = 7; }
    else if (diff >= 6) { column = 6; }
    else if (diff >= 1) { column = 5; }
    else if (diff >= -4) { column = 4; }
    else if (diff >= -9) { column = 3; }
    else if (diff >= -14) { column = 2; }
    return column;
};

let readJSONFile = function(filename) {
    let str = fs.readFileSync(filename, 'utf8');
    var obj = JSON.parse(str);
    return obj;
};

let writeJSONFile = function(fileName, obj) {
    let success = true;
    fs.writeFileSync(fileName, JSON.stringify(obj, null, 4), function(err) {
        if(err) {
            return console.log(err);
            success = false;
        }
        console.log("The file was saved!");
    }); 
    return success;
};

module.exports = fireRouter;


