import { addControls } from "./control.js";
import { addLight } from "./light.js";
import { createObject } from "./createObject.js";
import { getDefaultParams } from "./getDefaultParams.js";
import { getGUIFunction } from "./getGUI.js";

const canvas = document.getElementById("creator");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  75,
  globalThis.innerWidth / globalThis.innerHeight,
  0.1,
  1000,
);
camera.position.z = 10;
camera.position.y = 3;

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.shadowMap.enabled = true;

const createFunction = createObject("bookcase");
const guiFuntion = getGUIFunction("bookcase");
const params = getDefaultParams("bookcase");
let object = createFunction(params);
scene.add(object);

function updateObject() {
  scene.remove(object);
  object = createFunction(params);
  scene.add(object);
  addControls(canvas, object);
}

addControls(canvas, object);
addLight(scene);
guiFuntion(params, updateObject);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
