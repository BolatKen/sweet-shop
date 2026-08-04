"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const prisma_1 = __importDefault(require("../lib/prisma"));
let token;
let userId;
let variantId;
let categoryId;
let productId;
beforeAll(async () => {
    // Create test user and get token
    const email = `cart_test_${Date.now()}@test.com`;
    await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/register')
        .send({ email, password: '123456' });
    const loginRes = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/login')
        .send({ email, password: '123456' });
    token = loginRes.body.accessToken;
    userId = loginRes.body.id;
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    userId = user.id;
    // Create category, product, variant
    const category = await prisma_1.default.category.create({
        data: { name: 'Cart Test Category', slug: `cart-test-cat-${Date.now()}` }
    });
    categoryId = category.id;
    const product = await prisma_1.default.product.create({
        data: {
            name: 'Cart Test Product',
            slug: `cart-test-product-${Date.now()}`,
            categoryId: category.id,
            images: [],
            isActive: true,
        }
    });
    productId = product.id;
    const variant = await prisma_1.default.productVariant.create({
        data: {
            productId: product.id,
            size: 'M',
            color: 'Black',
            price: 10000,
            stock: 10,
        }
    });
    variantId = variant.id;
});
afterAll(async () => {
    await prisma_1.default.cartItem.deleteMany({ where: { userId } });
    await prisma_1.default.productVariant.deleteMany({ where: { productId } });
    await prisma_1.default.product.deleteMany({ where: { id: productId } });
    await prisma_1.default.category.deleteMany({ where: { id: categoryId } });
    await prisma_1.default.user.deleteMany({ where: { id: userId } });
    await prisma_1.default.$disconnect();
});
describe('Cart', () => {
    it('GET /api/cart — should reject without token', async () => {
        await (0, supertest_1.default)(app_1.default)
            .get('/api/cart')
            .expect(401);
    });
    it('GET /api/cart — should return empty array for new user', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });
    it('POST /api/cart — should add item to cart', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ variantId, quantity: 1 })
            .expect(200);
        expect(response.body.variantId).toBe(variantId);
        expect(response.body.quantity).toBe(1);
    });
    it('POST /api/cart — should increment quantity on duplicate', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/cart')
            .set('Authorization', `Bearer ${token}`)
            .send({ variantId, quantity: 1 })
            .expect(200);
        expect(response.body.quantity).toBe(2);
    });
    it('DELETE /api/cart/:id — should remove item', async () => {
        const cart = await (0, supertest_1.default)(app_1.default)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`);
        const itemId = cart.body[0].id;
        await (0, supertest_1.default)(app_1.default)
            .delete(`/api/cart/${itemId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        const updatedCart = await (0, supertest_1.default)(app_1.default)
            .get('/api/cart')
            .set('Authorization', `Bearer ${token}`);
        expect(updatedCart.body.length).toBe(0);
    });
});
