"use strict";

import { AmbientLight, BoxGeometry, CameraHelper, DirectionalLight, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { FractalBrownianMotion2D, StandardPerlin2D } from "./Voxel/PerlinNoise";
import { vec2, vec3 } from "./Utils/vec";
import Engine from "./Engine/engine";
import ChunkBase from "./Voxel/chunkBase";
import { Player } from "./Components/player";
import { camera, canvas, renderer, rr, scene, UICanvas, UICtx } from "./threeInit";
import { pp } from "./Engine/pp";
import { ThreeAxis } from "./Utils/utils";
import { EBlock } from "./Voxel/enums";
import { Menu, menuActive } from "./menu";

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

    if (menuActive)
        for (const item of Menu) if (item != undefined)
            item.activate();
    else
        for (const item of Menu) if (item != undefined)
            item.deactivate();
}

const render = () => {
    // renderer.render(scene, camera);
    pp.render();
    UICtx.clearRect(0,0,UICanvas.width, UICanvas.height);
    player.hotbar.Render(UICtx, rr);

    if (menuActive)
    {
        UICtx.globalAlpha = 0.7;
        UICtx.fillStyle = "white";
        UICtx.fillRect(window.innerWidth*0.1, window.innerHeight*0.1, window.innerWidth*0.8, window.innerHeight*0.8);
        for (const item of Menu) if (item != undefined)
            item.render(rr);
    }
    else
    {
        rr.write(["Press Esc. TWICE to pause"], "black", new vec2(window.innerWidth*0.5, window.innerHeight*0.01), window.innerHeight*0.03, new vec2(-0.5, -1));
    }
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