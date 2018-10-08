"use strict";

var express = require('express');
var gameMgmtRouter = express.Router();
var fs = require('fs');
var shipDataDir = "./shipdata/";
var gunDataDir = "./gundata/";
var gameDataDir = "./gamedata/";


gameMgmtRouter.post('/games/:gameName', function (req, res, next) { 
    let gameMeta = req.body.gameMeta;
    let gameName = req.params.gameName;
    if (!fs.existsSync(gameDataDir + gameName)){
        fs.mkdirSync(gameDataDir + gameName);
    }
    writeJSONFile(gameDataDir + gameName + "/gameMeta.json", gameMeta);
    res.json();
});

gameMgmtRouter.get('/games/ship/:gameName/:turn/:shipName', function (req, res, next) { 
    let shipName = req.params.shipName;
    let turn = req.params.turn - 1;
    let gameName = req.params.gameName;
    let shipFilePath = gameDataDir + gameName + "/turn_" + turn + "/" + shipName + ".json";
    if (turn === 0) {
        shipFilePath = gameDataDir + gameName + "/" + shipName + ".json";
    } 
    let shipData = readJSONFile(shipFilePath);
    res.json(shipData);
});

gameMgmtRouter.get('/games/shotsTaken/:gameName/:turn/:shipName/:filename', function (req, res, next) { 
    let shipName = req.params.shipName;
    let turn = req.params.turn;
    let gameName = req.params.gameName;
    let shotFileName = req.params.filename;
    let fileName = gameDataDir + gameName + "/turn_" + turn + "/" + shipName + "/" + shotFileName + ".json";
    let shipData = readJSONFile(fileName);
    res.json(shipData);
});

gameMgmtRouter.get('/games/gamemeta/:gameName', function (req, res, next) { 
    let gameName = req.params.gameName;
    let gameMetaObj = readJSONFile(gameDataDir + gameName + "/gameMeta.json");
    res.json(gameMetaObj);    
});

gameMgmtRouter.get('/games/gamemeta/ship/:gameName/:turn/:shipFileName', function (req, res, next) { 
    let gameName = req.params.gameName;
    let turn = req.params.turn;
    let shipFileName = req.params.shipFileName;
    let shipsArray = [];
    let turnStr = "";
    if (turn >= 1) {
        turnStr = "/turn_" + turn;
    }   
    
    let shipData = readJSONFile(gameDataDir + gameName + turnStr + "/" + shipFileName);
    shipsArray.push(shipData);
        
    res.json(shipsArray);    
});

gameMgmtRouter.get('/games/gamemeta/ships/:gameName/:turn/:player', function (req, res, next) { 
    let gameName = req.params.gameName;
    let turn = req.params.turn;
    let player = req.params.player;
    let shipsArray = [];
    let turnStr = "";
    if (turn >= 1) {
        turnStr = "/turn_" + turn;
    }
    let gameMetaObj = readJSONFile(gameDataDir + gameName + "/gameMeta.json");
    let shipsInGame = gameMetaObj.ships;
    for (let s=0; s<shipsInGame.length; s++) {
        let shipFileName = shipsInGame[s].name;
        if (shipsInGame[s].player === player) {
            let shipData = readJSONFile(gameDataDir + gameName + turnStr + "/" + shipFileName);
            shipsArray.push(shipData);
        }
    }
    res.json(shipsArray);    
});
        
gameMgmtRouter.post('/games/ship/:gameName/:shipName/:playerName', function (req, res, next) { 
    let shipName = req.params.shipName;
    let playerName = req.params.playerName;
    let gameName = req.params.gameName;
    if (fs.existsSync(gameDataDir + gameName)){
        let shipData = readJSONFile(shipDataDir + shipName + ".json");
        writeJSONFile(gameDataDir + gameName + "/" + shipName + ".json", shipData);
        let gameMeta = readJSONFile(gameDataDir + gameName + "/gameMeta.json");
        gameMeta.ships.push({"name": shipName, "player": playerName});
        writeJSONFile(gameDataDir + gameName + "/gameMeta.json", gameMeta);
    }
    res.json();
});

gameMgmtRouter.post('/games/endturn/:gameName/:turn', function (req, res, next) { 
    let turn = req.params.turn;
    let gameName = req.params.gameName;
    let damageFileNames = [];
    if (fs.existsSync(gameDataDir + gameName + "/turn_" + turn)){
        let shipDirectories = fs.readdirSync(gameDataDir + gameName + "/turn_" + turn);
        for (let shipDir=0; shipDir < shipDirectories.length; shipDir++) {
            // avoid trying to read json files with the readdirSync function
            if (!shipDirectories[shipDir].includes(".json")) {
                let shipDamageFiles = fs.readdirSync(gameDataDir + gameName + "/turn_" + turn + "/" + shipDirectories[shipDir]);
                let shipName = shipDirectories[shipDir];
                let shipFileName = gameDataDir + gameName + "/" + shipName + ".json";
                if (turn > 1) {
                    shipFileName = gameDataDir + gameName + "/turn_" + (turn - 1) + "/" + shipDirectories[shipDir] + shipName + ".json";
                } 
                let shipData = readJSONFile(shipFileName);
                // clear the damage report
                shipData.damageReport = [];
                for (let damageFile=0; damageFile < shipDamageFiles.length; damageFile++) {
                    damageFileNames.push(gameDataDir + gameName + "/turn_" + turn + "/" + shipDirectories[shipDir]+ "/" + shipDamageFiles[damageFile]);
                    let damageData = readJSONFile(gameDataDir + gameName + "/turn_" + turn + "/" + shipDirectories[shipDir]+ "/" + shipDamageFiles[damageFile]);
                    if (damageData.targetHit) {
                        // decrement armor
                        if (shipData[damageData.positionOfHit][damageData.sectionOfHit].hasOwnProperty([damageData.rightLeft])) { // some sections have no right/left value
                            shipData[damageData.positionOfHit][damageData.sectionOfHit][damageData.rightLeft] = 
                                shipData[damageData.positionOfHit][damageData.sectionOfHit][damageData.rightLeft] - damageData.damage.armor;
                        } else {
                            shipData[damageData.positionOfHit][damageData.sectionOfHit] = 
                                shipData[damageData.positionOfHit][damageData.sectionOfHit] - damageData.damage.armor;
                        }

                        // decrement hull. This gets its own function since it is also done when 
                        // resoving fires
                        shipData = decrementHull(shipData, damageData.damage.hull);

                        // decrement crew. In the future, will want to include effect on crew morale.
                        shipData.crew = shipData.crew - damageData.damage.crew;

                        // decrement stack
                        if (damageData.damage.stack > 0) {
                            // decrement the stack one at a time so that the stack damage table can be checked for each value
                            for (let stackhit=1; stackhit < damageData.damage.stack; stackhit++) {
                                shipData.stack = shipData.stack - 1;
                                // check the stack damage table and decrement speed as needed
                                for (let stackdamage=0; stackdamage < shipData.stackDamage.length; stackdamage++) {
                                    let takeDamageAt = shipData.stackDamage[stackdamage][0];
                                    let speedHitsTaken = shipData.stackDamage[stackdamage][1];
                                    if (takeDamageAt === shipData.originalStack - shipData.stack) {
                                        shipData.forwardSpeed.splice(shipData.forwardSpeed.length - 1, speedHitsTaken);
                                    }
                                }
                            }
                        }

                        // decrement speed
                        if (damageData.damage.speed > 0 && shipData.forwardSpeed.length > 0) {
                            shipData.forwardSpeed.splice(shipData.forwardSpeed.length - 1, damageData.damage.speed);
                        }

                        // decrement ram
                        if (damageData.damage.ram > 0 && shipData.ram.lengh > 0) {
                            shipData.ram.splice(0,1);
                        }

                        // decrement floatation
                        if (damageData.damage.floatation > 0) {
                            // decrement the floatation one at a time so that the floatation damage table can be checked for each value
                            for (let hh=1; hh < damageData.damage.floatation; hh++) {
                                shipData.floatation = shipData.floatation - 1;
                                // check the floatation damage table and decrement speed as needed
                                for (let fd=0; fd < shipData.floatationDamage.length; fd++) {
                                    let takeDamageAt = shipData.floatationDamage[fd][0];
                                    let speedHitsTaken = shipData.floatationDamage[fd][1];
                                    if (takeDamageAt === shipData.originalFloatation - shipData.floatation) {
                                        shipData.forwardSpeed.splice(shipData.forwardSpeed.length - 1, speedHitsTaken);
                                    }
                                }
                            }
                        }

                        // resolve fires in damage taken. This is done before the damage is determined 
                        // because normally fire damage would be determined at the beginning of the turn.
                        // Since this method is called at the end of the turn to determine ship state at the 
                        // beginning of the next turn, it is easier to include it here rather than having a 
                        // separate 'begin turn' function.
                        if (damageData.damage.fires.length > 0) {
                            for (let f=0; f<damageData.damage.fires.length; f++) {
                                shipData.fires.push(damageData.damage.fires[f]);
                            }
                        }

                        // resolve fires currently burning
                        if (shipData.fires.length > 0) {
                            let firesExtinguished = [];
                            // calculate fire fighting penalty: +1 per fire per level
                            let fireFightingPenalty = 0;
                            for (let f=0; f < shipData.fires.length; f++) {
                                fireFightingPenalty = fireFightingPenalty + shipData.fire[f].level;
                            }

                            // make attempt to extinguish fires
                            for (let f=0; f < shipData.fires.length; f++) {
                                let fireFightingRoll = rolld6() + fireFightingPenalty;
                                if (fireFightingRoll < 3) {
                                    // fire out
                                    firesExtinguished.push(f);
                                } else if (fireFightingRoll < 5) {
                                    // fire remains at present level
                                } else if (fireFightingRoll < 7) {
                                    // fire goes up one level
                                    shipData.fires[f].level = shipData.fires[f].level + 1;
                                } else {
                                    // fire goes up two levels
                                    shipData.fires[f].level = shipData.fires[f].level + 2;
                                } 
                            } 
                            // remove fires that were extinguished
                            for (let f=0; f < firesExtinguished.fires.length; f++) {
                                shipData.fires.splice(f,1);
                            } 

                            // now apply damage from fire
                            for (let f=0; f < shipData.fires.length; f++) {
                                switch (shipData.fires[f].level) {
                                    case 1:
                                        shipData.hptFromFires = shipData.hptFromFires + 2;
                                        break
                                    case 2:
                                        shipData.hptFromFires = shipData.hptFromFires + 3;
                                        shipData.hitEffectivenessPenaltyFromFires = 1;
                                        shipData = decrementHull (shipData, 1);
                                        break
                                    case 3:
                                        shipData.hptFromFires = shipData.hptFromFires + 4;
                                        shipData.hitEffectivenessPenaltyFromFires = 2;
                                        shipData = decrementHull (shipData, 2);
                                        break
                                    case 4:
                                        shipData.hptFromFires = shipData.hptFromFires + 5;
                                        shipData.hitEffectivenessPenaltyFromFires = 3;
                                        shipData = decrementHull (shipData, 3);
                                        break
                                    case 5:
                                        shipData.hptFromFires = shipData.hptFromFires + 8;
                                        shipData.hitEffectivenessPenaltyFromFires = 4;
                                        shipData = decrementHull (shipData, 4);
                                }

                            }
                        }

                        // resolve gun damage
                        shipData = destroyGun(damageData.damage.criticalPenetration.gunDestroyed, shipData, damageData);
                        shipData = destroyGun(damageData.damage.specialHit.gunDestroyed, shipData, damageData);
                        if (damageData.damage.specialHit.gunDamaged.length > 0) {
                            shipData = damageGun(shipData, damageData);
                        }
                        
                        //resolve engine restarts
                        if (damageData.damage.criticalPenetration.engineRestart.length > 0) {
                            let restartRoll = rolld6();
                            let restartResults = damageData.damage.criticalPenetration.engineRestart[restartRoll - 1];
                            shipData = decrementHull (shipData, restartResults.hull);
                            shipData.crew = shipData.crew -restartResults.crew;
                            shipData.engineCapacity = shipData.engineCapacity - restartResults.engineCapacity;
                            shipData.damageReport.push("turn " + (turn + 1) + ": " + restartResults.message);
                        }

                        // get damage reports
                        if (damageData.rolls.criticalPenetration > 0 && damageData.damage.criticalPenetration.message !== undefined) {
                            shipData.damageReport.push("turn " + turn + ": " + damageData.damage.criticalPenetration.message);
                        }
                        if (damageData.rolls.specialHit > 0 && damageData.damage.specialHit.message !== undefined) {
                            shipData.damageReport.push("turn " + turn + ": " + damageData.damage.specialHit.message);
                        }

                        // resolve shudder jams


                        // resolve rudder jams


                    }

                }
    //            console.log(shipData);
                writeJSONFile(gameDataDir + gameName + "/turn_" + turn + "/" + shipName + ".json", shipData);
            }
        }
    }
    let gameMeta = readJSONFile(gameDataDir + gameName + "/gameMeta.json");
    gameMeta.turn = gameMeta.turn + 1;
    writeJSONFile(gameDataDir + gameName + "/gameMeta.json", gameMeta);
    
    res.json();
});

gameMgmtRouter.get('/ship/:shipName', function(req, res, next) {
    let shipName = req.params.shipName;
    let file = shipDataDir + shipName + ".json";
    
    let shipData = fs.readFileSync(file, 'utf8');
    res.json(shipData);
    
});

gameMgmtRouter.get('/ships', function(req, res, next) {
    let dirArray = fs.readdirSync("./shipdata/");
    res.json(dirArray);
});

gameMgmtRouter.get('/guns', function(req, res, next) {
    let dirArray = fs.readdirSync(gunDataDir);
    res.json(dirArray);
});

gameMgmtRouter.get('/games', function(req, res, next) {
    let dirArray = fs.readdirSync(gameDataDir);
    res.json(dirArray);
});

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

let rolld6 = function() {
    let dieRoll = (Math.floor(Math.random() * 6) + 1);
    return dieRoll;
};

let decrementHull = function(shipData, hullPointsTaken) {
    if (hullPointsTaken > 0) {
        // decrement the hull one at a time so that the stack damage table can be checked for each value
        for (let hh=1; hh < hullPointsTaken; hh++) {
            shipData.hull = shipData.hull - 1;
            // check the hull damage table and decrement speed as needed
            for (let hd=0; hd < shipData.hullDamage.length; hd++) {
                let takeDamageAt = shipData.hullDamage[hd][0];
                let floatationTaken = shipData.hullDamage[hd][1];
                let speedHitsTaken = shipData.hullDamage[hd][2];
                if (takeDamageAt === shipData.originalHull - shipData.hull) {
                    shipData.floatation = shipData.floatation - floatationTaken;
                    // now check for additional speed hits for the floatation just taken
                    for (let hh=1; hh < floatationTaken; hh++) {
                        // check the floatation damage table and decrement speed as needed
                        for (let fd=0; fd < shipData.floatationDamage.length; fd++) {
                            let takeDamageAt = shipData.floatationDamage[fd][0];
                            let speedHitsTaken = shipData.floatationDamage[fd][1];
                            if (takeDamageAt === shipData.originalFloatation - shipData.floatation) {
                                shipData.forwardSpeed.splice(shipData.forwardSpeed.length - 1, speedHitsTaken);
                            }
                        }
                    }
                    // now take the additional speed hit
                    shipData.forwardSpeed.splice(shipData.forwardSpeed.length - 1, speedHitsTaken);
                }
            }
        }
    }
    return shipData;
};

let destroyGun = function(numDestroyed, shipData, damageData) {
    if (numDestroyed > 0) {
        switch(shipData.vesselType) {
            case "WoodenVessel":
            case "ArmoredFrigate":
            case "Casemate":
                if (rolld6() > 3) {
                    if (shipData.armament[damageData.positionOfHit][damageData.rightLeft].length > 0) {
                        if (numDestroyed > shipData.armament[damageData.positionOfHit][damageData.rightLeft].length) {
                            numDestroyed = shipData.armament[damageData.positionOfHit][damageData.rightLeft].length;
                        }
                        for (let nd=1; nd <= numDestroyed; nd++) {
                            if (shipData.armament[damageData.positionOfHit][damageData.rightLeft][nd].status === "good" ||
                                shipData.armament[damageData.positionOfHit][damageData.rightLeft][nd].status === "damaged") {
                                shipData.armament[damageData.positionOfHit][damageData.rightLeft][nd].status = "destroyed";
                            }
                        }
                    }
                } else {
                    if (shipData.armament[damageData.positionOfHit]["pivot"].length > 0) {
                        if (shipData.armament[damageData.positionOfHit]["pivot"][0].status === "good" ||
                            shipData.armament[damageData.positionOfHit]["pivot"][0].status === "damaged") {
                            shipData.armament[damageData.positionOfHit]["pivot"][0].status = "destroyed";
                        }
                    }
                }
                break
            case "Monitor":
                if (rolld6() > 3) {
                    if (shipData.armament[damageData.positionOfHit]["right"].status === "good" ||
                        shipData.armament[damageData.positionOfHit]["right"].status === "damaged") {
                        shipData.armament[damageData.positionOfHit]["right"].status = "destroyed";
                    }
                } else {
                    if (shipData.armament[damageData.positionOfHit]["left"].status === "good" ||
                        shipData.armament[damageData.positionOfHit]["left"].status === "damaged") {
                        shipData.armament[damageData.positionOfHit]["left"].status = "destroyed";
                    }
                }
        }
    }
    return shipData;
};

let damageGun = function(shipData, damageData) {
    switch(shipData.vesselType) {
        case "WoodenVessel":
        case "ArmoredFrigate":
        case "Casemate":
            if (rolld6() > 3) {
                // there could be multiple guns in the section so randomly select one.
                if (shipData.armament[damageData.positionOfHit][damageData.rightLeft].length > 0) {
                    let randomlySelectedGun = rollD6() * 2; // assumes there are never more than 12 guns in a section
                    let currentSelection = 0;
                    for (let rsg=1; rsg <= randomlySelectedGun; rsg++ ) {
                        currentSelection = rsg;
                        if (currentSelection > shipData.armament[damageData.positionOfHit][damageData.rightLeft].length) {
                            currentSelection = 0;
                        }
                    }
                    if (shipData.armament[damageData.positionOfHit][damageData.rightLeft][currentSelection].status === "good" &&
                        shipData.armament[damageData.positionOfHit][damageData.rightLeft][currentSelection].status !== "destroyed") {
                        shipData.armament[damageData.positionOfHit][damageData.rightLeft][currentSelection].status = "damaged";
                        shipData.armament[damageData.positionOfHit][damageData.rightLeft][currentSelection].gunDamaged = damageData.damage.specialHit.gunDamaged[0];
                    }
                }
            } else {
                // there can only be one gun in the pivot section.
                if (shipData.armament[damageData.positionOfHit]["pivot"].length > 0) {
                    if (shipData.armament[damageData.positionOfHit]["pivot"][0].status === "good" &&
                        shipData.armament[damageData.positionOfHit]["pivot"][0].status !== "destroyed") {
                        shipData.armament[damageData.positionOfHit]["pivot"][0].status = "damaged";
                        shipData.armament[damageData.positionOfHit]["pivot"][0].gunDamaged = damageData.damage.specialHit.gunDamaged[0];
                    }
                }
            }
            break
        case "Monitor":
            // roll to randomly select one of the two guns in the turret hit. right is anything above 3
            if (rolld6() > 3) {
                if (shipData.armament[damageData.positionOfHit]["right"].status === "good" &&
                    shipData.armament[damageData.positionOfHit]["right"].status !== "destroyed") {
                    shipData.armament[damageData.positionOfHit]["right"].status = "damaged";
                    shipData.armament[damageData.positionOfHit]["right"].gunDamaged = damageData.damage.specialHit.gunDamaged[0];
                }
            } else {
                if (shipData.armament[damageData.positionOfHit]["left"].status === "good" &&
                    shipData.armament[damageData.positionOfHit]["left"].status === "destroyed") {
                    shipData.armament[damageData.positionOfHit]["left"].status = "damaged";
                    shipData.armament[damageData.positionOfHit]["left"].gunDamaged = damageData.damage.specialHit.gunDamaged[0];
                }
            }
    }
    return shipData;
};

module.exports = gameMgmtRouter;
