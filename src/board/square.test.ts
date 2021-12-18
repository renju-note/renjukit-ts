import { Player, RowKind } from "./fundamentals"
import { wrapLine } from "./line"
import { Direction, Point } from "./point"
import { Row } from "./row"
import { createSquare, parseSquare, Square, WrappedSquare, wrapSquare } from "./square"

test("put", () => {
  let square = wrapSquare(createSquare())
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

test("remove", () => {
  let square = wrapSquare(createSquare())
  square = square.put(Player.black, [7, 7])
  square = square.put(Player.white, [8, 8])
  square = square.put(Player.black, [9, 8])
  square = square.remove([8, 8])

  let result: string, expected: string

  result = square
    .unwrap()
    .hlines.map(l => wrapLine(l).toString())
    .join("\n")
  expected = trimLinesString(`
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    -------o-------
    ---------o-----
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
  `)
  expect(result).toBe(expected)

  result = square
    .unwrap()
    .vlines.map(l => wrapLine(l).toString())
    .join("\n")
  expected = trimLinesString(`
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    ---------------
    -------o-------
    ---------------
    --------o------
    ---------------
    ---------------
    ---------------
    ---------------
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
    -------o-------
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
    -------o-------
    --------------
    -------------
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

test("stones", () => {
  let square = wrapSquare(createSquare())
  square = square.put(Player.black, [7, 7])
  square = square.put(Player.white, [8, 8])
  square = square.put(Player.black, [9, 8])

  const blacks: Point[] = [
    [7, 7],
    [9, 8],
  ]
  const whites: Point[] = [[8, 8]]
  expect(square.stones(Player.black)).toEqual(blacks)
  expect(square.stones(Player.white)).toEqual(whites)
})

test("rows,rowsOn", () => {
  const square = wrapSquare(
    parseSquare(`
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
  )
  const blackTwos: Row[] = [
    {
      direction: Direction.ascending,
      start: [7, 5],
      end: [10, 8],
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
  let result: Square, expected: WrappedSquare

  result = parseSquare("H8,J9/I9")!
  expected = wrapSquare(createSquare())
  expected = expected.put(Player.black, [7, 7])
  expected = expected.put(Player.white, [8, 8])
  expected = expected.put(Player.black, [9, 8])
  expect(result).toEqual(expected.unwrap())

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
  expected = wrapSquare(createSquare())
  expected = expected.put(Player.black, [7, 7])
  expected = expected.put(Player.white, [8, 8])
  expected = expected.put(Player.black, [9, 8])
  expected = expected.put(Player.black, [0, 0])
  expected = expected.put(Player.white, [0, 14])
  expected = expected.put(Player.black, [14, 0])
  expected = expected.put(Player.white, [14, 14])
  expect(result).toEqual(expected.unwrap())
})

test("toString", () => {
  let square = wrapSquare(createSquare())
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

const trimLinesString = (s: string): string =>
  s
    .trim()
    .split("\n")
    .map(ls => ls.trim())
    .join("\n")
