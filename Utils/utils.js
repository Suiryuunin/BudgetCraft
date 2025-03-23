import { Vector3 } from "three";
import { vec3 } from "./vec";

export const EUnitV3 =
{
    ForwardVector   : new vec3( 1, 0, 0),
    RightVector     : new vec3( 0, 0, 1),
    BackwardVector  : new vec3(-1, 0, 0),
    LeftVector      : new vec3( 0, 0,-1),
    UpwardVector    : new vec3( 0, 1, 0),
    DownwardVector  : new vec3( 0,-1, 0)
};

export const EDirV3 =
[
    new vec3( 1 , 0 , 0 ),  // ForwardVector 
    new vec3( 0 , 0 , 1 ),  // RightVector   
    new vec3(-1 , 0 , 0 ),  // BackwardVector
    new vec3( 0 , 0 ,-1 ),  // LeftVector    
    new vec3( 0 , 1 , 0 ),  // UpwardVector  
    new vec3( 0 ,-1 , 0 )   // DownwardVector
];

export const ThreeUnitV3 =
{
    ForwardVector   : new Vector3( 1, 0, 0),
    RightVector     : new Vector3( 0, 0, 1),
    BackwardVector  : new Vector3(-1, 0, 0),
    LeftVector      : new Vector3( 0, 0,-1),
    UpwardVector    : new Vector3( 0, 1, 0),
    DownwardVector  : new Vector3( 0,-1, 0)
};

export const ThreeAxis =
{
    X: new Vector3(1,0,0),
    Y: new Vector3(0,1,0),
    Z: new Vector3(0,0,1)
};