import { Color, Fog, FogExp2, PerspectiveCamera, Scene, WebGLRenderer } from "three";

export const canvas = document.querySelector('canvas');
        
canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
});

export const renderer = new WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Create a camera
export const camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

// const control = new OrbitControls(camera, renderer.domElement);

export const scene = new Scene();
scene.background = new Color(0xbcf0f9);

// const density = 0.1;
// scene.fog = new FogExp2(0xbcf0f9, density);

scene.fog = new Fog(0xbcf0f9, 0.1, 15);