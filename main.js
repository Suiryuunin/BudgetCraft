"use strict";

import { AmbientLight, BoxGeometry, CameraHelper, DirectionalLight, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { FractalBrownianMotion2D, StandardPerlin2D } from "./Voxel/PerlinNoise";
import { vec2, vec3 } from "./Utils/vec";
import Engine from "./Engine/engine";
import ChunkBase from "./Voxel/chunkBase";
import { Player } from "./Components/player";
import { camera, canvas, renderer, scene } from "./Engine/threeInit";
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
    player.Update(delta, canvas, chunkBase);
    
    chunkBase.Update();
}

const render = () => {
    // renderer.render(scene, camera);
    pp.render();
}

window.addEventListener("wheel", ()=>{
    chunkBase.OverwriteBlock(EBlock.Water, new vec3(1, 20, 1));
})

const enigne = new Engine(60, update, render);
enigne.start();

window.addEventListener('resize', () => {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    pp.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});



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