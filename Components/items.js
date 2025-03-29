import { EBlock } from "../Voxel/enums";

let DirtImg = new Image(64, 64);
DirtImg.src = "../Assets/Textures/Material/dirt.png";
let SandImg = new Image(64, 64);
SandImg.src = "../Assets/Textures/Material/sand.png";
let StoneImg = new Image(64, 64);
StoneImg.src = "../Assets/Textures/Material/stone.png";

export const EItem =
{
    Null: {
        Name: "Null",
        Placeable: false
    },
    Dirt: {
        Name: "Dirt",
        Placeable: true,
        Img: DirtImg,
        Count: 1
    },
    Sand: {
        Name: "Sand",
        Placeable: true,
        Img: SandImg,
        Count: 1
    },
    Stone: {
        Name: "Stone",
        Placeable: true,
        Img: StoneImg,
        Count: 1
    }
};

DirtImg = undefined;SandImg = undefined;StoneImg = undefined;