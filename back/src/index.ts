import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import productRoutes from './routes/products'
import authRoutes from './routes/auth'
import cartRoutes from './routes/cart'
import orderRoutes from './routes/orders'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)


const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API running on :${PORT}`))

