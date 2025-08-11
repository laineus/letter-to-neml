
export type Story = {
  title: string
  if?: {
    id: number
    resultId: number
  }
  list: StoryItem[]
}

export type StoryItem = StorySleep | StoryBackground | StorySpeakers | StoryMessages

export type StorySleep = {
  type: 'sleep'
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
}

export type StoryMessages = {
  type: 'messages'
  list: MessageConfig[]
}

export type MessageConfig = {
  name: string
  text: string
}

export type StoryCharacter = {
  name: string
}
