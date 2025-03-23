import { Color, MeshBasicMaterial, TextureLoader } from "three";
import { vec3 } from "../Utils/vec";
import { EDirV3 } from "../Utils/utils";

export const EDirection = {
    Forward : 0,
    Right   : 1,
    Back    : 2,
    Left    : 3,
    Up      : 4,
    Down    : 5
}

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
        [1,1,1],
        [
            texLoader.load("../Assets/Textures/dirt.webp"),  // Forward
            texLoader.load("../Assets/Textures/dirt.webp"),  // Right
            texLoader.load("../Assets/Textures/dirt.webp"),  // Backward
            texLoader.load("../Assets/Textures/dirt.webp"),  // Left
            texLoader.load("../Assets/Textures/grass.webp"), // Upward
            texLoader.load("../Assets/Textures/dirt.webp")   // Downward
        ]
    ],
    [ // Dirt
        false, // Transparent?
        0, // Opacity
        [1,1,1],
        [
            texLoader.load("../Assets/Textures/dirt.webp"),  // Forward
            texLoader.load("../Assets/Textures/dirt.webp"),  // Right
            texLoader.load("../Assets/Textures/dirt.webp"),  // Backward
            texLoader.load("../Assets/Textures/dirt.webp"),  // Left
            texLoader.load("../Assets/Textures/dirt.webp"),  // Upward
            texLoader.load("../Assets/Textures/dirt.webp")   // Downward
        ]
    ],
    [ // Water
        true, // Transparent?
        0.7, // Opacity
        [0.737,0.941,0.976],
        [
            texLoader.load("../Assets/Textures/water.webp"),  // Forward
            texLoader.load("../Assets/Textures/water.webp"),  // Right
            texLoader.load("../Assets/Textures/water.webp"),  // Backward
            texLoader.load("../Assets/Textures/water.webp"),  // Left
            texLoader.load("../Assets/Textures/water.webp"),  // Upward
            texLoader.load("../Assets/Textures/water.webp")   // Downward
        ]
    ]
];

export const mats = [];

for (let i = 0; i < EDirV3.length; i++)
{
    const brightness = EDirV3[i].dot(LightDir)/4+0.75;

    for (let j = 0; j < Textures.length; j++)
    {
        const index = j*EDirV3.length+i;
        mats[index] = new MeshBasicMaterial({color: new Color(brightness*Textures[j][2][0], brightness*Textures[j][2][1], brightness*Textures[j][2][2]), map: Textures[j][3][i], transparent: Textures[j][0], opacity: Textures[j][1]});
    }
}