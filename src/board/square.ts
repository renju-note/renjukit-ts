import { BOARD_SIZE, Player, RowKind } from "./fundamentals"
import { createLine, Line, parseLine, wrapLine } from "./line"
import { Direction, parsePoints, Point, Points, wrapPoint } from "./point"
import { makeRow, Row, wrapRow } from "./row"

export type Square = {
  vlines: OrthogonalLines
  hlines: OrthogonalLines
  alines: DiagonalLines
  dlines: DiagonalLines
}

export const createSquare = (): Square => ({
  vlines: orthogonalLines(),
  hlines: orthogonalLines(),
  alines: diagonalLines(),
  dlines: diagonalLines(),
})

export const makeSquare = (blacks: Points, whites: Points): Square => {
  let square = wrapSquare(createSquare())
  for (const p of blacks) {
    square = square.put(Player.black, p)
  }
  for (const p of whites) {
    square = square.put(Player.white, p)
  }
  return square.unwrap()
}

export const parseSquare = (s: string): Square | undefined => {
  if (s.includes("/")) {
    return fromStringPoints(s)
  } else {
    return fromStringDisplay(s)
  }
}

export type WrappedSquare = {
  unwrap: () => Square
  put: (player: Player, p: Point) => WrappedSquare
  rows: (player: Player, kind: RowKind) => Row[]
  rowsOn: (player: Player, kind: RowKind, p: Point) => Row[]
  toString: () => string
}

export const wrapSquare = (self: Square): WrappedSquare => ({
  unwrap: () => self,
  put: put(self),
  rows: rows(self),
  rowsOn: rowsOn(self),
  toString: toString(self),
})

type OrthogonalLines = Line[]
type DiagonalLines = Line[]

const D_LINE_NUM = (BOARD_SIZE - 4) * 2 - 1 // 21

const orthogonalLines = (): OrthogonalLines => [
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE),
]

const diagonalLines = (): DiagonalLines => [
  createLine(BOARD_SIZE - 10),
  createLine(BOARD_SIZE - 9),
  createLine(BOARD_SIZE - 8),
  createLine(BOARD_SIZE - 7),
  createLine(BOARD_SIZE - 6),
  createLine(BOARD_SIZE - 5),
  createLine(BOARD_SIZE - 4),
  createLine(BOARD_SIZE - 3),
  createLine(BOARD_SIZE - 2),
  createLine(BOARD_SIZE - 1),
  createLine(BOARD_SIZE),
  createLine(BOARD_SIZE - 1),
  createLine(BOARD_SIZE - 2),
  createLine(BOARD_SIZE - 3),
  createLine(BOARD_SIZE - 4),
  createLine(BOARD_SIZE - 5),
  createLine(BOARD_SIZE - 6),
  createLine(BOARD_SIZE - 7),
  createLine(BOARD_SIZE - 8),
  createLine(BOARD_SIZE - 9),
  createLine(BOARD_SIZE - 10),
]

const fromStringPoints = (s: string): Square | undefined => {
  const codes = s.trim().split("/")
  if (codes.length !== 2) return undefined
  const blacks = parsePoints(codes[0])
  if (blacks === undefined) return undefined
  const whites = parsePoints(codes[1])
  if (whites === undefined) return undefined
  return makeSquare(blacks, whites)
}

const fromStringDisplay = (s: string): Square | undefined => {
  const hlines = s
    .trim()
    .split("\n")
    .reverse()
    .map(ls => parseLine(ls.trim()))
    .filter(l => l !== undefined)
  if (hlines.length !== BOARD_SIZE) return undefined
  let square = wrapSquare(createSquare())
  for (const [y, hline] of hlines.map((hline, y) => [y, hline] as [number, Line])) {
    if (hline.size !== BOARD_SIZE) return undefined
    const stons = wrapLine(hline).stones()
    for (const [x, s] of stons.map((s, x) => [x, s] as [number, Player | undefined])) {
      const point: Point = [x, y]
      if (s === undefined) continue
      square = square.put(s, point)
    }
  }
  return square.unwrap()
}

const put =
  (self: Square) =>
  (player: Player, p: Point): WrappedSquare => {
    const wp = wrapPoint(p)
    const vidx = wp.toIndex(Direction.vertical)
    const vlines = self.vlines.map((l, i) =>
      i === vidx[0] ? wrapLine(l).put(player, vidx[1]).unwrap() : l
    )
    const hidx = wp.toIndex(Direction.horizontal)
    const hlines = self.hlines.map((l, i) =>
      i === hidx[0] ? wrapLine(l).put(player, hidx[1]).unwrap() : l
    )
    const aidx = wp.toIndex(Direction.ascending)
    const alines = bw(4, aidx[0], D_LINE_NUM + 3)
      ? self.alines.map((l, i) =>
          i === aidx[0] - 4 ? wrapLine(l).put(player, aidx[1]).unwrap() : l
        )
      : self.alines
    const didx = wp.toIndex(Direction.descending)
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
  (player: Player, kind: RowKind): Row[] =>
    lines(self)
      .map(([d, i, l]) =>
        wrapLine(l)
          .segments(player, kind)
          .map(s => makeRow(s, d, i))
      )
      .flat(1)

const rowsOn =
  (self: Square) =>
  (player: Player, kind: RowKind, p: Point): Row[] =>
    linesAlong(self, p)
      .map(([d, i, l]) =>
        wrapLine(l)
          .segments(player, kind)
          .map(s => makeRow(s, d, i))
          .filter(r => wrapRow(r).overlap(p))
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
  const vi = wp.toIndex(Direction.vertical)[0]
  const vlines: IndexedLine[] = [[Direction.vertical, vi, self.vlines[vi]]]
  const hi = wp.toIndex(Direction.horizontal)[0]
  const hlines: IndexedLine[] = [[Direction.horizontal, hi, self.hlines[hi]]]
  const ai = wp.toIndex(Direction.ascending)[0]
  const alines: IndexedLine[] = bw(4, ai, D_LINE_NUM + 3)
    ? [[Direction.ascending, ai, self.alines[ai - 4]]]
    : []
  const di = wp.toIndex(Direction.descending)[0]
  const dlines: IndexedLine[] = bw(4, di, D_LINE_NUM + 3)
    ? [[Direction.descending, di, self.dlines[di - 4]]]
    : []
  return [...vlines, ...hlines, ...alines, ...dlines]
}

const bw = (a: number, x: number, b: number): boolean => a <= x && x <= b
