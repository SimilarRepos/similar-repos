import { customAlphabet } from 'nanoid'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'

export const nanoid6 = customAlphabet(alphabet, 6)
export const nanoid8 = customAlphabet(alphabet, 8)
