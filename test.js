// Simple three.js example

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

var mesh, renderer, scene, camera, controls;

init();
animate();

function init() {

    // renderer
    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('canvas') });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( renderer.domElement );

    // scene
    scene = new THREE.Scene();
    
    // camera
    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set(2, 2, 2 );

    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    
    const height = 1;
    
    const vertices = [
        // front
        { pos: [0, 0,  1], norm: [ 0,  0,  1], uv: [0, 0], }, // 0
        { pos: [ 1, 0,  1], norm: [ 0,  0,  1], uv: [1, 0], }, // 1
        { pos: [0,  height,  1], norm: [ 0,  0,  1], uv: [0, 1], }, // 2
        { pos: [ 1,  height,  1], norm: [ 0,  0,  1], uv: [1, 1], }, // 3
        // right
        { pos: [ 1, 0,  1], norm: [ 1,  0,  0], uv: [0, 0], }, // 4
        { pos: [ 1, 0, 0], norm: [ 1,  0,  0], uv: [1, 0], }, // 5
        { pos: [ 1,  height,  1], norm: [ 1,  0,  0], uv: [0, 1], }, // 6
        { pos: [ 1,  height, 0], norm: [ 1,  0,  0], uv: [1, 1], }, // 7
        // back
        { pos: [ 1, 0, 0], norm: [ 0,  0, -1], uv: [0, 0], }, // 8
        { pos: [0, 0, 0], norm: [ 0,  0, -1], uv: [1, 0], }, // 9
        { pos: [ 1,  height, 0], norm: [ 0,  0, -1], uv: [0, 1], }, // 10
        { pos: [0,  height, 0], norm: [ 0,  0, -1], uv: [1, 1], }, // 11
        // left
        { pos: [0, 0, 0], norm: [-1,  0,  0], uv: [0, 0], }, // 12
        { pos: [0, 0,  1], norm: [-1,  0,  0], uv: [1, 0], }, // 13
        { pos: [0,  height, 0], norm: [-1,  0,  0], uv: [0, 1], }, // 14
        { pos: [0,  height,  1], norm: [-1,  0,  0], uv: [1, 1], }, // 15
        // top
        { pos: [ 1,  height, 0], norm: [ 0,  1,  0], uv: [0, 0], }, // 16  #PIN
        { pos: [0,  height, 0], norm: [ 0,  1,  0], uv: [1, 0], }, // 17 #PIN
        { pos: [ 1,  height,  1], norm: [ 0,  1,  0], uv: [0, 1], }, // 18 #PIN
        { pos: [0,  height,  1], norm: [ 0,  1,  0], uv: [1, 1], }, // 19 #PIN
        // bottom
        { pos: [ 1, 0,  1], norm: [ 0, -1,  0], uv: [0, 0], }, // 20  #PIN
        { pos: [0, 0,  1], norm: [ 0, -1,  0], uv: [1, 0], }, // 21  #PIN
        { pos: [ 1, 0, 0], norm: [ 0, -1,  0], uv: [0, 1], }, // 22  #PIN
        { pos: [0, 0, 0], norm: [ 0, -1,  0], uv: [1, 1], }, // 23 #PIN

    ];

    const positions = [];
    const normals = [];
    const uvs = [];
    for (const vertex of vertices) {
        positions.push(...vertex.pos);
        if(vertex.norm) {
            normals.push(...vertex.norm);
        }
        if(vertex.uv) {
            uvs.push(...vertex.uv);
        }
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(new Float32Array(normals), 3));
    geometry.setAttribute(
        'uv',
        new THREE.BufferAttribute(new Float32Array(uvs), 2));

    geometry.setIndex([
        0,  1,  2,   2,  1,  3,
        4,  5,  6,   6,  5,  7,
        8,  9, 10,  10,  9, 11,
        12, 13, 14,  14, 13, 15,
        16, 17, 18,  18, 17, 19,
        20, 21, 22,  22, 21, 23,
    ]);

    geometry.computeVertexNormals();

    geometry.clearGroups();
    geometry.addGroup(0, 6, 0); // Front
    geometry.addGroup(6, 12, 1); // Right
    geometry.addGroup(12, 18, 2); // Back
    geometry.addGroup(18, 24, 3); // Left
    geometry.addGroup(24, 30, 4); // Top
    geometry.addGroup(30, 36, 5); // Bottom
    
	const texLoader = new THREE.TextureLoader();

	const texURL1 = 'https://upload.wikimedia.org/wikipedia/commons/9/93/Gfp-jagged-rock-texture.jpg';
	const texURL2 = 'https://threejs.org/examples/textures/patterns/circuit_pattern.png';
	const texURL3 = 'https://threejs.org/examples/textures/decal/decal-normal.jpg';
	const texURL4 = 'https://threejs.org/examples/models/gltf/LeePerrySmith/Map-COL.jpg';
	const texURL5 = 'https://threejs.org/examples/models/gltf/LeePerrySmith/Map-SPEC.jpg';
	const texURL6 = 'https://threejs.org/examples/textures/cube/pisa/px.png';

	const mat1 = new THREE.MeshBasicMaterial({color: 0xffffff, map: texLoader.load(texURL1)});
	const mat2 = new THREE.MeshBasicMaterial({color: 0xffffff, map: texLoader.load(texURL2)});
	const mat3 = new THREE.MeshBasicMaterial({color: 0xffffff, map: texLoader.load(texURL3)});
	const mat4 = new THREE.MeshBasicMaterial({color: 0xffffff, map: texLoader.load(texURL4)});
	const mat5 = new THREE.MeshBasicMaterial({color: 0xffffff, map: texLoader.load(texURL5)});
	const mat6 = new THREE.MeshBasicMaterial({color: 0xffffff, map: texLoader.load(texURL6)});

	var material = [
		mat1,
		mat2,
		mat3,
		mat4,
		mat5,
		mat6,
	];

    const cube = new THREE.Mesh( geometry, material );
    
    scene.add(cube);
    
}

function animate() {

    requestAnimationFrame( animate );
    
    //controls.update();

    renderer.render( scene, camera );

}
