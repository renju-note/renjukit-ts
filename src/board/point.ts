import { BOARD_SIZE } from "./fundamentals"

const directions = ["vertical", "horizontal", "ascending", "descending"] as const
export type Direction = typeof directions[number]
export const Direction: Record<Direction, Direction> = {
  vertical: "vertical",
  horizontal: "horizontal",
  ascending: "ascending",
  descending: "descending",
}

export type Point = [number, number]

export const createPoint = (x: number, y: number): Point => [x, y]

export const parsePoint = (s: string): Point | undefined => {
  const x = X_CODE_TO_NUM[s[0]]
  const y = parseInt(s.slice(1)) - 1
  if (
    x === undefined ||
    y === undefined ||
    isNaN(y) ||
    x < 0 ||
    BOARD_SIZE <= x ||
    y < 0 ||
    BOARD_SIZE <= y
  ) {
    return undefined
  }
  return [x, y]
}

export const decodePoint = (c: number): Point | undefined => {
  const x = ~~(c / BOARD_SIZE)
  const y = c % BOARD_SIZE
  if (0 <= x && x < BOARD_SIZE && 0 <= y && y < BOARD_SIZE) {
    return [x, y]
  } else {
    return undefined
  }
}

export type WrappedPoint = {
  unwrap: () => Point
  toIndex: (direction: Direction) => Index
  toString: () => string
  encode: () => number
}

export const wrapPoint = (self: Point): WrappedPoint => ({
  unwrap: () => self,
  toIndex: toIndex(self),
  toString: toString(self),
  encode: encode(self),
})

const toIndex =
  ([x, y]: Point) =>
  (direction: Direction): Index => {
    const n = BOARD_SIZE - 1
    let i: number, j: number
    switch (direction) {
      case Direction.vertical:
        return [x, y]
      case Direction.horizontal:
        return [y, x]
      case Direction.ascending:
        i = x + n - y
        j = i < n ? x : y
        return [i, j]
      case Direction.descending:
        i = x + y
        j = i < n ? x : n - y
        return [i, j]
      default:
        return [x, y]
    }
  }

const encode =
  ([x, y]: Point) =>
  (): number =>
    x * BOARD_SIZE + y

const toString =
  ([x, y]: Point) =>
  (): string =>
    `${pointXToString(x)}${pointYToString(y)}`

export type Index = [number, number]

export type WrappedIndex = {
  unwrap: () => Index
  toPoint: (direction: Direction) => Point
}

export const wrapIndex = (self: Index): WrappedIndex => ({
  unwrap: () => self,
  toPoint: toPoint(self),
})

const toPoint =
  ([i, j]: Index) =>
  (direction: Direction): Point => {
    const n = BOARD_SIZE - 1
    let x: number, y: number
    switch (direction) {
      case Direction.vertical:
        return [i, j]
      case Direction.horizontal:
        return [j, i]
      case Direction.ascending:
        x = i < n ? j : i + j - n
        y = i < n ? n - i + j : j
        return [x, y]
      case Direction.descending:
        x = i < n ? j : i + j - n
        y = i < n ? i - j : n - j
        return [x, y]
      default:
        return [i, j]
    }
  }

export type Points = Point[]

export const parsePoints = (s: string): Points | undefined => {
  const ss = s.match(/[a-oA-O][0-9]+/g)
  if (!ss) return
  const ps = ss.map(parsePoint)
  if (ps.some(p => p === undefined)) return undefined
  return ps.map(p => p!)
}

export const decodePoints = (cs: Uint8Array): Points | undefined => {
  const ps = Array.from(cs).map(decodePoint)
  if (ps.some(p => p === undefined)) return undefined
  return ps.map(p => p!)
}

export type WrappedPoints = {
  unwrap: () => Points
  toString: () => string
  encode: () => Uint8Array
}

export const wrapPoints = (self: Points): WrappedPoints => ({
  unwrap: () => self,
  toString: toStringPoints(self),
  encode: encodePoints(self),
})

const toStringPoints = (self: Points) => (): string => self.map(p => toString(p)()).join(",")

const encodePoints = (self: Points) => (): Uint8Array => new Uint8Array(self.map(p => encode(p)()))

export const pointXToString = (x: number): string => X_CODES.charAt(x)

export const pointYToString = (y: number): string => (y + 1).toString()

const X_CODES = "ABCDEFGHIJKLMNO"

const X_CODE_TO_NUM: Record<string, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7,
  i: 8,
  j: 9,
  k: 10,
  l: 11,
  m: 12,
  n: 13,
  o: 14,
}
