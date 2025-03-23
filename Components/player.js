import { Camera, Vector3 } from "three";
import { ThreeAxis } from "../Utils/utils";
import { vec2 } from "../Utils/vec";
import ChunkBase from "../Voxel/chunkBase";

export class Player
{
    constructor(camera = new Camera(), Position = new Vector3())
    {
        this.Position = Position;
        this.dimensions = {
            side:0.4,
            vert:[1.6,0.2]
        }

        this.speed = 0.1;
        this.dir = new Vector3();

        this.camera = camera;
        this.camRotation = new Vector3(0, 0, 1);

        this.sensitivity = new vec2(0.004, 0.004);

        this.inputs = {};

        this.keyBinds = {
            Forward: "KeyW",
            Backward: "KeyS",
            Left: "KeyA",
            Right: "KeyD",
            Jump: "Space"
        };

        window.addEventListener("keydown", (e) =>
        {
            if (!this.pointerLocked) return;
            this.inputs[e.code] = true;
        });
        window.addEventListener("keyup", (e) => delete this.inputs[e.code]);

        window.addEventListener("mousemove", (e) =>
        {
            if (!this.pointerLocked) return;
            
            const v = new Vector3(this.camRotation.x, 0, this.camRotation.z);
            this.camRotation.applyAxisAngle(v.applyAxisAngle(ThreeAxis.Y, Math.PI/2), -e.movementY*this.sensitivity.y);
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

    UpdateMovement()
    {
        if (this.inputs[this.keyBinds.Forward])
        {
            this.dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
            this.dir.y = 0;
            this.dir.normalize().multiplyScalar(this.speed);

            this.Position.x += this.dir.x;
            this.Position.z += this.dir.z;
        }
        if (this.inputs[this.keyBinds.Backward])
        {
            this.dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
            this.dir.y = 0;
            this.dir.normalize().multiplyScalar(-this.speed);

            this.Position.x += this.dir.x;
            this.Position.z += this.dir.z;
        }
        if (this.inputs[this.keyBinds.Left])
        {
            this.dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
            this.dir.y = 0;
            this.dir.normalize().multiplyScalar(this.speed);
            this.dir.applyAxisAngle(ThreeAxis.Y, Math.PI/2);

            this.Position.x += this.dir.x;
            this.Position.z += this.dir.z;
        }
        if (this.inputs[this.keyBinds.Right])
        {
            this.dir = new Vector3(0,0,-1).applyQuaternion(this.camera.quaternion);
            this.dir.y = 0;
            this.dir.normalize().multiplyScalar(-this.speed);
            this.dir.applyAxisAngle(ThreeAxis.Y, Math.PI/2);

            this.Position.x += this.dir.x;
            this.Position.z += this.dir.z;
        }

        this.Position.y-=0.1;
        this.dir.y = -0.1;
    }

    UpdateCollision(chunkBase = new ChunkBase())
    {
        //sides
        // From Bottom to top
        for (let x = -1; x <= 1; x+=2)
        {
            for (let y = 0; y <= 1; y++)
            {
                for (let z = -1; z <= 1; z+=2)
                {
                    const cornerPos = this.Position.clone().sub(new Vector3(0,this.dimensions.vert[y],0)).add(new Vector3(this.dimensions.side*x, 0,this.dimensions.side*z)).floor();
                    const chunkPos = cornerPos.clone().multiplyScalar(chunkBase.recChunkSize).floor();
                    const chunk = chunkBase.Chunks[chunkPos.x][chunkPos.z];

                    console.log(cornerPos)
                    if (chunk.Blocks[chunk.GetBlockIndex(cornerPos.x, cornerPos.y, cornerPos.z)] != undefined && chunk.Blocks[chunk.GetBlockIndex(cornerPos.x, cornerPos.y, cornerPos.z)].Collide)
                    {
                        this.Position.add(this.dir.clone().multiplyScalar(-1));
                    }
                }
            }
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
        this.UpdateMovement();
        this.UpdateCollision(chunkBase);
        this.UpdateCameraPosition();
    }
}