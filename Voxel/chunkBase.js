import { Camera, Scene, Vector3 } from "three";
import { vec2, vec3 } from "../Utils/vec";
import Chunk from "./chunk";

"use strict";

export default class ChunkBase {
    constructor(camera = new Camera(), scene = new Scene())
    {
        this.XI = {min:0,max:0};
        this.YI = {min:0,max:0};

        this.ChunkSize = 16;
        this.BlockSize = 1;
        this.recBlockSize = 1/this.BlockSize;
        this.recChunkSize = 1/this.ChunkSize;
        this.ChunkHeight = 128;
        this.Chunks = {};

        this.camera = camera;
        this.scene = scene;

        this.renderDistance = 1;
    }

    Init()
    {
        for (let x = -this.renderDistance; x <= this.renderDistance; x++) { for (let y = -this.renderDistance; y <= this.renderDistance; y++)
        {
            const X = Math.floor(x + Math.floor(this.camera.position.x*this.recChunkSize/this.BlockSize));
            const Y = Math.floor(y + Math.floor(this.camera.position.z*this.recChunkSize/this.BlockSize));
            
            
            if (this.Chunks[X] == undefined)
                this.Chunks[X] = {};

            if (X < this.XI.min) this.XI.min = X;
            if (X > this.XI.max) this.XI.max = X;
            if (Y < this.YI.min) this.YI.min = Y;
            if (Y > this.YI.max) this.YI.max = Y;

            if (this.Chunks[X][Y] == undefined)
            {
                this.Chunks[X][Y] = new Chunk(this, 
                    new vec2(Math.floor((X)*this.ChunkSize*this.BlockSize), Math.floor((Y)*this.ChunkSize*this.BlockSize)), new vec2(X,Y),
                    this.ChunkSize, this.ChunkHeight, this.BlockSize
                );
                this.Chunks[X][Y].Init(this.scene);
            }
            else if (!this.Chunks[X][Y].active)
                this.scene.add(this.Chunks[X][Y].mesh);
        }}
    }

    OverwriteBlock(BlockType, Position)
    {
        const ChunkPos = new vec2(Math.floor(Position.x*this.recChunkSize), Math.floor(Position.z*this.recChunkSize));
        const LocalPos = new vec3(
            Math.floor(Position.x-ChunkPos.x*this.ChunkSize),
            Math.floor(Position.y),
            Math.floor(Position.z-ChunkPos.y*this.ChunkSize));

        const chunk = this.Chunks[ChunkPos.x][ChunkPos.y];

        chunk.OverwriteBlockAt(BlockType, LocalPos);
        chunk.ReMesh(this.scene);
    }
    OverwriteBlockAt(BlockType, chunkPos, blockPos)
    {
        const chunk = this.Chunks[chunkPos.x][chunkPos.z];

        chunk.OverwriteBlockAt(BlockType, blockPos);
        chunk.ReMesh(this.scene);
    }

    Update()
    {
        const pos = new vec2(this.camera.position.x, this.camera.position.z);
        const cullAxis = this.renderDistance*this.ChunkSize;
        const cullDistance = Math.sqrt(2)*cullAxis;

        for (let x = this.XI.min; x <= this.XI.max; x++)
        {
            if (this.Chunks[x] != undefined)
            for (let y = this.YI.min; y <= this.YI.max; y++)
            {
                if (this.Chunks[x][y] != undefined && this.Chunks[x][y].pos2.sub(pos.div(this.ChunkSize).floor().mult(this.ChunkSize)).mag() > cullDistance)
                {
                    this.Chunks[x][y].active = false;
                    this.scene.remove(this.Chunks[x][y].mesh);
                }
            }
        }

        for (let x = -this.renderDistance; x <= this.renderDistance; x++)
        {
            for (let y = -this.renderDistance; y <= this.renderDistance; y++)
            {
                const X = Math.floor(x + Math.floor(this.camera.position.x*this.recChunkSize/this.BlockSize));
                const Y = Math.floor(y + Math.floor(this.camera.position.z*this.recChunkSize/this.BlockSize));
                
                
                if (this.Chunks[X] == undefined)
                    this.Chunks[X] = {};

                if (X < this.XI.min) this.XI.min = X;
                if (X > this.XI.max) this.XI.max = X;
                if (Y < this.YI.min) this.YI.min = Y;
                if (Y > this.YI.max) this.YI.max = Y;

                if (this.Chunks[X][Y] == undefined)
                {
                    this.Chunks[X][Y] = new Chunk(this, 
                        new vec2(Math.floor((X)*this.ChunkSize*this.BlockSize), Math.floor((Y)*this.ChunkSize*this.BlockSize)), new vec2(X,Y),
                        this.ChunkSize, this.ChunkHeight, this.BlockSize
                    );
                    this.Chunks[X][Y].Init(this.scene);
                }
                else if (!this.Chunks[X][Y].active)
                    this.scene.add(this.Chunks[X][Y].mesh);
            }
        }
    }

    toBlockUnit(coord)
    {
        return Math.floor(coord*this.recBlockSize);
    }

    hitToBlockPos(hit, dir)
    {
        return new Vector3(
            Math.floor(hit.x+dir.x),
            Math.floor(hit.y+dir.y),
            Math.floor(hit.z+dir.z)
        );
    }

    raycast(start, dir, length)
    {
        function GetBlock(self, blockPos)
        {
            const chunkPos = blockPos.clone().multiplyScalar(self.recChunkSize).floor();
            const chunkedBlockPos = blockPos.clone().add(new vec3(-chunkPos.x*self.ChunkSize,0,-chunkPos.z*self.ChunkSize));

            if (self.Chunks[chunkPos.x] == undefined || self.Chunks[chunkPos.x][chunkPos.z] == undefined) return undefined;

            const chunk = self.Chunks[chunkPos.x][chunkPos.z];
            return {block: chunk.Blocks[chunk.GetBlockIndex(chunkedBlockPos.x, chunkedBlockPos.y, chunkedBlockPos.z)], chunkPos:chunkPos, chunkedBlockPos:chunkedBlockPos};
        }

        let hitCandidates = [];

        for (let x = (dir.x > 0 ? Math.ceil(start.x) - start.x : Math.floor(start.x) - start.x); Math.abs(x) < length*Math.abs(dir.x); x+=Math.sign(dir.x))
        {
            if (dir.x == 0) break;

            let k = x/dir.x;
            const pos = new vec3(x, dir.y*k, dir.z*k);
            const hitPos = start.clone().add(pos);
            const blockPos = this.hitToBlockPos(hitPos, new vec3(Math.sign(dir.x)*0.1,0,0));

            const Data = GetBlock(this, blockPos);
            if (Data == undefined) break;

            const block = Data.block;

            if (block == undefined) break;

            if (block.Collide && !block.Fluid)
            {
                hitCandidates.push([pos, hitPos, Data.chunkPos, Data.chunkedBlockPos, new vec3(-Math.sign(dir.x),0,0), block]);
            }
        }
        for (let y = (dir.y > 0 ? Math.ceil(start.y) - start.y : Math.floor(start.y) - start.y); Math.abs(y) < length*Math.abs(dir.y); y+=Math.sign(dir.y))
        {
            if (dir.y == 0) break;

            let k = y/dir.y;
            const pos = new vec3(dir.x*k, y, dir.z*k);
            const hitPos = start.clone().add(pos);
            const blockPos = this.hitToBlockPos(hitPos, new vec3(0,Math.sign(dir.y)*0.1,0));

            const Data = GetBlock(this, blockPos);
            if (Data == undefined) break;
            
            const block = Data.block;

            if (block == undefined) break;

            if (block.Collide && !block.Fluid)
            {
                hitCandidates.push([pos, hitPos, Data.chunkPos, Data.chunkedBlockPos, new vec3(0,-Math.sign(dir.y),0), block]);
            }
        }
        for (let z = (dir.z > 0 ? Math.ceil(start.z) - start.z : Math.floor(start.z) - start.z); Math.abs(z) < length*Math.abs(dir.z); z+=Math.sign(dir.z))
        {
            if (dir.z == 0) break;

            let k = z/dir.z;
            const pos = new vec3(dir.x*k, dir.y*k, z);
            const hitPos = start.clone().add(pos);
            const blockPos = this.hitToBlockPos(hitPos, new vec3(0,0,Math.sign(dir.z)*0.1));

            const Data = GetBlock(this, blockPos);
            if (Data == undefined) break;

            const block = Data.block;

            if (block == undefined) break;

            if (block.Collide && !block.Fluid)
            {
                hitCandidates.push([pos, hitPos, Data.chunkPos, Data.chunkedBlockPos, new vec3(0,0,-Math.sign(dir.z)), block]);
            }
        }
        
        if (hitCandidates[0] == undefined) return false;

        let closest = hitCandidates[0];
        for (let i = 1; i < hitCandidates.length; i++)
        {
            if (hitCandidates[i][0].mag() < closest[0].mag())
                closest = hitCandidates[i];
        }

        const hitData = {
            hit: closest[1],
            chunkPos: closest[2],
            blockPos: closest[3],
            direction: closest[4],
            block: closest[5]
        };

        return hitData;
    }
}