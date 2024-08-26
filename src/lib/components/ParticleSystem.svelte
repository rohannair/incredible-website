<script lang="ts">
import type { Particle } from "$lib/particle";
import { createEventDispatcher, onDestroy, onMount } from "svelte";
export let containerWidth: number;
export let containerHeight: number;
export let particleCount = 2;
export let particleIcon: string;
export let staticIcon = "/mary2.png";

const STATIC_SIZE = 100;
const dispatch = createEventDispatcher();

let particles: Particle[] = [];
let gameWon = false;
let animationFrame: number;
let lastTime: number;

$: if (containerWidth && containerHeight && particleIcon) {
  initParticles();
}

function createParticle(): Particle {
  const size = Math.random() * 35 + 25;
  const x = Math.random() * (containerWidth - size);
  const y = Math.random() * (containerHeight - size);
  return {
    x,
    y,
    size,
    speedX: (Math.random() - 0.5) * 250,
    speedY: (Math.random() - 0.5) * 250,
    opacity: Math.random() * 0.5 + 0.5,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 5,
    isStatic: false,
    originalSize: size,
    originalX: x,
    originalY: y
  };
}

function initParticles() {
  particles = Array(particleCount).fill(null).map(createParticle);
  gameWon = false;
}

function updateParticles(delta: number) {
  if (gameWon) return;

  const deltaSeconds = delta / 1000;
  let staticParticleCount = 0;

  particles = particles.map((particle) => {
    if (particle.isStatic) {
      staticParticleCount += 1;
      return particle;
    }

    particle.x += particle.speedX * deltaSeconds;
    particle.y += particle.speedY * deltaSeconds;

    if (particle.x < 0 || particle.x + particle.size > containerWidth) {
      particle.speedX = -particle.speedX;
      particle.x = particle.x < 0 ? 0 : containerWidth - particle.size;
    }
    if (particle.y < 0 || particle.y + particle.size > containerHeight) {
      particle.speedY = -particle.speedY;
      particle.y = particle.y < 0 ? 0 : containerHeight - particle.size;
    }

    particle.rotation += particle.rotationSpeed * deltaSeconds * 60;
    particle.opacity = 0.5 + Math.sin(Date.now() / 1000) * 0.25;

    return particle;
  });

  if (staticParticleCount === particleCount) {
    gameWon = true;
    dispatch("gameWon");
  }
}

function toggleParticleState(index: number) {
  if (gameWon) return;

  const particle = particles[index];
  if (!particle.isStatic) {
    particle.isStatic = true;
    particle.opacity = 1;
    particle.rotation = 0;
    particle.originalX = particle.x;
    particle.originalY = particle.y;

    const sizeDiff = STATIC_SIZE - particle.size;
    particle.x -= sizeDiff / 2;
    particle.y -= sizeDiff / 2;

    particle.x = Math.max(0, Math.min(particle.x, containerWidth - STATIC_SIZE));
    particle.y = Math.max(0, Math.min(particle.y, containerHeight - STATIC_SIZE));

    particle.size = STATIC_SIZE;

    dispatch("particleClick");
  }
  // biome-ignore lint/correctness/noSelfAssign: trigger svelte reactivity
  particles = particles;
}

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
</script>

{#if !gameWon}
  {#each particles as particle, i}
    <button
      on:click={() => toggleParticleState(i)}
      on:keydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          toggleParticleState(i);
        }
      }}
      style="position: absolute;
             left: {particle.x}px;
             top: {particle.y}px;
             width: {particle.size}px;
             height: {particle.size}px;
             opacity: {particle.opacity};
             transform: rotate({particle.isStatic ? 0 : particle.rotation}deg);
             cursor: pointer;
             background: none;
             border: none;
             padding: 0;
             transition: all 0.3s ease;"
      aria-label={particle.isStatic ? "Static particle" : "Moving particle"}
    >
      <img
        src={particle.isStatic ? staticIcon : particleIcon}
        alt=""
        style="width: 100%; height: 100%; object-fit: cover;"
      />
    </button>
  {/each}
{/if}
