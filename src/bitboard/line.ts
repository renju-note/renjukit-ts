import { Bits, BOARD_SIZE } from "./bits"
import { isBlack, Player, Row, RowKind, scanRows } from "./row"

export type Line = {
  size: number
  blacks: Bits
  whites: Bits
}

export type WrappedLine = {
  unwrap: () => Line
  put: (player: Player, i: number) => WrappedLine
  stones: () => (Player | undefined)[]
  rows: (player: Player, kind: RowKind) => Row[]
  eq: (other: Line) => boolean
  toString: () => string
}

export const wrapLine = (self: Line): WrappedLine => ({
  unwrap: () => self,
  put: put(self),
  stones: stones(self),
  rows: rows(self),
  eq: eq(self),
  toString: toString(self),
})

export const createLine = (size: number): WrappedLine =>
  wrapLine({
    size: Math.min(size, BOARD_SIZE),
    blacks: 0b0,
    whites: 0b0,
  })

export const createLineFromString = (s: string): WrappedLine | undefined => {
  const chars = s.split("")
  const size = chars.length
  if (size > BOARD_SIZE) return undefined
  let result = createLine(size)
  for (let i = 0; i < size; i++) {
    const c = chars[i]
    if (c === "o") {
      result = result.put(Player.black, i)
    } else if (c === "x") {
      result = result.put(Player.white, i)
    }
  }
  return result
}

const put =
  (self: Line) =>
  (player: Player, i: number): WrappedLine => {
    const stones = 0b1 << i
    let blacks = self.blacks
    let whites = self.whites
    if (isBlack(player)) {
      blacks |= stones
      whites &= ~stones
    } else {
      blacks &= ~stones
      whites |= stones
    }
    return wrapLine({
      ...self,
      blacks,
      whites,
    })
  }

const stones = (self: Line) => (): (Player | undefined)[] => {
  return new Array(self.size).fill(null).map((_, i) => {
    const pat = 0b1 << i
    if ((self.blacks & pat) !== 0b0) {
      return Player.black
    } else if ((self.whites & pat) !== 0b0) {
      return Player.white
    } else {
      return undefined
    }
  })
}

const rows =
  (self: Line) =>
  (player: Player, kind: RowKind): Row[] => {
    if (!mayContain(self, player, kind)) return []
    const offset = 1
    const stones_ = (isBlack(player) ? self.blacks : self.whites) << 1
    const blanks_ = blanks(self) << 1
    const limit = self.size + offset * 2
    return scanRows(player, kind, stones_, blanks_, limit, 1)
  }

const eq = (self: Line) => (other: Line) =>
  self.size === other.size && self.blacks === other.blacks && self.whites === other.whites

const toString = (self: Line) => (): string =>
  stones(self)()
    .map(v => {
      if (v === true) {
        return "o"
      } else if (v === false) {
        return "x"
      } else {
        return "-"
      }
    })
    .join("")

const mayContain = (self: Line, player: Player, kind: RowKind): boolean => {
  const blanks_ = blanks(self)
  const minBlank = minBlankCount(kind)
  if (countOnes(blanks_) < minBlank) return false

  const minStone = minStoneCount(kind)
  if (isBlack(player)) {
    return countOnes(self.blacks) >= minStone
  } else {
    return countOnes(self.whites) >= minStone
  }
}

const blanks = (self: Line): Bits => ~(self.blacks | self.whites) & ((0b1 << self.size) - 1)

const minStoneCount = (kind: RowKind): number => {
  switch (kind) {
    case RowKind.two:
      return 2
    case RowKind.sword:
      return 3
    case RowKind.three:
      return 3
    case RowKind.four:
      return 4
    case RowKind.five:
      return 5
    case RowKind.overline:
      return 6
    default:
      return 0
  }
}

const minBlankCount = (kind: RowKind): number => {
  switch (kind) {
    case RowKind.two:
      return 4
    case RowKind.sword:
      return 2
    case RowKind.three:
      return 3
    case RowKind.four:
      return 1
    case RowKind.five:
      return 0
    case RowKind.overline:
      return 0
    default:
      return 0
  }
}

const countOnes = (bits: Bits): number => {
  let result = 0
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (((0b1 << i) & bits) !== 0b0) result++
  }
  return result
}
