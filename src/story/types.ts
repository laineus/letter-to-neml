
export type Story = {
  title: string
  if?: {
    id: number
    resultId: number
  }
  list: StoryItem[]
}

type StoryItem = StoryBackground | StorySpeakers | StoryMessages

type StoryBackground = {
  type: 'background'
  image: string
}

type StorySpeakers = {
  type: 'speakers'
  list: SpeakerConfig[]
}
type SpeakerConfig = {
  image: string
  x: number
}

type StoryMessages = {
  type: 'messages'
  list: MessageConfig[]
}

type MessageConfig = {
  name: string
  text: string
}
