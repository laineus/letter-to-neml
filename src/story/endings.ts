import endingsJson from './endings.ja.json' with { type: 'json' }
type Ending = {
  id: number
  type: string
  title: string
  image: string
}

export const endings = endingsJson as Ending[]