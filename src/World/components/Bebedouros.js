import * as THREE from 'three';

export class Bebedouros {
  static createFloorTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#dcdad5';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#9e9b95';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 6);
    return tex;
  }

  static createTactileTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#55585c';
    ctx.fillRect(0, 0, 128, 128);

    ctx.fillStyle = '#686c70';
    for (let x = 16; x < 128; x += 32) {
      ctx.fillRect(x, 8, 14, 112);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(16, 1);
    return tex;
  }

  static createCeilingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#e6e6e4';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#a8a8a8';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 256, 256);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 6);
    return tex;
  }

  static create() {
    const group = new THREE.Group();

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xebeae6, roughness: 0.85 });
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x8f8e8a, roughness: 0.6 });
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0xf2f2f0, roughness: 0.5 });
    const inoxMat = new THREE.MeshStandardMaterial({
      color: 0xd8dde2,
      metalness: 0.9,
      roughness: 0.18,
    });
    const darkMetalMat = new THREE.MeshStandardMaterial({
      color: 0x222426,
      metalness: 0.6,
      roughness: 0.4,
    });

    // 1. Piso e faixa de piso tátil
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 10),
      new THREE.MeshStandardMaterial({ map: this.createFloorTexture(), roughness: 0.45 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    const tactileStrip = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 0.85),
      new THREE.MeshStandardMaterial({ map: this.createTactileTexture(), roughness: 0.7 })
    );
    tactileStrip.rotation.x = -Math.PI / 2;
    tactileStrip.position.set(0, 0.01, -1.1);
    tactileStrip.receiveShadow = true;
    group.add(tactileStrip);

    // 2. Teto modular
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 10),
      new THREE.MeshStandardMaterial({ map: this.createCeilingTexture(), roughness: 0.8 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 8;
    group.add(ceiling);

    // 3. Parede branca, rodapé e canaleta vertical
    const wall = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 0.4), wallMat);
    wall.position.set(0, 4, -4);
    wall.receiveShadow = true;
    group.add(wall);

    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(14, 0.25, 0.08), baseboardMat);
    baseboard.position.set(0, 0.125, -3.78);
    group.add(baseboard);

    const conduit = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5.6, 12), shelfMat);
    conduit.position.set(0.25, 5.2, -3.76);
    group.add(conduit);

    const outletBox = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.12), inoxMat);
    outletBox.position.set(0.25, 2.35, -3.74);
    group.add(outletBox);

    // 4. Prateleira branca com mãos-francesas
    const shelfBoard = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 1.15), shelfMat);
    shelfBoard.position.set(-1.35, 2.55, -3.22);
    shelfBoard.castShadow = true;
    shelfBoard.receiveShadow = true;
    group.add(shelfBoard);

    [-2.1, -0.6].forEach((bx) => {
      const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.75, 0.07), shelfMat);
      vBar.position.set(bx, 2.15, -3.76);

      const diagBar = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.95, 0.06), shelfMat);
      diagBar.position.set(bx, 2.2, -3.35);
      diagBar.rotation.x = Math.PI / 4;

      group.add(vBar, diagBar);
    });

    // 5. Fervedor inox sobre a prateleira
    const boiler = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.65, 0.92), inoxMat);
    boiler.position.set(-1.35, 3.41, -3.25);
    boiler.castShadow = true;
    boiler.receiveShadow = true;
    group.add(boiler);

    const boilerTray = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.14, 0.35), inoxMat);
    boilerTray.position.set(-1.35, 2.66, -2.65);
    group.add(boilerTray);

    const boilerGrid = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.02, 0.28), darkMetalMat);
    boilerGrid.position.set(-1.35, 2.74, -2.65);
    group.add(boilerGrid);

    const displayBg = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.12, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x111111 })
    );
    displayBg.position.set(-1.1, 3.92, -2.78);

    const displayRed = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.07, 0.025),
      new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 2 })
    );
    displayRed.position.set(-1.1, 3.92, -2.78);

    const ledDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff2200, emissiveIntensity: 2 })
    );
    ledDot.position.set(-1.82, 3.95, -2.78);

    group.add(displayBg, displayRed, ledDot);

    // 6. Bebedouro inox de chão
    const cooler = new THREE.Mesh(new THREE.BoxGeometry(1.45, 3.35, 1.15), inoxMat);
    cooler.position.set(1.65, 1.82, -3.05);
    cooler.castShadow = true;
    cooler.receiveShadow = true;
    group.add(cooler);

    [
      [1.05, -2.6],
      [2.25, -2.6],
      [1.05, -3.5],
      [2.25, -3.5],
    ].forEach(([fx, fz]) => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.16, 12), darkMetalMat);
      foot.position.set(fx, 0.08, fz);
      group.add(foot);
    });

    const coolerTray = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.18, 0.45), inoxMat);
    coolerTray.position.set(1.65, 1.25, -2.3);
    coolerTray.castShadow = true;
    group.add(coolerTray);

    const coolerGrid = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.02, 0.36), darkMetalMat);
    coolerGrid.position.set(1.65, 1.35, -2.3);
    group.add(coolerGrid);

    const labelMat = new THREE.MeshStandardMaterial({ color: 0x2b6cb0, roughness: 0.4 });
    [1.3, 2.0].forEach((lx) => {
      const label = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.02), labelMat);
      label.position.set(lx, 2.68, -2.47);
      group.add(label);
    });

    return group;
  }
}
