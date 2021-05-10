import * as math from "mathjs";
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

  applyQMatrix(qMatrix) {
    // console.log("before", this.state);

    this.state = math.multiply(qMatrix, this.state);
    const alpha = math.subset(this.state, math.index(0, 0));
    const beta = math.subset(this.state, math.index(1, 0));

    // equation derived using http://akyrillidis.github.io/notes/quant_post_7
    this.theta = math.re(math.multiply(2, math.acos(alpha)));
    this.phi = math.re(
      math.divide(
        math.log(math.divide(beta, math.sin(this.theta / 2))),
        math.complex(0, 1)
      )
    );

    console.log("state", alpha, beta);

    console.log("angles", this.theta, this.phi);

    if (isNaN(this.theta) || this.theta == Infinity || this.theta == -Infinity)
      this.theta = 0;
    if (isNaN(this.phi) || this.phi == Infinity || this.phi == -Infinity)
      this.phi = 0;

    // this.rotation.x = this.theta;

    // console.log("after", this.state);

    this.rotating = true;

    // this.arrow.material.color = this.color();
    // this.axis.material.color = this.color();
  }

  color() {
    const r = Math.round(this.quaternion.x * 128 + 127).toString();
    const g = Math.round(this.quaternion.y * 128 + 127).toString();
    const b = Math.round(this.quaternion.z * 128 + 127).toString();
    return new THREE.Color("rgb(" + r + ", " + g + ", " + b + ")");
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

      if (this.rotation.x == this.theta && this.rotation.z == this.phi) {
        this.rotating = false;
        console.log("rotation done");
      }
    }
  }
}
