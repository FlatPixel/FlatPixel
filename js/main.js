import * as THREE from 'three';
import { sRGBEncoding } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

THREE.ColorManagement.legacyMode = false;

const canvas = document.getElementById('canvas');
// const width = canvas.clientWidth;
// const height = canvas.clientHeight;
const width = window.innerWidth;
const height = window.innerWidth;

// Instantiate a loader
const loader = new GLTFLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 2000);

let controls;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
renderer.setSize(width, height);
renderer.outputEncoding = sRGBEncoding;

// Resize
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// // Shadow
// renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

// // Create a DirectionalLight and turn on shadows for the light
// const light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(-1, 0.5, 2); //default; light shining from top
// const targetObject = new THREE.Object3D();
// targetObject.position.set(0, 0, 0);
// scene.add(targetObject);
// light.target = targetObject;
// light.castShadow = true; // default false
// scene.add(light);

// // Set up shadow properties for the light
// light.shadow.mapSize.width = 1024; // default
// light.shadow.mapSize.height = 1024; // default
// light.shadow.camera.near = 0.1; // default
// light.shadow.camera.far = 100; // default
// light.shadow.radius = 25;
// light.shadow.blurSamples = 25;

// const FPmaterial = new THREE.MeshBasicMaterial();
// const FPtexture = new THREE.TextureLoader().load('3D/paris_diffuse.png');
// FPmaterial.map = FPtexture;

// const FPnormalTexture = new THREE.TextureLoader().load(
//     '3D/paris_normal.png'
// )
// FPmaterial.normalMap = FPnormalTexture;
// FPmaterial.normalScale.set(2, 2);

// // Model loader
// const fbxLoader = new FBXLoader()
// fbxLoader.load(
//     '3D/Paris.fbx',
//     (object) => {
//         // object.traverse(function (child) {
//         //     if ((child as THREE.Mesh).isMesh) {
//         //         // (child as THREE.Mesh).material = material
//         //         if ((child as THREE.Mesh).material) {
//         //             ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false
//         //         }
//         //     }
//         // })
//         object.traverse(function (child) {

//             if (child.isMesh) {
//                 child.castShadow = true;
//                 child.receiveShadow = true;
//             }

//             if (child.material) {
//                 child.material.map = FPtexture;
//                 child.material.normalMap = FPnormalTexture;
//             }

//         });

//         object.scale.set(.07, .07, .07)
//         object.position.set(1.5, -2.4, -1);
//         object.rotation.y = Math.PI * 0.25;
//         scene.add(object)
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//     },
//     (error) => {
//         console.log(error)
//     }
// )

// Get your video element:
const video = document.getElementById('video');
// Create your video texture:
const videoTexture = new THREE.VideoTexture(video);
const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.FrontSide, toneMapped: false });

// Load a glTF resource
loader.load(
    // resource URL
    '3D/Paris.glb',
    // called when the resource is loaded
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                console.log("mesh: " + child.name);
                const m = child;
                m.receiveShadow = true;
                m.castShadow = true;
                m.material.normalScale = new THREE.Vector2(-1, -1);
                m.material.color.set(0xffffff);
                m.material.roughness = 0.5;

                // m.scale.set(.07, .07, .07)
                // m.position.set(0, 0, 0);
                // m.position.set(1.5, 2.5, -2);
                m.position.set(3, 0, 0);
                // m.rotation.y = Math.PI * 0.25;

                if (m.name == "screenFrame") {
                    m.visible = false;
                    m.material.blending = THREE.AdditiveBlending;
                    // m.position.set(m.position.x, m.position.y + 2.5, m.position.z);
                }

                if (m.name == "screenVideo") {
                    m.visible = false;
                    // m.material.map = videoTexture;
                    // m.position.set(m.position.x, m.position.y + 2.5, m.position.z);
                }

                if (m.name == "glow" || m.name == "Cylinder002" || m.name == "Sphere002")
                    m.visible = false;
            }
        });

        scene.add(gltf.scene);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
    },
    // called while loading is progressing
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    // called when loading has errors
    function (error) {
        console.log('An error happened');
    }
);


// Lights
const light = new THREE.AmbientLight(0xffbc8f); // soft white light
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(- 1, 1.75, 1);
dirLight.position.multiplyScalar(30);
scene.add(dirLight);

dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;

const d = 50;

dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;

dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = - 0.0001;

// const dirLightHelper = new THREE.DirectionalLightHelper(dirLight, 10);
// scene.add(dirLightHelper);


// Camera Pos
// camera.position.set(0, 0, 75);
// camera.rotation.y = Math.PI * 0.5;
// camera.rotation.x = -Math.PI * 0.05;
camera.position.set(0, 3, 10);


// Controls
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.target.set(0, 0, 0);
controls.maxPolarAngle = Math.PI * 0.4;
controls.minPolarAngle = Math.PI * 0.2;
controls.minDistance = 7.5;
controls.maxDistance = 12.5;


// // Grid
// const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
// grid.material.opacity = 0.2;
// grid.material.transparent = true;
// scene.add(grid);


// const geometry = new THREE.BoxGeometry(9, 16, 1.7);

// // Get your video element:
// const video = document.getElementById('video');
// // Create your video texture:
// const videoTexture = new THREE.VideoTexture(video);
// const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.FrontSide, toneMapped: false });

// const cube = new THREE.Mesh(geometry, videoMaterial);
// cube.position.set(2, -0.5, -1);
// cube.castShadow = true; //default is false
// cube.receiveShadow = false; //default
// scene.add(cube);

// Create a plane that receives shadows (but does not cast them)
const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
const shadowMaterial = new THREE.ShadowMaterial();
shadowMaterial.opacity = 0.2;
const plane = new THREE.Mesh(planeGeometry, shadowMaterial);
plane.castShadow = false;
plane.receiveShadow = true;
plane.rotation.x = -Math.PI / 2;
plane.position.set(0, -2.3, 0);
scene.add(plane);

// // Create a helper for the shadow camera (optional)
// const helper = new THREE.CameraHelper(light.shadow.camera);
// scene.add(helper);

// // stats
// let stats = new Stats();
// const container = document.createElement('div');
// document.body.appendChild(container);
// container.appendChild(stats.dom);

function animate() {
    requestAnimationFrame(animate);

    if (camera == null) return;

    // cube.rotation.y += 0.002;

    // controls.update();
    renderer.render(scene, camera);

    // stats.update();
}
animate();