export interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  isStatic: boolean;
  originalSize: number;
  originalX: number;
  originalY: number;
}

export function createParticle(containerWidth: number, containerHeight: number): Particle {
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
    originalY: y,
  };
}

export function updateParticle(particle: Particle, deltaSeconds: number, containerWidth: number, containerHeight: number): Particle {
  if (particle.isStatic) {
    return particle;
  }

  let { x, y, speedX, speedY, rotation, rotationSpeed } = particle;

  x += speedX * deltaSeconds;
  y += speedY * deltaSeconds;

  if (x < 0 || x + particle.size > containerWidth) {
    speedX = -speedX;
    x = x < 0 ? 0 : containerWidth - particle.size;
  }
  if (y < 0 || y + particle.size > containerHeight) {
    speedY = -speedY;
    y = y < 0 ? 0 : containerHeight - particle.size;
  }

  rotation += rotationSpeed * deltaSeconds * 60;
  const opacity = 0.5 + Math.sin(Date.now() / 1000) * 0.25;

  return { ...particle, x, y, speedX, speedY, rotation, opacity };
}