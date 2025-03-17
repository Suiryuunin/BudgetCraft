import { BufferAttribute, BufferGeometry, Color, Mesh, MeshBasicMaterial, MeshStandardMaterial, Scene } from "three";
import { Clamp } from "../Utils/customMath.js";
import { vec2, vec3 } from "../Utils/vec.js";
import { EBlock, EDirection, EDirV3, EUnitV3, LightDir } from "./enums.js";
import { FractalBrownianMotion2D } from "./PerlinNoise.js";

export default class Chunk
{
    constructor(Position = new vec2(0,0), ChunkSize = 16, BlockSize = 1)
    {
        this.active = false;

        this.pos = new vec3(Position.x, 0, Position.y);
        this.pos2 = new vec2(Position.x, Position.y);

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
        this.UVData = [];
        this.TriangleData = [];


        this.ChunkSize = ChunkSize;
        this.YLmit = ChunkSize;
        this.BlockSize = BlockSize;

        this.Blocks = [];
        
	    for (let i = 0; i < 8; i++)
        {
            this.BlockVertexData[i] = (this.BlockVertexData[i].mult(this.BlockSize)).add(this.pos);
        }

        this.VertexCount = 0;
        this.TriVertexCount = 0;

        //Noise
        this.Amplitude = 16;

        this.mats = [];
        this.mesh = 0;
        this.groups = [];
    }

    Init(scene)
    {
        this.active = true;
        this.GenerateBlocks();
        this.GenerateMesh();
        this.ApplyMesh(scene);
    }

    GenerateBlocks()
    {
        for (let x = 0; x < this.ChunkSize; x++)
        {
            for (let z = 0; z < this.ChunkSize; z++)
            {
                const X = (x*this.BlockSize + this.pos.x)*0.01;
                const Z = (z*this.BlockSize + this.pos.z)*0.01;

                const Height = Clamp(Math.round((FractalBrownianMotion2D(X, Z, 8)+1)*0.5 * this.Amplitude), 0, this.YLmit);
                // const Height = 10;

                for (let y = 0; y < Height; y++)
                {
                    this.Blocks[this.GetBlockIndex(x,y,z)] = EBlock.Grass;
                }
                for (let y = Height; y < this.YLmit; y++)
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
        if (this.Blocks[this.GetBlockIndex(x, y, z)] != EBlock.Air)
        {
            const Position = new vec3(x, y, z);

            for (const Direction of [EDirection.Forward, EDirection.Right, EDirection.Back, EDirection.Left, EDirection.Up, EDirection.Down])
            {
                if (this.Check(this.GetPositionInDirection(Direction, Position)))
                    this.CreateFace(Direction, Position);
            }
        }
    };
    GenerateMesh()
    {
        for (let x = 0; x < this.ChunkSize; x++)
            for (let y = 0; y < this.YLmit; y++)
                for (let z = 0; z < this.ChunkSize; z++)
                    this.GenerateMeshAt(x,y,z);
    }

    GenerateMaterials()
    {
        this.mats = [];
        for (const DirV3 of EDirV3)
        {
            const brightness = DirV3.dot(LightDir)/2+0.5;

            this.mats.push(new MeshBasicMaterial({color: new Color(brightness, brightness, brightness)}))
        }
    }

    ApplyMesh(scene)
    {
        const geometry = new BufferGeometry();

        geometry.setAttribute("position", new BufferAttribute(new Float32Array(this.VertexData), 3));
        geometry.setAttribute("uv", new BufferAttribute(new Float32Array(this.UVData), 2));

        geometry.setIndex(this.TriangleData);

        geometry.clearGroups();
        for (const group of this.groups)
        {
            geometry.addGroup(group[0], group[1], group[2]);
        }

        this.GenerateMaterials();
        
        this.mesh = new Mesh(geometry, this.mats);

        scene.add(this.mesh);
    };

    // UpdateMesh(scene)
    // {
    //     scene.remove(this.mesh);
        
    //     const geometry = new BufferGeometry();

    //     geometry.setAttribute("position", new BufferAttribute(new Float32Array(this.VertexData), 3));
    //     geometry.setAttribute("uv", new BufferAttribute(new Float32Array(this.UVData), 2));

    //     geometry.setIndex(this.TriangleData);

    //     const material = new MeshBasicMaterial({color: 0xffffff, wireframe: false});
        
    //     this.mesh = new Mesh(geometry, material);

    //     scene.add(this.mesh);
    // }

    addMat(Direction, Position)
    {
        this.groups.push([this.TriVertexCount, 6, Direction]);
        this.TriVertexCount += 6;
    }

    CreateFace(Direction, Position)
    {
        this.VertexData.push(...this.GetFaceVertices(Direction, Position));
        this.UVData.push(1,1, 1,0, 0,0, 0,1);
        this.TriangleData.push(this.VertexCount+3, this.VertexCount+2, this.VertexCount, this.VertexCount+2, this.VertexCount+1, this.VertexCount);

        this.addMat(Direction)

        this.VertexCount += 4;
    }

    Check(Position)
    {
        if (Position.x >= this.ChunkSize || Position.y >= this.YLmit || Position.z >= this.ChunkSize || Position.x < 0 || Position.y < 0 || Position.z < 0) return true;

        return !this.Blocks[this.GetBlockIndex(Position.x, Position.y, Position.z)].Solid;
    }

    GetFaceVertices(Direction, Position = new vec3(0,0,0))
    {
        let Vertices = [];

        for (let i = 0; i < 4; i++)
        {
            Vertices.push(...(this.BlockVertexData[this.BlockTriangleData[Math.floor(i + Direction * 4)]].add(Position.mult(this.BlockSize)).array()));
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

    GetBlockIndex(x,y,z)
    {
        return z * this.ChunkSize * this.ChunkSize + y * this.YLmit + x;
    }
}