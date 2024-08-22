<script lang="ts">
  import { onMount } from "svelte";
  import { linear } from "svelte/easing";
  import { spring, tweened } from "svelte/motion";
  import ParticleSystem from "./ParticleSystem.svelte";

  let containerWidth: number;
  let containerHeight: number;
  let imageWidth = 100;
  let imageHeight: number;
  let image: HTMLImageElement;
  let error: string | null = null;

  const position = tweened(
    { x: 0, y: 0 },
    {
      duration: 0,
      easing: linear,
    }
  );

  let velocity = { x: 200, y: 200 };

  // Define the URL for the single particle icon
  const particleIcon = "/chicken.png";

  function handleImageLoad(): void {
    if (image) {
      const aspectRatio = image.naturalWidth / image.naturalHeight;
      imageHeight = imageWidth / aspectRatio;
    }
  }

  function updatePosition(delta: number): void {
    let newX = $position.x + velocity.x * (delta / 1000);
    let newY = $position.y + velocity.y * (delta / 1000);

    if (newX <= 0 || newX + imageWidth >= containerWidth) {
      velocity.x = -velocity.x;
      newX = Math.max(0, Math.min(newX, containerWidth - imageWidth));
    }
    if (newY <= 0 || newY + imageHeight >= containerHeight) {
      velocity.y = -velocity.y;
      newY = Math.max(0, Math.min(newY, containerHeight - imageHeight));
    }

    position.set({ x: newX, y: newY }, { duration: 0 });
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

  const textScale = spring(1, {
    stiffness: 0.1,
    damping: 0.2,
  });

  const textRotation = tweened(0, {
    duration: 3000,
    easing: linear,
  });

  const textHue = tweened(0, {
    duration: 5000,
    easing: linear,
  });

  function animateText() {
    textScale.set(1.5);
    setTimeout(() => textScale.set(1), 1500);

    textRotation.update((n) => n + 360);
    textHue.update((n) => (n + 60) % 360);

    setTimeout(animateText, 3000);
  }

  onMount(() => {
    containerWidth = window.innerWidth;
    containerHeight = window.innerHeight;
    requestAnimationFrame(animate);

    window.addEventListener("resize", () => {
      containerWidth = window.innerWidth;
      containerHeight = window.innerHeight;
    });

    animateText();
  });
</script>

<svelte:head>
  <style>
    body {
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
  </style>
</svelte:head>

{#if error}
  <div class="error">Error: {error}</div>
{:else}
  <div
    class="container"
    bind:clientWidth={containerWidth}
    bind:clientHeight={containerHeight}
  >
    <ParticleSystem
      {containerWidth}
      {containerHeight}
      particleCount={30}
      {particleIcon}
    />
    <img
      bind:this={image}
      src="/maryface.png"
      alt="Mary Choi"
      on:load={handleImageLoad}
      style="position: absolute; left: {$position.x}px; top: {$position.y}px; width: {imageWidth}px; height: {imageHeight}px; z-index: 10;"
    />
    <div
      class="psychedelic-text"
      style="transform: scale({$textScale}) rotate({$textRotation}deg);
                color: hsl({$textHue}, 100%, 50%);"
    >
      MARY CHOI!!!!!!
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
{/if}

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
    width: 100vw;
    height: 100vh;
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
  }

  .error {
    color: red;
    font-size: 1.5rem;
    padding: 20px;
  }

  .footer {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 20;
  }

  .button {
    background-color: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 25px;
    transition: background-color 0.3s ease;
  }

  .button:hover {
    background-color: #45a049;
  }
</style>
