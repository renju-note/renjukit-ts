import { BOARD_SIZE } from "./bits"
import { createLine, createLineFromString, WrappedLine } from "./line"
import { Player, Row, RowKind } from "./row"

test("createLine", () => {
  let result: WrappedLine

  result = createLine(10)
  expect(result.unwrap().size).toBe(10)

  result = createLine(16)
  expect(result.unwrap().size).toBe(BOARD_SIZE)
})

test("put", () => {
  let line = createLine(BOARD_SIZE)

  line = line.put(Player.black, 0).put(Player.white, 2)
  expect(line.unwrap().blacks).toBe(0b000000000000001)
  expect(line.unwrap().whites).toBe(0b000000000000100)

  // overwrite
  line = line.put(Player.black, 5).put(Player.white, 5)
  expect(line.unwrap().blacks).toBe(0b000000000000001)
  expect(line.unwrap().whites).toBe(0b000000000100100)
})

test("stones", () => {
  const line = createLineFromString("o-ox-")!
  const result = line.stones()
  const expected = [Player.black, undefined, Player.black, Player.white, undefined]
  expect(result).toEqual(expected)
})

test("rows", () => {
  const line = createLineFromString("-oooo---x--x---")!

  let result: Row[]
  let expected: Row[]

  result = line.rows(Player.black, RowKind.four)
  expected = [
    { start: 0, end: 4, eye1: 0, eye2: undefined },
    { start: 1, end: 5, eye1: 5, eye2: undefined },
  ]
  expect(result).toEqual(expected)

  result = line.rows(Player.white, RowKind.two)
  expected = [{ start: 7, end: 12, eye1: 9, eye2: 10 }]
  expect(result).toEqual(expected)
})

test("toString", () => {
  const line = createLine(7).put(Player.black, 0).put(Player.black, 4).put(Player.white, 2)
  expect(line.toString()).toEqual("o-x-o--")
})

test("createLineFromString", () => {
  const result = createLineFromString("-o---x----")!
  const expected = createLine(10).put(Player.black, 1).put(Player.white, 5)
  expect(result.unwrap()).toEqual(expected.unwrap())
})
