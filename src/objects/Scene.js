import * as THREE from "three";

import Lights from "./Lights.js";
import BlochSphere from "./BlochSphere";
import Gate from "./Gate";
import Floor from "./Floor";

export default class Scene extends THREE.Group {
  constructor() {
    super();

    this.blochSphere = new BlochSphere();

    this.gates = [
      new Gate(
        "Pauli X",
        new THREE.Quaternion(0, 0, -1, 0),
        new THREE.Vector3(-6, 0, -1.5)
      ),
      new Gate(
        "Pauli Y",
        new THREE.Quaternion(0, -1, 0, 0),
        new THREE.Vector3(-2, 0, -1.5)
      ),
      new Gate(
        "Pauli Z",
        new THREE.Quaternion(1, 0, 0, 0),
        new THREE.Vector3(2, 0, -1.5)
      ),
      new Gate(
        "Hadamard",
        new THREE.Quaternion(0, 1, 1, 0).normalize(),
        new THREE.Vector3(6, 0, -1.5)
      ),
    ];

    this.add(new Lights(), this.blochSphere, ...this.gates);
  }

  update(timeStamp) {
    this.blochSphere && this.blochSphere.update(timeStamp);

    for (const gate of this.gates) {
      if (gate.intersectsPoint(this.blochSphere.position)) {
        console.log(gate.name);
        this.blochSphere.applyGate(gate.qMatrix, timeStamp);
      }
    }
  }
}
