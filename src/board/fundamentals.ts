export const BOARD_SIZE = 15

export type Bits = number

export type Player = boolean
export const Player: Record<"black" | "white", Player> = {
  black: true,
  white: false,
} as const

export const isBlack = (player: Player): boolean => player

export const isWhite = (player: Player): boolean => !player

export const opponent = (player: Player): Player => !player

const rowKinds = ["two", "sword", "three", "four", "five", "overline"] as const
export type RowKind = typeof rowKinds[number]
export const RowKind: Record<RowKind, RowKind> = {
  two: "two",
  sword: "sword",
  three: "three",
  four: "four",
  five: "five",
  overline: "overline",
}
