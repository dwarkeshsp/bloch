import * as THREE from "three";

import Lights from "./Lights.js";
import BlochSphere from "./BlochSphere";
import Gate from "./Gate";

export default class SeedScene extends THREE.Group {
  constructor() {
    super();

    this.blochSphere = new BlochSphere();

    this.gates = [
      new Gate(
        "Pauli X",
        new THREE.Quaternion(0, 0, 1, 0),
        new THREE.Vector3(-6, 0, -2.5)
      ),
      new Gate(
        "Pauli Y",
        new THREE.Quaternion(0, 1, 0, 0),
        new THREE.Vector3(-2, 0, -2.5)
      ),
      new Gate(
        "Pauli Z",
        new THREE.Quaternion(1, 0, 0, 0),
        new THREE.Vector3(2, 0, -2.5)
      ),
      new Gate(
        "Hadamard",
        new THREE.Quaternion(0, 1, 0, 1).normalize(),
        new THREE.Vector3(6, 0, -2.5)
      ),
    ];

    this.add(new Lights(), this.blochSphere);
  }

  update(timeStamp) {
    this.blochSphere && this.blochSphere.update(timeStamp);
  }
}
