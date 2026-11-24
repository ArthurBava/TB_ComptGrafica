import * as THREE from "three";

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GuiControls } from './systems/GuiControls.js';

import { Camera } from './components/Camera.js';
import { Scene } from './components/Scene.js';
import { Floor } from './components/Floor.js';
import { Light } from './components/Light.js';

import { Renderer } from './systems/Renderer.js';
import { Resizer } from './systems/Resizer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera;
let renderer;
let scene;
let controls;
let resizer;
let mainGroup;

class World {
  constructor(container) {
    camera = Camera.create();
    renderer = Renderer.create();
    container.append(renderer.domElement);
    resizer = new Resizer(container, camera, renderer);

    // Controle da câmera com mouse e teclado
    controls = new OrbitControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);

    // Menu de controle no canto superior direito (dat.GUI)
    const guiControls = new GuiControls();

    // Posição inicial da câmera
    camera.position.set(0, 15, 30);

    scene = Scene.create();
    Scene.addGridHelper(scene, 40, 40).helper.visible = true; // grade no chão
    Scene.addAxesHelper(scene, 32).helper.visible = true;     // eixos X, Y, Z
    Scene.setBackgroundColor(scene, 0x21272e);                // fundo escuro neutro

    // Grupo principal onde vamos colocar todos os móveis e paredes
    mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Piso da sala (já existia no código do professor)
    const floor = Floor.createPlaneFloor();
    floor.material.color.set('lightgray');
    mainGroup.add(floor);

    // Iluminação básica
    const ambientLight = Light.createAmbientLight(0xffffff, 0.6);
    mainGroup.add(ambientLight);

    const directionalLight = Light.createDirectionalLight(2.5, 15, 10, 0xffffff, 1);
    const dlHelper = Light.createDirectionalLightHelper(directionalLight, 3);
    dlHelper.visible = true;
    mainGroup.add(directionalLight, dlHelper);

    // Painéis do menu lateral
    guiControls.addCameraFolder(camera, controls);
    guiControls.addLightFolder(ambientLight);
    guiControls.addLightFolder(directionalLight, dlHelper);
    guiControls.addSceneFolder(scene);
    guiControls.datGui.open();
  }

  render() {
    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });
  }
}

export { World };