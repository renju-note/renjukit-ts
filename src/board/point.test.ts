import {
  decodePoint,
  decodePoints,
  Direction,
  Index,
  parsePoint,
  parsePoints,
  Point,
  pointEqual,
  Points,
  wrapIndex,
  wrapPoint,
  wrapPoints,
} from "./point"

test("equalPoint", () => {
  expect(pointEqual([1, 2], [1, 2])).toBe(true)
  expect(pointEqual([1, 2], [1, 1])).toBe(false)
  expect(pointEqual([1, 2], [2, 2])).toBe(false)
})

test("toPoint,toIndex", () => {
  const allEqual = (p: Point, iv: Index, ih: Index, ia: Index, id: Index) => {
    const wp = wrapPoint(p)
    expect(wp.toIndex(Direction.vertical)).toEqual(iv)
    expect(wp.toIndex(Direction.horizontal)).toEqual(ih)
    expect(wp.toIndex(Direction.ascending)).toEqual(ia)
    expect(wp.toIndex(Direction.descending)).toEqual(id)
    expect(wrapIndex(iv).toPoint(Direction.vertical)).toEqual(p)
    expect(wrapIndex(ih).toPoint(Direction.horizontal)).toEqual(p)
    expect(wrapIndex(ia).toPoint(Direction.ascending)).toEqual(p)
    expect(wrapIndex(id).toPoint(Direction.descending)).toEqual(p)
  }

  // lower-left quadrant
  allEqual([3, 6], [3, 6], [6, 3], [11, 3], [9, 3])

  // lower-right quadrant
  allEqual([9, 6], [9, 6], [6, 9], [17, 6], [15, 8])

  // upper-left quadrant
  allEqual([3, 12], [3, 12], [12, 3], [5, 3], [15, 2])

  // upper-right quadrant
  allEqual([9, 12], [9, 12], [12, 9], [11, 9], [21, 2])
})

test("toString,parsePoint", () => {
  const p1: Point = [4, 1]
  const s1 = "E2"
  expect(wrapPoint(p1).toString()).toBe(s1)
  expect(parsePoint(s1)!).toEqual(p1)

  const p2: Point = [12, 14]
  const s2 = "M15"
  expect(wrapPoint(p2).toString()).toBe(s2)
  expect(parsePoint(s2)!).toEqual(p2)
})

test("encode,decodePoint", () => {
  const p: Point = [4, 12]
  const c = 72
  expect(wrapPoint(p).encode()).toBe(c)
  expect(decodePoint(c)!).toEqual(p)
})

test("toStringPoints,parsePoints", () => {
  const ps: Points = [
    [7, 7],
    [7, 8],
    [8, 8],
  ]
  const s = "H8,H9,I9"
  expect(wrapPoints(ps).toString()).toBe(s)
  expect(parsePoints(s)!).toEqual(ps)

  expect(wrapPoints(ps).toString(" ")).toBe("H8 H9 I9")
})

test("encodePoints,decodePoints", () => {
  const ps: Points = [
    [7, 7],
    [7, 8],
    [8, 8],
  ]
  const cs = new Uint8Array([112, 113, 128])
  expect(wrapPoints(ps).encode()).toEqual(cs)
  expect(decodePoints(cs)!).toEqual(ps)
})
