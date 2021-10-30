import { opponent, Player } from "./fundamentals"

test("opponent", () => {
  expect(opponent(Player.black)).toBe(Player.white)
  expect(opponent(Player.white)).toBe(Player.black)
})
