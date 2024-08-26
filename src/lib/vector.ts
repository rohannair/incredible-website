export interface Vector {
  dx: number;
  dy: number;
}

export const create= (dx: number, dy: number): Vector => ({ dx, dy });

export const zero = create(0, 0)

export const add = (v1: Vector, v2: Vector): Vector => create(v1.dx + v2.dx, v1.dy + v2.dy);

export const invert = (v: Vector): Vector => create(-v.dx, -v.dy);

export const invertX = (v: Vector): Vector => create(-v.dx, v.dy);

export const invertY = (v: Vector): Vector => create(v.dx, -v.dy);

export const mag = (v: Vector): number => Math.sqrt(v.dx * v.dx + v.dy * v.dy);

export const normalize = (v: Vector): Vector => {
  const m = mag(v);
  return m === 0 ? v : create(v.dx / m, v.dy / m);
};

export const scale = (s: number, v: Vector): Vector => create(v.dx * s, v.dy * s);