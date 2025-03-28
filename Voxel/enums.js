import { Color, DoubleSide, MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, TextureLoader, Vector2 } from "three";
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
            texLoader.load("../Assets/Textures/Pixel/grassfront.png"),  // Forward
            texLoader.load("../Assets/Textures/Pixel/grassright.png"),  // Right
            texLoader.load("../Assets/Textures/Pixel/grassback.png"),  // Backward
            texLoader.load("../Assets/Textures/Pixel/grassleft.png"),  // Left
            texLoader.load("../Assets/Textures/Pixel/grass.png"), // Upward
            texLoader.load("../Assets/Textures/Pixel/dirt.png")   // Downward
        ]
    ],
    [ // Dirt
        false, // Transparent?
        0, // Opacity
        [1,1,1],
        [
            texLoader.load("../Assets/Textures/Pixel/dirt.png"),  // Forward
            texLoader.load("../Assets/Textures/Pixel/dirt.png"),  // Right
            texLoader.load("../Assets/Textures/Pixel/dirt.png"),  // Backward
            texLoader.load("../Assets/Textures/Pixel/dirt.png"),  // Left
            texLoader.load("../Assets/Textures/Pixel/dirt.png"),  // Upward
            texLoader.load("../Assets/Textures/Pixel/dirt.png")   // Downward
        ]
    ],
    [ // Water
        true, // Transparent?
        0.7, // Opacity
        [0.737,0.941,0.976],
        [
            texLoader.load("../Assets/Textures/Pixel/water.png"),  // Forward
            texLoader.load("../Assets/Textures/Pixel/water.png"),  // Right
            texLoader.load("../Assets/Textures/Pixel/water.png"),  // Backward
            texLoader.load("../Assets/Textures/Pixel/water.png"),  // Left
            texLoader.load("../Assets/Textures/Pixel/water.png"),  // Upward
            texLoader.load("../Assets/Textures/Pixel/water.png")   // Downward
        ]
    ]
];

const waterNorm = texLoader.load("../Assets/Textures/waternormal.webp")

export const mats = [];

for (let i = 0; i < EDirV3.length; i++)
{
    let brightness = EDirV3[i].dot(LightDir)+0.4;
    if (brightness <= 0) brightness = 0.4;

    for (let j = 0; j < Textures.length; j++)
    {
        const index = j*EDirV3.length+i;
        if (Textures[j][0])
            mats[index] = new MeshPhongMaterial({color: new Color(brightness*Textures[j][2][0], brightness*Textures[j][2][1], brightness*Textures[j][2][2]), map: Textures[j][3][i], transparent: Textures[j][0], opacity: Textures[j][1], side:DoubleSide, specular:0x777777, shininess:64, normalMap:waterNorm, normalScale:new Vector2(0.5,0.5)});
        else
            mats[index] = new MeshBasicMaterial({color: new Color(brightness*Textures[j][2][0], brightness*Textures[j][2][1], brightness*Textures[j][2][2]), map: Textures[j][3][i], transparent: Textures[j][0], opacity: Textures[j][1]});
    }
}