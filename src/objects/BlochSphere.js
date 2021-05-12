import { min } from "mathjs";
import * as THREE from "three";
import BlochVector from "./BlochVector";

export default class BlochSphere extends THREE.Group {
  // Code partly adapted from https://github.com/stewdio/q.js/blob/master/Q/Q-BlochSphere.js
  constructor() {
    super();

    this.blochVector = new BlochVector();
    this.target = new THREE.Vector3();
    this.moving = false;

    document.addEventListener("keydown", (ev) => this.onKeyDown(ev.key));

    //TODO: add color gradient:  https://stackoverflow.com/questions/52614371/apply-color-gradient-to-material-on-mesh-three-js/52615186#52615186
    const surface = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.25,
        color: 0xffffff,
      })
    );

    surface.receiveShadow = true;

    const xAxis = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 0.01, 2.5),
      new THREE.MeshBasicMaterial({ color: 0x333333 })
    );

    const yAxis = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.01, 0.01),
      new THREE.MeshBasicMaterial({ color: 0x333333 })
    );

    const zAxis = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 2.5, 0.01),
      new THREE.MeshBasicMaterial({ color: 0x333333 })
    );

    const xArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1.0),
      new THREE.Vector3(0, 0, 1.25),
      0.1,
      0x333333,
      0.1,
      0.1
    );

    const yArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1.0, 0, 0),
      new THREE.Vector3(1.25, 0, 0),
      0.1,
      0x333333,
      0.1,
      0.1
    );

    const zArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1.0, 0),
      new THREE.Vector3(0, 1.25, 0),
      0.1,
      0x333333,
      0.1,
      0.1
    );

    const xLabel = new Label("x", new THREE.Vector3(0, 0, 1.65));
    const yLabel = new Label("y", new THREE.Vector3(1.65, 0, 0));
    const zLabel = new Label("z", new THREE.Vector3(0, 1.65, 0));

    const zeroLabel = new Label("|0〉", new THREE.Vector3(0, 1.45, 0));
    const oneLabel = new Label("|1〉", new THREE.Vector3(0, -1.45, 0));

    const plusLabel = new Label("|+〉", new THREE.Vector3(0, 0, 1.45));
    const minusLabel = new Label("|-〉", new THREE.Vector3(0, 0, -1.45));

    const iLabel = new Label("|i〉", new THREE.Vector3(1.45, 0, 0));
    const minusILabel = new Label("|-i〉", new THREE.Vector3(-1.45, 0, 0));

    this.add(
      surface,
      xAxis,
      yAxis,
      zAxis,
      xArrow,
      yArrow,
      zArrow,
      xLabel,
      yLabel,
      zLabel,
      zeroLabel,
      oneLabel,
      plusLabel,
      minusLabel,
      iLabel,
      minusILabel,
      this.blochVector
    );

    this.rotateY(-Math.PI / 4);
  }

  onKeyDown(key) {
    switch (key) {
      case "w":
        this.target = this.target
          .clone()
          .sub(new THREE.Vector3(0, 0, 1).normalize());
        break;
      case "s":
        this.target = this.target
          .clone()
          .add(new THREE.Vector3(0, 0, 1).normalize());
        break;
      case "a":
        this.target = this.target
          .clone()
          .sub(new THREE.Vector3(1, 0, 0).normalize());
        break;
      case "d":
        this.target = this.target
          .clone()
          .add(new THREE.Vector3(1, 0, 0).normalize());
        break;
    }
    this.moving = true;
  }

  update(timeStamp) {
    if (this.moving) {
      const difference = this.target.clone().sub(this.position);
      if (Math.abs(difference.length()) > 0.01) {
        difference.divideScalar(10);
      }
      this.position.add(difference);
      if (this.position.equals(this.target)) {
        this.moving = false;
        console.log("movement done");
      }
    }

    this.blochVector.update(timeStamp);
  }

  applyQMatrix(qMatrix) {
    this.blochVector.applyQMatrix(qMatrix);
  }
}

class Label extends THREE.Group {
  constructor(text, position) {
    super();

    const textStyle = {
      width: 128,
      height: 128,
      fillStyle: 0xffffff,
      font: 'bold italic 64px Georgia, "Times New Roman", serif',
    };

    const label = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: Object.assign(SurfaceText(textStyle)),
      })
    );

    label.material.map.print(text);
    label.position.set(position.x, position.y, position.z);
    label.scale.set(0.33, 0.33, 0.33);
    this.add(label);
  }
}

// Code from https://github.com/stewdio/q.js/blob/9cf1add65e4c05c5ec458af88d41bfe22aecdc54/assets/SurfaceText.js
const SurfaceText = function (options) {
  if (options === undefined) options = {};

  if (typeof options.width !== "number") options.width = 1024; //  Pixels to render.
  if (typeof options.height !== "number") options.height = 1024; //
  if (typeof options.flipHorizontal !== "boolean")
    options.flipHorizontal = false;
  if (typeof options.flipVertical !== "boolean") options.flipVertical = false;

  if (options.fontFamily === undefined)
    options.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
  if (options.fontSize === undefined) options.fontSize = "128px";
  if (typeof options.fontSize === "number")
    options.fontSize = options.fontSize + "px";

  if (options.lineHeight === undefined)
    options.lineHeight = parseFloat(options.fontSize) * 1.2 + "px";
  if (typeof options.lineHeight === "number")
    options.lineHeight = options.lineHeight + "px";

  if (options.textAlign === undefined) options.textAlign = "center";
  if (options.fillStyle === undefined) options.fillStyle = "white";
  if (options.textBaseline === undefined) options.textBaseline = "middle"; //alphabetic'
  if (options.textAlign === undefined) options.verticalAlign = "middle";
  if (options.font === undefined)
    options.font = options.fontSize + " " + options.fontFamily;
  if (options.measure === undefined) options.measure = options.width;

  if (options.text === undefined) options.text = "";

  const canvas = document.createElement("canvas");
  canvas.width = options.width;
  canvas.height = options.height;

  const context = canvas.getContext("2d"),
    translateX = options.flipHorizontal ? options.width : 0,
    translateY = options.flipVertical ? options.height : 0,
    scaleX = options.flipHorizontal ? -1 : 1,
    scaleY = options.flipVertical ? -1 : 1;

  Object.assign(context, options); //  Too promiscuous?
  context.translate(translateX, translateY);
  context.scale(scaleX, scaleY);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  function wordWrap(text) {
    const glue = " ",
      words = text.split(glue),
      lines = [];

    if (words.length <= 1) return words;

    let lineLast = words[0],
      lineLength = 0;

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      lineLength = context.measureText(lineLast + glue + word).width;
      if (lineLength < options.measure) {
        lineLast += glue + word;
      } else {
        lines.push(lineLast);
        lineLast = word;
      }
      if (i === words.length - 1) lines.push(lineLast);
    }
    return lines;
  }

  texture.print = function (text, x, y) {
    if (!text) text = options.text;
    else options.text = text;

    const lines = wordWrap(text),
      lineHeight = Number.parseFloat(options.lineHeight);

    if (x === undefined) x = options.x;
    if (y === undefined) y = options.y;
    if (typeof x !== "number") {
      if (options.textAlign === "left") x = 0;
      else if (options.textAlign === "right") x = options.width;
      else x = options.width / 2;
    }
    if (typeof y !== "number") {
      if (options.verticalAlign === "top") y = 0;
      else if (options.verticalAlign === "bottom") y = options.height;
      else y = options.height / 2 - (lineHeight * (lines.length - 1)) / 2;
    }
    context.clearRect(0, 0, options.width, options.height);
    if (options.backgroundColor !== undefined) {
      context.fillStyle = options.backgroundColor;
      context.fillRect(0, 0, options.width, options.height);
      context.fillStyle = options.fillStyle;
    }
    for (let i = 0; i < lines.length; i++) {
      context.fillText(lines[i], x, y + i * lineHeight);
    }
    texture.needsUpdate = true;
  };

  texture.print(options.text, options.x, options.y);
  return texture;
};

export { SurfaceText };
