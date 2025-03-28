import { Camera, Vector3 } from "three";
import { EUnitV3, ThreeAxis, ThreeUnitV3 } from "../Utils/utils";
import { vec2, vec3 } from "../Utils/vec";
import ChunkBase from "../Voxel/chunkBase";
import { Clamp, V2Mag } from "../Utils/customMath";
import { Inventory } from "./inventory";

export class Player
{
    constructor(camera = new Camera(), position = new Vector3())
    {
        // Debug
        this.PosP = document.getElementById("Position");
        this.ColP = document.getElementById("CollisionMsg");
        this.ColPlines = 0;

        // Inventory
        this.inventory = new Inventory();

        // Movement
        this.position = position;
        this.oPosition = position;

        this.margin = 0.1;
        this.marginPushStr = 0.001;
        this.dimensions = {
            side:0.4,
            vert:{"-1":-1.6,"1":0.2},
            sideY:[-1.4, -0.7, 0]
        };

        // Properties
        this.grounded = false;
        this.inFluid = false;
        this.onFluid = false;

        this.runningSpeed = 0.06;
        this.groundSpeed = 0.04;
        this.waterSpeed = 0.02;
        this.speed = this.groundSpeed;
        this.acceleration = new Vector3();
        this.velocity = new Vector3();

        // Camera Settings
        this.camera = camera;
        this.camRotation = new Vector3(0, 0, 1);
        this.cameraBobbingX = 0;
        this.cameraBobbingStr = 0.05;

        this.sensitivity = new vec2(0.004, 0.004);

        //Input
        this.keyBinds = {
            Forward : "KeyW" ,
            Backward: "KeyS" ,
            Left    : "KeyA" ,
            Right   : "KeyD" ,
            Jump    : "Space",
            Run     : "ShiftLeft"
        };

        this.inputs = {};

        window.addEventListener("keydown", (e) =>
        {
            if (!this.pointerLocked || this.inputs[e.code] === true) return;
            this.inputs[e.code] = true;
        });
        window.addEventListener("keyup", (e) =>
        {
            delete this.inputs[e.code];
        });

        // Look
        window.addEventListener("mousemove", (e) =>
        {
            if (!this.pointerLocked) return;
            
            const v = new Vector3(this.camRotation.x, 0, this.camRotation.z);
            this.camRotation.applyAxisAngle(v.applyAxisAngle(ThreeAxis.Y, Math.PI*0.5), -e.movementY*this.sensitivity.y);
            this.camRotation.applyAxisAngle(ThreeAxis.Y, -e.movementX*this.sensitivity.x);
        });
    }

    UpdateCameraRotation()
    {
        this.camera.position.set(this.position.x + this.camRotation.x, this.position.y + this.camRotation.y, this.position.z + this.camRotation.z);
        this.camera.lookAt(this.position);
        this.camera.position.set(this.position.x, this.position.y, this.position.z);
    }
    UpdateCameraPosition(dt)
    {
        let bobbing = Math.sin(this.cameraBobbingX)*this.cameraBobbingStr+this.cameraBobbingStr;
        this.camera.position.set(this.position.x, this.position.y+bobbing, this.position.z);
        if (this.grounded)
            this.cameraBobbingX+=dt*(V2Mag(this.velocity.x, this.velocity.z)/this.groundSpeed*12+1);
    }

    UpdateVelocity(dt)
    {

        let force = new Vector3();

        if (this.inputs[this.keyBinds.Forward])
        {
            let dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
            dir.y = 0;
            dir.normalize().multiplyScalar(this.speed);

            force.x += dir.x;
            force.z += dir.z;
        }
        if (this.inputs[this.keyBinds.Backward])
        {
            let dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
            dir.y = 0;
            dir.normalize().multiplyScalar(-this.speed);

            force.x += dir.x;
            force.z += dir.z;
        }
        if (this.inputs[this.keyBinds.Left])
        {
            let dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
            dir.y = 0;
            dir.normalize().multiplyScalar(this.speed);
            dir.applyAxisAngle(ThreeAxis.Y, Math.PI*0.5);

            force.x += dir.x;
            force.z += dir.z;
        }
        if (this.inputs[this.keyBinds.Right])
        {
            let dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
            dir.y = 0;
            dir.normalize().multiplyScalar(-this.speed);
            dir.applyAxisAngle(ThreeAxis.Y, Math.PI*0.5);

            force.x += dir.x;
            force.z += dir.z;
        }
        if (this.inputs[this.keyBinds.Jump])
        {
            switch (true)
            {
            case this.inFluid: this.acceleration.y = 0.03; break;
            case this.grounded: this.velocity.y = 0.175; break;
            }
        }

        if (this.inFluid) if (this.velocity.y < 0.03)
            this.velocity.y += this.acceleration.y*dt*8;
        else
            this.velocity.y = 0.03;

        switch (true)
        {
        case this.inFluid:
        {
            if (this.velocity.y > -0.05)
                this.acceleration.y = -0.001;
            else
                this.velocity.y = -0.05;

            this.speed = this.waterSpeed;
            break;
        }
        case this.onFluid:
        {
            if (this.velocity.y > -0.1)
                this.acceleration.y = -0.02;
            else
                this.velocity.y = -0.1;
            this.speed = this.waterSpeed;
            break;
        }
        default:
        {
            if (this.velocity.y > -0.2)
                this.acceleration.y = -0.02;
            else
                this.velocity.y = -0.2;
            this.speed = this.inputs[this.keyBinds.Run] ? this.runningSpeed : this.groundSpeed;
            break;
        }}

        this.velocity.x += (force.x-this.velocity.x)*0.5;
        this.velocity.z += (force.z-this.velocity.z)*0.5;

        this.velocity.add(this.acceleration.multiplyScalar(dt*30));
        let vel = 0;
        if ((vel = V2Mag(this.velocity.x, this.velocity.z)) > this.speed)
        {
            const k = Math.max(0.95,this.speed/vel);
            this.velocity.x *= k; 
            this.velocity.y *= k; 
        }
    }
    UpdateMovement(dt)
    {
        this.oPosition = this.position.clone();
        this.position.add(this.velocity.clone().multiplyScalar(dt*60));
        const ppos = this.position.clone().add(new Vector3(0, this.dimensions.vert[-1],0));
        this.PosP.innerHTML = `Position: {X: ${ppos.x.toFixed(2)}; Y: ${ppos.y.toFixed(2)}; Z: ${ppos.z.toFixed(2)}}`;
    }

    collisionMsg(msg)
    {
        if (this.ColPlines >= 4)
        {
            this.ColP.innerHTML="";
            this.ColPlines = 0;
        }
        this.ColP.innerHTML+=`Collision Message: ${msg}</br>`;
        this.ColPlines++;
    }

    UpdateCollision(chunkBase = new ChunkBase())
    {
        let X=true,Y=true,Z=true;

        let forces = {"-1":new Vector3(Math.min(0,this.velocity.x),Math.min(0,this.velocity.y),Math.min(0,this.velocity.z)),
            "1":new Vector3(Math.max(0,this.velocity.x),Math.max(0,this.velocity.y),Math.max(0,this.velocity.z))};

        let inFluid = false;
        let onFluid = false;

        const toChunkRatio = chunkBase.recChunkSize*chunkBase.recBlockSize;

        function GetBlockAt(corner)
        {
            const chunkPos = corner.clone().multiplyScalar(toChunkRatio).floor();
            const chunk = chunkBase.Chunks[chunkPos.x][chunkPos.z];

            corner.multiplyScalar(chunkBase.recBlockSize).add(new vec3(-chunkPos.x*chunkBase.ChunkSize, 0, -chunkPos.z*chunkBase.ChunkSize));

            return chunk.Blocks[chunk.GetBlockIndex(Math.floor(corner.x), Math.floor(corner.y), Math.floor(corner.z))];
        }

        function CheckCorner(corner)
        {
            const block = GetBlockAt(corner);

            if (block != undefined && block.Collide)
            {
                return block;
            }
            return false;
        }
        

        for (let y = -1; y <= 1; y+=2) { for (let x = -1; x <= 1; x+=2) { for (let z = -1; z <= 1; z+=2)
        {
            let ocorner = this.position.clone().add(new vec3((this.dimensions.side-this.margin)*x, this.dimensions.vert[y],(this.dimensions.side-this.margin)*z)).floor();
            
            let block = CheckCorner(ocorner);
            if (block && !block.Fluid)
            {
                this.collisionMsg("push y");

                Y = false;

                if (this.inFluid)
                    forces[y].y = -y*this.marginPushStr*0.1;
                else
                    forces[y].y = -y*this.marginPushStr;
            }
            else if (Y)
            {
                let corner = this.position.clone().add(this.velocity).add(new vec3((this.dimensions.side-this.margin)*x, this.dimensions.vert[y],(this.dimensions.side-this.margin)*z)).floor();
                if (block = CheckCorner(corner))
                {
                    if (block.Fluid)
                    {
                        // onFluid = true;
                    }
                    else
                    {
                        this.collisionMsg("y");

                        const Corner = this.position.clone().add(new vec3((this.dimensions.side-this.margin)*x, this.dimensions.vert[y],(this.dimensions.side-this.margin)*z));
                        const chunkPos = corner.clone().multiplyScalar(toChunkRatio).floor();
                        Corner.add(new vec3(-chunkPos.x*chunkBase.ChunkSize*chunkBase.BlockSize, 0, -chunkPos.z*chunkBase.ChunkSize*chunkBase.BlockSize));
                        const blockPos = Corner.clone().multiplyScalar(chunkBase.recBlockSize).floor().multiplyScalar(chunkBase.BlockSize);

                        if (Math.abs(forces[y].y) <= this.marginPushStr) forces[y].y = 0;
                        else
                        {
                            if (this.velocity.y < 0)
                                forces[y].y = Math.max(forces[y].y, (blockPos.y)-Corner.y+this.marginPushStr);
                            if (this.velocity.y > 0)
                                forces[y].y = Math.min(forces[y].y, (blockPos.y+1)-Corner.y-this.marginPushStr);
                        }
                    }
                }
            }
        }}};

        for (let x = -1; x <= 1; x+=2) { for (let sY = 0; sY < this.dimensions.sideY.length; sY++) { for (let z = -1; z <= 1; z+=2)
        {
            let ocorner = this.position.clone().add(new vec3(this.dimensions.side*x, this.dimensions.sideY[sY], (this.dimensions.side-this.margin)*z)).floor();

            let block = CheckCorner(ocorner);
            if (block && !block.Fluid)
            {
                this.collisionMsg("push x");

                X = false;
                
                forces[x].x = -x*this.marginPushStr;
            }
            else if (X)
            {
                let corner = this.position.clone().add(new vec3(this.velocity.x, 0, this.velocity.z)).add(new vec3(this.dimensions.side*x, this.dimensions.sideY[sY], (this.dimensions.side-this.margin)*z)).floor();
                if (block = CheckCorner(corner.clone()))
                {
                    if (block.Fluid)
                    {
                        let closeBlock = false;
                        {
                            const underBlock = GetBlockAt(corner.clone().add(new vec3(0,-chunkBase.BlockSize,0)));
                            if (underBlock.Collide && !underBlock.Fluid) closeBlock = true;
                        }
                        if (!closeBlock) for (let _x = -1; _x <= 1; _x+=2){ for (let _z = -1; _z <= 1; _z+=2)
                        {
                            const underBlock = GetBlockAt(corner.clone().add(new vec3(_x*chunkBase.BlockSize,0,_z*chunkBase.BlockSize)));
                            if (underBlock.Collide && !underBlock.Fluid) closeBlock = true;
                        }}
                        if (sY == 1 || closeBlock)
                            inFluid = true;
                        else
                            onFluid = true;
                    }
                    else
                    {
                        this.collisionMsg("push x");

                        const Corner = this.position.clone().add(new vec3(this.dimensions.side*x, this.dimensions.sideY[sY], (this.dimensions.side-this.margin)*z));
                        const chunkPos = corner.clone().multiplyScalar(toChunkRatio).floor();
                        Corner.add(new vec3(-chunkPos.x*chunkBase.ChunkSize*chunkBase.BlockSize, 0, -chunkPos.z*chunkBase.ChunkSize*chunkBase.BlockSize));
                        const blockPos = Corner.clone().multiplyScalar(chunkBase.recBlockSize).floor().multiplyScalar(chunkBase.BlockSize);

                        if (Math.abs(forces[x].x) <= this.marginPushStr) forces[x].x = 0;
                        else
                        {
                            if (this.velocity.x < 0)
                                forces[x].x = Math.max(forces[x].x, (blockPos.x)-Corner.x);
                            if (this.velocity.x > 0)
                                forces[x].x = Math.min(forces[x].x, (blockPos.x+1)-Corner.x);
                        }
                    }
                }
            }
        }}};

        for (let z = -1; z <= 1; z+=2) { for (let sY = 0; sY < this.dimensions.sideY.length; sY++) { for (let x = -1; x <= 1; x+=2)
        {
            let ocorner = this.position.clone().add(new vec3((this.dimensions.side-this.margin)*x, this.dimensions.sideY[sY],this.dimensions.side*z)).floor();

            let block = CheckCorner(ocorner);
            if (block && !block.Fluid)
            {
                this.collisionMsg("push z");

                Z = false;

                forces[z].z = -z*this.marginPushStr;
            }
            else if (Z)
            {
                let corner = this.position.clone().add(new vec3(this.velocity.x, 0, this.velocity.z)).add(new vec3((this.dimensions.side-this.margin)*x, this.dimensions.sideY[sY],this.dimensions.side*z)).floor();
                if (block = CheckCorner(corner.clone()))
                {
                    if (block.Fluid)
                    {
                        let closeBlock = false;
                        {
                            const underBlock = GetBlockAt(corner.clone().add(new vec3(0,-chunkBase.BlockSize,0)));
                            if (underBlock.Collide && !underBlock.Fluid) closeBlock = true;
                        }
                        if (!closeBlock) for (let _x = -1; _x <= 1; _x+=2){ for (let _z = -1; _z <= 1; _z+=2)
                        {
                            const underBlock = GetBlockAt(corner.clone().add(new vec3(_x*chunkBase.BlockSize,0,_z*chunkBase.BlockSize)));
                            if (underBlock.Collide && !underBlock.Fluid) closeBlock = true;
                        }}
                        if (sY == 1 || closeBlock)
                            inFluid = true;
                        else
                            onFluid = true;
                    }
                    else
                    {
                        this.collisionMsg("push z");

                        const Corner = this.position.clone().add(new vec3((this.dimensions.side-this.margin)*x, this.dimensions.sideY[sY],this.dimensions.side*z));
                        const chunkPos = corner.clone().multiplyScalar(toChunkRatio).floor();
                        Corner.add(new vec3(-chunkPos.x*chunkBase.ChunkSize*chunkBase.BlockSize, 0, -chunkPos.z*chunkBase.ChunkSize*chunkBase.BlockSize));
                        const blockPos = Corner.clone().multiplyScalar(chunkBase.recBlockSize).floor().multiplyScalar(chunkBase.BlockSize);
                        
                        if (Math.abs(forces[z].z) <= this.marginPushStr) forces[z].z = 0;
                        else
                        {
                            if (this.velocity.z < 0)
                                forces[z].z = Math.max(forces[z].z, (blockPos.z)-Corner.z);
                            if (this.velocity.z > 0)
                                forces[z].z = Math.min(forces[z].z, (blockPos.z+1)-Corner.z);
                        }
                    }
                }
            }
        }}};

        // for (let i = -1; i <= 1; i+=2)
        // {
        //     if (Math.abs(forces[i].x) <= 0.01) forces[i].x = 0;
        //     if (Math.abs(forces[i].y) <= 0.01) forces[i].y = 0;
        //     if (Math.abs(forces[i].z) <= 0.01) forces[i].z = 0;
        // }

        if (this.velocity.y < 0 && this.velocity.y != forces[-1].y) this.grounded = true;
        else this.grounded = false;
        this.inFluid = inFluid;
        this.onFluid = onFluid;

        this.velocity = forces[-1].clone().add(forces[1]);
    }

    Update(dt, canvas, chunkBase)
    {
        if (document.pointerLockElement != canvas)
        {
            this.pointerLocked = false;
            this.UpdateCollision(chunkBase);
            this.UpdateCameraPosition(dt);
            return;
        }
        this.pointerLocked = true;
        this.UpdateCameraRotation();
        this.UpdateVelocity(dt);
        this.UpdateCollision(chunkBase);
        this.UpdateMovement(dt);
        this.UpdateCameraPosition(dt);
    }
}