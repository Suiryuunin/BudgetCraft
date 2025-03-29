import { Vector3 } from "three";
import { vec3 } from "../Utils/vec";
import { EBlock } from "./enums";

export function GenerateTreeAt(Position, callback)
{
    callback(EBlock.Dirt, Position);
    callback(EBlock.Dirt, Position.add(new Vector3(0,1,0)));
    callback(EBlock.Dirt, Position.add(new Vector3(0,1,0)));

    for (let x = -2; x <= 2; x++) { for (let z = -2; z <= 2; z++) {
        if (!(x==0 && z==0))
            callback(EBlock.Sand, Position.clone().add(new Vector3(x,0,z)));
    }}
    callback(EBlock.Dirt, Position.add(new Vector3(0,1,0)));
    
    ;
    for (let x = -2; x <= 0; x++) {for (let z = -2; z <= 2; z++) {
        if (!(x==0 && z==0) && (Math.abs(x)+Math.abs(z) != 4))
        {
            const pos = Position.clone().add(new Vector3(x,0,z));
            callback(EBlock.Sand, pos);
        }
    }}
    callback(EBlock.Dirt, Position.add(new Vector3(0,1,0)));

    for (let x = -1; x <= 1; x++) { for (let z = -1; z <= 1; z++) {
        if (!(x==0 && z==0))
            callback(EBlock.Sand, Position.clone().add(new Vector3(x,0,z)));
    }}
    callback(EBlock.Sand, Position.add(new Vector3(0,1,0)));

    for (let x = -1; x <= 1; x++) { for (let z = -1; z <= 1; z++) {
        if (!(x==0 && z==0) && (Math.abs(x)+Math.abs(z) != 2))
            callback(EBlock.Sand, Position.clone().add(new Vector3(x,0,z)));
    }}
}