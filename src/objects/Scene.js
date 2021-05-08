import { Group } from "three";

import BasicLights from "./Lights.js";
import BlochSphere from "./BlochSphere";

export default class SeedScene extends Group {
  constructor() {
    super();

    const lights = new BasicLights();
    this.blochSphere = new BlochSphere();

    this.add(lights, this.blochSphere);
  }

  update(timeStamp) {
    this.blochSphere && this.blochSphere.update(timeStamp);
  }
}
