
let Background = {
  earth_crystalcaveazure:"earth_crystalcaveazure",
  earth_crystalcaverainbow:"earth_crystalcaverainbow",
  earth_emeraldforest:"earth_emeraldforest",
  earth_gardenOfEden: "earth_gardenOfEden",
  earth_goldenGlade: "earth_goldenGlade",

  extras_autofarm: "extras_autofarm",
  extras_vietnam: "extras_vietnam",

  ocean_abysbioluminescence: "ocean_abysbioluminescence",
  ocean_beach: "ocean_beach",
  ocean_magicDeepSea: "ocean_magicDeepSea",
  ocean_natureSea: "ocean_natureSea",

  science_furnacePlain:"science_furnacePlain",
  science_lab: "science_lab",
  science_steamApparat: "science_steamApparat",

  sky_happysnowfield: "sky_happysnowfield",
  sky_nightMountain: "sky_nightMountain",
  sky_star: "sky_star",
  sky_sunsetCliffs: "sky_sunsetCliffs"

};
export const getBackground = (backgroundSrc) => {

     for (const [key, value] of Object.entries(Background)) {
         if (backgroundSrc.includes(key)) {
             return Background[key]
             //return await loadImage(path.resolve(`images/Backgrounds/${Background[key]}_1.svg`));
         }
     }
     console.error(`Background ${backgroundSrc} cannot be found.`);
};

let Shell = {
  metal_alembic: "metal_alembic",
  wood_carnivora: "wood_carnivora",
  partner_kongz: "partner_kongz",
};
export const getShell = (src) => {
    for (const [key, value] of Object.entries(Shell)) {
        if (src.includes(key)) {
            return Shell[key]
            //return await loadImage(path.resolve(`images/Shell/${Shell[key]}_1.svg`));
        }
    }
    console.error(`Shell ${src} cannot be found. Or image path for src is invalid`);
};

let Claws = {
  metal_lasergun: "metal_lasergun",
  snow_icycle: "snow_icycle",
  wood_hammerlogs: "wood_hammerlogs",
};
export const getClaws = (src) => {
    for (const [key, value] of Object.entries(Claws)) {
        if (src.includes(key)) {
            return Claws[key]
            //return await loadImage(path.resolve(`images/Claws/${Claws[key]}_1.svg`));
        }
    }
    console.error(`Claws ${src} cannot be found. Or image path for src is invalid`);
};

let Legs = {
  wood_3: "wood_3",
  snow_1: "snow_1",
};
export const getLegs = (src) => {
    for (const [key, value] of Object.entries(Legs)) {
        if (src.includes(key)) {
            return Legs[key]
            //return await loadImage(path.resolve(`images/Legs/${Legs[key]}_1.svg`));
        }
    }
    console.error(`Legs ${src} cannot be found. Or image path for src is invalid`);
};


let Body = {
    metal_golden: "metal_golden",
    wood_beastman: "wood_beastman",
    partner_kongz: "partner_kongz",
};
export const getBody = (src) => {
    for (const [key, value] of Object.entries(Body)) {
        if (src.includes(key)) {
            return Body[key]
        }
    }
    console.error(`Body ${src} cannot be found. Or image path for src is invalid`);
};

let HeadPieces = {
    crystal1: "crystal1",
    crystal2: "crystal2",
    "crystal2-1": "crystal2-1",
    "crystal2-2": "crystal2-2",
    "crystal2-3": "crystal2-3",
    "crystal3-1": "crystal3-1",
    "crystal3-2": "crystal3-2",
    "crystal3-3": "crystal3-3",
    fire1: "fire1",
    fire2: "fire2",
    fire3: "fire3",
    lotus1: "lotus1",
    lotus2: "lotus2",
    lotus3: "lotus3",
    moon1: "moon1",
    moon2: "moon2",
    moon3: "moon3",
    skull1: "skull1",
    skull2: "skull2",
    skull3: "skull3",
    starfish1: "starfish1",
    starfish2: "starfish2",
    starfish3: "starfish3",
    starfish4: "starfish4",
    sun1: "sun1",
    sun2: "sun2",
    sun3: "sun3",
  };
  export const getHeadPieces = (src) => {
      for (const [key, value] of Object.entries(HeadPieces)) {
          if (src.includes(key)) {
              return HeadPieces[key]
          }
      }
      console.error(`HeadPieces ${src} cannot be found. Or image path for src is invalid`);
  };