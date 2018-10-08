"use strict";
var specialHitResolver = {
    
};

let rolld6 = function() {
    let dieRoll = (Math.floor(Math.random() * 6) + 1);
    return dieRoll;
};
let roll2d6 = function() {
    let dieRoll = rolld6() + rolld6();
    return dieRoll;
};

specialHitResolver.specialHit = function(ship, results) {
    let dieRoll = roll2d6();
    switch(dieRoll) {
        case 2:
            switch(ship.vesselType) {
                case "ArmoredFrigate":
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            results.damage.specialHit.gunDestroyed = 1;
                            results.damage.specialHit.message = "1 Gun Destroyed.";
                            if (results.shotType === "shell") {
                                let fireStartRoll = rolld6();
                                if (fireStartRoll < 3) {
                                    results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                    results.damage.specialHit.message = results.damage.specialHit.message + " Level 1 fire starts";
                                }
                            }
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.floatationation = results.damage.floatationation + 2;
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                            switch(results.sectionOfHit) {
                                case "foreship":
                                    results.damage.specialHit.gunDamaged = [ {message: "gun explodes", penetrationFactor: .5, armor: 2, crew: 3, hull: 2, fire: {level: 1, started: results.turn, magazineFire: false  }}, 
                                                                             {message: "gun explodes", penetrationFactor: .5, armor: 2, crew: 3, hull: 2, fire: {level: 1, started: results.turn, magazineFire: false  }},
                                                                             {penetrationFactor: .5 },
                                                                             {penetrationFactor: .5 },
                                                                             {penetrationFactor: .5 },
                                                                             {penetrationFactor: .5 }];
                                    results.damage.specialHit.message = "Muzzle of gun in section hit broken. Damaged gun can be fired at risk at 1/2 penetration factor";
                                    break
                                case "left midship":
                                case "right midship":
                                case "aftership":
                                    let turretJamRoll = rolld6();
                                    switch (turretJamRoll) {
                                        case 1:
                                            results.damage.specialHit.message = "turret jammed 4 turns directly ahead.";
                                            break;
                                        case 2:
                                            results.damage.specialHit.message = "turret jammed 4 turns right ahead.";
                                            break;
                                        case 3:
                                            results.damage.specialHit.message = "turret jammed 4 turns right astern.";
                                            break;
                                        case 4:
                                            results.damage.specialHit.message = "turret jammed 4 turns directly astern.";
                                            break;
                                        case 5:
                                            results.damage.specialHit.message = "turret jammed 4 turns left astern.";
                                            break;
                                        case 6:
                                            results.damage.specialHit.message = "turret jammed 4 turns left ahead.";

                                    }
                            }
                            break
                        case "deck":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.floatationation = results.damage.crew + 1;
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.floatationation = results.damage.floatationation + 2;
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                case "aftership":
                                case "stern":
                                    results.damage.specialHit.gunDamaged = [ {message: "gun explodes", penetrationFactor: .5, armor: 2, crew: 3, hull: 2, fire: {level: 1, started: results.turn, magazineFire: false  }}, 
                                                                             {message: "gun explodes", penetrationFactor: .5, armor: 2, crew: 3, hull: 2, fire: {level: 1, started: results.turn, magazineFire: false  }},
                                                                             {penetrationFactor: .5 },
                                                                             {penetrationFactor: .5 },
                                                                             {penetrationFactor: .5 },
                                                                             {penetrationFactor: .5 }];
                                    results.damage.specialHit.message = "Muzzle of gun in section hit broken. Damaged gun can be fired at risk at 1/2 penetration factor";
                            }
                            break
                        case "deck":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.floatationation = results.damage.crew + 1;
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.floatationation = results.damage.floatationation + 2;
                    }
            }
            break   
        
        
        case 3:
            switch(ship.vesselType) {
                case "ArmoredFrigate":
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.specialHit.message = results.damage.specialHit.message + " Steering damaged. Vessel remains on present heading for 4 turns, no maneuvering.";
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.specialHit.message = results.damage.specialHit.message + " Steering damaged. Vessel remains on present heading for 4 turns, no maneuvering.";
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.specialHit.message = results.damage.specialHit.message + " Steering damaged. Vessel remains on present heading for 4 turns, no maneuvering.";
                            }
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                            results.damage.specialHit.message = "Pilot house hit. Vessel remains on present heading 3 turns. Maximum speed it halved during these turns.";
                            results.damage.armor = results.damage.armor + 2;
                            break
                        case "turretZ":
                            results.damage.armor = results.damage.armor + 3;
                            break
                        case "deck":
                            // there don't seem to be any results of this section on a monitor
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.floatation = results.damage.floatation + 2;
                            results.damage.hull = results.damage.hull + 1;
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                    results.damage.specialHit.message = "Pilot house hit. Vessel remains on present heading 3 turns. Maximum speed it halved during these turns.";
                                    results.damage.armor = results.damage.armor + 2;
                                    break
                                case "midship":
                                case "aftership":
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 1;
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 1;
                                    break
                                case "foreship":
                                    results.damage.specialHit.message = "Pilot house hit. Vessel remains on present heading 3 turns. Maximum speed it halved during these turns.";
                                    results.damage.armor = results.damage.armor + 2;
                                    break
                                case "midship":
                                    results.damage.stack = results.damage.stack + 1;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 1;
                            }
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.floatation = results.damage.floatation + 2;
                    }
            }
            break 
        case 4:
            switch(ship.vesselType) {
                case "ArmoredFrigate":
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 1;
                                    break
                                case "midship":
                                    switch (results.shotType) {
                                        case "solidshot":
                                            results.damage.stack = results.damage.stack + 1;
                                            break
                                        case "shell":
                                            results.damage.stack = results.damage.stack + 2;
                                            results.damage.crew = results.damage.crew + 3;
                                    }
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 1;
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 1;
                                    break
                                case "midship":
                                    switch (results.shotType) {
                                        case "solidshot":
                                            results.damage.stack = results.damage.stack + 1;
                                            break
                                        case "shell":
                                            results.damage.stack = results.damage.stack + 2;
                                            results.damage.crew = results.damage.crew + 3;
                                    }
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 1;
                            }
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 1;
                            results.damage.floatation = results.damage.floatation + 1;
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                            results.damage.armor = results.damage.armor + 2;
                            break
                        case "deck":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 1;
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.floatation = results.damage.floatation + 1;
                                    break
                                case "midship":
                                    switch (results.shotType) {
                                        case "solidshot":
                                            results.damage.stack = results.damage.stack + 1;
                                            break
                                        case "shell":
                                            results.damage.stack = results.damage.stack + 2;
                                            results.damage.crew = results.damage.crew + 3;
                                    }
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.floatation = results.damage.floatation + 1;
                            }
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "aftership":
                                case "stern":
                                case "foreship":
                                    results.damage.armor = results.damage.armor + 2;
                                    break
                                case "midship":
                                    switch (results.shotType) {
                                        case "solidshot":
                                            results.damage.stack = results.damage.stack + 1;
                                            break
                                        case "shell":
                                            results.damage.stack = results.damage.stack + 2;
                                            results.damage.crew = results.damage.crew + 3;
                                    }
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                    results.damage.armor = results.damage.armor + 2;
                                    break
                                case "midship":
                                    switch (results.shotType) {
                                        case "solidshot":
                                            results.damage.stack = results.damage.stack + 1;
                                            break
                                        case "shell":
                                            results.damage.stack = results.damage.stack + 2;
                                            results.damage.crew = results.damage.crew + 3;
                                    }
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.armor = results.damage.armor + 2;
                            }
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 1;
                            results.damage.hull = results.damage.hull + 1;
                    }
            }
            break

        case 5:
            switch(ship.vesselType) {
                case "ArmoredFrigate":
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            switch (results.shotType) {
                                case "solidshot":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 1;
                                    results.damage.crew = results.damage.crew + 2;
                                    break
                                case "shell":
                                    results.damage.armor = results.damage.armor + 1;
                                    results.damage.crew = results.damage.crew + 2;
                                    let fireStartRoll = rolld6();
                                    if (fireStartRoll < 3) {
                                        results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                        results.damage.specialHit.message = "Level 1 fire starts";
                                    }
                            }
                            break
                        case "waterline":
                            results.damage.floatation = results.damage.floatation + 1;
                    }
                    break
                case "Monitor":
                case "Casemate":
                    results.damage.hull = results.damage.hull + 1;
                    
            }
            break

        case 6:
            switch(ship.vesselType) {
                case "ArmoredFrigate":
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            switch (results.shotType) {
                                case "solidshot":
                                    results.damage.armor = results.damage.armor + 1;
                                    results.damage.hull = results.damage.hull + 1;
                                    results.damage.crew = results.damage.crew + 1;
                                    break
                                case "shell":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.crew = results.damage.crew + 2;
                                    let fireStartRoll = rolld6();
                                    if (fireStartRoll < 3) {
                                        results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                        results.damage.specialHit.message = "Level 1 fire starts";
                                    }
                            }
                            break
                        case "waterline":
                            results.damage.floatation = results.damage.floatation + 1;
                            results.damage.hull = results.damage.hull + 1;
                    }
                    break
                case "Monitor":
                case "Casemate":
                    results.damage.hull = results.damage.hull + 1;
            }
            break

        case 7:
            switch(ship.vesselType) {
                case "ArmoredFrigate":
                case "WoodenVessel":
                    results.damage.armor = results.damage.armor + 2;
                    results.damage.hull = results.damage.hull + 1;
                    results.damage.crew = results.damage.crew + 1;
                    break
                case "Monitor":
                case "Casemate":
                    results.damage.armor = results.damage.armor + 2;
                    results.damage.crew = results.damage.crew + 1;
            }
            break

        case 8:
            switch(ship.vesselType) {
                case "ArmoredFrigate":
                case "WoodenVessel":
                    results.damage.armor = results.damage.armor + 1;
                    results.damage.hull = results.damage.hull + 1;
                    break
                case "Monitor":
                case "Casemate":
                    results.damage.armor = results.damage.armor + 1;
                    results.damage.crew = results.damage.crew + 1;
                    break
                case "ArmoredFrigate":
                    results.damage.armor = results.damage.armor + 1;
                    results.damage.hull = results.damage.hull + 1;
            }
            break

        case 9:
            switch(ship.vesselType) {
                case "ArmoredFrigate":
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            results.damage.hull = results.damage.hull + 2;
                            break
                        case "waterline":
                            results.damage.hull = results.damage.hull + 1;
                            results.damage.floatation = results.damage.floatation + 1;
                    }
                    break
                case "Monitor":
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                        case "casemate":
                        case "deck":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 1;
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.floatation = results.damage.floatation + 1;
                    }
            }
            break

        case 10:
            switch(ship.vesselType) {
                case "ArmoredFrigate":
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            switch (results.shotType) {
                                case "solidshot":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.crew = results.damage.crew + 2;
                                    break
                                case "shell":
                                    results.damage.armor = results.damage.armor + 1;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.crew = results.damage.crew + 3;
                                    results.damage.fires.push({level: 1, started: results.turn, magazineFire: false  });
                                    results.damage.specialHit.message = "Level 1 fire starts";
                            }
                            break
                        case "waterline":
                            results.damage.floatation = results.damage.floatation + 2;
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                        case "deck":
                            results.damage.armor = results.damage.armor + 3;
                            results.damage.hull = results.damage.hull + 1;
                            results.damage.crew = results.damage.crew + 1;
                            break
                        case "waterline":
                            
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                        case "deck":
                            results.damage.armor = results.damage.armor + 3;
                            results.damage.hull = results.damage.hull + 1;
                            results.damage.crew = results.damage.crew + 1;
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 1;
                            results.damage.floatation = results.damage.floatation + 2;
                    }
            }
            break

        case 11:
            switch(ship.vesselType) {
                case "ArmoredFrigate":
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.crew = results.damage.crew + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    let rudderJamRoll = rolld6();
                                    switch (rudderJamRoll) {
                                        case 1:
                                        case 2:
                                            results.damage.specialHit.message = "Rudder jammed left 3 turns. Maximum available speed is halved while rudder is jammed";
                                            break
                                        case 3:
                                        case 4:
                                            results.damage.specialHit.message = "Rudder jammed right 3 turns.  Maximum available speed is halved while rudder is jammed";
                                            break
                                        case 5:
                                        case 6:
                                            results.damage.specialHit.message = "Rudder jammed straight ahead 3 turns.  Maximum available speed is halved while rudder is jammed";
                                    } 
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                case "aftership":
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.crew = results.damage.crew + 2;
                            }
                            break
                        case "waterline":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                case "midship":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 2;
                                    results.damage.floatation = results.damage.floatation + 2;
                                    break
                                case "aftership":
                                case "stern":
                                    let rudderJamRoll = rolld6();
                                    switch (rudderJamRoll) {
                                        case 1:
                                        case 2:
                                            results.damage.specialHit.message = "Rudder jammed left 3 turns. Maximum available speed is halved while rudder is jammed";
                                            break
                                        case 3:
                                        case 4:
                                            results.damage.specialHit.message = "Rudder jammed right 3 turns.  Maximum available speed is halved while rudder is jammed";
                                            break
                                        case 5:
                                        case 6:
                                            results.damage.specialHit.message = "Rudder jammed straight ahead 3 turns.  Maximum available speed is halved while rudder is jammed";
                                    } 
                            }
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                            results.damage.specialHit.message = "Pilot house hit. Vessel remains on present heading 3 turns. Maximum speed it halved during these turns.";
                            results.damage.armor = results.damage.armor + 2;
                            break
                        case "turretZ":
                            results.damage.armor = results.damage.armor + 3;
                            break
                        case "deck":
                            // there don't seem to be any results of this section on a monitor
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.floatation = results.damage.floatation + 2;
                            results.damage.hull = results.damage.hull + 1;
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                            switch(results.sectionOfHit) {
                                case "bow":
                                case "foreship":
                                    results.damage.specialHit.message = "Pilot house hit. Vessel remains on present heading 3 turns. Maximum speed it halved during these turns.";
                                    results.damage.armor = results.damage.armor + 2;
                                    break
                                case "midship":
                                case "aftership":
                                case "stern":
                                    results.damage.armor = results.damage.armor + 3;
                                    results.damage.hull = results.damage.hull + 1;
                            }
                            break
                        case "deck":
                            switch(results.sectionOfHit) {
                                case "bow":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 1;
                                    break
                                case "foreship":
                                    results.damage.specialHit.message = "Pilot house hit. Vessel remains on present heading 3 turns. Maximum speed it halved during these turns.";
                                    results.damage.armor = results.damage.armor + 2;
                                    break
                                case "midship":
                                    results.damage.stack = results.damage.stack + 1;
                                    break
                                case "aftership":
                                case "stern":
                                    results.damage.armor = results.damage.armor + 2;
                                    results.damage.hull = results.damage.hull + 1;
                            }
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.floatation = results.damage.floatation + 2;
                    }
            }
            break

        case 12:
            switch(ship.vesselType) {
                case "ArmoredFrigate":
                case "WoodenVessel":
                    switch (results.positionOfHit) {
                        case "hullArmor":
                        case "deck":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.crew = results.damage.crew + 4;
                            results.damage.specialHit.message = "2 adjacent guns destroyed in section hit.";
                            results.damage.specialHit.gunDestroyed = 2;
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 2;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.floatation = results.damage.floatation + 3;
                    }
                    break
                case "Monitor":
                    switch (results.positionOfHit) {
                        case "turretA":
                        case "turretZ":
                            switch(results.sectionOfHit) {
                                case "foreship":
                                    results.damage.specialHit.message = "Gun port shudder jammed shut in section hit. Gun cannot fire out of that port until shudder is freed. Gun is freed on a 1 or 2 and may fire in the turn it is freed.";
                                    break
                                case "left midship":
                                case "right midship":
                                case "aftership":
                                    let turretJamRoll = rolld6();
                                    switch (turretJamRoll) {
                                        case 1:
                                            results.damage.specialHit.message = "turret jammed 4 turns directly ahead.";
                                            break;
                                        case 2:
                                            results.damage.specialHit.message = "turret jammed 4 turns right ahead.";
                                            break;
                                        case 3:
                                            results.damage.specialHit.message = "turret jammed 4 turns right astern.";
                                            break;
                                        case 4:
                                            results.damage.specialHit.message = "turret jammed 4 turns directly astern.";
                                            break;
                                        case 5:
                                            results.damage.specialHit.message = "turret jammed 4 turns left astern.";
                                            break;
                                        case 6:
                                            results.damage.specialHit.message = "turret jammed 4 turns left ahead.";

                                    }     
                            }
                            break
                        case "deck":
                            results.damage.armor = results.damage.armor + 4;
                            results.damage.hull = results.damage.hull + 3;
                            results.damage.crew = results.damage.crew + 2;
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 3;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.crew = results.damage.crew + 2;
                            results.damage.floatation = results.damage.floatation + 3;
                    }
                    break
                case "Casemate":
                    switch (results.positionOfHit) {
                        case "casemate":
                            results.damage.specialHit.message = "Gun port shudder jammed shut in section hit. Gun cannot fire out of that port until shudder is freed. Gun is freed on a 1 or 2 and may fire in the turn it is freed.";
                            break
                        case "deck":
                            results.damage.armor = results.damage.armor + 4;
                            results.damage.hull = results.damage.hull + 3;
                            results.damage.crew = results.damage.crew + 2;
                            break
                        case "waterline":
                            results.damage.armor = results.damage.armor + 3;
                            results.damage.hull = results.damage.hull + 2;
                            results.damage.crew = results.damage.crew + 2;
                            results.damage.floatation = results.damage.floatation + 3;
                    }
                
            }
    }
    
    return results;
};

module.exports = specialHitResolver;