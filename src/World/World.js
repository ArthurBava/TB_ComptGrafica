import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GuiControls } from './systems/GuiControls.js';

import { Camera } from './components/Camera.js';
import { Scene } from './components/Scene.js';
import { Light } from './components/Light.js';
import { Room } from './components/Room.js';
import { Luminaria } from './components/Luminaria.js';
import { Cortina } from './components/Cortina.js';
import { Bebedouros } from './components/Bebedouros.js';

import { Renderer } from './systems/Renderer.js';
import { Resizer } from './systems/Resizer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera;
let renderer;
let scene;
let controls;
let resizer;
let cena1Group;
let cena2Group;
let rapierWorld;
let cortinaController;
let guiControls;
const loadedModels = [];
const clock = new THREE.Clock();

class World {
  constructor(container) {
    camera = Camera.create();
    renderer = Renderer.create();
    renderer.shadowMap.enabled = true;
    container.append(renderer.domElement);
    resizer = new Resizer(container, camera, renderer);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);

    guiControls = new GuiControls();
    scene = Scene.create();
    Scene.setBackgroundColor(scene, 0x15181e);

    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.35;
    } catch (e) {
      console.warn('Ambiente de reflexo ignorado:', e);
    }

    const ambientLight = Light.createAmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    // =========================================================
    // CENA 1: OBRIGATÓRIA (70%) - SALA
    // =========================================================
    cena1Group = new THREE.Group();
    scene.add(cena1Group);

    cena1Group.add(Room.create());

   const luminaria = Luminaria.create();
    luminaria.rotation.y = Math.PI / 2;
    luminaria.position.x = 4.0; // Aumente ou diminua este valor para ajustar para a direita
    cena1Group.add(luminaria);

    this.initPhysics();

    // 1. Sofá preto abaixo da janela
    this.loadModel(cena1Group, 'C1_Sofa', [
      'src/World/assets/sofa.glb',
      'src/World/assets/low_poly_sofa.glb',
    ], {
      pos: { x: -1.25, y: 0.00, z: -6.50 },
      rot: { x: 0.00, y: -1.55, z: 0.00 },
      targetSize: 6.2,
    });

    // 2. Vaso de planta entre o sofá e a poltrona
    this.loadModel(cena1Group, 'C1_Planta', [
      'src/World/assets/vaso_de_plantas/scene.gltf',
      'src/World/assets/scene.gltf',
      'src/World/assets/planta.glb',
    ], {
      pos: { x: 3.80, y: 0.00, z: -6.90 },
      rot: { x: 0.00, y: 0.30, z: 0.00 },
      targetSize: 3.5,
      doubleSide: true,
    });

    // 3. Poltrona marrom no canto direito
    this.loadModel(cena1Group, 'C1_Poltrona', [
      'src/World/assets/poltrona.glb',
    ], {
      pos: { x: 6.15, y: 0.00, z: -4.70 },
      rot: { x: -0.05, y: -1.00, z: -0.05 },
      targetSize: 3.51,
      tintColor: 0x6B574A,
    });

    // 4. Quatro almofadas coloridas apoiadas no sofá
    this.loadModel(cena1Group, 'C1_Almofada_Roxa', ['src/World/assets/almofada.glb'], {
      pos: { x: -2.15, y: 1.40, z: -5.40 },
      rot: { x: -1.65, y: 0.00, z: -0.20 },
      targetSize: 0.9,
      tintColor: 0x7b68ee,
    });

    this.loadModel(cena1Group, 'C1_Almofada_Rosa', ['src/World/assets/almofada.glb'], {
      pos: { x: -0.70, y: 1.30, z: -6.55 },
      rot: { x: -0.35, y: -0.20, z: 0.00 },
      targetSize: 0.9,
      tintColor: 0xd94e8f,
    });

    this.loadModel(cena1Group, 'C1_Almofada_Azul', ['src/World/assets/almofada.glb'], {
      pos: { x: 0.00, y: 1.30, z: -6.30 },
      rot: { x: -0.30, y: 0.10, z: 0.00 },
      targetSize: 0.88,
      tintColor: 0x87ceeb,
    });

    this.loadModel(cena1Group, 'C1_Almofada_Salmao', ['src/World/assets/almofada.glb'], {
      pos: { x: 0.75, y: 1.25, z: -6.30 },
      rot: { x: -0.20, y: -0.15, z: -0.10 },
      targetSize: 0.88,
      tintColor: 0xf4a49e,
    });

    // 5. Ar-condicionado acima da janela
    this.loadModel(cena1Group, 'C1_Ar', ['src/World/assets/ar.glb'], {
      pos: { x: -2.60, y: 8.15, z: -7.55 },
      rot: { x: 0.00, y: 0.00, z: 0.00 },
      targetSize: 3.3,
    });

    // =========================================================
    // CENA 2: OPÇÃO 1 (30%) - BEBEDOUROS
    // =========================================================
    cena2Group = new THREE.Group();
    cena2Group.visible = false;
    scene.add(cena2Group);

    cena2Group.add(Bebedouros.create());

    const coolerLight = new THREE.DirectionalLight(0xffffff, 1.4);
    coolerLight.position.set(-3, 7, 4);
    coolerLight.castShadow = true;
    cena2Group.add(coolerLight);

    // Torneiras alinhadas nos equipamentos
    this.loadModel(cena2Group, 'C2_Torneira_Fervedor', ['src/World/assets/torneira.glb'], {
      pos: { x: -1.45, y: 3.55, z: -2.70 },
      rot: { x: -0.40, y: 1.55, z: 0.50 },
      targetSize: 0.35,
    });
    this.loadModel(cena2Group, 'C2_Torneira_Esq', ['src/World/assets/torneira.glb'], {
      pos: { x: 1.30, y: 2.38, z: -2.35 },
      rot: { x: 0.00, y: 1.40, z: 0.00 },
      targetSize: 0.35,
    });
    this.loadModel(cena2Group, 'C2_Torneira_Dir', ['src/World/assets/torneira.glb'], {
      pos: { x: 2.00, y: 2.38, z: -2.35 },
      rot: { x: 0.00, y: 1.50, z: 0.00 },
      targetSize: 0.35,
    });

    // =========================================================
    // SELETOR DE CENAS E CONTROLES
    // =========================================================
    const state = {
      cena: 'Cena 1 - Sala (70%)',
      resetarCamera: () => trocarCena(state.cena),
    };

    const trocarCena = (valor) => {
      const isCena1 = valor === 'Cena 1 - Sala (70%)';
      cena1Group.visible = isCena1;
      cena2Group.visible = !isCena1;

      if (isCena1) {
        camera.position.set(-6.2, 5.2, 4.5);
        controls.target.set(0.5, 3.2, -5.5);
      } else {
        camera.position.set(4.2, 3.6, 2.2);
        controls.target.set(0.3, 2.3, -3.0);
      }
      controls.update();
    };

    trocarCena(state.cena);

    const sceneCtrl = guiControls.datGui
      .add(state, 'cena', ['Cena 1 - Sala (70%)', 'Cena 2 - Bebedouros (30%)'])
      .name('Cena Ativa')
      .onChange(trocarCena);

    guiControls.datGui.add(state, 'resetarCamera').name('Resetar Camera (R)');

    window.addEventListener('keydown', (e) => {
      if (e.key === '1') {
        state.cena = 'Cena 1 - Sala (70%)';
        sceneCtrl.updateDisplay();
        trocarCena(state.cena);
      } else if (e.key === '2') {
        state.cena = 'Cena 2 - Bebedouros (30%)';
        sceneCtrl.updateDisplay();
        trocarCena(state.cena);
      } else if (e.key.toLowerCase() === 'r') {
        trocarCena(state.cena);
      }
    });

    guiControls.addCameraFolder(camera, controls);
    guiControls.addLightFolder(ambientLight);
    guiControls.datGui.open();
  }

  async initPhysics() {
    await RAPIER.init();
    rapierWorld = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });
    cortinaController = Cortina.create(RAPIER, rapierWorld);
    cena1Group.add(cortinaController.group);
  }

  loadModel(targetGroup, nome, paths, options = {}) {
    const {
      pos = { x: 0, y: 0, z: 0 },
      rot = { x: 0, y: 0, z: 0 },
      targetSize = 2.0,
      tintColor = null,
      doubleSide = false,
    } = options;

    const pathList = Array.isArray(paths) ? paths : [paths];
    const loader = new GLTFLoader();

    const tryLoad = (index) => {
      if (index >= pathList.length) {
        console.warn(`Arquivo não encontrado para ${nome}:`, pathList);
        return;
      }

      loader.load(
        pathList[index],
        (gltf) => {
          const rawModel = gltf.scene;

          const box = new THREE.Box3().setFromObject(rawModel);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);

          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const autoScale = targetSize / maxDim;

          rawModel.scale.setScalar(autoScale);
          rawModel.position.set(
            -center.x * autoScale,
            -box.min.y * autoScale,
            -center.z * autoScale
          );

          const wrapper = new THREE.Group();
          wrapper.add(rawModel);
          wrapper.position.set(pos.x, pos.y, pos.z);
          wrapper.rotation.set(rot.x || 0, rot.y || 0, rot.z || 0);

          rawModel.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                if (tintColor !== null) {
                  child.material = child.material.clone();
                  child.material.color.setHex(tintColor);
                }
                if (doubleSide) {
                  child.material.side = THREE.DoubleSide;
                }
              }
            }
          });

          targetGroup.add(wrapper);
          loadedModels.push({ nome, wrapper, baseTargetSize: targetSize });

          const folder = guiControls.datGui.addFolder(nome);
          folder.add(wrapper.position, 'x', -8, 8, 0.05);
          folder.add(wrapper.position, 'y', 0, 10, 0.05);
          folder.add(wrapper.position, 'z', -8, 8, 0.05);
          folder.add(wrapper.rotation, 'x', -Math.PI, Math.PI, 0.05).name('rotacaoX');
          folder.add(wrapper.rotation, 'y', -Math.PI, Math.PI, 0.05).name('rotacaoY');
          folder.add(wrapper.rotation, 'z', -Math.PI, Math.PI, 0.05).name('rotacaoZ');
          const cfg = { escala: 1 };
          folder.add(cfg, 'escala', 0.1, 5, 0.05).onChange((v) => wrapper.scale.setScalar(v));
        },
        undefined,
        () => tryLoad(index + 1)
      );
    };

    tryLoad(0);
  }

  render() {
    renderer.setAnimationLoop(() => {
      const elapsed = clock.getElapsedTime();

      if (rapierWorld && cortinaController && cena1Group.visible) {
        cortinaController.update(elapsed);
        rapierWorld.step();
      }

      controls.update();
      renderer.render(scene, camera);
    });
  }
}

export { World };