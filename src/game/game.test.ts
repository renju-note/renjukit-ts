import { createGame, parseGame, wrapGame } from "./game"

test("move", () => {
  let game = wrapGame(createGame())
  expect(game.toString()).toBe("")

  game = game.move([7, 7])
  expect(game.toString()).toBe("H8")

  game = game.move([7, 8])
  expect(game.toString()).toBe("H8,H9")

  game = game.move([7, 7])
  expect(game.toString()).toBe("H8,H9")
})

test("undo", () => {
  let game = wrapGame(parseGame("H8,H9,J10")!)
  expect(game.toString()).toBe("H8,H9,J10")

  game = game.undo()
  expect(game.toString()).toBe("H8,H9")

  game = game.undo()
  expect(game.toString()).toBe("H8")

  game = game.undo()
  expect(game.toString()).toBe("")

  game = game.undo()
  expect(game.toString()).toBe("")
})

test("has", () => {
  let game = wrapGame(parseGame("H8,H9,J10")!)
  expect(game.has([7, 7])).toBe(true)
  expect(game.has([7, 8])).toBe(true)
  expect(game.has([7, 9])).toBe(false)
})

test("cut", () => {
  let game = wrapGame(parseGame("H8,H9,J10,I9")!)
  expect(game.cut(0).toString()).toBe("")
  expect(game.cut(2).toString()).toBe("H8,H9")
  expect(game.cut(4).toString()).toBe("H8,H9,J10,I9")
  expect(game.cut(5).toString()).toBe("H8,H9,J10,I9")
})

test("invert", () => {
  let game = wrapGame(createGame())
  expect(game.inverted()).toBe(false)
  expect(game.invert(true).inverted()).toBe(true)
})

test("canUndo", () => {
  let game = wrapGame(createGame())
  expect(game.canUndo()).toBe(false)

  game = wrapGame(parseGame("H8,H9,J10")!)
  expect(game.canUndo()).toBe(true)
})

test("blacks", () => {
  let game = wrapGame(parseGame("H8,H9,J10,I9")!)
  expect(game.blacks()).toStrictEqual([
    [7, 7],
    [9, 9],
  ])

  game = wrapGame(parseGame("H8,H9,J10,I9")!).invert(true)
  expect(game.blacks()).toStrictEqual([
    [7, 8],
    [8, 8],
  ])
})

test("whites", () => {
  let game = wrapGame(parseGame("H8,H9,J10,I9")!)
  expect(game.whites()).toStrictEqual([
    [7, 8],
    [8, 8],
  ])

  game = wrapGame(parseGame("H8,H9,J10,I9")!).invert(true)
  expect(game.whites()).toStrictEqual([
    [7, 7],
    [9, 9],
  ])
})

test("isBlackTurn", () => {
  let game = wrapGame(createGame())
  expect(game.isBlackTurn()).toBe(true)

  game = game.move([7, 7])
  expect(game.isBlackTurn()).toBe(false)

  game = game.invert(true)
  expect(game.isBlackTurn()).toBe(true)
})

test("lastMove", () => {
  let game = wrapGame(parseGame("H8,H9,J10,I9")!)
  expect(game.lastMove()).toStrictEqual([8, 8])
})
