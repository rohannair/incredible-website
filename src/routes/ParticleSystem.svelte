<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  import { tweened } from "svelte/motion";

  export let containerWidth: number;
  export let containerHeight: number;
  export let particleCount: number = 50;
  export let particleIcon: string;

  interface Particle {
    x: number;
    y: number;
    size: number;
    speed: number;
    angle: number;
    opacity: number;
    tweened: {
      x: number;
      y: number;
      opacity: number;
    };
  }

  let particles: Particle[] = [];

  function createParticle(): Particle {
    const size = Math.random() * 20 + 10;
    const x = Math.random() * containerWidth;
    const y = Math.random() * containerHeight;
    const opacity = Math.random() * 0.5 + 0.5;

    const tween = tweened(
      { x, y, opacity },
      { duration: 1000, easing: cubicOut }
    );

    const particle: Particle = {
      x,
      y,
      size,
      speed: Math.random() * 50 + 25,
      angle: Math.random() * Math.PI * 2,
      opacity,
      tweened: { x, y, opacity },
    };

    tween.subscribe((value) => {
      particle.tweened = value;
    });

    return particle;
  }

  function initParticles() {
    particles = Array(particleCount).fill(null).map(createParticle);
  }

  function updateParticle(particle: Particle, delta: number) {
    const dx = Math.cos(particle.angle) * particle.speed * (delta / 1000);
    const dy = Math.sin(particle.angle) * particle.speed * (delta / 1000);

    let newX = particle.x + dx;
    let newY = particle.y + dy;

    if (newX < 0 || newX > containerWidth) {
      particle.angle = Math.PI - particle.angle;
      newX = Math.max(0, Math.min(newX, containerWidth));
    }
    if (newY < 0 || newY > containerHeight) {
      particle.angle = -particle.angle;
      newY = Math.max(0, Math.min(newY, containerHeight));
    }

    particle.x = newX;
    particle.y = newY;

    particle.tweened = {
      x: newX,
      y: newY,
      opacity: particle.opacity,
    };
  }

  let animationFrame: number;
  let lastTime: number;

  function animate(time: number) {
    if (lastTime) {
      const delta = time - lastTime;
      particles.forEach((particle) => updateParticle(particle, delta));
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
    style="position: absolute; left: {particle.tweened.x}px; top: {particle
      .tweened
      .y}px; width: {particle.size}px; height: {particle.size}px; opacity: {particle
      .tweened.opacity};"
  />
{/each}
