import config from './config'
declare global {
  interface Number {
    half: () => number
    twice: () => number
    toArray: () => number[]
    toColorString: () => string
    byRight: () => number
    byBottom: () => number
  }
  interface String {
    toColorNumber: () => number
  }
  interface Array<T> {
    random: () => T | undefined
    remove: (callbackfn: ((value: T, index: number) => any)) => void
    findMin: (callbackfn: ((value: T, index: number) => any) | T) => T
    findMax: (callbackfn: ((value: T, index: number) => any) | T) => T
  }
  interface ArrayConstructor {
    range: (min: number, max: number) => number[]
  }
  interface Math {
    sum: (...values: number[]) => number
    average: (...args: number[]) => number
    minmax: (value: number, min: number, max: number) => number
    randomInt: (min: number, max: number) => number
    chance: (value: number) => boolean
  }
  function log (...data: any[]): void
  function sleep (duration: number): Promise<void>
}

export const extendNativeClassFunctions = (screenWidth: number, screenHeight: number, tileSize: number) => {
  // Number instance methods
  Object.defineProperty(Number.prototype, 'half', {
    value () { return this / 2 }
  })
  Object.defineProperty(Number.prototype, 'twice', {
    value () { return this * 2 }
  })
  Object.defineProperty(Number.prototype, 'toArray', {
    value () { return [...Array(this).keys()] }
  })
  Object.defineProperty(Number.prototype, 'toColorString', {
    value () { return `#${this.toString(16)}` }
  })
  Object.defineProperty(Number.prototype, 'byRight', {
    value () { return screenWidth - this }
  })
  Object.defineProperty(Number.prototype, 'byBottom', {
    value () { return screenHeight - this }
  })
  // String instance methods
  Object.defineProperty(String.prototype, 'toColorNumber', {
    value () { return parseInt(this.slice(1), 16) }
  })
  // Array instance methods
  Object.defineProperty(Array.prototype, 'random', {
    value () { return this[Math.randomInt(0, this.length - 1)] }
  })
  Object.defineProperty(Array.prototype, 'remove', {
    value<T> (callbackfn: ((value: T, index: number) => any)) {
      const i = this.findIndex(callbackfn)
      if (i === -1) return
      this.splice(i, 1)
    }
  })
  Object.defineProperty(Array.prototype, 'findMin', {
    value<T> (callbackfn: (value: T, index: number) => number) {
      return (this as Array<T>).reduce((result, record, i) => {
        const value = callbackfn(record, i)
        if (!result.record || value < result.value) {
          Object.assign(result, { value, record })
        }
        return result
      }, { value: Infinity, record: undefined }).record
    }
  })
  Object.defineProperty(Array.prototype, 'findMax', {
    value<T>  (callbackfn: (value: T, index: number) => number) {
      return (this as Array<T>).reduce((result, record, i) => {
        const value = callbackfn(record, i)
        if (!result.record || value > result.value) {
          Object.assign(result, { value, record })
        }
        return result
      }, { value: -Infinity, record: undefined }).record
    }
  })
  // Array class method
  Array.range = (start: number, end: number) => {
    const negative = start > end
    return (Math.abs(end - start) + 1).toArray().map(i => negative ? start - i : i + start)
  }
  // Math class methods
  Math.sum = (...args) => args.reduce((accumulator, current) => accumulator + current)
  Math.average = (...args) => Math.sum(...args) / args.length
  Math.minmax = (value, min, max) => Math.min(Math.max(value, min), max)
  Math.randomInt = (min, max) => Math.floor(Math.random() * (max + 1 - min)) + min
  Math.chance = value => value > Math.random()
  // Global variables
  window.sleep = duration => new Promise(resolve => setTimeout(resolve, duration))
  window.log = console.log
}
extendNativeClassFunctions(config.WIDTH, config.HEIGHT, 32)
