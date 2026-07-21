import express from 'express'
import Stripe from 'stripe'
import prisma from '../lib/prisma'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

router.post('/checkout', authenticateToken, async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const userId = (req as any).user.id
  const { orderId } = req.body

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      }
    }
  })

  if (!order) return res.status(404).json({ message: 'Order not found' })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: order.items.map(item => ({
      price_data: {
        currency: 'kzt',
        product_data: {
          name: `${item.variant.product.name} — ${item.variant.size} / ${item.variant.color}`
        },
        unit_amount: item.variant.price
      },
      quantity: item.quantity
    })),
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/checkout/success?orderId=${orderId}`,
    cancel_url: `${process.env.FRONTEND_URL}/checkout`
  })

  res.json({ url: session.url })
})

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const sig = req.headers['stripe-signature'] as string

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return res.status(400).json({ message: 'Webhook error' })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const orderId = session.success_url.split('orderId=')[1]

    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID', stripePaymentId: session.payment_intent }
    })
  }

  res.json({ received: true })
})

export default router





























































































































