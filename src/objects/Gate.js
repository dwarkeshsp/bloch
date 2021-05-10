import * as THREE from "three";

export default class Gate extends THREE.Group {
  constructor(name, qMatrix, position) {
    super();

    this.name = name;

    this.qMatrix = qMatrix;

    const geometry = new THREE.BoxGeometry(2, 2, 0.05);
    geometry.translate(position.x, position.y, position.z);

    const plane = new THREE.Mesh(
      geometry,
      new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      })
    );

    plane.geometry.computeBoundingBox();
    this.boundingBox = plane.geometry.boundingBox.clone();

    this.add(plane);
  }

  intersectsPoint(p) {
    return this.boundingBox.containsPoint(p);
  }
}
