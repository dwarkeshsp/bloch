import * as THREE from "three";

import Lights from "./Lights.js";
import BlochSphere from "./BlochSphere";
import Gate from "./Gate";
import Floor from "./Floor";
import * as math from "mathjs";

export default class Scene extends THREE.Group {
  constructor() {
    super();

    this.blochSphere = new BlochSphere();

    this.gates = [
      new Gate(
        "Pauli X",
        math.matrix([
          [0, 1],
          [1, 0],
        ]),
        new THREE.Vector3(-5, 0, -2.5)
      ),
      new Gate(
        "Pauli Y",
        math.matrix([
          [0, math.complex(0, -1)],
          [math.complex(0, 1), 0],
        ]),
        new THREE.Vector3(-2.5, 0, -2.5)
      ),
      new Gate(
        "Hadamard",
        math.matrix([
          [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
          [1 / Math.sqrt(2), -1 / Math.sqrt(2)],
        ]),
        new THREE.Vector3(0, 0, -2.5)
      ),
      new Gate(
        "Pauli Z",
        math.matrix([
          [1, 0],
          [0, -1],
        ]),
        new THREE.Vector3(2.5, 0, -2.5)
      ),
      new Gate(
        "Phase",
        math.matrix([
          [1, 0],
          [0, math.complex(0, 1)],
        ]),
        new THREE.Vector3(5, 0, -2.5)
      ),
      new Gate(
        "R_y π/8",
        math.matrix([
          [math.cos(math.pi / 8), -math.sin(math.pi / 8)],
          [math.sin(math.pi / 8), math.cos(math.pi / 8)],
        ]),
        new THREE.Vector3(7.5, 0, -2.5)
      ),
    ];

    this.add(new Lights(), this.blochSphere, ...this.gates);

    this.gatesApplied = [];
  }

  update(timeStamp) {
    this.blochSphere && this.blochSphere.update(timeStamp);

    for (const gate of this.gates) {
      if (gate.intersectsPoint(this.blochSphere.position)) {
        console.log(gate.name);
        this.gatesApplied.push(gate.name);
        this.blochSphere.applyQMatrix(gate.qMatrix);
      }
    }
  }

  gatesToString() {
    let result = "Gates applied: ";
    for (const gate of this.gatesApplied) {
      result += gate + ", ";
    }

    return result;
  }
}
