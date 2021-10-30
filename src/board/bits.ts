import { Bits } from "./fundamentals"

export type Window = {
  size: number
  target: Bits
}

export type WrappedWindow = {
  unwrap: () => Window
  satisfies: (stones: Bits, blanks: Bits) => boolean
}

export const wrapWindow = (self: Window): WrappedWindow => ({
  unwrap: () => self,
  satisfies: satisfies(self),
})

const satisfies =
  (self: Window) =>
  (stones: Bits, blanks: Bits): boolean => {
    return (self.target & (stones | blanks)) === self.target
  }

export type Pattern = {
  filter: Bits
  stones: Bits
  blanks: Bits
  eyes__: Bits
}

export type WrappedPattern = {
  unwrap: () => Pattern
  matches: (stones: Bits, blanks: Bits) => boolean
  start: () => number
  end: () => number
  eye1: () => number | undefined
  eye2: () => number | undefined
}

export const wrapPattern = (self: Pattern): WrappedPattern => ({
  unwrap: () => self,
  matches: matches(self),
  start: start(self),
  end: end(self),
  eye1: eye1(self),
  eye2: eye2(self),
})

const matches =
  (self: Pattern) =>
  (stones: Bits, blanks: Bits): boolean => {
    return (
      (stones & self.filter) === self.stones && (blanks & self.filter & self.blanks) === self.blanks
    )
  }

const start = (self: Pattern) => (): number => {
  switch ((self.stones | self.blanks) & 0b11) {
    case 0b11:
      return 0
    case 0b10:
      return 1
    case 0b00:
      return 2
    default:
      return 0
  }
}

const end = (self: Pattern) => (): number => {
  switch (self.stones | self.blanks) {
    case 0b1111:
      return 3
    case 0b11110:
      return 4
    case 0b111100:
      return 5
    case 0b11111:
      return 4
    case 0b111110:
      return 5
    case 0b1111100:
      return 6
    case 0b111111:
      return 5
    case 0b1111110:
      return 6
    case 0b11111100:
      return 7
    default:
      return 0
  }
}

const eye1 = (self: Pattern) => (): number | undefined => {
  switch (self.eyes__) {
    case 0b1:
      return 0
    case 0b10:
      return 1
    case 0b100:
      return 2
    case 0b1000:
      return 3
    case 0b10000:
      return 4
    case 0b100000:
      return 5
    case 0b1000000:
      return 6
    case 0b11:
      return 0
    case 0b101:
      return 0
    case 0b110:
      return 1
    case 0b1001:
      return 0
    case 0b1010:
      return 1
    case 0b1100:
      return 2
    case 0b10001:
      return 0
    case 0b10010:
      return 1
    case 0b10100:
      return 2
    case 0b11000:
      return 3
    case 0b100010:
      return 1
    case 0b100100:
      return 2
    case 0b101000:
      return 3
    case 0b110000:
      return 4
    default:
      return undefined
  }
}

const eye2 = (self: Pattern) => (): number | undefined => {
  switch (self.eyes__) {
    case 0b11:
      return 1
    case 0b101:
      return 2
    case 0b110:
      return 2
    case 0b1001:
      return 3
    case 0b1010:
      return 3
    case 0b1100:
      return 3
    case 0b10001:
      return 4
    case 0b10010:
      return 4
    case 0b10100:
      return 4
    case 0b11000:
      return 4
    case 0b100010:
      return 5
    case 0b100100:
      return 5
    case 0b101000:
      return 5
    case 0b110000:
      return 5
    default:
      return undefined
  }
}

export const B_TWO: Window = {
  size: 8,
  target: 0b01111110,
}

export const B_TWOS: Pattern[] = [
  {
    filter: 0b11111111,
    stones: 0b00001100,
    blanks: 0b01110010,
    eyes__: 0b00110000,
  },
  {
    filter: 0b11111111,
    stones: 0b00010100,
    blanks: 0b01101010,
    eyes__: 0b00101000,
  },
  {
    filter: 0b11111111,
    stones: 0b00011000,
    blanks: 0b01100110,
    eyes__: 0b00100100,
  },
  {
    filter: 0b11111111,
    stones: 0b00100100,
    blanks: 0b01011010,
    eyes__: 0b00011000,
  },
  {
    filter: 0b11111111,
    stones: 0b00101000,
    blanks: 0b01010110,
    eyes__: 0b00010100,
  },
  {
    filter: 0b11111111,
    stones: 0b00110000,
    blanks: 0b01001110,
    eyes__: 0b00001100,
  },
]

export const B_THREE: Window = {
  size: 8,
  target: 0b01111110,
}

export const B_THREES: Pattern[] = [
  {
    filter: 0b11111111,
    stones: 0b00011100,
    blanks: 0b01100010,
    eyes__: 0b00100000,
  },
  {
    filter: 0b11111111,
    stones: 0b00101100,
    blanks: 0b01010010,
    eyes__: 0b00010000,
  },
  {
    filter: 0b11111111,
    stones: 0b00110100,
    blanks: 0b01001010,
    eyes__: 0b00001000,
  },
  {
    filter: 0b11111111,
    stones: 0b00111000,
    blanks: 0b01000110,
    eyes__: 0b00000100,
  },
]

export const B_SWORD: Window = {
  size: 7,
  target: 0b0111110,
}

export const B_SWORDS: Pattern[] = [
  {
    filter: 0b1111111,
    stones: 0b0001110,
    blanks: 0b0110000,
    eyes__: 0b0110000,
  },
  {
    filter: 0b1111111,
    stones: 0b0010110,
    blanks: 0b0101000,
    eyes__: 0b0101000,
  },
  {
    filter: 0b1111111,
    stones: 0b0011010,
    blanks: 0b0100100,
    eyes__: 0b0100100,
  },
  {
    filter: 0b1111111,
    stones: 0b0011100,
    blanks: 0b0100010,
    eyes__: 0b0100010,
  },
  {
    filter: 0b1111111,
    stones: 0b0100110,
    blanks: 0b0011000,
    eyes__: 0b0011000,
  },
  {
    filter: 0b1111111,
    stones: 0b0101010,
    blanks: 0b0010100,
    eyes__: 0b0010100,
  },
  {
    filter: 0b1111111,
    stones: 0b0101100,
    blanks: 0b0010010,
    eyes__: 0b0010010,
  },
  {
    filter: 0b1111111,
    stones: 0b0110010,
    blanks: 0b0001100,
    eyes__: 0b0001100,
  },
  {
    filter: 0b1111111,
    stones: 0b0110100,
    blanks: 0b0001010,
    eyes__: 0b0001010,
  },
  {
    filter: 0b1111111,
    stones: 0b0111000,
    blanks: 0b0000110,
    eyes__: 0b0000110,
  },
]

export const B_FOUR: Window = {
  size: 7,
  target: 0b0111110,
}

export const B_FOURS: Pattern[] = [
  {
    filter: 0b1111111,
    stones: 0b0011110,
    blanks: 0b0100000,
    eyes__: 0b0100000,
  },
  {
    filter: 0b1111111,
    stones: 0b0101110,
    blanks: 0b0010000,
    eyes__: 0b0010000,
  },
  {
    filter: 0b1111111,
    stones: 0b0110110,
    blanks: 0b0001000,
    eyes__: 0b0001000,
  },
  {
    filter: 0b1111111,
    stones: 0b0111010,
    blanks: 0b0000100,
    eyes__: 0b0000100,
  },
  {
    filter: 0b1111111,
    stones: 0b0111100,
    blanks: 0b0000010,
    eyes__: 0b0000010,
  },
]

export const B_FIVE: Window = {
  size: 7,
  target: 0b0111110,
}

export const B_FIVES: Pattern[] = [
  {
    filter: 0b1111111,
    stones: 0b0111110,
    blanks: 0b0000000,
    eyes__: 0b0000000,
  },
]

export const B_OVERLINE: Window = {
  size: 6,
  target: 0b111111,
}

export const B_OVERLINES: Pattern[] = [
  {
    filter: 0b111111,
    stones: 0b111111,
    blanks: 0b000000,
    eyes__: 0b000000,
  },
]

export const W_TWO: Window = {
  size: 6,
  target: 0b111111,
}

export const W_TWOS: Pattern[] = [
  {
    filter: 0b111111,
    stones: 0b000110,
    blanks: 0b111001,
    eyes__: 0b011000,
  },
  {
    filter: 0b111111,
    stones: 0b001010,
    blanks: 0b110101,
    eyes__: 0b010100,
  },
  {
    filter: 0b111111,
    stones: 0b001100,
    blanks: 0b110011,
    eyes__: 0b010010,
  },
  {
    filter: 0b111111,
    stones: 0b010010,
    blanks: 0b101101,
    eyes__: 0b001100,
  },
  {
    filter: 0b111111,
    stones: 0b010100,
    blanks: 0b101011,
    eyes__: 0b001010,
  },
  {
    filter: 0b111111,
    stones: 0b011000,
    blanks: 0b100111,
    eyes__: 0b000110,
  },
]

export const W_THREE: Window = {
  size: 6,
  target: 0b111111,
}

export const W_THREES: Pattern[] = [
  {
    filter: 0b111111,
    stones: 0b001110,
    blanks: 0b110001,
    eyes__: 0b010000,
  },
  {
    filter: 0b111111,
    stones: 0b010110,
    blanks: 0b101001,
    eyes__: 0b001000,
  },
  {
    filter: 0b111111,
    stones: 0b011010,
    blanks: 0b100101,
    eyes__: 0b000100,
  },
  {
    filter: 0b111111,
    stones: 0b011100,
    blanks: 0b100011,
    eyes__: 0b000010,
  },
]

export const W_SWORD: Window = {
  size: 5,
  target: 0b11111,
}

export const W_SWORDS: Pattern[] = [
  {
    filter: 0b11111,
    stones: 0b00111,
    blanks: 0b11000,
    eyes__: 0b11000,
  },
  {
    filter: 0b11111,
    stones: 0b01011,
    blanks: 0b10100,
    eyes__: 0b10100,
  },
  {
    filter: 0b11111,
    stones: 0b01101,
    blanks: 0b10010,
    eyes__: 0b10010,
  },
  {
    filter: 0b11111,
    stones: 0b01110,
    blanks: 0b10001,
    eyes__: 0b10001,
  },
  {
    filter: 0b11111,
    stones: 0b10011,
    blanks: 0b01100,
    eyes__: 0b01100,
  },
  {
    filter: 0b11111,
    stones: 0b10101,
    blanks: 0b01010,
    eyes__: 0b01010,
  },
  {
    filter: 0b11111,
    stones: 0b10110,
    blanks: 0b01001,
    eyes__: 0b01001,
  },
  {
    filter: 0b11111,
    stones: 0b11001,
    blanks: 0b00110,
    eyes__: 0b00110,
  },
  {
    filter: 0b11111,
    stones: 0b11010,
    blanks: 0b00101,
    eyes__: 0b00101,
  },
  {
    filter: 0b11111,
    stones: 0b11100,
    blanks: 0b00011,
    eyes__: 0b00011,
  },
]

export const W_FOUR: Window = {
  size: 5,
  target: 0b11111,
}

export const W_FOURS: Pattern[] = [
  {
    filter: 0b11111,
    stones: 0b01111,
    blanks: 0b10000,
    eyes__: 0b10000,
  },
  {
    filter: 0b11111,
    stones: 0b10111,
    blanks: 0b01000,
    eyes__: 0b01000,
  },
  {
    filter: 0b11111,
    stones: 0b11011,
    blanks: 0b00100,
    eyes__: 0b00100,
  },
  {
    filter: 0b11111,
    stones: 0b11101,
    blanks: 0b00010,
    eyes__: 0b00010,
  },
  {
    filter: 0b11111,
    stones: 0b11110,
    blanks: 0b00001,
    eyes__: 0b00001,
  },
]

export const W_FIVE: Window = {
  size: 5,
  target: 0b11111,
}

export const W_FIVES: Pattern[] = [
  {
    filter: 0b11111,
    stones: 0b11111,
    blanks: 0b00000,
    eyes__: 0b00000,
  },
]
