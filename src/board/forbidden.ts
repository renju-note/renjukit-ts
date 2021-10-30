import { BOARD_SIZE, Player, RowKind } from "./fundamentals"
import { Point } from "./point"
import { Row, wrapRow } from "./row"
import { Square, WrappedSquare, wrapSquare } from "./square"

export const forbiddenKinds = ["doubleThree", "doubleFour", "overline"] as const
export type ForbiddenKind = typeof forbiddenKinds[number]
export const ForbiddenKind: Record<ForbiddenKind, ForbiddenKind> = {
  doubleThree: "doubleThree",
  doubleFour: "doubleFour",
  overline: "overline",
}

export const forbiddens = (square: Square): [ForbiddenKind, Point][] =>
  new Array(BOARD_SIZE)
    .fill(null)
    .map((_, x) =>
      new Array(BOARD_SIZE)
        .fill(null)
        .map((_, y) => {
          const p: Point = [x, y]
          return [forbidden(square, p), p] as [ForbiddenKind | undefined, Point]
        })
        .filter(([k, _]) => k !== undefined)
    )
    .flat(1)
    .map(([k, p]) => [k, p] as [ForbiddenKind, Point])

export const forbidden = (square: Square, p: Point): ForbiddenKind | undefined => {
  const next = wrapSquare(square).put(Player.black, p)
  if (overline(next, p)) {
    return ForbiddenKind.overline
  } else if (doubleFour(next, p)) {
    return ForbiddenKind.doubleFour
  } else if (doubleThree(next, p)) {
    return ForbiddenKind.doubleThree
  }
}

const overline = (next: WrappedSquare, p: Point): boolean => {
  const newOverlines = next.rowsOn(Player.black, RowKind.overline, p)
  return newOverlines.length >= 1
}

const doubleFour = (next: WrappedSquare, p: Point): boolean => {
  const newFours = next.rowsOn(Player.black, RowKind.four, p)
  if (newFours.length < 2) return false
  return distinctive(newFours)
}

const doubleThree = (next: WrappedSquare, p: Point): boolean => {
  const newThrees = next.rowsOn(Player.black, RowKind.three, p)
  if (newThrees.length < 2 || !distinctive(newThrees)) return false
  const truthyThrees = newThrees.filter(
    r => forbidden(next.unwrap(), r.eye1 as Point) === undefined
  )
  if (truthyThrees.length < 2) return false
  return distinctive(truthyThrees)
}

const distinctive = (rows: Row[]): boolean => {
  const first = wrapRow(rows[0])
  for (const row of rows.slice(1)) {
    if (!first.adjacent(row)) return true
  }
  return false
}
