<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { browser } from "$app/environment";
  import * as THREE from "three";
  import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
  import { FontLoader } from "three/addons/loaders/FontLoader.js";
  import type { Font } from "three/addons/loaders/FontLoader.js";

  export let text = "MARY CHOI";

  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let textMesh: THREE.Mesh<TextGeometry, THREE.MeshPhysicalMaterial>;
  let isSpinning = true;
  let raycaster: THREE.Raycaster;
  let mouse: THREE.Vector2;
  let font: Font;
  let mounted = false;

  onMount(() => {
    mounted = true;
    if (browser) {
      init();
      animate();
      window.addEventListener("resize", onWindowResize, false);
      container.addEventListener("click", onClick, false);
      container.addEventListener("keydown", onKeyDown, false);
    }
  });

  onDestroy(() => {
    if (browser) {
      if (renderer) {
        renderer.dispose();
      }
      window.removeEventListener("resize", onWindowResize);
      container?.removeEventListener("click", onClick);
      container?.removeEventListener("keydown", onKeyDown);
    }
  });

  function init(): void {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6;
    camera.position.y = 0.5;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const frontLight = new THREE.SpotLight(0xffffff, 1);
    frontLight.position.set(0, 0, 10);
    scene.add(frontLight);

    const backLight = new THREE.SpotLight(0xffffff, 0.5);
    backLight.position.set(0, 0, -10);
    scene.add(backLight);

    const leftLight = new THREE.SpotLight(0xffffff, 0.7);
    leftLight.position.set(-10, 0, 0);
    scene.add(leftLight);

    const rightLight = new THREE.SpotLight(0xffffff, 0.7);
    rightLight.position.set(10, 0, 0);
    scene.add(rightLight);

    // Environment map for reflections
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const envMap = cubeTextureLoader.load([
      "https://threejs.org/examples/textures/cube/Bridge2/posx.jpg",
      "https://threejs.org/examples/textures/cube/Bridge2/negx.jpg",
      "https://threejs.org/examples/textures/cube/Bridge2/posy.jpg",
      "https://threejs.org/examples/textures/cube/Bridge2/negy.jpg",
      "https://threejs.org/examples/textures/cube/Bridge2/posz.jpg",
      "https://threejs.org/examples/textures/cube/Bridge2/negz.jpg",
    ]);
    scene.environment = envMap;

    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (loadedFont: Font) => {
        font = loadedFont;
        createText();
      }
    );
  }

  function createText(): void {
    if (textMesh) {
      scene.remove(textMesh);
    }

    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 0.7,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.9,
      roughness: 0.1,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMap: scene.environment,
      envMapIntensity: 1,
    });

    textMesh = new THREE.Mesh(textGeometry, chromeMaterial);
    textGeometry.center();
    scene.add(textMesh);
  }

  function onWindowResize(): void {
    if (browser && camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  function animate(): void {
    if (browser) {
      requestAnimationFrame(animate);
      if (textMesh && isSpinning) {
        textMesh.rotation.y += 0.01;
      }
      renderer?.render(scene, camera);
    }
  }

  function toggleSpin(): void {
    isSpinning = !isSpinning;
  }

  function onClick(event: MouseEvent): void {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(textMesh);
    if (intersects.length > 0) {
      toggleSpin();
    }
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      toggleSpin();
    }
  }

  $: if (mounted && browser && font && text) {
    createText();
  }
</script>

<div
  bind:this={container}
  tabindex="0"
  aria-label="3D Text Display"
  role="button"
/>

<style>
  div {
    width: 100%;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    pointer-events: none;
  }
</style>
