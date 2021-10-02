import { wrapPattern, wrapWindow } from "./bits"

test("satisfies", () => {
  const window = wrapWindow({
    size: 7,
    target: 0b0111110,
  })
  expect(window.satisfies(0b0101010, 0b0010100)).toBeTruthy()
  expect(window.satisfies(0b0101011, 0b0010100)).toBeTruthy()
  expect(window.satisfies(0b0101010, 0b0010000)).toBeFalsy()
})

test("matches", () => {
  const pattern = wrapPattern({
    filter: 0b1111111,
    stones: 0b0101010,
    blanks: 0b0010100,
    eyes__: 0b0010100,
  })
  expect(pattern.matches(0b0101010, 0b0010100)).toBeTruthy()
  expect(pattern.matches(0b0101010, 0b1010101)).toBeTruthy()
  expect(pattern.matches(0b0101000, 0b0010100)).toBeFalsy()
  expect(pattern.matches(0b0101001, 0b0010100)).toBeFalsy()
})

test("start,end,eye1,eye1", () => {
  const pattern = wrapPattern({
    filter: 0b1111111,
    stones: 0b0101010,
    blanks: 0b0010100,
    eyes__: 0b0010100,
  })
  expect(pattern.start()).toEqual(1)
  expect(pattern.end()).toEqual(5)
  expect(pattern.eye1()).toEqual(2)
  expect(pattern.eye2()).toEqual(4)
})
