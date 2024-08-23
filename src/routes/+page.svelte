<script lang="ts">
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import SvelteSeo from "svelte-seo";
  import { cubicInOut } from "svelte/easing";
  import { tweened } from "svelte/motion";
  import HeroBanner from "./HeroBanner.svelte";
  import ParticleSystem from "./ParticleSystem.svelte";

  let containerWidth: number = 1000; // Default value
  let containerHeight: number = 600; // Default value
  let imageWidth = 100;
  let imageHeight: number = 100; // Provide a default value
  let image: HTMLImageElement;

  // Initialize both x and y with default values
  let x = containerWidth / 2;
  let y = containerHeight / 2;
  let vx = 200;
  let vy = 200;

  // Define the URLs for the particle icons
  const particleIcon = "/chicken.png";
  const staticIcon = "/mary2.png";
  const kingstonIcon = "/kingston.png";

  let gameWon = false;
  let heroText = "MARY CHOI";
  let particleCount = 3; // Easier to win in debug mode

  // New variables for timer and score
  let timerStarted = false;
  let timerValue = 0;
  let clickedParticles = 0;
  let startTime: number;

  const scale = tweened(1, {
    duration: 2000,
    easing: cubicInOut,
  });

  function handleGameWon() {
    gameWon = true;
    heroText = "KINGSTON'S VALET";
    animateKingstonImage();
    stopTimer();
  }

  function animateKingstonImage() {
    const zoomIn = () => scale.set(1.5, { duration: 1000 }).then(zoomOut);
    const zoomOut = () => scale.set(1, { duration: 1000 }).then(zoomIn);
    zoomIn();
  }

  function handleImageLoad(): void {
    if (image) {
      const aspectRatio = image.naturalWidth / image.naturalHeight;
      imageHeight = imageWidth / aspectRatio;

      // Initialize position to center of container
      x = (containerWidth - imageWidth) / 2;
      y = (containerHeight - imageHeight) / 2;
    }
  }

  function updatePosition(delta: number): void {
    if (gameWon) return;

    const deltaSeconds = delta / 1000;

    x += vx * deltaSeconds;
    y += vy * deltaSeconds;

    // Ensure x and y are numbers
    x = Number.isFinite(x) ? x : containerWidth / 2;
    y = Number.isFinite(y) ? y : containerHeight / 2;

    if (x <= 0 || x + imageWidth >= containerWidth) {
      vx = -vx;
      x = x <= 0 ? 0 : containerWidth - imageWidth;
    }
    if (y <= 0 || y + imageHeight >= containerHeight) {
      vy = -vy;
      y = y <= 0 ? 0 : containerHeight - imageHeight;
    }
  }

  let lastTime: number;
  function animate(time: number): void {
    if (lastTime) {
      const delta = time - lastTime;
      updatePosition(delta);
    }
    lastTime = time;
    requestAnimationFrame(animate);
  }

  function handleResize() {
    if (browser) {
      containerWidth = window.innerWidth;
      containerHeight = window.innerHeight;

      // Ensure the bouncing image stays within the new boundaries
      x = Math.min(Math.max(0, x), containerWidth - imageWidth);
      y = Math.min(Math.max(0, y), containerHeight - imageHeight);
    }
  }

  function startTimer() {
    if (!timerStarted) {
      timerStarted = true;
      startTime = performance.now();
      updateTimer();
    }
  }

  function updateTimer() {
    if (timerStarted && !gameWon) {
      timerValue = performance.now() - startTime;
      requestAnimationFrame(updateTimer);
    }
  }

  function stopTimer() {
    timerStarted = false;
  }

  function handleParticleClick() {
    if (!timerStarted) {
      startTimer();
    }
    clickedParticles++;
  }

  onMount(() => {
    if (browser) {
      handleResize();
      requestAnimationFrame(animate);

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        stopTimer();
      };
    }
  });
</script>

<svelte:window on:resize={handleResize} />

<SvelteSeo
  title="Mary Choi | Kingston's Personal Valet 🐶"
  description="Hi, I'm Mary, an Engineering Manager and Full Stack Engineer with healthcare experience. I build teams and robust, user-centric applications."
  openGraph={{
    title: "Mary Choi | Kingston's Personal Valet 🐶",
    description:
      "Hi, I'm Mary, an Engineering Manager and Full Stack Engineer with healthcare experience. I build teams and robust, user-centric applications.",
    type: "website",
    images: [
      {
        url: "/maryface.png",
        width: 460,
        height: 460,
        alt: "Mary",
      },
      {
        url: "/mary2.png",
        width: 433,
        height: 577,
        alt: "Mary",
      },
      {
        url: "/kingston.png",
        width: 748,
        height: 544,
        alt: "Kingston",
      },
    ],
    site_name: "Mary Choi",
  }}
/>

<svelte:head>
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  </style>
</svelte:head>

<div
  class="container"
  style="width: {containerWidth}px; height: {containerHeight}px;"
>
  <ParticleSystem
    {containerWidth}
    {containerHeight}
    {particleCount}
    {particleIcon}
    {staticIcon}
    on:gameWon={handleGameWon}
    on:particleClick={handleParticleClick}
  />
  {#if !gameWon}
    <img
      bind:this={image}
      src="/maryface.png"
      alt="Mary Choi"
      on:load={handleImageLoad}
      style="position: absolute; left: {x}px; top: {y}px; width: {imageWidth}px; height: {imageHeight}px; z-index: 10;"
    />
  {:else}
    <img
      src={kingstonIcon}
      alt="Kingston"
      style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) scale({$scale}); max-width: 80%; max-height: 80%; object-fit: contain;"
    />
  {/if}
  <HeroBanner text={heroText} />
  <div class="game-stats">
    <p>Time: {(timerValue / 1000).toFixed(3)} seconds</p>
    <p>Score: {clickedParticles}/{particleCount}</p>
    <div class="progress-bar">
      <div
        class="progress"
        style="width: {(clickedParticles / particleCount) * 100}%"
      ></div>
    </div>
  </div>
  <footer class="footer">
    <a
      href="https://marymchoi.com"
      target="_blank"
      rel="noopener noreferrer"
      class="button"
    >
      Visit Mary's real site
    </a>
  </footer>
</div>

<style>
  .container {
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Open Sans",
      "Helvetica Neue",
      sans-serif;
    overflow: hidden;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .footer {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 20;
    opacity: 0.4;
  }

  .footer:hover {
    opacity: 1;
  }

  .button {
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 5px 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 12px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 25px;
    transition: background-color 0.3s ease;
  }

  .button:hover {
    background-color: rgba(255, 255, 255, 0.6);
  }

  .game-stats {
    position: absolute;
    top: 20px;
    left: 20px;
    color: white;
    z-index: 20;
  }

  .progress-bar {
    width: 200px;
    height: 20px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    overflow: hidden;
  }

  .progress {
    height: 100%;
    background-color: #4caf50;
    transition: width 0.3s ease;
  }
</style>
