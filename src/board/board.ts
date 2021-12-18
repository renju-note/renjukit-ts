import {
  forbidden as forbiddenFunc,
  ForbiddenKind,
  forbiddens as forbiddensFunc,
} from "./forbidden"
import { Player, RowKind } from "./fundamentals"
import { Point, Points } from "./point"
import { Row } from "./row"
import { createSquare, makeSquare, parseSquare, Square, wrapSquare } from "./square"

export type Board = {
  square: Square
}

export const createBoard = (): Board => ({
  square: createSquare(),
})

export const makeBoard = (blacks: Points, whites: Points): Board => ({
  square: makeSquare(blacks, whites),
})

export const parseBoard = (s: string): Board | undefined => {
  const square = parseSquare(s)
  if (square === undefined) {
    return undefined
  } else {
    return { square }
  }
}

export type WrappedBoard = {
  unwrap: () => Board
  put: (player: Player, p: Point) => WrappedBoard
  remove: (p: Point) => WrappedBoard
  stones: (player: Player) => Point[]
  rows: (player: Player, kind: RowKind) => Row[]
  rowsOn: (player: Player, kind: RowKind, p: Point) => Row[]
  forbiddens: () => [ForbiddenKind, Point][]
  forbidden: (p: Point) => ForbiddenKind | undefined
  toString: () => string
}

export const wrapBoard = (self: Board): WrappedBoard => ({
  unwrap: () => self,
  put: put(self),
  remove: remove(self),
  stones: stones(self),
  rows: rows(self),
  rowsOn: rowsOn(self),
  forbidden: forbidden(self),
  forbiddens: forbiddens(self),
  toString: toString(self),
})

const put =
  (self: Board) =>
  (player: Player, p: Point): WrappedBoard =>
    wrapBoard({
      square: wrapSquare(self.square).put(player, p).unwrap(),
    })

const remove =
  (self: Board) =>
  (p: Point): WrappedBoard =>
    wrapBoard({
      square: wrapSquare(self.square).remove(p).unwrap(),
    })

const stones =
  (self: Board) =>
  (player: Player): Point[] =>
    wrapSquare(self.square).stones(player)

const rows =
  (self: Board) =>
  (player: Player, kind: RowKind): Row[] =>
    wrapSquare(self.square).rows(player, kind)

const rowsOn =
  (self: Board) =>
  (player: Player, kind: RowKind, p: Point): Row[] =>
    wrapSquare(self.square).rowsOn(player, kind, p)

const forbiddens = (self: Board) => (): [ForbiddenKind, Point][] => forbiddensFunc(self.square)

const forbidden =
  (self: Board) =>
  (p: Point): ForbiddenKind | undefined =>
    forbiddenFunc(self.square, p)

const toString = (self: Board) => (): string => wrapSquare(self.square).toString()
