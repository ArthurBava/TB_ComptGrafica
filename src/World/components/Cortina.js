import * as THREE from 'three';

export class Cortina {
  static create(rapier, rapierWorld) {
    const group = new THREE.Group();

    const housingMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, roughness: 0.4 });
    const fabricMat = new THREE.MeshStandardMaterial({
      color: 0xcfd3d8,
      roughness: 0.85,
      side: THREE.DoubleSide,
    });

    // Rolo superior fixo acima da janela
    const topRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 7.6, 20), housingMat);
    topRoll.rotation.z = Math.PI / 2;
    topRoll.position.set(1.15, 7.85, -7.65);
    group.add(topRoll);

    // Tecido da cortina ancorado no topo
    const fabricGeo = new THREE.PlaneGeometry(7.5, 1);
    fabricGeo.translate(0, -0.5, 0);
    const fabric = new THREE.Mesh(fabricGeo, fabricMat);
    fabric.position.set(1.15, 7.8, -7.62);
    fabric.castShadow = true;
    group.add(fabric);

    // Barra inferior da cortina
    const bottomBar = new THREE.Mesh(new THREE.BoxGeometry(7.55, 0.08, 0.08), housingMat);
    bottomBar.position.set(1.15, 6.0, -7.62);
    group.add(bottomBar);

    // Corpo rígido cinemático no Rapier
    const bodyDesc = rapier.RigidBodyDesc.kinematicPositionBased().setTranslation(1.15, 6.0, -7.62);
    const rigidBody = rapierWorld.createRigidBody(bodyDesc);

    const topY = 7.8;

    return {
      group,
      update(elapsedTime) {
        const targetY = 5.45 + Math.sin(elapsedTime * 1.2) * 1.95;

        rigidBody.setNextKinematicTranslation({ x: 1.15, y: targetY, z: -7.62 });

        const pos = rigidBody.translation();
        bottomBar.position.y = pos.y;
        fabric.scale.y = Math.max(0.1, topY - pos.y);
      },
    };
  }
}