import {
  forbidden as forbiddenFunc,
  ForbiddenKind,
  forbiddens as forbiddensFunc,
} from "./forbidden"
import { Point, Points } from "./point"
import { Player, RowKind } from "./row"
import { createSquare, makeSquare, parseSquare, RowSegment, Square, wrapSquare } from "./square"

export type Board = {
  square: Square
}

export type WrappedBoard = {
  unwrap: () => Board
  put: (player: Player, p: Point) => WrappedBoard
  rows: (player: Player, kind: RowKind) => RowSegment[]
  rowsOn: (player: Player, kind: RowKind, p: Point) => RowSegment[]
  forbiddens: () => [ForbiddenKind, Point][]
  forbidden: (p: Point) => ForbiddenKind | undefined
  toString: () => string
}

export const createBoard = (): WrappedBoard =>
  wrapBoard({
    square: createSquare().unwrap(),
  })

export const makeBoard = (blacks: Points, whites: Points): WrappedBoard =>
  wrapBoard({
    square: makeSquare(blacks, whites).unwrap(),
  })

export const parseBoard = (s: string): WrappedBoard | undefined => {
  const wsquare = parseSquare(s)
  if (wsquare === undefined) {
    return undefined
  } else {
    return wrapBoard({ square: wsquare.unwrap() })
  }
}

export const wrapBoard = (self: Board): WrappedBoard => ({
  unwrap: () => self,
  put: put(self),
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

const rows =
  (self: Board) =>
  (player: Player, kind: RowKind): RowSegment[] =>
    wrapSquare(self.square).rows(player, kind)

const rowsOn =
  (self: Board) =>
  (player: Player, kind: RowKind, p: Point): RowSegment[] =>
    wrapSquare(self.square).rowsOn(player, kind, p)

const toString = (self: Board) => (): string => wrapSquare(self.square).toString()

const forbiddens = (self: Board) => (): [ForbiddenKind, Point][] =>
  forbiddensFunc(wrapSquare(self.square))

const forbidden =
  (self: Board) =>
  (p: Point): ForbiddenKind | undefined =>
    forbiddenFunc(wrapSquare(self.square), p)
