"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/checkout', auth_1.authenticateToken, async (req, res) => {
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    const userId = req.user.id;
    const { orderId } = req.body;
    const order = await prisma_1.default.order.findUnique({
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
    });
    if (!order)
        return res.status(404).json({ message: 'Order not found' });
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
    });
    res.json({ url: session.url });
});
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), async (req, res) => {
    const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    }
    catch {
        return res.status(400).json({ message: 'Webhook error' });
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.success_url.split('orderId=')[1];
        await prisma_1.default.order.update({
            where: { id: orderId },
            data: { status: 'PAID', stripePaymentId: session.payment_intent }
        });
    }
    res.json({ received: true });
});
exports.default = router;
