export function addLight(scene) {
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  light.castShadow = false;
  scene.add(light);
}
