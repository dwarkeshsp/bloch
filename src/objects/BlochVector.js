import * as math from "mathjs";
import { string } from "mathjs";
import * as THREE from "three";

export default class BlochVector extends THREE.Group {
  constructor() {
    super();

    this.state = math.matrix([[1], [0]]);
    this.theta = 0;
    this.phi = 0;

    this.rotating = false;

    const axis = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 1),
      new THREE.MeshBasicMaterial({ color: this.color() })
    );
    axis.translateY(0.5);

    this.axis = axis;

    const arrow = new THREE.Mesh(
      new THREE.ConeGeometry(0.1, 0.2, 32),
      new THREE.MeshBasicMaterial({ color: this.color() })
    );
    arrow.translateY(1.1);

    this.arrow = arrow;

    this.add(this.axis, this.arrow);
  }

  alpha() {
    return math.subset(this.state, math.index(0, 0));
  }

  beta() {
    return math.subset(this.state, math.index(1, 0));
  }

  applyQMatrix(qMatrix) {
    // console.log("before", this.state);

    this.state = math.multiply(qMatrix, this.state);
    // equation derived using http://akyrillidis.github.io/notes/quant_post_7
    this.theta = math.re(math.multiply(2, math.acos(this.alpha())));
    this.phi = math.re(
      math.im(math.log(math.divide(this.beta(), math.sin(this.theta / 2))))
    );

    console.log("state", this.alpha(), this.beta());

    console.log("angles", this.theta, this.phi);

    if (isNaN(this.theta) || this.theta == Infinity || this.theta == -Infinity)
      this.theta = 0;
    if (isNaN(this.phi) || this.phi == Infinity || this.phi == -Infinity)
      this.phi = 0;

    this.rotating = true;
  }

  color() {
    const g = this.rotation.x / Math.PI;
    const b = this.rotation.y / Math.PI;
    const r = this.rotation.z / Math.PI;
    return new THREE.Color(r, g, b);
  }

  update(timeStamp) {
    if (this.rotating) {
      let dTheta = this.theta - this.rotation.x;
      if (Math.abs(dTheta) > 0.01) {
        dTheta /= 10;
      }
      this.rotation.x += dTheta;

      let dPhi = -this.phi - this.rotation.z;
      if (Math.abs(dPhi) > 0.01) {
        dPhi /= 10;
      }
      this.rotation.z += dPhi;

      this.arrow.material.color = this.color();
      this.axis.material.color = this.color();
      // console.log(this.rotation.toArray());
      console.log(this.color());

      if (this.rotation.x == this.theta && this.rotation.z == this.phi) {
        this.rotating = false;
        console.log("rotation done");
      }
    }
  }

  stateToString() {
    const alpha = this.alpha();
    const beta = this.beta();

    return "Amplitudes: [ ".concat(
      round(math.re(alpha)),
      " + ",
      round(math.im(alpha)),
      "i, ",
      round(math.re(beta)),
      " + ",
      round(math.im(beta)),
      "i ]"
    );
  }

  probToString() {
    return "Probabilities : [ ".concat(
      round(math.abs(math.square(this.alpha()))),
      ", ",
      round(math.abs(math.square(this.beta()))),
      " ]"
    );
  }
}

function round(num) {
  return (Math.round(num * 100) / 100).toString();
}
