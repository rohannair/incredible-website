<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as THREE from "three";
  import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
  import { FontLoader } from "three/addons/loaders/FontLoader.js";
  import type { Font } from "three/addons/loaders/FontLoader.js";

  let container: HTMLDivElement;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let textMesh: THREE.Mesh<TextGeometry, THREE.MeshPhysicalMaterial>;
  let exclamationMesh: THREE.Mesh<TextGeometry, THREE.MeshPhysicalMaterial>;
  let isSpinning = true;
  let exclamationCount = 0;
  let increasing = true;

  const loader = new FontLoader();

  onMount(() => {
    init();
    animate();
    animateExclamations();
  });

  onDestroy(() => {
    if (renderer) {
      renderer.dispose();
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

    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",
      (font: Font) => {
        const textGeometry = new TextGeometry("MARY CHOI!!!!!!!!", {
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
          envMap: envMap,
          envMapIntensity: 1,
        });

        textMesh = new THREE.Mesh(textGeometry, chromeMaterial);
        textGeometry.center();
        scene.add(textMesh);

        // Create exclamation point mesh
        // const exclamationGeometry = new TextGeometry("!", {
        //   font: font,
        //   size: 0.7,
        //   height: 0.2,
        //   curveSegments: 12,
        //   bevelEnabled: true,
        //   bevelThickness: 0.03,
        //   bevelSize: 0.02,
        //   bevelOffset: 0,
        //   bevelSegments: 5,
        // });

        // exclamationMesh = new THREE.Mesh(exclamationGeometry, chromeMaterial);
        exclamationMesh.position.set(3, 0, 0); // Position it to the right of "MARY CHOI"
        scene.add(exclamationMesh);
      }
    );

    window.addEventListener("resize", onWindowResize, false);
  }

  function onWindowResize(): void {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  function animate(): void {
    requestAnimationFrame(animate);

    if (textMesh && isSpinning) {
      textMesh.rotation.y += 0.01;
      if (exclamationMesh) {
        exclamationMesh.rotation.y = textMesh.rotation.y;
      }
    }

    if (exclamationMesh) {
      exclamationMesh.visible = exclamationCount > 0;
      exclamationMesh.scale.set(1, exclamationCount / 10, 1);
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  async function animateExclamations(): Promise<void> {
    while (true) {
      if (increasing) {
        exclamationCount++;
        if (exclamationCount === 10) increasing = false;
      } else {
        exclamationCount--;
        if (exclamationCount === 0) increasing = true;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  function toggleSpin(): void {
    isSpinning = !isSpinning;
  }
</script>

<div bind:this={container} on:click={toggleSpin}></div>

<style>
  div {
    width: 100%;
    height: 100vh;
    background-color: #1a1a1a; /* Dark background for better contrast */
  }
</style>
