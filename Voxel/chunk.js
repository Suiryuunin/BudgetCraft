import * as THREE from 'three';

const BLOCK = {
    "Null"  : 0,
    "Air"   : 1,
    "Grass" : 2,
    "Dirt"  : 3,
    "Stone" : 4
}

export default class Chunk
{
    constructor(Position = new THREE.Vector2(0,0), ChunkSize = 16)
    {
        this.BlockVertexMap = new Float32Array([
            1, 1, 1,
            1, 0, 1,
            1, 0, 0,
            1, 1, 0,
            0, 0, 1,
            0, 1, 1,
            0, 1, 0,
            0, 0, 0
        ]);

        this.BlockTriangleData = [
            0,1,2,3, // Forward
            5,0,3,6, // Right
            4,5,6,7, // Back
            1,4,7,2, // Left
            5,4,1,0, // Up
            3,2,7,6  // Down
        ];

        this.VertexData = [];
        this.TriangleData = [];
        this.Blocks = [];

        this.ChunkSize = ChunkSize;
        this.Position = Position;
    }

    GenerateBlocks()
    {
        
    }
    GenerateMesh()
    {

    }

    CreateFace()
    {
        
    }

    GetBlockIndex(x,y,z)
    {
        return z * this.ChunkSize * this.ChunkSize + y * this.ChunkSize + x;
    }
}