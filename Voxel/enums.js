import { Color, MeshBasicMaterial, TextureLoader } from "three";
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
        Name: "Air",
        Full: false,
        Visible: false,
        Collide: false,
        Fluid: false
    },
    Grass: {
        Name: "Grass",
        Full: true,
        Visible: true,
        Collide: true,
        Fluid: false
    },
    Dirt: {
        Name: "Dirt",
        Full: true,
        Visible: true,
        Collide: true,
        Fluid: false
    },
    Water: {
        Name: "Water",
        Full: false,
        Visible: true,
        Collide: true,
        Fluid: true
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

export const LightDir = new vec3(0.6,0.8,0.5);

const texLoader = new TextureLoader();

export const TextureIndex = {
    Grass: 0,
    Dirt: 1,
    Water: 2
}

export const Textures = [
    [ // Grass
        false, // Transparent?
        0, // Opacity
        texLoader.load("../Assets/Textures/dirt.webp"),  // Forward
        texLoader.load("../Assets/Textures/dirt.webp"),  // Right
        texLoader.load("../Assets/Textures/dirt.webp"),  // Backward
        texLoader.load("../Assets/Textures/dirt.webp"),  // Left
        texLoader.load("../Assets/Textures/grass.webp"), // Upward
        texLoader.load("../Assets/Textures/dirt.webp")   // Downward
    ],
    [ // Dirt
        false, // Transparent?
        0, // Opacity
        texLoader.load("../Assets/Textures/dirt.webp"),  // Forward
        texLoader.load("../Assets/Textures/dirt.webp"),  // Right
        texLoader.load("../Assets/Textures/dirt.webp"),  // Backward
        texLoader.load("../Assets/Textures/dirt.webp"),  // Left
        texLoader.load("../Assets/Textures/dirt.webp"),  // Upward
        texLoader.load("../Assets/Textures/dirt.webp")   // Downward
    ],
    [ // Water
        true, // Transparent?
        0.7, // Opacity
        texLoader.load("../Assets/Textures/dirt.webp"),  // Forward
        texLoader.load("../Assets/Textures/dirt.webp"),  // Right
        texLoader.load("../Assets/Textures/dirt.webp"),  // Backward
        texLoader.load("../Assets/Textures/dirt.webp"),  // Left
        texLoader.load("../Assets/Textures/dirt.webp"),  // Upward
        texLoader.load("../Assets/Textures/dirt.webp")   // Downward
    ]
];

export const mats = [];

for (let i = 0; i < EDirV3.length; i++)
{
    const brightness = EDirV3[i].dot(LightDir)/4+0.75;

    for (let j = 0; j < Textures.length; j++)
    {
        const index = j*EDirV3.length+i;
        mats[index] = new MeshBasicMaterial({color: new Color(brightness, brightness, brightness), map: Textures[j][i+2], transparent: Textures[j][0], opacity: Textures[j][1]});
    }
}