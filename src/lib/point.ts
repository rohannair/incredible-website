import * as Vector from "./vector";

export interface Point {
  x: number;
  y: number;
}

export const create = (x: number, y: number): Point => ({ x, y });

export const zero = create(0, 0);

export const distance = (p1: Point, p2: Point): number => {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const add = (p1: Point, p2: Point): Point => create(p1.x + p2.x, p1.y + p2.y);

export const applyVector = (v: Vector.Vector, p: Point): Point => create(p.x + v.dx, p.y + v.dy);
