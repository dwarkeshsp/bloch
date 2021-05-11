/**
 * entry.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

import { WebGLRenderer, PerspectiveCamera, Scene, Vector3 } from "three";
import SeedScene from "./objects/Scene.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new Scene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableKeys = false;

const seedScene = new SeedScene();

// scene
scene.add(seedScene);

// camera
camera.position.set(0, 5, 10);
camera.lookAt(new Vector3(0, 0, 0));

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff, 1);

const state = document.createElement("div");
state.style =
  "position: absolute;top: 10px; left: 10px; width: 1d00%;text-align: left;z-index: 100;display:block;";

const probability = document.createElement("div");
probability.style =
  "position: absolute;top: 40px; left: 10px; width: 1d00%;text-align: left;z-index: 100;display:block;";

const gates = document.createElement("div");
gates.style =
  "position: absolute;top: 70px; left: 10px; width: 1d00%;text-align: left;z-index: 100;display:block;";

// render loop
const onAnimationFrameHandler = (timeStamp) => {
  renderer.render(scene, camera);
  seedScene.update && seedScene.update(timeStamp);
  state.innerHTML = seedScene.blochSphere.blochVector.stateToString();
  probability.innerHTML = seedScene.blochSphere.blochVector.probToString();
  gates.innerHTML = seedScene.gatesToString();
  window.requestAnimationFrame(onAnimationFrameHandler);
};
window.requestAnimationFrame(onAnimationFrameHandler);

// resize
const windowResizeHanlder = () => {
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener("resize", windowResizeHanlder);

// dom
document.body.style.margin = 0;
document.body.appendChild(renderer.domElement);
document.body.appendChild(state);
document.body.appendChild(probability);
document.body.appendChild(gates);
