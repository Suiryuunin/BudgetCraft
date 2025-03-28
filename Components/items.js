import { EBlock } from "../Voxel/enums";

export const EItem =
{
    Null: {
        BlockType: false,
        Placeable: false
    },
    Dirt: {
        BlockType: EBlock.Dirt,
        Placeable: true
    },
    Stone: {
        BlockType: EBlock.Stone,
        Placeable: true
    }
}