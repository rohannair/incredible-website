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
  let displayText = "MARY CHOI!!!!!!";

  const scale = tweened(1, {
    duration: 2000,
    easing: cubicInOut,
  });

  function handleGameWon() {
    gameWon = true;
    displayText = "KINGSTON";
    animateKingstonImage();
  }

  function animateKingstonImage() {
    scale.set(1.5).then(() => scale.set(1));
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

  onMount(() => {
    if (browser) {
      handleResize();
      requestAnimationFrame(animate);

      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
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
  {#if !gameWon}
    <ParticleSystem
      {containerWidth}
      {containerHeight}
      particleCount={30}
      {particleIcon}
      {staticIcon}
      on:gameWon={handleGameWon}
    />
    <img
      bind:this={image}
      src="/maryface.png"
      alt="Mary Choi"
      on:load={handleImageLoad}
      style="position: absolute; left: {x}px; top: {y}px; width: {imageWidth}px; height: {imageHeight}px; z-index: 10;"
    />
    <HeroBanner />
  {:else}
    <img
      src={kingstonIcon}
      alt="Kingston"
      style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) scale({$scale}); max-width: 80%; max-height: 80%; object-fit: contain;"
    />
  {/if}
  <div class="psychedelic-text">
    {displayText}
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

  .psychedelic-text {
    position: absolute;
    font-size: 4rem;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    z-index: 5;
    color: white;
    animation: psychedelic 5s infinite linear;
  }

  @keyframes psychedelic {
    0% {
      color: red;
      transform: scale(1) rotate(0deg);
    }
    25% {
      color: yellow;
      transform: scale(1.2) rotate(90deg);
    }
    50% {
      color: blue;
      transform: scale(1) rotate(180deg);
    }
    75% {
      color: green;
      transform: scale(1.2) rotate(270deg);
    }
    100% {
      color: red;
      transform: scale(1) rotate(360deg);
    }
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
</style>
