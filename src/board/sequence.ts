import { Bits, isBlack, Player, RowKind } from "./fundamentals"

export type Sequence = {
  start: number
  end: number
  eye1: number | undefined
  eye2: number | undefined
}

export const scanSequences = (
  player: Player,
  kind: RowKind,
  stones: Bits,
  blanks: Bits,
  limit: number,
  offset: number
): Sequence[] => {
  if (isBlack(player)) {
    switch (kind) {
      case RowKind.two:
        return scan(B_TWO, B_TWOS, stones, blanks, limit, offset)
      case RowKind.sword:
        return scan(B_SWORD, B_SWORDS, stones, blanks, limit, offset)
      case RowKind.three:
        return scan(B_THREE, B_THREES, stones, blanks, limit, offset)
      case RowKind.four:
        return scan(B_FOUR, B_FOURS, stones, blanks, limit, offset)
      case RowKind.five:
        return scan(B_FIVE, B_FIVES, stones, blanks, limit, offset)
      case RowKind.overline:
        return scan(B_OVERLINE, B_OVERLINES, stones, blanks, limit, offset)
    }
  } else {
    switch (kind) {
      case RowKind.two:
        return scan(W_TWO, W_TWOS, stones, blanks, limit, offset)
      case RowKind.sword:
        return scan(W_SWORD, W_SWORDS, stones, blanks, limit, offset)
      case RowKind.three:
        return scan(W_THREE, W_THREES, stones, blanks, limit, offset)
      case RowKind.four:
        return scan(W_FOUR, W_FOURS, stones, blanks, limit, offset)
      case RowKind.five:
        return scan(W_FIVE, W_FIVES, stones, blanks, limit, offset)
      default:
        return []
    }
  }
  return []
}

const scan = (
  window: Window,
  patterns: Pattern[],
  stones: Bits,
  blanks: Bits,
  limit: number,
  offset: number
): Sequence[] => {
  const result: Sequence[] = []
  const size = window.size
  if (limit < size) {
    return result
  }
  const window_ = wrapWindow(window)
  for (let i = 0; i <= limit - size; i++) {
    const stones_ = stones >> i
    const blanks_ = blanks >> i
    if (!window_.satisfies(stones_, blanks_)) continue
    for (const p of patterns) {
      const p_ = wrapPattern(p)
      if (!p_.matches(stones_, blanks_)) continue
      result.push({
        start: p.start + i - offset,
        end: p.end + i - offset,
        eye1: p.eye1 === undefined ? undefined : p.eye1 + i - offset,
        eye2: p.eye2 === undefined ? undefined : p.eye2 + i - offset,
      })
    }
  }
  return result
}

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
  start: number
  end: number
  eye1: number | undefined
  eye2: number | undefined
}

export type WrappedPattern = {
  unwrap: () => Pattern
  matches: (stones: Bits, blanks: Bits) => boolean
}

export const wrapPattern = (self: Pattern): WrappedPattern => ({
  unwrap: () => self,
  matches: matches(self),
})

const matches =
  (self: Pattern) =>
  (stones: Bits, blanks: Bits): boolean => {
    return (
      (stones & self.filter) === self.stones && (blanks & self.filter & self.blanks) === self.blanks
    )
  }

const B_TWO: Window = {
  size: 8,
  target: 0b01111110,
}

const B_TWOS: Pattern[] = [
  {
    filter: 0b11111111,
    stones: 0b00001100,
    blanks: 0b01110010,
    start: 1,
    end: 6,
    eye1: 4,
    eye2: 5,
  },
  {
    filter: 0b11111111,
    stones: 0b00010100,
    blanks: 0b01101010,
    start: 1,
    end: 6,
    eye1: 3,
    eye2: 5,
  },
  {
    filter: 0b11111111,
    stones: 0b00011000,
    blanks: 0b01100110,
    start: 1,
    end: 6,
    eye1: 2,
    eye2: 5,
  },
  {
    filter: 0b11111111,
    stones: 0b00100100,
    blanks: 0b01011010,
    start: 1,
    end: 6,
    eye1: 3,
    eye2: 4,
  },
  {
    filter: 0b11111111,
    stones: 0b00101000,
    blanks: 0b01010110,
    start: 1,
    end: 6,
    eye1: 2,
    eye2: 4,
  },
  {
    filter: 0b11111111,
    stones: 0b00110000,
    blanks: 0b01001110,
    start: 1,
    end: 6,
    eye1: 2,
    eye2: 3,
  },
]

const B_THREE: Window = {
  size: 8,
  target: 0b01111110,
}

const B_THREES: Pattern[] = [
  {
    filter: 0b11111111,
    stones: 0b00011100,
    blanks: 0b01100010,
    start: 1,
    end: 6,
    eye1: 5,
    eye2: undefined,
  },
  {
    filter: 0b11111111,
    stones: 0b00101100,
    blanks: 0b01010010,
    start: 1,
    end: 6,
    eye1: 4,
    eye2: undefined,
  },
  {
    filter: 0b11111111,
    stones: 0b00110100,
    blanks: 0b01001010,
    start: 1,
    end: 6,
    eye1: 3,
    eye2: undefined,
  },
  {
    filter: 0b11111111,
    stones: 0b00111000,
    blanks: 0b01000110,
    start: 1,
    end: 6,
    eye1: 2,
    eye2: undefined,
  },
]

const B_SWORD: Window = {
  size: 7,
  target: 0b0111110,
}

const B_SWORDS: Pattern[] = [
  {
    filter: 0b1111111,
    stones: 0b0001110,
    blanks: 0b0110000,
    start: 1,
    end: 5,
    eye1: 4,
    eye2: 5,
  },
  {
    filter: 0b1111111,
    stones: 0b0010110,
    blanks: 0b0101000,
    start: 1,
    end: 5,
    eye1: 3,
    eye2: 5,
  },
  {
    filter: 0b1111111,
    stones: 0b0011010,
    blanks: 0b0100100,
    start: 1,
    end: 5,
    eye1: 2,
    eye2: 5,
  },
  {
    filter: 0b1111111,
    stones: 0b0011100,
    blanks: 0b0100010,
    start: 1,
    end: 5,
    eye1: 1,
    eye2: 5,
  },
  {
    filter: 0b1111111,
    stones: 0b0100110,
    blanks: 0b0011000,
    start: 1,
    end: 5,
    eye1: 3,
    eye2: 4,
  },
  {
    filter: 0b1111111,
    stones: 0b0101010,
    blanks: 0b0010100,
    start: 1,
    end: 5,
    eye1: 2,
    eye2: 4,
  },
  {
    filter: 0b1111111,
    stones: 0b0101100,
    blanks: 0b0010010,
    start: 1,
    end: 5,
    eye1: 1,
    eye2: 4,
  },
  {
    filter: 0b1111111,
    stones: 0b0110010,
    blanks: 0b0001100,
    start: 1,
    end: 5,
    eye1: 2,
    eye2: 3,
  },
  {
    filter: 0b1111111,
    stones: 0b0110100,
    blanks: 0b0001010,
    start: 1,
    end: 5,
    eye1: 1,
    eye2: 3,
  },
  {
    filter: 0b1111111,
    stones: 0b0111000,
    blanks: 0b0000110,
    start: 1,
    end: 5,
    eye1: 1,
    eye2: 2,
  },
]

const B_FOUR: Window = {
  size: 7,
  target: 0b0111110,
}

const B_FOURS: Pattern[] = [
  {
    filter: 0b1111111,
    stones: 0b0011110,
    blanks: 0b0100000,
    start: 1,
    end: 5,
    eye1: 5,
    eye2: undefined,
  },
  {
    filter: 0b1111111,
    stones: 0b0101110,
    blanks: 0b0010000,
    start: 1,
    end: 5,
    eye1: 4,
    eye2: undefined,
  },
  {
    filter: 0b1111111,
    stones: 0b0110110,
    blanks: 0b0001000,
    start: 1,
    end: 5,
    eye1: 3,
    eye2: undefined,
  },
  {
    filter: 0b1111111,
    stones: 0b0111010,
    blanks: 0b0000100,
    start: 1,
    end: 5,
    eye1: 2,
    eye2: undefined,
  },
  {
    filter: 0b1111111,
    stones: 0b0111100,
    blanks: 0b0000010,
    start: 1,
    end: 5,
    eye1: 1,
    eye2: undefined,
  },
]

const B_FIVE: Window = {
  size: 7,
  target: 0b0111110,
}

const B_FIVES: Pattern[] = [
  {
    filter: 0b1111111,
    stones: 0b0111110,
    blanks: 0b0000000,
    start: 1,
    end: 5,
    eye1: undefined,
    eye2: undefined,
  },
]

const B_OVERLINE: Window = {
  size: 6,
  target: 0b111111,
}

const B_OVERLINES: Pattern[] = [
  {
    filter: 0b111111,
    stones: 0b111111,
    blanks: 0b000000,
    start: 0,
    end: 5,
    eye1: undefined,
    eye2: undefined,
  },
]

const W_TWO: Window = {
  size: 6,
  target: 0b111111,
}

const W_TWOS: Pattern[] = [
  {
    filter: 0b111111,
    stones: 0b000110,
    blanks: 0b111001,
    start: 0,
    end: 5,
    eye1: 3,
    eye2: 4,
  },
  {
    filter: 0b111111,
    stones: 0b001010,
    blanks: 0b110101,
    start: 0,
    end: 5,
    eye1: 2,
    eye2: 4,
  },
  {
    filter: 0b111111,
    stones: 0b001100,
    blanks: 0b110011,
    start: 0,
    end: 5,
    eye1: 1,
    eye2: 4,
  },
  {
    filter: 0b111111,
    stones: 0b010010,
    blanks: 0b101101,
    start: 0,
    end: 5,
    eye1: 2,
    eye2: 3,
  },
  {
    filter: 0b111111,
    stones: 0b010100,
    blanks: 0b101011,
    start: 0,
    end: 5,
    eye1: 1,
    eye2: 3,
  },
  {
    filter: 0b111111,
    stones: 0b011000,
    blanks: 0b100111,
    start: 0,
    end: 5,
    eye1: 1,
    eye2: 2,
  },
]

const W_THREE: Window = {
  size: 6,
  target: 0b111111,
}

const W_THREES: Pattern[] = [
  {
    filter: 0b111111,
    stones: 0b001110,
    blanks: 0b110001,
    start: 0,
    end: 5,
    eye1: 4,
    eye2: undefined,
  },
  {
    filter: 0b111111,
    stones: 0b010110,
    blanks: 0b101001,
    start: 0,
    end: 5,
    eye1: 3,
    eye2: undefined,
  },
  {
    filter: 0b111111,
    stones: 0b011010,
    blanks: 0b100101,
    start: 0,
    end: 5,
    eye1: 2,
    eye2: undefined,
  },
  {
    filter: 0b111111,
    stones: 0b011100,
    blanks: 0b100011,
    start: 0,
    end: 5,
    eye1: 1,
    eye2: undefined,
  },
]

const W_SWORD: Window = {
  size: 5,
  target: 0b11111,
}

const W_SWORDS: Pattern[] = [
  {
    filter: 0b11111,
    stones: 0b00111,
    blanks: 0b11000,
    start: 0,
    end: 4,
    eye1: 3,
    eye2: 4,
  },
  {
    filter: 0b11111,
    stones: 0b01011,
    blanks: 0b10100,
    start: 0,
    end: 4,
    eye1: 2,
    eye2: 4,
  },
  {
    filter: 0b11111,
    stones: 0b01101,
    blanks: 0b10010,
    start: 0,
    end: 4,
    eye1: 1,
    eye2: 4,
  },
  {
    filter: 0b11111,
    stones: 0b01110,
    blanks: 0b10001,
    start: 0,
    end: 4,
    eye1: 0,
    eye2: 4,
  },
  {
    filter: 0b11111,
    stones: 0b10011,
    blanks: 0b01100,
    start: 0,
    end: 4,
    eye1: 2,
    eye2: 3,
  },
  {
    filter: 0b11111,
    stones: 0b10101,
    blanks: 0b01010,
    start: 0,
    end: 4,
    eye1: 1,
    eye2: 3,
  },
  {
    filter: 0b11111,
    stones: 0b10110,
    blanks: 0b01001,
    start: 0,
    end: 4,
    eye1: 0,
    eye2: 3,
  },
  {
    filter: 0b11111,
    stones: 0b11001,
    blanks: 0b00110,
    start: 0,
    end: 4,
    eye1: 1,
    eye2: 2,
  },
  {
    filter: 0b11111,
    stones: 0b11010,
    blanks: 0b00101,
    start: 0,
    end: 4,
    eye1: 0,
    eye2: 2,
  },
  {
    filter: 0b11111,
    stones: 0b11100,
    blanks: 0b00011,
    start: 0,
    end: 4,
    eye1: 0,
    eye2: 1,
  },
]

const W_FOUR: Window = {
  size: 5,
  target: 0b11111,
}

const W_FOURS: Pattern[] = [
  {
    filter: 0b11111,
    stones: 0b01111,
    blanks: 0b10000,
    start: 0,
    end: 4,
    eye1: 4,
    eye2: undefined,
  },
  {
    filter: 0b11111,
    stones: 0b10111,
    blanks: 0b01000,
    start: 0,
    end: 4,
    eye1: 3,
    eye2: undefined,
  },
  {
    filter: 0b11111,
    stones: 0b11011,
    blanks: 0b00100,
    start: 0,
    end: 4,
    eye1: 2,
    eye2: undefined,
  },
  {
    filter: 0b11111,
    stones: 0b11101,
    blanks: 0b00010,
    start: 0,
    end: 4,
    eye1: 1,
    eye2: undefined,
  },
  {
    filter: 0b11111,
    stones: 0b11110,
    blanks: 0b00001,
    start: 0,
    end: 4,
    eye1: 0,
    eye2: undefined,
  },
]

const W_FIVE: Window = {
  size: 5,
  target: 0b11111,
}

const W_FIVES: Pattern[] = [
  {
    filter: 0b11111,
    stones: 0b11111,
    blanks: 0b00000,
    start: 0,
    end: 4,
    eye1: undefined,
    eye2: undefined,
  },
]
