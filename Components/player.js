import { Camera, Vector3 } from "three";
import { EUnitV3, ThreeAxis, ThreeUnitV3 } from "../Utils/utils";
import { vec2 } from "../Utils/vec";
import ChunkBase from "../Voxel/chunkBase";

export class Player
{
    constructor(camera = new Camera(), Position = new Vector3())
    {
        this.p = document.getElementById("p1");

        this.Position = Position;
        this.oPosition = Position;

        this.margin = 0.1;
        this.marginPushStr = 0.01;
        this.dimensions = {
            side:0.4,
            vert:{"-1":-1.6,"1":0.2},
            sideY:[-1.5, -0.7, 0.1]
        };

        // Properties
        this.grounded = false;
        this.inFluid = false;

        this.speed = 0.1;
        this.velocity = new Vector3();

        this.camera = camera;
        this.camRotation = new Vector3(0, 0, 1);

        this.sensitivity = new vec2(0.004, 0.004);

        this.inputs = {};
        this.inputsLength = 0;

        this.keyBinds = {
            Forward: "KeyW",
            Backward: "KeyS",
            Left: "KeyA",
            Right: "KeyD",
            Jump: "Space"
        };

        window.addEventListener("keydown", (e) =>
        {
            if (!this.pointerLocked || this.inputs[e.code] === true) return;
            this.inputs[e.code] = true;
            this.inputsLength++;
        });
        window.addEventListener("keyup", (e) =>
        {
            delete this.inputs[e.code];
            this.inputsLength--;
        });

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
        this.camera.position.set(this.Position.x + this.camRotation.x, this.Position.y + this.camRotation.y, this.Position.z + this.camRotation.z);
        this.camera.lookAt(this.Position);
        this.camera.position.set(this.Position.x, this.Position.y, this.Position.z);
    }
    UpdateCameraPosition()
    {
        this.camera.position.set(this.Position.x, this.Position.y, this.Position.z);
    }

    UpdateVelocity()
    {
        this.velocity.x = this.velocity.z = 0;
        if (this.inputsLength > 0)
        {
            if (this.inputs[this.keyBinds.Forward])
            {
                let dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
                dir.y = 0;
                dir.normalize().multiplyScalar(this.speed);
    
                this.velocity.x += dir.x;
                this.velocity.z += dir.z;
            }
            if (this.inputs[this.keyBinds.Backward])
            {
                let dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
                dir.y = 0;
                dir.normalize().multiplyScalar(-this.speed);
    
                this.velocity.x += dir.x;
                this.velocity.z += dir.z;
            }
            if (this.inputs[this.keyBinds.Left])
            {
                let dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
                dir.y = 0;
                dir.normalize().multiplyScalar(this.speed);
                dir.applyAxisAngle(ThreeAxis.Y, Math.PI*0.5);
    
                this.velocity.x += dir.x;
                this.velocity.z += dir.z;
            }
            if (this.inputs[this.keyBinds.Right])
            {
                let dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
                dir.y = 0;
                dir.normalize().multiplyScalar(-this.speed);
                dir.applyAxisAngle(ThreeAxis.Y, Math.PI*0.5);
    
                this.velocity.x += dir.x;
                this.velocity.z += dir.z;
            }
            if (this.inputs[this.keyBinds.Jump])
            {
                this.velocity.y = 0.3;
            }
        }
        
        // if (!this.grounded)
        // this.velocity.y = -0.1;
    }
    UpdateMovement()
    {
        this.oPosition = this.Position.clone();
        this.Position.add(this.velocity);
    }

    UpdateCollision(chunkBase = new ChunkBase())
    {
        let X =false,Y=false,Z=false;
        let Ycollision = false;

        let forces = {"-1":new Vector3(), "1":new Vector3()};

        const toChunkRatio = chunkBase.recChunkSize*chunkBase.recBlockSize;

        function CheckCorner(corner)
        {
            const chunkPos = corner.clone().multiplyScalar(toChunkRatio).floor();
            const chunk = chunkBase.Chunks[chunkPos.x][chunkPos.z];

            corner.multiplyScalar(chunkBase.recBlockSize).add(new Vector3(-chunkPos.x*chunkBase.ChunkSize, 0, -chunkPos.z*chunkBase.ChunkSize)).floor();

            const block = chunk.Blocks[chunk.GetBlockIndex(corner.x, corner.y, corner.z)]

            if (block != undefined && block.Collide)
            {
                return block;
            }
            return false;
        }
        

        for (let y = -1; y <= 1; y+=2) { for (let x = -1; x <= 1; x+=2) { for (let z = -1; z <= 1; z+=2)
        {
            let corner = this.Position.clone().add(new Vector3((this.dimensions.side-this.margin)*x, this.dimensions.vert[y],(this.dimensions.side-this.margin)*z)).floor();

            let block;
            if (block = CheckCorner(corner))
            {
                if (block.Fluid)
                {

                }
                else
                {
                    this.p.innerHTML="push y";

                    Y = true;
                    forces[y].y = y*this.marginPushStr;
                }
            }
            else if (Y)
            {
                corner = this.Position.clone().add(this.velocity).add(new Vector3((this.dimensions.side-this.margin)*x, this.dimensions.vert[y],(this.dimensions.side-this.margin)*z)).floor();
                if (block = CheckCorner(corner))
                {
                    if (block.Fluid)
                    {

                    }
                    else
                    {
                        this.p.innerHTML = "y";
                        corner.multiplyScalar(chunkBase.recBlockSize).add(new Vector3(-chunkPos.x*chunkBase.ChunkSize, 0, -chunkPos.z*chunkBase.ChunkSize));
                        blockPos = corner.clone().floor();
                        forces[y].y = 0 //change
                    }
                }
            }
        }}};

        for (let x = -1; x <= 1; x+=2) { for (const sideY of this.dimensions.sideY) { for (let z = -1; z <= 1; z+=2)
        {
            let corner = this.Position.clone().add(new Vector3(this.dimensions.side*x, sideY, (this.dimensions.side-this.margin)*z)).floor();

            let block;
            if (block = CheckCorner(corner))
            {
                if (block.Fluid)
                {

                }
                else
                {
                    this.p.innerHTML = "push x";
                    forces.x -= x*this.marginPushStr;
                }
            }
            else
            {
                corner = this.Position.clone().add(this.velocity).add(new Vector3(this.dimensions.side*x, sideY, (this.dimensions.side-this.margin)*z)).floor();
                if (block = CheckCorner(corner))
                {
                    if (block.Fluid)
                    {
    
                    }
                    else
                    {
                        this.p.innerHTML = "x";
                        X=1;
                    }
                }
            }
        }}};

        for (let z = -1; z <= 1; z+=2) { for (const sideY of this.dimensions.sideY) { for (let x = -1; x <= 1; x+=2)
        {
            let corner = this.Position.clone().add(new Vector3((this.dimensions.side-this.margin)*x, sideY,this.dimensions.side*z)).floor();

            let block
            if (block = CheckCorner(corner))
            {
                if (block.Fluid)
                {

                }
                else
                {
                    this.p.innerHTML = "push z";
                    forces.z -= z*this.marginPushStr;
                }
            }
            else
            {
                corner = this.Position.clone().add(this.velocity).add(new Vector3((this.dimensions.side-this.margin)*x, sideY,this.dimensions.side*z)).floor();
                if (block = CheckCorner(corner))
                {
                    if (block.Fluid)
                    {

                    }
                    else
                    {
                        this.p.innerHTML = "z";
                        Z=1;
                    }
                }
            }
        }}};

        this.Position.add(forces);
        this.Position.add(new Vector3(-X*this.velocity.x, -Y*this.velocity.y, -Z*this.velocity.z));
        if (Ycollision)
        {
            // this.velocity.y = Y - Math.sign(Y)*0.1;
            this.grounded = true;
        }
        else this.grounded = false;

        if (this.velocity.y < 0)
        {
            // this.velocity.y = 0;
        }
    }

    Update(delta, canvas, chunkBase)
    {
        if (document.pointerLockElement != canvas)
        {
            this.pointerLocked = false;
            this.UpdateCollision(chunkBase);
            this.UpdateCameraPosition();
            return;
        }
        this.pointerLocked = true;
        this.UpdateCameraRotation();
        this.UpdateVelocity();
        this.UpdateCollision(chunkBase);
        this.UpdateMovement();
        this.UpdateCameraPosition();
    }
}