import storiesJson from './stories.json' with { type: 'json' }
import type { Story } from './types'

export const stories = storiesJson as Story[]
