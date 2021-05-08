import * as THREE from "three";

export default class Gate extends THREE.Group {
  constructor(name, unitQuaterion, position) {
    super();

    this.name = name;
    this.unitQuaterion = unitQuaterion;

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshPhongMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      })
    );
    plane.translateX(position.x);
    plane.translateY(position.y);
    plane.translateZ(position.z);

    plane.geometry.computeBoundingBox();
    this.boundingBox = plane.geometry.boundingBox;

    this.add(plane);

    // const textStyle = {
    //   width: 128,
    //   height: 128,
    //   fillStyle: 0xffffff,
    //   font: 'bold italic 64px Georgia, "Times New Roman", serif',
    // };

    // const text = new THREE.Sprite(
    //   new THREE.SpriteMaterial({ map: SurfaceText(textStyle) })
    // );

    // text.material.map.print(name);
    // // text.position.set(0, 0, 1.45);
    // text.scale.set(0.25, 0.25, 0.25);

    // const loader = new THREE.FontLoader();

    // loader.load("", function (font) {
    //   const geometry = new THREE.TextGeometry("Hello three.js!", {
    //     font: font,
    //     size: 80,
    //     height: 5,
    //     curveSegments: 12,
    //     bevelEnabled: true,
    //     bevelThickness: 10,
    //     bevelSize: 8,
    //     bevelOffset: 0,
    //     bevelSegments: 5,
    //   });
    // });

    // const mesh = new THREE.Mesh(geometry,new THREE.MeshBasicMaterial( { color: 0xffff00 } ));

    // this.add(plane, text);
  }

  //   intersectsPoint(p) {
  //     const min = this.boundingBox.min,
  //       max = this.boundingBox.max;
  //     return (
  //       min.x < p.x &&
  //       min.y < p.y &&
  //       min.z < p.z &&
  //       max.x > p.x &&
  //       max.y > p.y &&
  //       max.z > p.z
  //     );
  //   }
}
