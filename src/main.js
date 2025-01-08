import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

/*
scene: container for 3D models, lights, and cameras
camera: viewer's perspective
renderer: renders the scene and camera onto a canvas element
mixer: manage animations of 3D Models
*/

let scene, camera, renderer, mixer;

function init() {
    // Create Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202124);

    // Create Camera
    camera = new THREE.PerspectiveCamera(
        75, // Field of View in degrees
        window.innerWidth / window.innerHeight, // Aspect Ratio
        0.1, // Near Clipping Plane
        1000 // Far Clipping Plane
    );
    camera.position.set(0, 1, 5);

    // Create Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true }); // antialias smooths edges of objects
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //Enable users to rotate, zoom, and pan camera with the mouse
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Add smoothing effect when moving the camera

    // Add Light Source
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Show 3D Axis
    const axesHelper = new THREE.AxesHelper(5); // Parameter is the size of the axes
    scene.add(axesHelper);

    // Load Model
    const loader = new GLTFLoader();
    loader.load(
        '/assets/models/Waving_2.glb',
        (gltf) => {
            const model = gltf.scene;
            model.scale.set(0.1, 0.1, 0.1);

            // Center model
            const box = new THREE.Box3().setFromObject(model); // Compute the bounding box
            const center = box.getCenter(new THREE.Vector3()); // Get the center of the bounding box

            model.position.y = center.y - 1.5;

            scene.add(model);

            // Play animation
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
                mixer.clipAction(clip).play();
            });
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            console.error('An error occurred:', error);
        }
    );

    window.addEventListener('resize', onWindowResize);
}

// Update camera aspect ratio when window is resized
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Loop the animation
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);
}

// Initialize 3D Animation
const clock = new THREE.Clock();
init();
animate();