"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const prisma_1 = __importDefault(require("../lib/prisma"));
let categoryId;
let productSlug;
beforeAll(async () => {
    const category = await prisma_1.default.category.create({
        data: { name: 'Test Category', slug: `test-category-${Date.now()}` }
    });
    categoryId = category.id;
    const product = await prisma_1.default.product.create({
        data: {
            name: 'Test Product',
            slug: `test-product-${Date.now()}`,
            description: 'Test description',
            categoryId: category.id,
            images: [],
            isActive: true,
        }
    });
    productSlug = product.slug;
});
afterAll(async () => {
    await prisma_1.default.product.deleteMany({ where: { slug: { startsWith: 'test-product' } } });
    await prisma_1.default.category.deleteMany({ where: { slug: { startsWith: 'test-category' } } });
    await prisma_1.default.$disconnect();
});
describe('Products', () => {
    it('GET /api/products — should return array', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/products')
            .expect(200);
        expect(Array.isArray(response.body.products)).toBe(true);
    });
    it('GET /api/products/:slug — should return product', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/api/products/${productSlug}`)
            .expect(200);
        expect(response.body.slug).toBe(productSlug);
        expect(response.body.name).toBe('Test Product');
    });
    it('GET /api/products/:slug — non-existent slug should return null', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/products/non-existent-slug')
            .expect(200);
        expect(response.body).toBeNull();
    });
    it('POST /api/products — should reject without token', async () => {
        await (0, supertest_1.default)(app_1.default)
            .post('/api/products')
            .send({ name: 'Unauthorized Product', slug: 'unauth-product' })
            .expect(401);
    });
});
