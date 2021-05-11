import * as THREE from "three";
import * as math from "mathjs";
const fontJson = require("../helvetiker_regular.typeface.json");
import { complexToString, round } from "../utilities";

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

    this.add(plane, new GateText(this.title(qMatrix), position));
  }

  title(qMatrix) {
    function matrixIndex(i, j) {
      return complexToString(math.subset(qMatrix, math.index(i, j))) + "   ";
    }
    console.log(qMatrix);

    let result = this.name.concat(
      "\n\n",
      matrixIndex(0, 0),
      matrixIndex(0, 1),
      "\n",
      matrixIndex(1, 0),
      matrixIndex(1, 1)
    );
    return result;
  }

  intersectsPoint(p) {
    return this.boundingBox.containsPoint(p);
  }
}

class GateText extends THREE.Group {
  constructor(text, position) {
    super();

    const geometry = new THREE.TextGeometry(text, {
      font: new THREE.Font(fontJson),
      size: 0.25,
      height: 0.01,
    });

    geometry.translate(position.x - 0.75, position.y + 1 / 3, position.z);
    this.add(
      new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }))
    );
  }
}
