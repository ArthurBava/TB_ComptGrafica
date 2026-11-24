import * as THREE from 'three';

export class Room {
  static createTileTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#e4e4e4';
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = '#bcbcbc';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(8, 8);
    return texture;
  }

  static create() {
    const group = new THREE.Group();

    const whiteWallMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.85 });
    const darkWallMat = new THREE.MeshStandardMaterial({ color: 0x1c1e22, roughness: 0.9 });
    const floorMat = new THREE.MeshStandardMaterial({
      map: this.createTileTexture(),
      roughness: 0.4,
    });

    // Piso
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    group.add(floor);

    // Teto
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), whiteWallMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 10;
    group.add(ceiling);

    // Parede direita preta (sem as letras)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.4, 10, 16), darkWallMat);
    rightWall.position.set(8, 5, 0);
    rightWall.receiveShadow = true;
    group.add(rightWall);

    // Pilar branco no canto
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 10, 1.2), whiteWallMat);
    pillar.position.set(7.1, 5, -7.4);
    pillar.castShadow = true;
    pillar.receiveShadow = true;
    group.add(pillar);

    // Parede da janela dividida em blocos ao redor do vão
    const bottomWall = new THREE.Mesh(new THREE.BoxGeometry(16, 3.2, 0.4), whiteWallMat);
    bottomWall.position.set(0, 1.6, -8);
    bottomWall.receiveShadow = true;

    const topWall = new THREE.Mesh(new THREE.BoxGeometry(16, 2.3, 0.4), whiteWallMat);
    topWall.position.set(0, 8.85, -8);

    const sideLeftWall = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4.5, 0.4), whiteWallMat);
    sideLeftWall.position.set(-7.25, 5.45, -8);

    const sideRightWall = new THREE.Mesh(new THREE.BoxGeometry(3.0, 4.5, 0.4), whiteWallMat);
    sideRightWall.position.set(6.5, 5.45, -8);

    group.add(bottomWall, topWall, sideLeftWall, sideRightWall);

    // Vidro escuro da janela
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x11161d,
      roughness: 0.1,
      metalness: 0.2,
    });
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(11.5, 4.5), glassMat);
    glass.position.set(-0.75, 5.45, -8.05);
    group.add(glass);

    // Esquadrias brancas da janela
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const hMid = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.14, 0.22), frameMat);
    hMid.position.set(-0.75, 5.9, -7.95);

    const hTop = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.16, 0.22), frameMat);
    hTop.position.set(-0.75, 7.65, -7.95);

    const hBot = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.16, 0.22), frameMat);
    hBot.position.set(-0.75, 3.25, -7.95);

    group.add(hMid, hTop, hBot);

    [-6.45, -2.65, 1.15, 4.95].forEach((vx) => {
      const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.15, 4.5, 0.22), frameMat);
      vBar.position.set(vx, 5.45, -7.95);
      group.add(vBar);
    });

    return group;
  }
}