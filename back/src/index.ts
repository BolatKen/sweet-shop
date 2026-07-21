import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import productRoutes from './routes/products'
import authRoutes from './routes/auth'
import cartRoutes from './routes/cart'
import orderRoutes from './routes/orders'
import categoryRoutes from './routes/categories'
import userRoutes from './routes/users'
import adminRoutes from './routes/admin'
import paymentRoutes from './routes/payments'

dotenv.config()
const app = express()

app.use(cors({
  origin: 'https://sweet-shop-one-flame.vercel.app',
  credentials: true
}))
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payments', paymentRoutes)


const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API running on :${PORT}`))

