import * as THREE from 'three';

export class Luminaria {
  static create() {
    const group = new THREE.Group();

    const capMat = new THREE.MeshStandardMaterial({ color: 0xe8e8e8, roughness: 0.4 });
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });

    // Tubo luminoso central
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 5.2, 20), tubeMat);
    tube.rotation.z = Math.PI / 2;

    // Pontas da luminária
    const capLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.45, 20), capMat);
    capLeft.rotation.z = Math.PI / 2;
    capLeft.position.x = -2.75;

    const capRight = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.45, 20), capMat);
    capRight.rotation.z = Math.PI / 2;
    capRight.position.x = 2.75;

    // Luz real emitida no ambiente
    const light = new THREE.PointLight(0xfff8ee, 45, 25, 1.5);
    light.position.set(0, -0.4, 0);
    light.castShadow = true;
    light.shadow.mapSize.set(1024, 1024);

    group.add(tube, capLeft, capRight, light);
    group.position.set(0.5, 9.75, -3.5);

    return group;
  }
}