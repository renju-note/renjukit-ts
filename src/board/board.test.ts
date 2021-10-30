import { createBoard, wrapBoard } from "./board"
import { ForbiddenKind } from "./forbidden"
import { Player, RowKind } from "./fundamentals"
import { Direction } from "./point"
import { Row } from "./row"

test("put,rows,rowsOn,forbiddens,forbidden,toString", () => {
  let board = wrapBoard(createBoard())
  board = board.put(Player.black, [7, 7])
  board = board.put(Player.white, [7, 8])
  board = board.put(Player.black, [9, 9])
  board = board.put(Player.white, [8, 8])
  board = board.put(Player.black, [6, 8])
  board = board.put(Player.white, [8, 6])
  board = board.put(Player.black, [6, 9])
  board = board.put(Player.white, [8, 9])
  board = board.put(Player.black, [8, 7])
  board = board.put(Player.white, [5, 6])

  const expected = trimLinesString(`
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    ------o-xo-----
    ------oxx------
    -------oo------
    -----x--x------
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
  `)
  expect(board.toString()).toBe(expected)

  const blackTwos: Row[] = [
    { direction: Direction.vertical, start: [6, 5], end: [6, 10], eye1: [6, 6], eye2: [6, 7] },
    { direction: Direction.vertical, start: [6, 6], end: [6, 11], eye1: [6, 7], eye2: [6, 10] },
    { direction: Direction.vertical, start: [6, 7], end: [6, 12], eye1: [6, 10], eye2: [6, 11] },
    { direction: Direction.horizontal, start: [4, 7], end: [9, 7], eye1: [5, 7], eye2: [6, 7] },
    { direction: Direction.horizontal, start: [5, 7], end: [10, 7], eye1: [6, 7], eye2: [9, 7] },
    { direction: Direction.horizontal, start: [6, 7], end: [11, 7], eye1: [9, 7], eye2: [10, 7] },
  ]
  const whiteTwos: Row[] = [
    { direction: Direction.horizontal, start: [4, 6], end: [9, 6], eye1: [6, 6], eye2: [7, 6] },
    { direction: Direction.ascending, start: [6, 7], end: [11, 12], eye1: [9, 10], eye2: [10, 11] },
  ]
  const whiteThrees: Row[] = [
    { direction: Direction.ascending, start: [4, 5], end: [9, 10], eye1: [6, 7], eye2: undefined },
  ]

  expect(board.rows(Player.black, RowKind.two)).toEqual(blackTwos)
  expect(board.rows(Player.white, RowKind.two)).toEqual(whiteTwos)
  expect(board.rows(Player.white, RowKind.three)).toEqual(whiteThrees)
  expect(board.rowsOn(Player.black, RowKind.two, [7, 7])).toEqual([
    blackTwos[3],
    blackTwos[4],
    blackTwos[5],
  ])
  expect(board.forbiddens()).toEqual([[ForbiddenKind.doubleThree, [6, 7]]])
  expect(board.forbidden([6, 7])).toBe(ForbiddenKind.doubleThree)
})

const trimLinesString = (s: string): string =>
  s
    .trim()
    .split("\n")
    .map(ls => ls.trim())
    .join("\n")
