import { Camera, Scene } from "three";
import { vec2 } from "../Utils/vec";
import Chunk from "./chunk";

export default class ChunkBase {
    constructor(camera = new Camera(), scene = new Scene())
    {
        this.XI = {min:0,max:0};
        this.YI = {min:0,max:0};

        this.ChunkSize = 16;
        this.ChunkHeight = 64;
        this.Chunks = {};

        this.camera = camera;
        this.scene = scene;

        this.renderDistance = 8;
    }

    Init()
    {
        for (let x = -this.renderDistance; x <= this.renderDistance; x++)
        {            
            if (this.Chunks[x] == undefined)
                this.Chunks[x] = {};

            for (let y = -this.renderDistance; y <= this.renderDistance; y++)
            {
                if (x < this.XI.min) this.XI.min = x;
                if (x > this.XI.max) this.XI.max = x;
                if (y < this.YI.min) this.YI.min = y;
                if (y > this.YI.max) this.YI.max = y;

                this.Chunks[x][y] = new Chunk(new vec2(Math.floor((x)*this.ChunkSize), Math.floor((y)*this.ChunkSize)), this.ChunkSize, this.ChunkHeight, 1);

                this.Chunks[x][y].Init(this.scene);
            }
        }
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
                const X = Math.floor(x + Math.floor(this.camera.position.x/this.ChunkSize));
                const Y = Math.floor(y + Math.floor(this.camera.position.z/this.ChunkSize));
                
                
                if (this.Chunks[X] == undefined)
                    this.Chunks[X] = {};

                if (X < this.XI.min) this.XI.min = X;
                if (X > this.XI.max) this.XI.max = X;
                if (Y < this.YI.min) this.YI.min = Y;
                if (Y > this.YI.max) this.YI.max = Y;

                if (this.Chunks[X][Y] == undefined)
                {
                    this.Chunks[X][Y] = new Chunk(
                        new vec2(Math.floor((X)*this.ChunkSize), Math.floor((Y)*this.ChunkSize)),
                        this.ChunkSize, this.ChunkHeight, 1
                    );
                    this.Chunks[X][Y].Init(this.scene);
                }
                else if (!this.Chunks[X][Y].active)
                    this.scene.add(this.Chunks[X][Y].mesh);
            }
        }
    }
}