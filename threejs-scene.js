import * as THREE from 'three';
import {OrbitControls} from "three/addons";
import {GLTFLoader} from "three/addons";

function loadThreeJsScene() {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000);
  camera.position.y = 5;
  camera.position.z = 5;

  const axesHelper = new THREE.AxesHelper(5);
  axesHelper.setColors('red', 'green', 'blue');
  scene.add(axesHelper);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  class Box extends THREE.Mesh {

    constructor(
      width,
      height,
      depth,
      color,
      velocity = {x: 0, y: 0, z: 0},
      position = {x: 0, y: 0, z: 0}
    ) {

      super(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshStandardMaterial({color})
      );

      this.width = width;
      this.height = height;
      this.depth = depth;

      this.velocity = velocity;
      this.gravity = -0.002;

      this.top = this.position.y + this.height / 2;
      this.bottom = this.position.y - this.height / 2;

      this.position.set(position.x, position.y, position.z);
    }

    update() {
      this.top = this.position.y + this.height / 2;
      this.bottom = this.position.y - this.height / 2;

      this.position.x += this.velocity.x;
      this.position.z += this.velocity.z;

      this.applyGravity();
    }

    applyGravity() {
      this.velocity.y += this.gravity;

      if (this.bottom + this.velocity.y <= ground.top) {
        this.velocity.y *= 0.6;
        this.velocity.y = -this.velocity.y;
      } else {
        this.position.y += this.velocity.y;
      }
    }
  }

  const cube = new Box(
    1, 1, 1,
    '#0f0',
    {x: 0, y: -.01, z: 0},
    {x: 0, y: 2, z: -2});
  cube.castShadow = true;
  scene.add(cube);

  const ground = new Box(
    5, 0.5, 5,
    '#00f',
    {x: 0, y: 0, z: 0},
    {x: 0, y: 0, z: -2});
  ground.receiveShadow = true;
  scene.add(ground);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 4;
  light.position.y = 2;
  light.position.z = 5;
  light.castShadow = true;
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, .5))

  new OrbitControls(camera, renderer.domElement);
  new GLTFLoader();

  const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false}
  }

  function animate() {
    requestAnimationFrame(animate);

    cube.velocity.x = 0;
    cube.velocity.z = 0;

    if (keys.a.pressed) cube.velocity.x = -0.01
    else if (keys.d.pressed) cube.velocity.x = 0.01;


    if (keys.s.pressed) cube.velocity.z = 0.01
    else if (keys.w.pressed) cube.velocity.z = -0.01;

    cube.update();
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('keydown', event => {

    switch (event.code) {

      case 'KeyW':
      case 'KeyA':
      case 'KeyS':
      case 'KeyD':
        keys[event.code.slice(-1).toLowerCase()].pressed = true;
    }
  });

  window.addEventListener('keyup', event => {

    switch (event.code) {

      case 'KeyW':
      case 'KeyA':
      case 'KeyS':
      case 'KeyD':
        keys[event.code.slice(-1).toLowerCase()].pressed = false;
    }
  });
}

export {loadThreeJsScene};
