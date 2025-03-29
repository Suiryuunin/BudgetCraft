import { BufferAttribute, BufferGeometry, Color, Mesh, MeshBasicMaterial, MeshStandardMaterial, Scene } from "three";
import { Clamp } from "../Utils/customMath.js";
import { vec2, vec3 } from "../Utils/vec.js";
import { EBlock, EDirection, LightDir, mats, TextureIndex, Textures } from "./enums.js";
import { EDirArr, EDirV3, EUnitV3 } from "../Utils/utils.js"
import { FractalBrownianMotion2D, StandardPerlin2D } from "./PerlinNoise.js";

export default class Chunk
{
    constructor(ChunkBase, Position = new vec2(0,0), Index = new vec2(0,0), ChunkSize = 16, ChunkHeight = 16, BlockSize = 1)
    {
        this.ChunkBase = ChunkBase;
        this.active = false;

        this.pos = new vec3(Position.x, 0, Position.y);
        this.pos2 = Position;

        this.Index = Index;

        this.WaterLevel = 8;

        this.BlockVertexData = [
            new vec3(1, 1, 1),
            new vec3(1, 1, 0),
            new vec3(1, 0, 0),
            new vec3(1, 0, 1),
            new vec3(0, 1, 0),
            new vec3(0, 1, 1),
            new vec3(0, 0, 1),
            new vec3(0, 0, 0)
        ];

        this.BlockTriangleData = [
            0,1,2,3, // Forward
            5,0,3,6, // Right
            4,5,6,7, // Back
            1,4,7,2, // Left
            5,4,1,0, // Up
            3,2,7,6  // Down
        ];

        this.VertexData = [];
        this.NormalData = [];
        this.UVData = [];
        this.TriangleData = [];


        this.ChunkSize = ChunkSize;
        this.invChunkSize = 1/ChunkSize;
        this.ChunkHeight = ChunkHeight;
        this.BlockSize = BlockSize;

        this.Blocks = [];
        
	    for (let i = 0; i < 8; i++)
        {
            this.BlockVertexData[i] = (this.BlockVertexData[i].mult(this.BlockSize)).add(this.pos);
        }

        this.VertexCount = 0;
        this.TriVertexCount = 0;

        //Noise
        this.Amplitude = ChunkHeight;

        // this.mats = [];
        this.mesh = 0;
        this.groups = [];
    }

    Init(scene)
    {
        this.active = true;
        this.GenerateBlocks();
        this.GenerateMesh();
        this.ApplyMesh(scene);
        this.clearData();
    }
    ReMesh(scene)
    {
        scene.remove(this.mesh);
        this.active = true;
        this.mesh=undefined;
        this.GenerateMesh();
        this.ApplyMesh(scene);
        this.clearData();
    }
    OverwriteBlockAt(BlockType, Position)
    {
        this.Blocks[this.GetBlockIndex(Position.x, Position.y, Position.z)] = BlockType;
    }

    GenerateBlocks()
    {
        for (let x = 0; x < this.ChunkSize; x++)
        {
            for (let z = 0; z < this.ChunkSize; z++)
            {
                const X = (x*this.BlockSize + this.pos.x)*0.01;
                const Z = (z*this.BlockSize + this.pos.z)*0.01;

                let noiseValue = (FractalBrownianMotion2D(X, Z, 8))+0.5;
                let perlin = StandardPerlin2D(X,Z);
                if (perlin < 0) perlin *= 0.5;
                perlin = (perlin+0.5)*0.5;

                if (noiseValue < 0)
                    noiseValue *= perlin * 0.05 * this.Amplitude;
                else
                {
                    noiseValue *= (perlin * this.Amplitude);
                }

                const Height = Clamp(Math.round(noiseValue), 1, this.ChunkHeight);

                for (let y = 0; y < Height-1; y++)
                {
                    this.Blocks[this.GetBlockIndex(x,y,z)] = EBlock.Dirt;
                }
                if (Height <= this.WaterLevel)
                    for (let i = 0; i <= 3; i++)
                    this.Blocks[this.GetBlockIndex(x,Height-i,z)] = EBlock.Sand;
                else this.Blocks[this.GetBlockIndex(x,Height-1,z)] = EBlock.Grass;
                
                for (let y = Height; y < this.WaterLevel; y++)
                {
                    this.Blocks[this.GetBlockIndex(x,y,z)] = EBlock.Water;
                }
                for (let y = Math.max(Height, this.WaterLevel); y < this.ChunkHeight; y++)
                {
                    this.Blocks[this.GetBlockIndex(x,y,z)] = EBlock.Air;
                }
                //for (let z = 0; z < rand() % Height; z++)
                //{
                //	Blocks[GetBlockIndex(x,y,z)] = EBlock.Air;
                //}
            }
        }
    }

    GenerateMeshAt(x, y, z)
    {
        const Block = this.Blocks[this.GetBlockIndex(x, y, z)];
        if (Block.Visible)
        {
            const Position = new vec3(x, y, z);

            for (const Direction of [EDirection.Forward, EDirection.Right, EDirection.Back, EDirection.Left, EDirection.Up, EDirection.Down])
            {
                const NeighborBlock = this.GetBlockInDirection(Direction, Position);
                if (NeighborBlock == null)
                {
                    if (Block.Full)
                        this.CreateFace(Direction, Position, Block.UVScale, 0);
                }
                else if (((Block.Name != NeighborBlock.Name)) && this.Check(NeighborBlock))
                {
                    let offset = 0;
                    if (Block.Fluid && Direction == EDirection.Up) offset = -0.0625;

                    this.CreateFace(Direction, Position, Block.UVScale, offset);
                }
            }
        }
    };
    GenerateMesh()
    {
        for (let x = 0; x < this.ChunkSize; x++)
            for (let y = 0; y < this.ChunkHeight; y++)
                for (let z = 0; z < this.ChunkSize; z++)
                    this.GenerateMeshAt(x,y,z);
    }

    ApplyMesh(scene)
    {
        const geometry = new BufferGeometry();

        geometry.setAttribute("position", new BufferAttribute(new Float32Array(this.VertexData), 3));
        geometry.setAttribute("normal", new BufferAttribute(new Float32Array(this.NormalData), 3));
        geometry.setAttribute("uv", new BufferAttribute(new Float32Array(this.UVData), 2));

        geometry.setIndex(this.TriangleData);

        geometry.clearGroups();
        for (const group of this.groups)
        {
            geometry.addGroup(group[0], group[1], group[2]);
        }
        
        this.mesh = new Mesh(geometry, mats);

        scene.add(this.mesh);
    };

    clearData()
    {
        this.VertexData = [];
        this.NormalData = [];
        this.UVData = [];
        this.TriangleData = [];
        this.groups = [];
        this.TriVertexCount = 0;
        this.VertexCount = 0;
    }

    addMat(Direction, Position)
    {
        this.groups.push([this.TriVertexCount, 6, Direction + TextureIndex[this.Blocks[this.GetBlockIndex(Position.x, Position.y, Position.z)].Name]*6]);
        this.TriVertexCount += 6;
    }

    CreateFace(Direction, Position, UVScale = 1, offset = 0)
    {
        this.VertexData.push(...this.GetFaceVertices(Direction, Position, offset));
        this.NormalData.push(...EDirArr[Direction],...EDirArr[Direction],...EDirArr[Direction],...EDirArr[Direction]);

        let pos = 0;

        switch (Direction)
        {
        case EDirection.Forward: case EDirection.Back: pos = new vec2(Position.z,Position.y);break;
        case EDirection.Up: case EDirection.Down: pos = new vec2(Position.z,Position.x);break;
        case EDirection.Left: case EDirection.Right: pos = new vec2(Position.x,Position.y);break;
        }

        this.UVData.push(
            0, UVScale,
            UVScale, UVScale,
            UVScale, 0,
            0, 0);
        this.TriangleData.push(this.VertexCount+3, this.VertexCount+2, this.VertexCount, this.VertexCount+2, this.VertexCount+1, this.VertexCount);

        this.addMat(Direction, Position);

        this.VertexCount += 4;
    }

    Check(Block)
    {
        if (Block == null) return true;

        return !Block.Full;
    }

    GetFaceVertices(Direction, Position = new vec3(0,0,0), offset = 0)
    {
        let Vertices = [];

        for (let i = 0; i < 4; i++)
        {
            Vertices.push(...(this.BlockVertexData[this.BlockTriangleData[Math.floor(i + Direction * 4)]].add(Position.mult(this.BlockSize)).add(EDirV3[Direction].mult(offset)).array()));
        }
        return Vertices;
    }

    GetPositionInDirection(Direction, Position)
    {
        switch (Direction)
        {
        case EDirection.Forward : return Position.add(EUnitV3.ForwardVector );
        case EDirection.Right	: return Position.add(EUnitV3.RightVector   );
        case EDirection.Back	: return Position.add(EUnitV3.BackwardVector);
        case EDirection.Left	: return Position.add(EUnitV3.LeftVector    );
        case EDirection.Up 	    : return Position.add(EUnitV3.UpwardVector  );
        case EDirection.Down	: return Position.add(EUnitV3.DownwardVector);
        default: console.error("invalid direction");
        }
    }
    GetBlockInDirection(Direction, Position)
    {
        const NPos = this.GetPositionInDirection(Direction, Position);
        
        if (NPos.x >= this.ChunkSize || NPos.y >= this.ChunkHeight || NPos.z >= this.ChunkSize || NPos.x < 0 || NPos.y < 0 || NPos.z < 0) return null;
        return this.Blocks[this.GetBlockIndex(NPos.x, NPos.y, NPos.z)];
    }

    GetBlockIndex(x,y,z)
    {
        return y * this.ChunkHeight * this.ChunkSize + z * this.ChunkSize + x;
    }
}