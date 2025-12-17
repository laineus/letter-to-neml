export type Branch = {
  code: number
  result: true
  ref: string
} | {
  code: number
  result: false
  ref: null
}
export type SuccessResponse = {
  result: Branch[]
}
export type ErrorResponse = {
  error: {
    code: string
    ref: string | null
  }
}
