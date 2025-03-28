"use strict";

import { AmbientLight, BoxGeometry, CameraHelper, DirectionalLight, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { FractalBrownianMotion2D, StandardPerlin2D } from "./Voxel/PerlinNoise";
import { vec2, vec3 } from "./Utils/vec";
import Engine from "./Engine/engine";
import ChunkBase from "./Voxel/chunkBase";
import { Player } from "./Components/player";
import { camera, canvas, renderer, scene, UICanvas, UICtx } from "./Engine/threeInit";
import { pp } from "./Engine/pp";
import { ThreeAxis } from "./Utils/utils";
import { EBlock } from "./Voxel/enums";

const light = new DirectionalLight(0xffffff);
light.position.set(0.6,0.8,0.5)
light.intensity = 2;
scene.add(light);
const alight = new AmbientLight();
scene.add(alight);

const chunkBase = new ChunkBase(camera, scene);
chunkBase.Init();


const player = new Player(camera, new Vector3(0,20,0));

// Gameloop
const update = (delta) => {
    player.Update(delta, UICanvas, chunkBase);
    
    chunkBase.Update();
}

const hotbarImg = new Image(288, 32);
hotbarImg.src = "./Assets/Textures/Inventory/hotbar.png";

const render = () => {
    // renderer.render(scene, camera);
    pp.render();
    UICtx.clearRect(0,0,UICanvas.width, UICanvas.height)
    UICtx.drawImage(hotbarImg, 0,0,288,32,0,0,288*2,64);
}

window.addEventListener("wheel", ()=>{
    chunkBase.OverwriteBlock(EBlock.Water, new vec3(1, 20, 1));
})

const enigne = new Engine(30, update, render);
enigne.start();

function Resize()
{
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    pp.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    UICanvas.width = window.innerWidth;
    UICanvas.height = window.innerHeight;
}

window.addEventListener('load', Resize);
window.addEventListener('resize', Resize);



// const canvas = document.querySelector("canvas");
// const ctx = canvas.getContext("2d");

// canvas.width = 500;
// canvas.height = 500;

// for (let x = 0; x < 500; x++)
// {
//     for (let y = 0; y < 500; y++)
//     {
//         let value = FractalBrownianMotion2D(x*0.01,y*0.01, 8);
//         value += 1;
//         value *= 0.5;
//         ctx.fillStyle = `hsl(0deg, 0%, ${value*100}%)`;
//         ctx.fillRect(x, y, 1, 1);
//     }
// }