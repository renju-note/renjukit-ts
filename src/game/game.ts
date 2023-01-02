import { parsePoints, Point, pointEqual, Points, wrapPoints } from "../board"

export type Game = {
  moves: Points
  inverted: boolean
}

export const createGame = (): Game => ({ moves: [], inverted: false })

export const makeGame = (moves: Points, inverted: boolean): Game => ({ moves, inverted })

export const parseGame = (code: string): Game | undefined => {
  const points = parsePoints(code)
  return points && { moves: points, inverted: false }
}

export type WrappedGame = {
  unwrap: () => Game
  move: (p: Point) => WrappedGame
  undo: () => WrappedGame
  has: (p: Point) => boolean
  cut: (length: number) => WrappedGame
  invert: (inverted: boolean) => WrappedGame
  canUndo: () => boolean
  blacks: () => Points
  whites: () => Points
  lastMove: () => Point | undefined
  isBlackTurn: () => boolean
  size: () => number
  empty: () => boolean
  inverted: () => boolean
  toString: (separator?: string) => string
}

export const wrapGame = (self: Game): WrappedGame => ({
  unwrap: () => self,
  move: move(self),
  undo: undo(self),
  has: has(self),
  cut: cut(self),
  invert: invert(self),
  canUndo: canUndo(self),
  blacks: blacks(self),
  whites: whites(self),
  lastMove: lastMove(self),
  isBlackTurn: isBlackTurn(self),
  size: size(self),
  empty: empty(self),
  inverted: inverted(self),
  toString: toString(self),
})

const move =
  (self: Game) =>
  (p: Point): WrappedGame => {
    const game = has(self)(p) ? self : { ...self, moves: [...self.moves, p] }
    return wrapGame(game)
  }

const undo = (self: Game) => (): WrappedGame => {
  const game =
    self.moves.length === 0 ? self : { ...self, moves: self.moves.slice(0, self.moves.length - 1) }
  return wrapGame(game)
}

const has =
  (self: Game) =>
  (p: Point): boolean =>
    self.moves.findIndex(q => pointEqual(p, q)) >= 0

const cut =
  (self: Game) =>
  (length: number): WrappedGame =>
    wrapGame({ ...self, moves: self.moves.slice(0, length) })

const invert =
  (self: Game) =>
  (inverted: boolean): WrappedGame =>
    wrapGame({ ...self, inverted })

const canUndo = (self: Game) => () => self.moves.length > 0

const blacks = (self: Game) => () => {
  const r = self.inverted ? 1 : 0
  return self.moves.filter((p, i) => i % 2 === r)
}

const whites = (self: Game) => () => {
  const r = self.inverted ? 0 : 1
  return self.moves.filter((p, i) => i % 2 === r)
}

const isBlackTurn = (self: Game) => () => {
  const r = self.inverted ? 1 : 0
  return self.moves.length % 2 === r
}

const lastMove = (self: Game) => () => self.moves[self.moves.length - 1]

const size = (self: Game) => () => self.moves.length

const empty = (self: Game) => () => self.moves.length === 0

const inverted = (self: Game) => () => self.inverted

const toString =
  (self: Game) =>
  (separator: string = ",") =>
    wrapPoints(self.moves).toString(separator)
