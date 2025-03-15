"use strict";

import { Color, DirectionalLight, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { FractalBrownianMotion2D, StandardPerlin2D } from "./Voxel/PerlinNoise";
import Chunk from "./Voxel/chunk";
import { vec2 } from "./Utils/vec";
import Engine from "./Engine/engine";
import { OrbitControls } from "three/examples/jsm/Addons.js";



const renderer = new WebGLRenderer({ canvas: document.querySelector('canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create a camera
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

const control = new OrbitControls(camera, renderer.domElement);

const scene = new Scene();
scene.background = new Color(0xFAC898);

const chunk = new Chunk(new vec2(0,0), 16, 1);

chunk.Init(scene);


// Gameloop
const update = (delta) => {

}

const render = () => {
    renderer.render(scene, camera);
}

const enigne = new Engine(60, update, render);
enigne.start();

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