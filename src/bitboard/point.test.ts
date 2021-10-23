import {
  decodePoint,
  decodePoints,
  Direction,
  parsePoint,
  parsePoints,
  Point,
  Points,
  wrapIndex,
  WrappedIndex,
  WrappedPoint,
  wrapPoint,
  wrapPoints,
} from "./point"

test("toPoint,toIndex", () => {
  const allEqual = (
    p: WrappedPoint,
    iv: WrappedIndex,
    ih: WrappedIndex,
    ia: WrappedIndex,
    id: WrappedIndex
  ) => {
    expect(p.toIndex(Direction.vertical).unwrap()).toEqual(iv.unwrap())
    expect(p.toIndex(Direction.horizontal).unwrap()).toEqual(ih.unwrap())
    expect(p.toIndex(Direction.ascending).unwrap()).toEqual(ia.unwrap())
    expect(p.toIndex(Direction.descending).unwrap()).toEqual(id.unwrap())
    expect(iv.toPoint(Direction.vertical).unwrap()).toEqual(p.unwrap())
    expect(ih.toPoint(Direction.horizontal).unwrap()).toEqual(p.unwrap())
    expect(ia.toPoint(Direction.ascending).unwrap()).toEqual(p.unwrap())
    expect(id.toPoint(Direction.descending).unwrap()).toEqual(p.unwrap())
  }

  let p: WrappedPoint, iv: WrappedIndex, ih: WrappedIndex, ia: WrappedIndex, id: WrappedIndex

  // lower-left quadrant
  p = wrapPoint([3, 6])
  iv = wrapIndex([3, 6])
  ih = wrapIndex([6, 3])
  ia = wrapIndex([11, 3])
  id = wrapIndex([9, 3])
  allEqual(p, iv, ih, ia, id)

  // lower-right quadrant
  p = wrapPoint([9, 6])
  iv = wrapIndex([9, 6])
  ih = wrapIndex([6, 9])
  ia = wrapIndex([17, 6])
  id = wrapIndex([15, 8])
  allEqual(p, iv, ih, ia, id)

  // upper-left quadrant
  p = wrapPoint([3, 12])
  iv = wrapIndex([3, 12])
  ih = wrapIndex([12, 3])
  ia = wrapIndex([5, 3])
  id = wrapIndex([15, 2])
  allEqual(p, iv, ih, ia, id)

  // upper-right quadrant
  p = wrapPoint([9, 12])
  iv = wrapIndex([9, 12])
  ih = wrapIndex([12, 9])
  ia = wrapIndex([11, 9])
  id = wrapIndex([21, 2])
  allEqual(p, iv, ih, ia, id)
})

test("toString,parsePoint", () => {
  const p1: Point = [4, 1]
  const s1 = "E2"
  expect(wrapPoint(p1).toString()).toBe(s1)
  expect(parsePoint(s1)!.unwrap()).toEqual(p1)

  const p2: Point = [12, 14]
  const s2 = "M15"
  expect(wrapPoint(p2).toString()).toBe(s2)
  expect(parsePoint(s2)!.unwrap()).toEqual(p2)
})

test("encode,decodePoint", () => {
  const p: Point = [4, 12]
  const c = 72
  expect(wrapPoint(p).encode()).toBe(c)
  expect(decodePoint(c)!.unwrap()).toEqual(p)
})

test("toStringPoints,parsePoints", () => {
  const ps: Points = [
    [7, 7],
    [7, 8],
    [8, 8],
  ]
  const s = "H8,H9,I9"
  expect(wrapPoints(ps).toString()).toBe(s)
  expect(parsePoints(s)!.unwrap()).toEqual(ps)
})

test("encodePoints,decodePoints", () => {
  const ps: Points = [
    [7, 7],
    [7, 8],
    [8, 8],
  ]
  const cs = new Uint8Array([112, 113, 128])
  expect(wrapPoints(ps).encode()).toEqual(cs)
  expect(decodePoints(cs)!.unwrap()).toEqual(ps)
})
