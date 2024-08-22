<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  export let containerWidth: number;
  export let containerHeight: number;
  export let particleCount: number = 50;
  export let particleIcon: string;

  interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    rotation: number;
    rotationSpeed: number;
  }

  let particles: Particle[] = [];
  let frame = 0; // Add this line to force updates

  function createParticle(): Particle {
    return {
      x: Math.random() * containerWidth,
      y: Math.random() * containerHeight,
      size: Math.random() * 20 + 10,
      speedX: (Math.random() - 0.5) * 100,
      speedY: (Math.random() - 0.5) * 100,
      opacity: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
    };
  }

  function initParticles() {
    particles = Array(particleCount).fill(null).map(createParticle);
  }

  function updateParticles(delta: number) {
    const deltaSeconds = delta / 1000;
    particles = particles.map((particle) => {
      // Update position
      particle.x += particle.speedX * deltaSeconds;
      particle.y += particle.speedY * deltaSeconds;

      // Bounce off walls
      if (particle.x < 0 || particle.x > containerWidth) {
        particle.speedX = -particle.speedX;
        particle.x = Math.max(0, Math.min(particle.x, containerWidth));
      }
      if (particle.y < 0 || particle.y > containerHeight) {
        particle.speedY = -particle.speedY;
        particle.y = Math.max(0, Math.min(particle.y, containerHeight));
      }

      // Update rotation
      particle.rotation += particle.rotationSpeed * deltaSeconds * 60;

      // Update opacity (make it pulse)
      particle.opacity = 0.5 + Math.sin(Date.now() / 1000) * 0.25;

      return particle;
    });
    frame++; // Increment frame to force update
  }

  let animationFrame: number;
  let lastTime: number;

  function animate(time: number) {
    if (lastTime) {
      const delta = time - lastTime;
      updateParticles(delta);
    }
    lastTime = time;
    animationFrame = requestAnimationFrame(animate);
  }

  onMount(() => {
    initParticles();
    animationFrame = requestAnimationFrame(animate);
  });

  onDestroy(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });

  $: if (containerWidth && containerHeight && particleIcon) {
    initParticles();
  }
</script>

{#each particles as particle (particle)}
  <img
    src={particleIcon}
    alt="Particle"
    style="position: absolute; 
           left: {particle.x}px; 
           top: {particle.y}px; 
           width: {particle.size}px; 
           height: {particle.size}px; 
           opacity: {particle.opacity};
           transform: rotate({particle.rotation}deg);"
  />
{/each}
