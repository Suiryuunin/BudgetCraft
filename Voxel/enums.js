import { Color, DoubleSide, MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, TextureLoader, Vector2 } from "three";
import { vec3 } from "../Utils/vec";
import { EDirV3 } from "../Utils/utils";
import { EItem } from "../Components/items";

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
        Item: null,
        Full: false,
        Visible: false,
        Collide: false,
        Fluid: false,
        UVScale: 1
    },
    Grass: {
        Name: "Grass",
        Item: EItem.Dirt,
        Full: true,
        Visible: true,
        Collide: true,
        Fluid: false,
        UVScale: 1
    },
    Dirt: {
        Name: "Dirt",
        Item: EItem.Dirt,
        Full: true,
        Visible: true,
        Collide: true,
        Fluid: false,
        UVScale: 1
    },
    Sand: {
        Name: "Sand",
        Item: EItem.Sand,
        Full: true,
        Visible: true,
        Collide: true,
        Fluid: false,
        UVScale: 1
    },
    Water: {
        Name: "Water",
        Item: null,
        Full: false,
        Visible: true,
        Collide: true,
        Fluid: true,
        UVScale: 0.4
    }
};

export const LightDir = new vec3(0.6,0.8,0.5);

const texLoader = new TextureLoader();

export const TextureIndex = {
    Grass: 0,
    Dirt: 1,
    Sand: 2,
    Water: 3
}

export const Textures = [
    [ // Grass
        false, // Transparent?
        0, // Opacity
        [1,1,1],
        [
            texLoader.load("../Assets/Textures/Material/grassfront.png"),  // Forward
            texLoader.load("../Assets/Textures/Material/grassright.png"),  // Right
            texLoader.load("../Assets/Textures/Material/grassback.png"),  // Backward
            texLoader.load("../Assets/Textures/Material/grassleft.png"),  // Left
            texLoader.load("../Assets/Textures/Material/grass.png"), // Upward
            texLoader.load("../Assets/Textures/Material/dirt.png")   // Downward
        ]
    ],
    [ // Dirt
        false, // Transparent?
        0, // Opacity
        [1,1,1],
        [
            texLoader.load("../Assets/Textures/Material/dirt.png"),  // Forward
            texLoader.load("../Assets/Textures/Material/dirt.png"),  // Right
            texLoader.load("../Assets/Textures/Material/dirt.png"),  // Backward
            texLoader.load("../Assets/Textures/Material/dirt.png"),  // Left
            texLoader.load("../Assets/Textures/Material/dirt.png"),  // Upward
            texLoader.load("../Assets/Textures/Material/dirt.png")   // Downward
        ]
    ],
    [ // Sand
        false, // Transparent?
        0, // Opacity
        [1,1,1],
        [
            texLoader.load("../Assets/Textures/Material/sand.png"),  // Forward
            texLoader.load("../Assets/Textures/Material/sand.png"),  // Right
            texLoader.load("../Assets/Textures/Material/sand.png"),  // Backward
            texLoader.load("../Assets/Textures/Material/sand.png"),  // Left
            texLoader.load("../Assets/Textures/Material/sand.png"),  // Upward
            texLoader.load("../Assets/Textures/Material/sand.png")   // Downward
        ]
    ],
    [ // Water
        true, // Transparent?
        0.7, // Opacity
        [0.737,0.941,0.976],
        [
            texLoader.load("../Assets/Textures/Material/water.png"),  // Forward
            texLoader.load("../Assets/Textures/Material/water.png"),  // Right
            texLoader.load("../Assets/Textures/Material/water.png"),  // Backward
            texLoader.load("../Assets/Textures/Material/water.png"),  // Left
            texLoader.load("../Assets/Textures/Material/water.png"),  // Upward
            texLoader.load("../Assets/Textures/Material/water.png")   // Downward
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