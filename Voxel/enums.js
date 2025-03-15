import { vec3 } from "../Utils/vec";

export const EDirection = {
    Forward : 0,
    Right   : 1,
    Back    : 2,
    Left    : 3,
    Up      : 4,
    Down    : 5
}
export const EDirV3 =
[
    new vec3( 1 , 0 , 0 ),  // ForwardVector 
    new vec3( 0 , 0 , 1 ),  // RightVector   
    new vec3(-1 , 0 , 0 ),  // BackwardVector
    new vec3( 0 , 0 ,-1 ),  // LeftVector    
    new vec3( 0 , 1 , 0 ),  // UpwardVector  
    new vec3( 0 ,-1 , 0 )   // DownwardVector
];

export const EBlock = {
    Air: {
        Solid: false
    },
    Grass: {
        Solid: true
    }
};

export const EUnitV3 = {
    ForwardVector   : new vec3(1,0,0),
    RightVector     : new vec3(0,0,1),
    BackwardVector  : new vec3(-1,0,0),
    LeftVector      : new vec3(0,0,-1),
    UpwardVector    : new vec3(0,1,0),
    DownwardVector  : new vec3(0,-1,0)
};

export const LightDir = new vec3(0.6,0.8,0.5)