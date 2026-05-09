import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import productRoutes from './routes/products'
import authRoutes from './routes/auth'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/products', productRoutes)

app.use('/api/auth', authRoutes)


const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API running on :${PORT}`))

