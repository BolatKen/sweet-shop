"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const testEmail = `test_${Date.now()}@test.com`;
const testPassword = '123456';
afterAll(async () => {
    await prisma_1.default.user.deleteMany({ where: { email: testEmail } });
    await prisma_1.default.$disconnect();
});
describe('Auth', () => {
    it('POST /api/auth/register — should return 201', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/register')
            .send({ email: testEmail, password: testPassword })
            .expect(201);
        expect(response.body.message).toBe('User registered successfully');
    });
    it('POST /api/auth/login — should return token', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email: testEmail, password: testPassword })
            .expect(200);
        expect(response.body.accessToken).toBeDefined();
    });
    it('POST /api/auth/login — invalid credentials should return 400', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({ email: 'wrong@gmail.com', password: 'wrongpassword' })
            .expect(400);
        expect(response.body.message).toBe('Invalid credentials');
    });
});
