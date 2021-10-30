import { Direction, Point, wrapIndex } from "./point"
import { Segment } from "./segment"

export type Row = {
  direction: Direction
  start: Point
  end: Point
  eye1: Point | undefined
  eye2: Point | undefined
}

export type WrappedRow = {
  unwrap: () => Row
  overlap: (p: Point) => boolean
  adjacent: (other: Row) => boolean
  eyes: () => Point[]
}

export const wrapRow = (self: Row): WrappedRow => ({
  unwrap: () => self,
  overlap: overlap(self),
  adjacent: adjacent(self),
  eyes: eyes(self),
})

export const fromSegment = (r: Segment, d: Direction, i: number): Row => ({
  direction: d,
  start: wrapIndex([i, r.start]).toPoint(d).unwrap(),
  end: wrapIndex([i, r.end]).toPoint(d).unwrap(),
  eye1: r.eye1 !== undefined ? wrapIndex([i, r.eye1]).toPoint(d).unwrap() : undefined,
  eye2: r.eye2 !== undefined ? wrapIndex([i, r.eye2]).toPoint(d).unwrap() : undefined,
})

const overlap =
  (self: Row) =>
  (p: Point): boolean => {
    const [px, py] = p
    const [sx, sy] = self.start
    const [ex, ey] = self.end
    switch (self.direction) {
      case Direction.vertical:
        return px == sx && bw(sy, py, ey)
      case Direction.horizontal:
        return py == sy && bw(sx, px, ex)
      case Direction.ascending:
        return bw(sx, px, ex) && bw(sy, py, ey) && px - sx == py - sy
      case Direction.descending:
        return bw(sx, px, ex) && bw(ey, py, sy) && px - sx == sy - py
      default:
        return false
    }
  }

const adjacent =
  (self: Row) =>
  (other: Row): boolean => {
    if (self.direction !== other.direction) return false
    const [sx, sy] = self.start
    const [ox, oy] = other.start
    const [xd, yd] = [sx - ox, sy - oy]
    switch (self.direction) {
      case Direction.vertical:
        return Math.abs(xd) === 0 && Math.abs(yd) === 1
      case Direction.horizontal:
        return Math.abs(xd) === 1 && Math.abs(yd) === 0
      case Direction.ascending:
        return Math.abs(xd) === 1 && xd === yd
      case Direction.descending:
        return Math.abs(xd) === 1 && xd === -yd
      default:
        return false
    }
  }

const eyes = (self: Row) => (): Point[] => {
  if (self.eye1 === undefined) {
    return []
  } else if (self.eye2 === undefined) {
    return [self.eye1]
  } else {
    return [self.eye1, self.eye2]
  }
}

const bw = (a: number, x: number, b: number): boolean => a <= x && x <= b
