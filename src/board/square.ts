import { BOARD_SIZE, Player, RowKind } from "./fundamentals"
import { createLine, Line, parseLine, wrapLine, WrappedLine } from "./line"
import { Direction, parsePoints, Point, Points, wrapIndex, wrapPoint } from "./point"
import { Segment } from "./segment"

export type Square = {
  vlines: OrthogonalLines
  hlines: OrthogonalLines
  alines: DiagonalLines
  dlines: DiagonalLines
}

export type WrappedSquare = {
  unwrap: () => Square
  put: (player: Player, p: Point) => WrappedSquare
  rows: (player: Player, kind: RowKind) => RowSegment[]
  rowsOn: (player: Player, kind: RowKind, p: Point) => RowSegment[]
  toString: () => string
}

export const createSquare = (): WrappedSquare =>
  wrapSquare({
    vlines: orthogonalLines(),
    hlines: orthogonalLines(),
    alines: diagonalLines(),
    dlines: diagonalLines(),
  })

type OrthogonalLines = Line[]
type DiagonalLines = Line[]

const D_LINE_NUM = (BOARD_SIZE - 4) * 2 - 1 // 21

const orthogonalLines = (): OrthogonalLines => [
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
]

const diagonalLines = (): DiagonalLines => [
  createLine(BOARD_SIZE - 10).unwrap(),
  createLine(BOARD_SIZE - 9).unwrap(),
  createLine(BOARD_SIZE - 8).unwrap(),
  createLine(BOARD_SIZE - 7).unwrap(),
  createLine(BOARD_SIZE - 6).unwrap(),
  createLine(BOARD_SIZE - 5).unwrap(),
  createLine(BOARD_SIZE - 4).unwrap(),
  createLine(BOARD_SIZE - 3).unwrap(),
  createLine(BOARD_SIZE - 2).unwrap(),
  createLine(BOARD_SIZE - 1).unwrap(),
  createLine(BOARD_SIZE).unwrap(),
  createLine(BOARD_SIZE - 1).unwrap(),
  createLine(BOARD_SIZE - 2).unwrap(),
  createLine(BOARD_SIZE - 3).unwrap(),
  createLine(BOARD_SIZE - 4).unwrap(),
  createLine(BOARD_SIZE - 5).unwrap(),
  createLine(BOARD_SIZE - 6).unwrap(),
  createLine(BOARD_SIZE - 7).unwrap(),
  createLine(BOARD_SIZE - 8).unwrap(),
  createLine(BOARD_SIZE - 9).unwrap(),
  createLine(BOARD_SIZE - 10).unwrap(),
]

export const makeSquare = (blacks: Points, whites: Points): WrappedSquare => {
  let square = createSquare()
  for (const p of blacks) {
    square = square.put(Player.black, p)
  }
  for (const p of whites) {
    square = square.put(Player.white, p)
  }
  return square
}

export const parseSquare = (s: string): WrappedSquare | undefined => {
  if (s.includes("/")) {
    return fromStringPoints(s)
  } else {
    return fromStringDisplay(s)
  }
}

const fromStringPoints = (s: string): WrappedSquare | undefined => {
  const codes = s.trim().split("/")
  if (codes.length !== 2) return undefined
  const blacks = parsePoints(codes[0])
  if (blacks === undefined) return undefined
  const whites = parsePoints(codes[1])
  if (whites === undefined) return undefined
  return makeSquare(blacks.unwrap(), whites.unwrap())
}

const fromStringDisplay = (s: string): WrappedSquare | undefined => {
  const hlines = s
    .trim()
    .split("\n")
    .reverse()
    .map(ls => parseLine(ls.trim()))
    .filter(l => l !== undefined)
  if (hlines.length !== BOARD_SIZE) return undefined
  let square = createSquare()
  for (const [y, hline] of hlines.map((hline, y) => [y, hline] as [number, WrappedLine])) {
    if (hline.unwrap().size !== BOARD_SIZE) return undefined
    for (const [x, s] of hline.stones().map((s, x) => [x, s] as [number, Player | undefined])) {
      const point: Point = [x, y]
      if (s === undefined) continue
      square = square.put(s, point)
    }
  }
  return square
}

export const wrapSquare = (self: Square): WrappedSquare => ({
  unwrap: () => self,
  put: put(self),
  rows: rows(self),
  rowsOn: rowsOn(self),
  toString: toString(self),
})

const put =
  (self: Square) =>
  (player: Player, p: Point): WrappedSquare => {
    const wp = wrapPoint(p)
    const vidx = wp.toIndex(Direction.vertical).unwrap()
    const vlines = self.vlines.map((l, i) =>
      i === vidx[0] ? wrapLine(l).put(player, vidx[1]).unwrap() : l
    )
    const hidx = wp.toIndex(Direction.horizontal).unwrap()
    const hlines = self.hlines.map((l, i) =>
      i === hidx[0] ? wrapLine(l).put(player, hidx[1]).unwrap() : l
    )
    const aidx = wp.toIndex(Direction.ascending).unwrap()
    const alines = bw(4, aidx[0], D_LINE_NUM + 3)
      ? self.alines.map((l, i) =>
          i === aidx[0] - 4 ? wrapLine(l).put(player, aidx[1]).unwrap() : l
        )
      : self.alines
    const didx = wp.toIndex(Direction.descending).unwrap()
    const dlines = bw(4, didx[0], D_LINE_NUM + 3)
      ? self.dlines.map((l, i) =>
          i === didx[0] - 4 ? wrapLine(l).put(player, didx[1]).unwrap() : l
        )
      : self.dlines
    return wrapSquare({
      vlines: vlines,
      hlines: hlines,
      alines: alines,
      dlines: dlines,
    })
  }

const rows =
  (self: Square) =>
  (player: Player, kind: RowKind): RowSegment[] =>
    lines(self)
      .map(([d, i, l]) =>
        wrapLine(l)
          .rows(player, kind)
          .map(r => fromRow(r, d, i))
      )
      .flat(1)

const rowsOn =
  (self: Square) =>
  (player: Player, kind: RowKind, p: Point): RowSegment[] =>
    linesAlong(self, p)
      .map(([d, i, l]) =>
        wrapLine(l)
          .rows(player, kind)
          .map(r => fromRow(r, d, i))
          .filter(r => wrapRowSegment(r).overlap(p))
      )
      .flat(1)

const toString = (self: Square) => (): string =>
  self.hlines
    .slice()
    .reverse()
    .map(l => wrapLine(l).toString())
    .join("\n")

type IndexedLine = [Direction, number, Line]

const lines = (self: Square): IndexedLine[] => {
  const vlines: IndexedLine[] = self.vlines.map((l, i) => [Direction.vertical, i, l])
  const hlines: IndexedLine[] = self.hlines.map((l, i) => [Direction.horizontal, i, l])
  const alines: IndexedLine[] = self.alines.map((l, i) => [Direction.ascending, i + 4, l])
  const dlines: IndexedLine[] = self.dlines.map((l, i) => [Direction.descending, i + 4, l])
  return [...vlines, ...hlines, ...alines, ...dlines]
}

const linesAlong = (self: Square, p: Point): IndexedLine[] => {
  const wp = wrapPoint(p)
  const vi = wp.toIndex(Direction.vertical).unwrap()[0]
  const vlines: IndexedLine[] = [[Direction.vertical, vi, self.vlines[vi]]]
  const hi = wp.toIndex(Direction.horizontal).unwrap()[0]
  const hlines: IndexedLine[] = [[Direction.horizontal, hi, self.hlines[hi]]]
  const ai = wp.toIndex(Direction.ascending).unwrap()[0]
  const alines: IndexedLine[] = bw(4, ai, D_LINE_NUM + 3)
    ? [[Direction.ascending, ai, self.alines[ai - 4]]]
    : []
  const di = wp.toIndex(Direction.descending).unwrap()[0]
  const dlines: IndexedLine[] = bw(4, di, D_LINE_NUM + 3)
    ? [[Direction.descending, di, self.dlines[di - 4]]]
    : []
  return [...vlines, ...hlines, ...alines, ...dlines]
}

export type RowSegment = {
  direction: Direction
  start: Point
  end: Point
  eye1: Point | undefined
  eye2: Point | undefined
}

export type WrappedRowSegment = {
  unwrap: () => RowSegment
  overlap: (p: Point) => boolean
  adjacent: (other: RowSegment) => boolean
  eyes: () => Point[]
}

export const wrapRowSegment = (self: RowSegment): WrappedRowSegment => ({
  unwrap: () => self,
  overlap: overlap(self),
  adjacent: adjacent(self),
  eyes: eyes(self),
})

const overlap =
  (self: RowSegment) =>
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
  (self: RowSegment) =>
  (other: RowSegment): boolean => {
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

const eyes = (self: RowSegment) => (): Point[] => {
  if (self.eye1 === undefined) {
    return []
  } else if (self.eye2 === undefined) {
    return [self.eye1]
  } else {
    return [self.eye1, self.eye2]
  }
}

const fromRow = (r: Segment, d: Direction, i: number): RowSegment => ({
  direction: d,
  start: wrapIndex([i, r.start]).toPoint(d).unwrap(),
  end: wrapIndex([i, r.end]).toPoint(d).unwrap(),
  eye1: r.eye1 !== undefined ? wrapIndex([i, r.eye1]).toPoint(d).unwrap() : undefined,
  eye2: r.eye2 !== undefined ? wrapIndex([i, r.eye2]).toPoint(d).unwrap() : undefined,
})

const bw = (a: number, x: number, b: number): boolean => a <= x && x <= b
