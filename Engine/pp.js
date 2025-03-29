import { EffectComposer, GTAOPass, OutlinePass, OutputPass, RenderPass, RenderPixelatedPass, ShaderPass, SobelOperatorShader, SSAOPass, UnrealBloomPass } from "three/examples/jsm/Addons.js";
import { camera, renderer, scene } from "../threeInit";
import { Vector2 } from "three";

// PP
export const pp = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
pp.addPass(renderPass);

// const outlinePass = new OutlinePass(new Vector2(window.innerWidth, window.innerHeight), scene, camera);

// pp.addPass(outlinePass);

const res = new Vector2(window.innerWidth, window.innerHeight);
const resolution = new Vector2(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);

// const renderPixelatedPass = new RenderPixelatedPass( 1, scene, camera );
// renderPixelatedPass.normalEdgeStrength = 0;
// renderPixelatedPass.depthEdgeStrength = 0;
// pp.addPass( renderPixelatedPass );

const bloomPass = new UnrealBloomPass(res, .2, 1, 0.95);
pp.addPass(bloomPass);

// const gtaoPass = new GTAOPass(scene, camera, window.innerWidth, window.innerHeight);
// gtaoPass.output = GTAOPass.OUTPUT.Default;
// gtaoPass.updateGtaoMaterial({radius:0.14, distanceFallOff:0.04, scale:0.7, thickness:1, screenSpaceRadius:false})
// pp.addPass(gtaoPass);

// const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
// ssaoPass.output = SSAOPass.OUTPUT.Default;
// ssaoPass.minDistance = 0.001;
// ssaoPass.maxDistance = 0.01;
// pp.addPass(ssaoPass);

// const sobelOperator = new ShaderPass( SobelOperatorShader );
// sobelOperator.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
// sobelOperator.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
// pp.addPass( sobelOperator );

const outputPass = new OutputPass();

pp.addPass(outputPass);

window.addEventListener("resize", () =>
{
    // sobelOperator.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
    // sobelOperator.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
});