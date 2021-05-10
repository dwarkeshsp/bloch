import * as THREE from "three";

export default class BlochVector extends THREE.Group {
  constructor() {
    super();

    this.currentQuaternion = this.quaternion;
    this.targetQuaternion = this.currentQuaternion;
    this.timeStart = 0;
    // w = cos (theta /2)
    // x = ux * sin(theta / 2)
    console.log(this.quaternion);

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

  color() {
    const r = Math.round(this.quaternion.x * 128 + 127).toString();
    const g = Math.round(this.quaternion.y * 128 + 127).toString();
    const b = Math.round(this.quaternion.z * 128 + 127).toString();
    return new THREE.Color("rgb(" + r + ", " + g + ", " + b + ")");
  }

  applyGate(q, timeStamp) {
    console.log("before", this.quaternion);
    // this.setRotationFromQuaternion(this.quaternion.clone().multiply(q));
    this.quaternion.multiply(q);
    // this.setRotationFromQuaternion()
    // console.log(this.quaternion);
    // this.rotateX(Math.PI / 2);

    console.log("after", this.quaternion);

    // this.arrow.material.color = this.color();
    // this.axis.material.color = this.color();

    // this.timeStart = timeStamp;
  }

  update(timeStamp) {
    // if (timeStamp < this.timeStart + 1000) {
    //   console.log("hreerd");
    //   this.setRotationFromQuaternion(
    //     this.currentQuaternion
    //       .clone()
    //       .slerp(this.targetQuaternion, timeStamp / 1000)
    //   );
    // } else {
    //   this.currentQuaternion = this.quaternion;
    // }
  }
}
