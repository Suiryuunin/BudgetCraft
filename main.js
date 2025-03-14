"use strict";

import PerlinNoise from "./Voxel/PerlinNoise";



const perlin = new PerlinNoise(0);

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

for (let x = 0; x < 500; x++)
{
    for (let y = 0; y < 500; y++)
    {
        let value = perlin.FractalBrownianMotion2D(x*0.01,y*0.01, 8);
        value += 1;
        value *= 0.5;
        ctx.fillStyle = `hsl(0deg, 0%, ${value*100}%)`;
        ctx.fillRect(x, y, 1, 1);
    }
}