import {
  Bits,
  B_FIVE,
  B_FIVES,
  B_FOUR,
  B_FOURS,
  B_OVERLINE,
  B_OVERLINES,
  B_SWORD,
  B_SWORDS,
  B_THREE,
  B_THREES,
  B_TWO,
  B_TWOS,
  Pattern,
  Window,
  wrapPattern,
  wrapWindow,
  W_FIVE,
  W_FIVES,
  W_FOUR,
  W_FOURS,
  W_SWORD,
  W_SWORDS,
  W_THREE,
  W_THREES,
  W_TWO,
  W_TWOS,
} from "./bits"

export type Player = boolean
export const Player: Record<"black" | "white", Player> = {
  black: true,
  white: false,
} as const

export const rowKinds = ["two", "sword", "three", "four", "five", "overline"] as const
export type RowKind = typeof rowKinds[number]
export const RowKind: Record<RowKind, RowKind> = {
  two: "two",
  sword: "sword",
  three: "three",
  four: "four",
  five: "five",
  overline: "overline",
}

export type Row = {
  start: number
  end: number
  eye1: number | undefined
  eye2: number | undefined
}

export const isBlack = (player: Player): boolean => player

export const isWhite = (player: Player): boolean => !player

export const opponent = (player: Player): Player => !player

export const scanRows = (
  player: Player,
  kind: RowKind,
  stones: Bits,
  blanks: Bits,
  limit: number,
  offset: number
): Row[] => {
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
): Row[] => {
  const result: Row[] = []
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
      const eye1 = p_.eye1()
      const eye2 = p_.eye2()
      result.push({
        start: p_.start() + i - offset,
        end: p_.end() + i - offset,
        eye1: eye1 === undefined ? undefined : eye1 + i - offset,
        eye2: eye2 === undefined ? undefined : eye2 + i - offset,
      })
    }
  }
  return result
}
