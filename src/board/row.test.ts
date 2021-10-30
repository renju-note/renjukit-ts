import { Direction } from "./point"
import { Row, wrapRow } from "./row"

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
