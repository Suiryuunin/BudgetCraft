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


const player = new Player(camera);

// Gameloop
const update = (delta) => {
    player.Update(delta, UICanvas, chunkBase);
    
    chunkBase.Update();
}

const render = () => {
    // renderer.render(scene, camera);
    pp.render();
    UICtx.clearRect(0,0,UICanvas.width, UICanvas.height);
    player.hotbar.Render(UICtx);
}

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
    UICtx.imageSmoothingEnabled = false;

    render();
}

window.addEventListener('load', Resize);
window.addEventListener('resize', Resize);