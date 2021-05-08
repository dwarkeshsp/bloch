import * as THREE from "three";

export default class Scene extends THREE.Group {
  constructor() {
    super();
    const geometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      side: THREE.BackSide,
    });
    const floor = new THREE.Mesh(geometry, material);
    floor.rotation.x = Math.PI / 2;
    floor.translateZ(1);
    this.add(floor);
  }
}
