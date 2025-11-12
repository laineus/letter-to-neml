import express from 'express'
import cors from 'cors'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 5903

app.use(cors())
app.use(express.json())

// stories.json取得エンドポイント
app.get('/api', async (req, res) => {
  try {
    const storiesPath = path.join(__dirname, '../src/story', 'stories.json')
    const data = await fs.readFile(storiesPath, 'utf8')
    const stories = JSON.parse(data)
    res.json(stories)
  } catch (error) {
    console.error('Error reading stories.json:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to read stories.json',
      details: error.message
    })
  }
})

// stories.json更新エンドポイント
app.post('/api', async (req, res) => {
  try {
    const storiesPath = path.join(__dirname, '../src/story', 'stories.json')
    // リクエストボディをそのままファイルに書き込む
    req.body.forEach(story => {
      if (!story.if) {
        delete story.if
      }
    })
    await fs.writeFile(storiesPath, JSON.stringify(req.body, null, 2))
    res.json({ 
      success: true, 
      message: 'stories.json has been updated successfully' 
    })
  } catch (error) {
    console.error('Error updating stories.json:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update stories.json',
      details: error.message
    })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
