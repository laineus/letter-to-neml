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

// story.json更新エンドポイント
app.post('/api', async (req, res) => {
  try {
    const storiesPath = path.join(__dirname, '../src/story', 'story.json')
    // リクエストボディをそのままファイルに書き込む
    await fs.writeFile(storiesPath, JSON.stringify(req.body, null, 2))
    res.json({ 
      success: true, 
      message: 'story.json has been updated successfully' 
    })
  } catch (error) {
    console.error('Error updating story.json:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update story.json',
      details: error.message
    })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
