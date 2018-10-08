"use strict";
var criticalHitResolver = {
    
};
    
criticalHitResolver.test = function(results) {
    results.damage.criticalPenetration = "Critical Penetration!!";
    return results;
};

let magazineHit = function(results, ship) {
    results.damage.criticalHit = "Magazine Hit";
    let magHitRoll = rolld6();
    if (results.shotType === "shell") {
        magHitRoll = magHitRoll - 1;
    }
    if (magHitRoll <= 2 ) {
        results.damage.criticalPenetration.message = "Vessel explodes and sinks.";
        results.damage.floatation = ship.floatation;
    } else if (magHitRoll === 3 || magHitRoll === 4 ) {
        results.damage.criticalPenetration.message = "Vessel explodes. Vessel loses 50% of remaining hull and floatation. Level III fire automatic. Cease gunfire for 2 turns and each gun has 4 turns of ammunition remaining.";
        results.damage.floatation = results.damage.floatation + (ship.floatation *.5);
        results.damage.hull = results.damage.hull + (ship.hull * .5);
        results.damage.fires.push({level: 3, started: results.turn, magazineFire: false  });
    } else {
        results.damage.criticalPenetration.message = "Vessel explodes. Vessel loses 25% of remaining hull and floatation. Level III fire automatic in magazine. This fire must be extinguished in 3 turns or new magazine hit will be rolled. Cease gunfire for 1 turn.";
        results.damage.floatation = results.damage.floatation + (ship.floatation *.25);
        results.damage.hull = results.damage.hull + (ship.hull * .25);
        results.damage.fires.push({level: 3, started: results.turn, magazineFire: false  });
    }
    return results.damage;
};

let engineHit = function(results, ship) {
    let engineHitRoll = rolld6();
    if (results.shotType === "shell") {
        engineHitRoll = engineHitRoll - 1;
    }
    switch (engineHitRoll) {
        case 0:
        case 1:
            results.damage.speed = results.damage.speed + 3;
            results.damage.criticalPenetration.message = "All steam power lost for 4 turns.";
            break;
        case 2:
            results.damage.speed = results.damage.speed + 2;
            results.damage.criticalPenetration.message = "All steam power lost for 3 turns.";
            break;
        case 3:
            results.damage.speed = results.damage.speed + 2;
            results.damage.criticalPenetration.message = "All steam power lost for 2 turns.";
            break;
        case 4:
        case 5:
        case 6:
            results.damage.speed = results.damage.speed + 1;
            results.damage.crew = results.damage.crew + 2;
        
    }
    return results.damage;
};

let rolld6 = function() {
    let dieRoll = (Math.floor(Math.random() * 6) + 1);
    return dieRoll;
};
let roll2d6 = function() {
    let dieRoll = rolld6() + rolld6();
    return dieRoll;
};


//let results = {
//        target: req.body.target.shipname,
//        gun: req.body.gun.gunType,rolls: {
//            toHit = 0,
//            penetration = 0,
//            criticalPenetration = 0,
//            specialHit = 0
//        },
//        fireType: req.params.fireType,
//        shotType: req.params.shotType,
//        rightLeft: req.params.rightLeft,
//        range: req.params.range,
//        penetrationFactor: 0,
//        targetAspect: req.params.targetAspect,
//        positionOfHit: "none",
//        sectionOfHit: 'none',
//        targetHit: false,
//        turn: req.params.turn,
//        damage: {
//            penetration: false,
//            criticalPenetration: {message: false, gunDestroyed: 0, engineRestart: []},
//            specialHit: {message: false},
//            armor: 0,
//            hull: 0,
//            crew: 0,
//            floatation: 0,
//            speed: 0,
//            ram: 0,
//            stack: 0,
//            fires: [],
//            turningCapacity: 0
//        },
//    };

criticalHitResolver.criticalPenetration = function(ship, results) {
    let dieRoll = roll2d6();
    results.rolls.criticalPenetration = dieRoll;
    switch(dieRoll) {
        case 2:
            switch(ship.vesselType) {
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            results.damage = magazineHit(results, ship);
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 4;
                            results.damage.hull = results.damage.hull + 6;
                            results.damage.floatation = results.damage.floatation + 5;
                            results.damage.crew = results.damage.crew + 4;
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                        case "deck":
                            results.damage = magazineHit(results, ship);
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 4;
                            results.damage.hull = results.damage.hull + 6;
                            results.damage.floatation = results.damage.floatation + 5;
                            results.damage.crew = results.damage.crew + 4;
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                            results.damage = magazineHit(results, ship);
                            break
                        case "deck":
                            results.damage = magazineHit(results, ship);
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 4;
                            results.damage.hull = results.damage.hull + 6;
                            results.damage.floatation = results.damage.floatation + 5;
                            results.damage.crew = results.damage.crew + 4;
                    }
                    break
                case "ArmoredFrigate":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            results.damage = magazineHit(results, ship);
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 4;
                            results.damage.hull = results.damage.hull + 6;
                            results.damage.floatation = results.damage.floatation + 5;
                            results.damage.crew = results.damage.crew + 4;
                    }
            }
            break        
        case 3:
            switch(ship.vesselType) {
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            results.damage.criticalPenetration.gunDestroyed = 1;
                            results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.hull = results.damage.hull + 5;
                                    results.damage.floatation = results.damage.floatation + 4;
                                    results.damage.ram = results.damage.ram + 1;
                                    results.damage.criticalPenetration.message = "Spar torpedo lost";
                                    break
                                case "foreship":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.hull = results.damage.hull + 4;
                                    results.damage.floatation = results.damage.floatation + 5;
                                    results.damage.criticalPenetration.message = "Critical Penetration";
                                    break
                                case "midship":
                                case "aftership":
                                    results.damage.speed = results.damage.speed + 3;
                                    results.damage.crew = results.damage.crew + 5;
                                    results.damage.floatation = results.damage.floatation + 4;
                                    results.damage.criticalPenetration.message = "Critical Penetration";
                                    break
                                case "stern":
                                    results.damage.turningCapacity = 1;
                                    results.damage.hull = results.damage.hull + 5;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.criticalPenetration.message = "Critical Penetration: Steering damaged. Turning capacity reduced to 1/1 at any speed";
                            }
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                            switch(results.sectionOfHit) {
                                case "foreship":
                                    results.damage.criticalPenetration.gunDestroyed = 1;
                                    results.damage.criticalPenetration.message = "1 Gun Destroyed";
                                case "left midship":
                                case "right midship":
                                case "aftership":
                                    results.damage.armor = results.damage.armor + 6;
                                    let gunJamRoll = rolld6();
                                    switch (gunJamRoll) {
                                        case 1:
                                            results.damage.criticalPenetration.message = "Turret jammed directly ahead (towards bow) for 5 turns.";
                                            break
                                        case 2:
                                            results.damage.criticalPenetration.message = "Turret jammed right forward for 5 turns.";
                                            break
                                        case 3:
                                            results.damage.criticalPenetration.message = "Turret jammed right aft for 5 turns.";
                                            break
                                        case 4:
                                            results.damage.criticalPenetration.message = "Turret jammed directly astern (towards stern) for 5 turns.";
                                            break
                                        case 5:
                                            results.damage.criticalPenetration.message = "Turret jammed left aft for 5 turns.";
                                            break
                                        case 6:
                                            results.damage.criticalPenetration.message = "Turret jammed left forward for 5 turns.";
                                            break
                                    }
                            }
                            break
                        case "deck":
                            results.damage.armor = results.damage.armor + 3;
                            results.damage.hull = results.damage.hull + 3;
                            results.damage.crew = results.damage.crew + 2;
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.hull = results.damage.hull + 5;
                                    results.damage.floatation = results.damage.floatation + 4;
                                    results.damage.ram = results.damage.ram + 1;
                                    results.damage.criticalPenetration.message = "Spar torpedo lost";
                                    break
                                case "foreship":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.hull = results.damage.hull + 4;
                                    results.damage.floatation = results.damage.floatation + 5;
                                    results.damage.criticalPenetration.message = "Critical Penetration";
                                    break
                                case "midship":
                                case "aftership":
                                    results.damage.speed = results.damage.speed + 3;
                                    results.damage.crew = results.damage.crew + 5;
                                    results.damage.floatation = results.damage.floatation + 4;
                                    results.damage.criticalPenetration.message = "Critical Penetration";
                                    break
                                case "stern":
                                    results.damage.turningCapacity = 1;
                                    results.damage.hull = results.damage.hull + 5;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.criticalPenetration.message = "Critical Penetration: Steering damaged. Turning capacity reduced to 1/1 at any speed";
                            }
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                        case "deck":
                            results.damage.criticalPenetration.gunDestroyed = 1;
                            results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.hull = results.damage.hull + 5;
                                    results.damage.floatation = results.damage.floatation + 4;
                                    results.damage.ram = results.damage.ram + 1;
                                    results.damage.criticalPenetration.message = "Spar torpedo lost";
                                    break
                                case "foreship":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.hull = results.damage.hull + 4;
                                    results.damage.floatation = results.damage.floatation + 5;
                                    results.damage.criticalPenetration.message = "Critical Penetration";
                                    break
                                case "midship":
                                case "aftership":
                                    results.damage.speed = results.damage.speed + 3;
                                    results.damage.crew = results.damage.crew + 5;
                                    results.damage.floatation = results.damage.floatation + 4;
                                    results.damage.criticalPenetration.message = "Critical Penetration";
                                    break
                                case "stern":
                                    results.damage.turningCapacity = 1;
                                    results.damage.hull = results.damage.hull + 5;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.criticalPenetration.message = "Critical Penetration: Steering damaged. Turning capacity reduced to 1/1 at any speed";
                            }
                    }
                    break
                case "ArmoredFrigate":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            results.damage.criticalPenetration.gunDestroyed = 1;
                            results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.hull = results.damage.hull + 5;
                                    results.damage.floatation = results.damage.floatation + 4;
                                    results.damage.ram = results.damage.ram + 1;
                                    results.damage.criticalPenetration.message = "Spar torpedo lost";
                                    break
                                case "foreship":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.hull = results.damage.hull + 4;
                                    results.damage.floatation = results.damage.floatation + 5;
                                    results.damage.criticalPenetration.message = "Critical Penetration";
                                    break
                                case "midship":
                                case "aftership":
                                    results.damage.speed = results.damage.speed + 3;
                                    results.damage.crew = results.damage.crew + 5;
                                    results.damage.floatation = results.damage.floatation + 4;
                                    results.damage.criticalPenetration.message = "Critical Penetration";
                                    break
                                case "stern":
                                    results.damage.turningCapacity = 1;
                                    results.damage.hull = results.damage.hull + 5;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.criticalPenetration.message = "Critical Penetration: Steering damaged. Turning capacity reduced to 1/1 at any speed";
                            }
                    }
            }
            break 
        case 4:
            switch(ship.vesselType) {
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            results.damage.criticalPenetration.gunDestroyed = 1;
                            results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.criticalPenetration.message = "Rudder jammed right 3 turns, movement sequence is ahead 1 right turn, ahead 1 etc. Vessel speed must be reduced to 1/2 available movement. ";
                            }
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                            switch(results.sectionOfHit) {
                                case "foreship":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.criticalPenetration.message = "Gun port shudder jammed shut. Gun cannot fire out of that port while shutter is jammed. Shudder must remained jammed 2 turns, then third turn roll 1 die: 1-2 shudder is freed, gun may fire out of it that turn; 3-6 shudder ramains jammed. Die is rolled each subsequent turn.";
                                    break
                                case "left midship":
                                case "right midship":
                                case "aftership":
                                    results.damage.criticalPenetration.message = "Turret jammed, roll 1 die for direction. Turret must remain jammed 2 turns then on third turn roll 1 die. 1-2 turret free to rotate; 3-6 turret remains jammed. Die is rolled each subsequent turn.";
                                    break
                            }
                            break
                        case "deck":
                            results.damage.armor = results.damage.armor + 3;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.crew = results.damage.crew + 2;
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.criticalPenetration.message = "Rudder jammed right 3 turns, movement sequence is ahead 1 right turn, ahead 1 etc. Vessel speed must be reduced to 1/2 available movement. ";
                            }
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                            results.damage.armor = results.damage.armor + 4;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.criticalPenetration.message = "Gun port shudder jammed shut. Gun cannot fire out of that port while shutter is jammed. Shudder must remained jammed 2 turns, then third turn roll 1 die: 1-2 shudder is freed, gun may fire out of it that turn; 3-6 shudder ramains jammed. Die is rolled each subsequent turn.";                                   
                            break
                        case "deck":
                            results.damage.armor = results.damage.armor + 3;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.crew = results.damage.crew + 2;
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.criticalPenetration.message = "Rudder jammed right 3 turns, movement sequence is ahead 1 right turn, ahead 1 etc. Vessel speed must be reduced to 1/2 available movement. ";
                            }
                    }
                    break
                case "ArmoredFrigate":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            results.damage.criticalPenetration.gunDestroyed = 1;
                            results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.criticalPenetration.message = "Rudder jammed right 3 turns, movement sequence is ahead 1 right turn, ahead 1 etc. Vessel speed must be reduced to 1/2 available movement. ";
                            }
                    }
            }
            break

        case 5:
            switch(ship.vesselType) {
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                            break
                        case "deck":
                            results.damage.criticalPenetration.gunDestroyed = 1;
                            results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.criticalPenetration.message = "Rudder jammed right 3 turns, movement sequence is ahead 1 right turn, ahead 1 etc. Vessel speed must be reduced to 1/2 available movement. ";
                            }
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                            switch(results.sectionOfHit) {
                                case "foreship":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.criticalPenetration.message = "Gun port shudder jammed shut. Gun cannot fire out of that port while shutter is jammed. Shudder must remained jammed 2 turns, then third turn roll 1 die: 1-2 shudder is freed, gun may fire out of it that turn; 3-6 shudder ramains jammed. Die is rolled each subsequent turn.";
                                    break
                                case "left midship":
                                case "right midship":
                                case "aftership":
                                    results.damage.criticalPenetration.message = "Turret jammed, roll 1 die for direction. Turret must remain jammed 2 turns then on third turn roll 1 die. 1-2 turret free to rotate; 3-6 turret remains jammed. Die is rolled each subsequent turn.";
                                    
                            }
                            break
                        case "deck":
                            results.damage.armor = results.damage.armor + 3;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.crew = results.damage.crew + 2;
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.criticalPenetration.message = "Rudder jammed right 3 turns, movement sequence is ahead 1 right turn, ahead 1 etc. Vessel speed must be reduced to 1/2 available movement. ";
                            }
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                            results.damage.armor = results.damage.armor + 4;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.criticalPenetration.message = "Gun port shudder jammed shut. Gun cannot fire out of that port while shutter is jammed. Shudder must remained jammed 2 turns, then third turn roll 1 die: 1-2 shudder is freed, gun may fire out of it that turn; 3-6 shudder ramains jammed. Die is rolled each subsequent turn.";                                   
                            break
                        case "deck":
                            results.damage.armor = results.damage.armor + 3;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.crew = results.damage.crew + 2;
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.criticalPenetration.message = "Rudder jammed left 3 turns, movement sequence is ahead 1 left turn, ahead 1 etc. Vessel speed must be reduced to 1/2 available movement. ";
                            }
                    }
                    break
                case "ArmoredFrigate":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            results.damage.criticalPenetration.gunDestroyed = 1;
                            results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.criticalPenetration.message = "Rudder jammed left 3 turns, movement sequence is ahead 1 left turn, ahead 1 etc. Vessel speed must be reduced to 1/2 available movement. ";
                            }
                    }
            }
            break

        case 6:
            switch(ship.vesselType) {
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    break;
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage = engineHit(results, ship);
                                    break;
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    break;
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage = engineHit(results, ship);
                                    break;
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage = engineHit(results, ship);
                                    break;
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 1;
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    break;
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage = engineHit(results, ship);
                                    break;
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage = engineHit(results, ship);
                                    break;
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 1;
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    break;
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage = engineHit(results, ship);
                                    break;
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage = engineHit(results, ship);
                                    break;
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
                    break
                case "ArmoredFrigate":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    break;
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage = engineHit(results, ship);
                                    break;
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    break;
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage = engineHit(results, ship);
                                    break;
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage = engineHit(results, ship);
                                    break;
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
            }
            break

        case 7:
            switch(ship.vesselType) {
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                        let fireStartRoll = rolld6();
                                        if (fireStartRoll < 3) {
                                            results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                            results.damage.criticalPenetration.message = "Level 1 fire starts";
                                        }
                                    }
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 1;
                                        results.damage.speed = results.damage.speed + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 3;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 4;
                                        results.damage.speed = results.damage.speed + 2;
                                        results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 1 fire automatic";
                                    }
                                case "stern":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                        let fireStartRoll = rolld6();
                                        if (fireStartRoll < 3) {
                                            results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                            results.damage.criticalPenetration.message = "Level 1 fire starts";
                                        }
                                    }
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                        let fireStartRoll = rolld6();
                                        if (fireStartRoll < 3) {
                                            results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                            results.damage.criticalPenetration.message = "Level 1 fire starts";
                                        }
                                    }
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 1;
                                        results.damage.speed = results.damage.speed + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 3;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 4;
                                        results.damage.speed = results.damage.speed + 2;
                                        results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 1 fire automatic";
                                    }
                                case "stern":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                        let fireStartRoll = rolld6();
                                        if (fireStartRoll < 3) {
                                            results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                            results.damage.criticalPenetration.message = "Level 1 fire starts";
                                        }
                                    }
                            }
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.floatation = results.damage.floatation + 1;
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 3;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.crew = results.damage.crew + 2;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                            break
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 3;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.crew = results.damage.crew + 2;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.floatation = results.damage.floatation + 1;
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 3;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.crew = results.damage.crew + 2;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                            break
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 3;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.crew = results.damage.crew + 2;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.floatation = results.damage.floatation + 1;
                    }
                    break
                case "ArmoredFrigate":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                        let fireStartRoll = rolld6();
                                        if (fireStartRoll < 3) {
                                            results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                            results.damage.criticalPenetration.message = "Level 1 fire starts";
                                        }
                                    }
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 1;
                                        results.damage.speed = results.damage.speed + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 3;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 4;
                                        results.damage.speed = results.damage.speed + 2;
                                        results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 1 fire automatic";
                                    }
                                case "stern":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                        let fireStartRoll = rolld6();
                                        if (fireStartRoll < 3) {
                                            results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                            results.damage.criticalPenetration.message = "Level 1 fire starts";
                                        }
                                    }
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                        let fireStartRoll = rolld6();
                                        if (fireStartRoll < 3) {
                                            results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                            results.damage.criticalPenetration.message = "Level 1 fire starts";
                                        }
                                    }
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 1;
                                        results.damage.speed = results.damage.speed + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 3;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 4;
                                        results.damage.speed = results.damage.speed + 2;
                                        results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 1 fire automatic";
                                    }
                                case "stern":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                        let fireStartRoll = rolld6();
                                        if (fireStartRoll < 3) {
                                            results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                            results.damage.criticalPenetration.message = "Level 1 fire starts";
                                        }
                                    }
                            }
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.floatation = results.damage.floatation + 1;
                    }
            }
            break

        case 8:
            switch(ship.vesselType) {
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                            break
                        case "waterline":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                                results.damage.floatation = results.damage.floatation + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                            break
                        case "waterline":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                                results.damage.floatation = results.damage.floatation + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                        case "deck":
                        if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                            break
                        case "waterline":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                                results.damage.floatation = results.damage.floatation + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
                    break
                case "ArmoredFrigate":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                            break
                        case "waterline":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 1;
                                results.damage.floatation = results.damage.floatation + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
            }
            break

        case 9:
            switch(ship.vesselType) {
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 3;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                            break
                        case "waterline":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.floatation = results.damage.floatation + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 3;
                                results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 3;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                        case "waterline":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.floatation = results.damage.floatation + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 3;
                                results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                        case "deck":
                        if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 3;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                        case "waterline":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.floatation = results.damage.floatation + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 3;
                                results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
                    break
                case "ArmoredFrigate":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 3;
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Level 1 fire starts";
                                }
                            }
                            break
                        case "waterline":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.floatation = results.damage.floatation + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 1;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 3;
                                results.damage.floatation = results.damage.floatation + 2;
                            }
                    }
            }
            break

        case 10:
            switch(ship.vesselType) {
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 1;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 2;
                                        results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 2 fire starts";
                                    }
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.criticalPenetration.engineRestart = [ {message: "boiler explodes", crew: 10, hull: 8, engineCapacity: 0}, 
                                                                                         {message: "engine stopped", crew: 0, hull: 0, engineCapacity: 0},
                                                                                         {message: "engine stopped", crew: 0, hull: 0, engineCapacity: 0},
                                                                                         {message: "engine stopped", crew: 0, hull: 0, engineCapacity: 0},
                                                                                         {message: "engine restarted", crew: 0, hull: 0, engineCapacity: 1},
                                                                                         {message: "engine restarted", crew: 0, hull: 0, engineCapacity: 1}];
                                    results.damage.criticalPenetration.message = "Engine stopped. All steam power lost. Will attempt to restart next turn.";
                                    break
                                case "stern":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 1;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 2;
                                        results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 2 fire starts";
                                    }
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.ram = results.damage.ram + 1;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.criticalPenetration.engineRestart = [ {message: "boiler explodes", crew: 10, hull: 8}, 
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine restarted", engineCapacity: 1},
                                                                                         {message: "engine restarted", engineCapacity: 1}];
                                    results.damage.criticalPenetration.message = "Engine stopped. All steam power lost. Will attempt to restart next turn.";
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 3;
                            }
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                            results.damage.armor = results.damage.armor + 4;
                            results.damage.hull = results.damage.hull + 1;
                            results.damage.crew = results.damage.crew + 1;
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 1;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 2;
                                        results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 2 fire starts";
                                    }
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.criticalPenetration.engineRestart = [ {message: "boiler explodes", crew: 10, hull: 8}, 
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine restarted", engineCapacity: 1},
                                                                                         {message: "engine restarted", engineCapacity: 1}];
                                    results.damage.criticalPenetration.message = "Engine stopped. All steam power lost. Will attempt to restart next turn.";
                                    break
                                case "stern":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 1;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 2;
                                        results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 2 fire starts";
                                    }
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.ram = results.damage.ram + 1;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.criticalPenetration.engineRestart = [ {message: "boiler explodes", crew: 10, hull: 8}, 
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine restarted", engineCapacity: 1},
                                                                                         {message: "engine restarted", engineCapacity: 1}];
                                    results.damage.criticalPenetration.message = "Engine stopped. All steam power lost. Will attempt to restart next turn.";
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 3;
                            }
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 3;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 2;
                                        let fireStartRoll = rolld6();
                                        if (fireStartRoll < 3) {
                                            results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                            results.damage.criticalPenetration.message = "Level 2 fire starts";
                                        }
                                    }
                                    break
                                case "midship":
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.criticalPenetration.engineRestart = [ {message: "boiler explodes", crew: 10, hull: 8}, 
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine restarted", engineCapacity: 1},
                                                                                         {message: "engine restarted", engineCapacity: 1}];
                                    results.damage.criticalPenetration.message = "Engine stopped. All steam power lost. Will attempt to restart next turn.";
                                    break
                                case "aftership":
                                case "stern":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 3;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 2;
                                        let fireStartRoll = rolld6();
                                        if (fireStartRoll < 3) {
                                            results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                            results.damage.criticalPenetration.message = "Level 2 fire starts";
                                        }
                                    }
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.floatation = results.damage.floatation + 1;
                                    results.damage.ram = results.damage.ram + 1;
                                    results.damage.message = "Spar Torpedo lost";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                results.damage.armor = results.damage.armor + 2;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.floatation = results.damage.floatation + 1;
                                    results.damage.message = "Rudder jammed on present heading for 2 turns.";
                            }
                    }
                    break
                case "ArmoredFrigate":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 1;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 2;
                                        results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 2 fire starts";
                                    }
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.criticalPenetration.engineRestart = [ {message: "boiler explodes", crew: 10, hull: 8}, 
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine restarted", engineCapacity: 1},
                                                                                         {message: "engine restarted", engineCapacity: 1}];
                                    results.damage.criticalPenetration.message = "Engine stopped. All steam power lost. Will attempt to restart next turn.";
                                    break
                                case "stern":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 1;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 2;
                                        results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 2 fire starts";
                                    }
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.ram = results.damage.ram + 1;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.criticalPenetration.engineRestart = [ {message: "boiler explodes", crew: 10, hull: 8}, 
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine stopped"},
                                                                                         {message: "engine restarted", engineCapacity: 1},
                                                                                         {message: "engine restarted", engineCapacity: 1}];
                                    results.damage.criticalPenetration.message = "Engine stopped. All steam power lost. Will attempt to restart next turn.";
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 3;
                            }
                    }
            }
            break
        case 11:
            switch(ship.vesselType) {
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.criticalPenetration.gunDestroyed = 1;
                                results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 3;
                                results.damage.criticalPenetration.gunDestroyed = 1;
                                results.damage.criticalPenetration.message = "1 Gun Destroyed";
                                results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                results.damage.criticalPenetration.message = "Level 2 fire starts";
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.ram = results.damage.ram + 2;
                                    results.damage.criticalPenetration.message = "Spar Torpedo Lost";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.speed = results.damage.speed + 2;
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.criticalPenetration.message = "Rudder jammed on present heading 3 turns, vessel speed must be reduced to 1/2 available movement.";
                            }
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                            switch(results.sectionOfHit) {
                                case "foreship":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 3;
                                        results.damage.crew = results.damage.crew + 2;
                                        results.damage.criticalPenetration.gunDestroyed = 1;
                                        results.damage.criticalPenetration.message = "1 Gun Destroyed";
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.crew = results.damage.crew + 2;
                                        results.damage.criticalPenetration.gunDestroyed = 1;
                                        results.damage.criticalPenetration.message = "1 Gun Destroyed";
                                        results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 2 fire starts";
                                    }
                                    break
                                case "left midship":
                                case "right midship":
                                case "aftership":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 4;
                                        results.damage.crew = results.damage.crew + 1;
                                        let gunJamRoll = rolld6();
                                        switch (gunJamRoll) {
                                            case 1:
                                                results.damage.criticalPenetration.message = "Turret jammed directly ahead (towards bow) for 3 turns.";
                                                break
                                            case 2:
                                                results.damage.criticalPenetration.message = "Turret jammed right forward for 3 turns.";
                                                break
                                            case 3:
                                                results.damage.criticalPenetration.message = "Turret jammed right aft for 3 turns.";
                                                break
                                            case 4:
                                                results.damage.criticalPenetration.message = "Turret jammed directly astern (towards stern) for 3 turns.";
                                                break
                                            case 5:
                                                results.damage.criticalPenetration.message = "Turret jammed left aft for 3 turns.";
                                                break
                                            case 6:
                                                results.damage.criticalPenetration.message = "Turret jammed left forward for 3 turns.";
                                                break
                                        } 
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 3;
                                        results.damage.crew = results.damage.crew + 2;
                                        let gunJamRoll = rolld6();
                                        switch (gunJamRoll) {
                                            case 1:
                                                results.damage.criticalPenetration.message = "Level 2 fire starts. Turret jammed directly ahead (towards bow) for 4 turns.";
                                                break
                                            case 2:
                                                results.damage.criticalPenetration.message = "Level 2 fire starts. Turret jammed right forward for 4 turns.";
                                                break
                                            case 3:
                                                results.damage.criticalPenetration.message = "Level 2 fire starts. Turret jammed right aft for 4 turns.";
                                                break
                                            case 4:
                                                results.damage.criticalPenetration.message = "Level 2 fire starts. Turret jammed directly astern (towards stern) for 4 turns.";
                                                break
                                            case 5:
                                                results.damage.criticalPenetration.message = "Level 2 fire starts. Turret jammed left aft for 4 turns.";
                                                break
                                            case 6:
                                                results.damage.criticalPenetration.message = "Level 2 fire starts. Turret jammed left forward for 4 turns.";
                                                break
                                        }
                                        results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                    }
                                    break
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 2;
                                        results.damage.crew = results.damage.crew + 2;
                                        results.damage.stack = results.damage.stack + 1;
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 1;
                                        results.damage.crew = results.damage.crew + 3;
                                        results.damage.stack = results.damage.stack + 2;
                                        results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 2 fire starts";
                                    }
                                    break
                                case "aftership":
                                case "stern":
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.ram = results.damage.ram + 2;
                                    results.damage.criticalPenetration.message = "Spar Torpedo Lost";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.speed = results.damage.speed + 2;
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.criticalPenetration.message = "Rudder jammed on present heading 3 turns, vessel speed must be reduced to 1/2 available movement.";
                            }
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 3;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.criticalPenetration.gunDestroyed = 1;
                                results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 3;
                                results.damage.criticalPenetration.gunDestroyed = 1;
                                results.damage.criticalPenetration.message = "1 Gun Destroyed";
                                results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                results.damage.criticalPenetration.message = "Level 2 fire starts";
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.ram = results.damage.ram + 2;
                                    results.damage.criticalPenetration.message = "Spar Torpedo Lost";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.speed = results.damage.speed + 2;
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.criticalPenetration.message = "Rudder jammed on present heading 3 turns, vessel speed must be reduced to 1/2 available movement.";
                            }
                    }
                    break
                case "ArmoredFrigate":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.criticalPenetration.gunDestroyed = 1;
                                results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 3;
                                results.damage.criticalPenetration.gunDestroyed = 1;
                                results.damage.criticalPenetration.message = "1 Gun Destroyed";
                                results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                results.damage.criticalPenetration.message = "Level 2 fire starts";
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.ram = results.damage.ram + 2;
                                    results.damage.criticalPenetration.message = "Spar Torpedo Lost";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.speed = results.damage.speed + 2;
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 4;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.criticalPenetration.message = "Rudder jammed on present heading 3 turns, vessel speed must be reduced to 1/2 available movement.";
                            }
                    }
            }
            break
        case 12:
            switch(ship.vesselType) {
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.criticalPenetration.gunDestroyed = 1;
                                    results.damage.criticalPenetration.message = "1 Gun Destroyed";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.hull = results.damage.hull + 8;
                                    results.damage.crew = results.damage.crew + 10;
                                    results.damage.fires.push({level: 4, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Boiler hit and explodes. All speed and steam lost for remainder of game. Level 4 fire starts. Cease gunfire for 3 turns.";
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.criticalPenetration.gunDestroyed = 1;
                                    results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 5;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.ram = results.damage.ram + 2;
                                    results.damage.criticalPenetration.message = "Spar Torpedo Lost";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.hull = results.damage.hull + 8;
                                    results.damage.crew = results.damage.crew + 10;
                                    results.damage.fires.push({level: 4, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Boiler hit and explodes. All speed and steam lost for remainder of game. Level 4 fire starts. Cease gunfire for 3 turns.";
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 5;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.turningCapacity = 1;
                                    results.damage.criticalPenetration.message = "Steering damaged. Turning capacity ruduced to 1/1. Vessel must remain on present heading 4 turns and reduce speed to 1/2 movement.";
                            }
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                            switch(results.sectionOfHit) {
                                case "foreship":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 4;
                                        results.damage.hull = results.damage.hull + 1;
                                        results.damage.crew = results.damage.crew + 2;
                                        results.damage.criticalPenetration.gunDestroyed = 1;
                                        results.damage.criticalPenetration.message = "1 Gun Destroyed";
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 3;
                                        results.damage.hull = results.damage.hull + 2;
                                        results.damage.crew = results.damage.crew + 3;
                                        results.damage.criticalPenetration.gunDestroyed = 1;
                                        results.damage.criticalPenetration.message = "1 Gun Destroyed";
                                        results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 2 fire starts";
                                    }
                                    break
                                case "left midship":
                                case "right midship":
                                case "aftership":
                                    if (results.shotType === "solidshot") {
                                        results.damage.armor = results.damage.armor + 5;
                                        results.damage.hull = results.damage.hull + 5;
                                        results.damage.crew = results.damage.crew + 2;
                                        results.damage.criticalPenetration.message = "Turret jammed for remainder of game. Roll die for direction";
                                    } else if (results.shotType === "shell") {
                                        results.damage.armor = results.damage.armor + 4;
                                        results.damage.hull = results.damage.hull + 3;
                                        results.damage.crew = results.damage.crew + 3;
                                        results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                        results.damage.criticalPenetration.message = "Level 2 fire starts. Turret jammed for remainder of game. Roll die for direction";
                                    }
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 5;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.ram = results.damage.ram + 2;
                                    results.damage.criticalPenetration.message = "Spar Torpedo Lost";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.hull = results.damage.hull + 8;
                                    results.damage.crew = results.damage.crew + 10;
                                    results.damage.fires.push({level: 4, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Boiler hit and explodes. All speed and steam lost for remainder of game. Level 4 fire starts. Cease gunfire for 3 turns.";
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 5;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.turningCapacity = 1;
                                    results.damage.criticalPenetration.message = "Steering damaged. Turning capacity ruduced to 1/1. Vessel must remain on present heading 4 turns and reduce speed to 1/2 movement.";
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 5;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.ram = results.damage.ram + 2;
                                    results.damage.criticalPenetration.message = "Spar Torpedo Lost";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.hull = results.damage.hull + 8;
                                    results.damage.crew = results.damage.crew + 10;
                                    results.damage.fires.push({level: 4, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Boiler hit and explodes. All speed and steam lost for remainder of game. Level 4 fire starts. Cease gunfire for 3 turns.";
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 5;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.turningCapacity = 1;
                                    results.damage.criticalPenetration.message = "Steering damaged. Turning capacity ruduced to 1/1. Vessel must remain on present heading 4 turns and reduce speed to 1/2 movement.";
                            }
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 4;
                                results.damage.hull = results.damage.hull + 1;
                                results.damage.crew = results.damage.crew + 2;
                                results.damage.criticalPenetration.gunDestroyed = 1;
                                results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 3;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 3;
                                results.damage.criticalPenetration.gunDestroyed = 1;
                                results.damage.criticalPenetration.message = "1 Gun Destroyed";
                                results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                results.damage.criticalPenetration.message = "Level 2 fire starts";
                            }
                            break
                        case "deck":
                            if (results.shotType === "solidshot") {
                                results.damage.armor = results.damage.armor + 3;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 2;
                            } else if (results.shotType === "shell") {
                                results.damage.armor = results.damage.armor + 2;
                                results.damage.hull = results.damage.hull + 2;
                                results.damage.crew = results.damage.crew + 3;
                                results.damage.fires.push({level: 2, started: results.turn, magazineFire: false  });
                                results.damage.criticalPenetration.message = "Level 2 fire starts";
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 5;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.ram = results.damage.ram + 2;
                                    results.damage.criticalPenetration.message = "Spar Torpedo Lost";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.hull = results.damage.hull + 8;
                                    results.damage.crew = results.damage.crew + 10;
                                    results.damage.fires.push({level: 4, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Boiler hit and explodes. All speed and steam lost for remainder of game. Level 4 fire starts. Cease gunfire for 3 turns.";
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 5;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.turningCapacity = 1;
                                    results.damage.criticalPenetration.message = "Steering damaged. Turning capacity ruduced to 1/1. Vessel must remain on present heading 4 turns and reduce speed to 1/2 movement.";
                            }
                    }
                    break
                case "ArmoredFrigate":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.criticalPenetration.gunDestroyed = 1;
                                    results.damage.criticalPenetration.message = "1 Gun Destroyed";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.hull = results.damage.hull + 8;
                                    results.damage.crew = results.damage.crew + 10;
                                    results.damage.fires.push({level: 4, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Boiler hit and explodes. All speed and steam lost for remainder of game. Level 4 fire starts. Cease gunfire for 3 turns.";
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.crew = results.damage.crew + 2;
                                    results.damage.criticalPenetration.gunDestroyed = 1;
                                    results.damage.criticalPenetration.message = "1 Gun Destroyed";
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 5;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.ram = results.damage.ram + 2;
                                    results.damage.criticalPenetration.message = "Spar Torpedo Lost";
                                    break
                                case "foreship":
                                case "midship":
                                case "aftership":
                                    results.damage.hull = results.damage.hull + 8;
                                    results.damage.crew = results.damage.crew + 10;
                                    results.damage.fires.push({level: 4, started: results.turn, magazineFire: false  });
                                    results.damage.criticalPenetration.message = "Boiler hit and explodes. All speed and steam lost for remainder of game. Level 4 fire starts. Cease gunfire for 3 turns.";
                                    break
                                case "stern":
                                    results.damage.armor = results.damage.armor + 5;
                                    results.damage.floatation = results.damage.floatation + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.turningCapacity = 1;
                                    results.damage.criticalPenetration.message = "Steering damaged. Turning capacity ruduced to 1/1. Vessel must remain on present heading 4 turns and reduce speed to 1/2 movement.";
                            }
                    }
            }
    }
    
    return results;
};


module.exports = criticalHitResolver;



