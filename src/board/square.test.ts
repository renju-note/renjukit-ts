import { Player, RowKind } from "./fundamentals"
import { wrapLine } from "./line"
import { Direction } from "./point"
import { createSquare, parseSquare, Row, WrappedSquare, wrapRow } from "./square"

test("put", () => {
  let square = createSquare()
  square = square.put(Player.black, [7, 7])
  square = square.put(Player.white, [8, 8])
  square = square.put(Player.black, [9, 8])
  square = square.put(Player.black, [1, 1])
  square = square.put(Player.white, [1, 13])
  square = square.put(Player.black, [13, 1])
  square = square.put(Player.white, [13, 13])

  let result: string, expected: string

  result = square
    .unwrap()
    .hlines.map(l => wrapLine(l).toString())
    .join("\n")
  expected = trimLinesString(`
    ---------------
    -o-----------o-
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    -------o-------
    --------xo-----
    ---------------
    ---------------
    ---------------
    ---------------
    -x-----------x-
    ---------------
  `)
  expect(result).toBe(expected)

  result = square
    .unwrap()
    .vlines.map(l => wrapLine(l).toString())
    .join("\n")
  expected = trimLinesString(`
    ---------------
    -o-----------x-
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    -------o-------
    --------x------
    --------o------
    ---------------
    ---------------
    ---------------
    -o-----------x-
    ---------------
  `)
  expect(result).toBe(expected)

  result = square
    .unwrap()
    .alines.map(l => wrapLine(l).toString())
    .join("\n")
  expected = trimLinesString(`
    -----
    ------
    -------
    --------
    ---------
    ----------
    -----------
    ------------
    -------------
    --------------
    -o-----ox----x-
    --------o-----
    -------------
    ------------
    -----------
    ----------
    ---------
    --------
    -------
    ------
    -----
  `)
  expect(result).toBe(expected)

  result = square
    .unwrap()
    .dlines.map(l => wrapLine(l).toString())
    .join("\n")
  expected = trimLinesString(`
    -----
    ------
    -------
    --------
    ---------
    ----------
    -----------
    ------------
    -------------
    --------------
    -x-----o-----o-
    --------------
    ------x------
    ------o-----
    -----------
    ----------
    ---------
    --------
    -------
    ------
    -----
  `)
  expect(result).toBe(expected)
})

test("rows,rowsOn", () => {
  const square = parseSquare(`
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    -------xxxo----
    -------o-------
    ---------------
    -------o-------
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
  `)!
  const blackTwos: Row[] = [
    {
      direction: Direction.ascending,
      start: [6, 4],
      end: [11, 9],
      eye1: [8, 6],
      eye2: [9, 7],
    },
  ]
  const whiteSwords: Row[] = [
    {
      direction: Direction.horizontal,
      start: [5, 8],
      end: [9, 8],
      eye1: [5, 8],
      eye2: [6, 8],
    },
  ]
  expect(square.rows(Player.black, RowKind.two)).toEqual(blackTwos)
  expect(square.rows(Player.white, RowKind.sword)).toEqual(whiteSwords)
  expect(square.rowsOn(Player.black, RowKind.two, [10, 8])).toEqual(blackTwos)
  expect(square.rowsOn(Player.black, RowKind.two, [7, 7])).toEqual([])
})

test("parseSquare", () => {
  let result: WrappedSquare, expected: WrappedSquare

  result = parseSquare("H8,J9/I9")!
  expected = createSquare()
  expected = expected.put(Player.black, [7, 7])
  expected = expected.put(Player.white, [8, 8])
  expected = expected.put(Player.black, [9, 8])
  expect(result.unwrap()).toEqual(expected.unwrap())

  result = parseSquare(`
      x-------------x
      ---------------
      ---------------
      ---------------
      ---------------
      ---------------
      --------xo-----
      -------o-------
      ---------------
      ---------------
      ---------------
      ---------------
      ---------------
      ---------------
      o-------------o
  `)!
  expected = createSquare()
  expected = expected.put(Player.black, [7, 7])
  expected = expected.put(Player.white, [8, 8])
  expected = expected.put(Player.black, [9, 8])
  expected = expected.put(Player.black, [0, 0])
  expected = expected.put(Player.white, [0, 14])
  expected = expected.put(Player.black, [14, 0])
  expected = expected.put(Player.white, [14, 14])
  expect(result.unwrap()).toEqual(expected.unwrap())
})

test("toString", () => {
  let square = createSquare()
  square = square.put(Player.black, [7, 7])
  square = square.put(Player.white, [8, 8])
  square = square.put(Player.black, [9, 8])
  square = square.put(Player.black, [0, 0])
  square = square.put(Player.white, [0, 14])
  square = square.put(Player.black, [14, 0])
  square = square.put(Player.white, [14, 14])
  const expected = trimLinesString(`
      x-------------x
      ---------------
      ---------------
      ---------------
      ---------------
      ---------------
      --------xo-----
      -------o-------
      ---------------
      ---------------
      ---------------
      ---------------
      ---------------
      ---------------
      o-------------o
  `)
  expect(square.toString()).toBe(expected)
})

test("adjacent", () => {
  let a: Row, b: Row
  a = {
    direction: Direction.vertical,
    start: [3, 3],
    end: [3, 9],
    eye1: undefined,
    eye2: undefined,
  }
  b = {
    direction: Direction.horizontal,
    start: [3, 3],
    end: [9, 3],
    eye1: undefined,
    eye2: undefined,
  }
  expect(wrapRow(a).adjacent(b)).toBe(false)
  a = {
    direction: Direction.vertical,
    start: [3, 3],
    end: [3, 9],
    eye1: undefined,
    eye2: undefined,
  }
  b = {
    direction: Direction.vertical,
    start: [3, 4],
    end: [3, 10],
    eye1: undefined,
    eye2: undefined,
  }
  expect(wrapRow(a).adjacent(b)).toBe(true)
  a = {
    direction: Direction.vertical,
    start: [3, 3],
    end: [3, 9],
    eye1: undefined,
    eye2: undefined,
  }
  b = {
    direction: Direction.vertical,
    start: [3, 5],
    end: [3, 11],
    eye1: undefined,
    eye2: undefined,
  }
  expect(wrapRow(a).adjacent(b)).toBe(false)
  a = {
    direction: Direction.descending,
    start: [3, 9],
    end: [9, 3],
    eye1: undefined,
    eye2: undefined,
  }
  b = {
    direction: Direction.descending,
    start: [4, 8],
    end: [10, 2],
    eye1: undefined,
    eye2: undefined,
  }
  expect(wrapRow(a).adjacent(b)).toBe(true)
})

const trimLinesString = (s: string): string =>
  s
    .trim()
    .split("\n")
    .map(ls => ls.trim())
    .join("\n")
