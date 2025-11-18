
export type Story = {
  title: string
  if: string
  list: StoryItem[]
}

export type StoryItem = StoryIf | StorySleep | StoryFade | StoryBackground | StorySpeakers | StoryMessages | StoryEndIf | StoryFunction

export type StorySleep = {
  type: 'sleep'
  duration: number
}
export type StoryFade = {
  type: 'fade'
  fade: 'in' | 'out'
  duration: number
}

export type StoryBackground = {
  type: 'background'
  image: string
}

export type StorySpeakers = {
  type: 'speakers'
  list: SpeakerConfig[]
}

export type SpeakerConfig = {
  image: string
  x: number
  facing: 'left' | 'right'
}

export type StoryMessages = {
  type: 'messages'
  list: MessageConfig[]
}

export type StoryIf = {
  type: 'if'
  if: string
}

export type StoryEndIf = {
  type: 'endIf'
}

export type StoryFunction = {
  type: 'function'
  function: string
}

export type MessageConfig = {
  name: string
  text: string
}

export type Branch = {
  code: number
  result: boolean
  ref: string
}
