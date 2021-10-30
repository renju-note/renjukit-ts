import { Player, RowKind } from "./fundamentals"
import { Row, scanRows } from "./row"

test("scanRows", () => {
  const stones = 0b0011100
  const blanks = 0b1100010

  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.white, RowKind.three, stones, blanks, 7, 0)
  expected = [{ start: 1, end: 6, eye1: 5, eye2: undefined }]
  expect(result).toEqual(expected)
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.three, stones, blanks, 5, 0)
  expected = []
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.three, stones, blanks, 7, 1)
  expected = [{ start: 0, end: 5, eye1: 4, eye2: undefined }]
  expect(result).toEqual(expected)
})

test("black two", () => {
  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.black, RowKind.two, 0b00001100, 0b01110010, 8, 0)
  expected = [{ start: 1, end: 6, eye1: 4, eye2: 5 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.two, 0b00010100, 0b01101010, 8, 0)
  expected = [{ start: 1, end: 6, eye1: 3, eye2: 5 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.two, 0b00011000, 0b01100110, 8, 0)
  expected = [{ start: 1, end: 6, eye1: 2, eye2: 5 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.two, 0b00100100, 0b01011010, 8, 0)
  expected = [{ start: 1, end: 6, eye1: 3, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.two, 0b00101000, 0b01010110, 8, 0)
  expected = [{ start: 1, end: 6, eye1: 2, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.two, 0b00110000, 0b01001110, 8, 0)
  expected = [{ start: 1, end: 6, eye1: 2, eye2: 3 }]
  expect(result).toEqual(expected)

  // two twos
  result = scanRows(Player.black, RowKind.two, 0b000101000, 0b111010111, 9, 0)
  expected = [
    { start: 1, end: 6, eye1: 2, eye2: 4 },
    { start: 2, end: 7, eye1: 4, eye2: 6 },
  ]
  expect(result).toEqual(expected)

  // two twos
  result = scanRows(Player.black, RowKind.two, 0b00100100100, 0b01011011010, 11, 0)
  expected = [
    { start: 1, end: 6, eye1: 3, eye2: 4 },
    { start: 4, end: 9, eye1: 6, eye2: 7 },
  ]
  expect(result).toEqual(expected)

  // not two
  result = scanRows(Player.black, RowKind.two, 0b00011100, 0b00100010, 8, 0)
  expected = []
  expect(result).toEqual(expected)

  // not two (overline)
  result = scanRows(Player.black, RowKind.two, 0b100101001, 0b011010110, 9, 0)
  expected = []
  expect(result).toEqual(expected)
})

test("black three", () => {
  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.black, RowKind.three, 0b00011100, 0b01100010, 8, 0)
  expected = [{ start: 1, end: 6, eye1: 5, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.three, 0b00101100, 0b01010010, 8, 0)
  expected = [{ start: 1, end: 6, eye1: 4, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.three, 0b00110100, 0b01001010, 8, 0)
  expected = [{ start: 1, end: 6, eye1: 3, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.three, 0b00111000, 0b01000110, 8, 0)
  expected = [{ start: 1, end: 6, eye1: 2, eye2: undefined }]
  expect(result).toEqual(expected)

  // two threes
  result = scanRows(Player.white, RowKind.three, 0b000111000, 0b111000111, 9, 0)
  expected = [
    { start: 1, end: 6, eye1: 2, eye2: undefined },
    { start: 2, end: 7, eye1: 6, eye2: undefined },
  ]
  expect(result).toEqual(expected)

  // overline
  result = scanRows(Player.black, RowKind.three, 0b0010110100, 0b1101001011, 10, 0)
  expected = []
  expect(result).toEqual(expected)

  // overline
  result = scanRows(Player.black, RowKind.three, 0b100111001, 0b011000110, 9, 0)
  expected = []
  expect(result).toEqual(expected)
})

test("black sword", () => {
  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.black, RowKind.sword, 0b0001110, 0b0110000, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 4, eye2: 5 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.sword, 0b0010110, 0b0101000, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 3, eye2: 5 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.sword, 0b0011010, 0b0100100, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 2, eye2: 5 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.sword, 0b0011100, 0b0100010, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 1, eye2: 5 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.sword, 0b0100110, 0b0011000, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 3, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.sword, 0b0101010, 0b0010100, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 2, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.sword, 0b0101100, 0b0010010, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 1, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.sword, 0b0110010, 0b0001100, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 2, eye2: 3 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.sword, 0b0110100, 0b0001010, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 1, eye2: 3 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.sword, 0b0111000, 0b0000110, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 1, eye2: 2 }]
  expect(result).toEqual(expected)

  // multiple
  result = scanRows(Player.black, RowKind.sword, 0b00011100, 0b11100011, 8, 0)
  expected = [
    { start: 1, end: 5, eye1: 1, eye2: 5 },
    { start: 2, end: 6, eye1: 5, eye2: 6 },
  ]
  expect(result).toEqual(expected)

  // maybe overline
  result = scanRows(Player.black, RowKind.sword, 0b1001110, 0b0110001, 7, 0)
  expected = []
  expect(result).toEqual(expected)

  // not overline
  result = scanRows(Player.black, RowKind.sword, 0b10011100, 0b01100010, 8, 0)
  expected = [{ start: 1, end: 5, eye1: 1, eye2: 5 }]
  expect(result).toEqual(expected)

  // multiple
  result = scanRows(Player.black, RowKind.sword, 0b0010110100, 0b1101001011, 10, 0)
  expected = [
    { start: 1, end: 5, eye1: 1, eye2: 3 },
    { start: 4, end: 8, eye1: 6, eye2: 8 },
  ]
  expect(result).toEqual(expected)
})

test("black four", () => {
  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.black, RowKind.four, 0b0011110, 0b0100000, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 5, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.four, 0b0101110, 0b0010000, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 4, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.four, 0b0110110, 0b0001000, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 3, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.four, 0b0111010, 0b0000100, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 2, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.four, 0b0111100, 0b00000010, 7, 0)
  expected = [{ start: 1, end: 5, eye1: 1, eye2: undefined }]
  expect(result).toEqual(expected)

  // open four
  result = scanRows(Player.black, RowKind.four, 0b00111100, 0b01000010, 8, 0)
  expected = [
    { start: 1, end: 5, eye1: 1, eye2: undefined },
    { start: 2, end: 6, eye1: 6, eye2: undefined },
  ]
  expect(result).toEqual(expected)

  // not open four
  result = scanRows(Player.black, RowKind.four, 0b00111100, 0b00000010, 8, 0)
  expected = [{ start: 1, end: 5, eye1: 1, eye2: undefined }]
  expect(result).toEqual(expected)

  // not open four
  result = scanRows(Player.black, RowKind.four, 0b00111100, 0b01000000, 8, 0)
  expected = [{ start: 2, end: 6, eye1: 6, eye2: undefined }]
  expect(result).toEqual(expected)

  // not open four (overline)
  result = scanRows(Player.black, RowKind.four, 0b10111100, 0b01000010, 8, 0)
  expected = [{ start: 1, end: 5, eye1: 1, eye2: undefined }]
  expect(result).toEqual(expected)

  // not open four (overline)
  result = scanRows(Player.black, RowKind.four, 0b00111101, 0b01000010, 8, 0)
  expected = [{ start: 2, end: 6, eye1: 6, eye2: undefined }]
  expect(result).toEqual(expected)

  // not four (overline)
  result = scanRows(Player.black, RowKind.four, 0b10111101, 0b01000010, 8, 0)
  expected = []
  expect(result).toEqual(expected)

  // not four (overline)
  result = scanRows(Player.black, RowKind.four, 0b01110110, 0b10001001, 8, 0)
  expected = []
  expect(result).toEqual(expected)
})

test("black five", () => {
  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.black, RowKind.five, 0b0111110, 0b0000000, 7, 0)
  expected = [{ start: 1, end: 5, eye1: undefined, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.five, 0b0111110, 0b0000000, 6, 0)
  expected = []
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.five, 0b1111110, 0b0000000, 7, 0)
  expected = []
  expect(result).toEqual(expected)
})

test("black overline", () => {
  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.black, RowKind.overline, 0b111111, 0b000000, 6, 0)
  expected = [{ start: 0, end: 5, eye1: undefined, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.overline, 0b1111111, 0b0000000, 6, 0)
  expected = [{ start: 0, end: 5, eye1: undefined, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.black, RowKind.overline, 0b1111111, 0b0000000, 7, 0)
  expected = [
    { start: 0, end: 5, eye1: undefined, eye2: undefined },
    { start: 1, end: 6, eye1: undefined, eye2: undefined },
  ]
  expect(result).toEqual(expected)
})

test("white two", () => {
  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.white, RowKind.two, 0b000110, 0b111001, 6, 0)
  expected = [{ start: 0, end: 5, eye1: 3, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.two, 0b001010, 0b110101, 6, 0)
  expected = [{ start: 0, end: 5, eye1: 2, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.two, 0b001100, 0b110011, 6, 0)
  expected = [{ start: 0, end: 5, eye1: 1, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.two, 0b010010, 0b101101, 6, 0)
  expected = [{ start: 0, end: 5, eye1: 2, eye2: 3 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.two, 0b010100, 0b101011, 6, 0)
  expected = [{ start: 0, end: 5, eye1: 1, eye2: 3 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.two, 0b011000, 0b100111, 6, 0)
  expected = [{ start: 0, end: 5, eye1: 1, eye2: 2 }]
  expect(result).toEqual(expected)

  // two twos
  result = scanRows(Player.white, RowKind.two, 0b010010010, 0b101101101, 9, 0)
  expected = [
    { start: 0, end: 5, eye1: 2, eye2: 3 },
    { start: 3, end: 8, eye1: 5, eye2: 6 },
  ]
  expect(result).toEqual(expected)

  // not two
  result = scanRows(Player.white, RowKind.two, 0b001110, 0b010001, 6, 0)
  expected = []
  expect(result).toEqual(expected)
})

test("white three", () => {
  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.white, RowKind.three, 0b001110, 0b110001, 6, 0)
  expected = [{ start: 0, end: 5, eye1: 4, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.three, 0b010110, 0b101001, 6, 0)
  expected = [{ start: 0, end: 5, eye1: 3, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.three, 0b011010, 0b100101, 6, 0)
  expected = [{ start: 0, end: 5, eye1: 2, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.three, 0b011100, 0b100011, 6, 0)
  expected = [{ start: 0, end: 5, eye1: 1, eye2: undefined }]
  expect(result).toEqual(expected)

  // two threes
  result = scanRows(Player.white, RowKind.three, 0b0011100, 0b1100011, 7, 0)
  expected = [
    { start: 0, end: 5, eye1: 1, eye2: undefined },
    { start: 1, end: 6, eye1: 5, eye2: undefined },
  ]
  expect(result).toEqual(expected)

  // not three
  result = scanRows(Player.white, RowKind.three, 0b001110, 0b010001, 6, 0)
  expected = []
  expect(result).toEqual(expected)
})

test("white sword", () => {
  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.white, RowKind.sword, 0b00111, 0b11000, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 3, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.sword, 0b01011, 0b10100, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 2, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.sword, 0b01101, 0b10010, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 1, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.sword, 0b01110, 0b10001, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 0, eye2: 4 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.sword, 0b10011, 0b01100, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 2, eye2: 3 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.sword, 0b10101, 0b01010, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 1, eye2: 3 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.sword, 0b10110, 0b01001, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 0, eye2: 3 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.sword, 0b11001, 0b00110, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 1, eye2: 2 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.sword, 0b11010, 0b00101, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 0, eye2: 2 }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.sword, 0b11100, 0b00011, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 0, eye2: 1 }]
  expect(result).toEqual(expected)

  // multiple
  result = scanRows(Player.white, RowKind.sword, 0b101011, 0b010100, 6, 0)
  expected = [
    { start: 0, end: 4, eye1: 2, eye2: 4 },
    { start: 1, end: 5, eye1: 2, eye2: 4 },
  ]
  expect(result).toEqual(expected)

  // multiple
  result = scanRows(Player.white, RowKind.sword, 0b110011, 0b001100, 6, 0)
  expected = [
    { start: 0, end: 4, eye1: 2, eye2: 3 },
    { start: 1, end: 5, eye1: 2, eye2: 3 },
  ]
  expect(result).toEqual(expected)

  // multiple
  result = scanRows(Player.white, RowKind.sword, 0b0011100, 0b1100011, 7, 0)
  expected = [
    { start: 0, end: 4, eye1: 0, eye2: 1 },
    { start: 1, end: 5, eye1: 1, eye2: 5 },
    { start: 2, end: 6, eye1: 5, eye2: 6 },
  ]
  expect(result).toEqual(expected)
})

test("white four", () => {
  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.white, RowKind.four, 0b01111, 0b10000, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 4, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.four, 0b10111, 0b01000, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 3, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.four, 0b11011, 0b00100, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 2, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.four, 0b11101, 0b00010, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 1, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.four, 0b11110, 0b000001, 5, 0)
  expected = [{ start: 0, end: 4, eye1: 0, eye2: undefined }]
  expect(result).toEqual(expected)

  // open four
  result = scanRows(Player.white, RowKind.four, 0b011110, 0b100001, 6, 0)
  expected = [
    { start: 0, end: 4, eye1: 0, eye2: undefined },
    { start: 1, end: 5, eye1: 5, eye2: undefined },
  ]
  expect(result).toEqual(expected)

  // not open four
  result = scanRows(Player.white, RowKind.four, 0b011110, 0b000001, 6, 0)
  expected = [{ start: 0, end: 4, eye1: 0, eye2: undefined }]
  expect(result).toEqual(expected)

  // not open four
  result = scanRows(Player.white, RowKind.four, 0b011110, 0b100000, 6, 0)
  expected = [{ start: 1, end: 5, eye1: 5, eye2: undefined }]
  expect(result).toEqual(expected)
})

test("white five", () => {
  let result: Row[] = []
  let expected: Row[] = []

  result = scanRows(Player.white, RowKind.five, 0b11111, 0b00000, 5, 0)
  expected = [{ start: 0, end: 4, eye1: undefined, eye2: undefined }]
  expect(result).toEqual(expected)

  result = scanRows(Player.white, RowKind.five, 0b111111, 0b00000, 6, 0)
  expected = [
    { start: 0, end: 4, eye1: undefined, eye2: undefined },
    { start: 1, end: 5, eye1: undefined, eye2: undefined },
  ]
  expect(result).toEqual(expected)
})
