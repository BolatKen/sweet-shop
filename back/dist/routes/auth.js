"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        await prisma_1.default.user.create({ data: { email, passwordHash: hashedPassword } });
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Error registing user", error: err.message });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ message: 'Invalid credentials' });
        const isMatch = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials' });
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '720h' });
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: { refreshToken }
        });
        res.status(200).json({ accessToken, refreshToken, message: 'Logged in successfully' });
    }
    catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
});
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    try {
        if (!refreshToken)
            return res.status(400).json({ message: 'Refresh token missing' });
        const user = await prisma_1.default.user.findFirst({ where: { refreshToken } });
        if (!user)
            return res.status(401).json({ message: 'Invalid refresh token' });
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken });
    }
    catch (err) {
        res.status(500).json({ message: 'Error refreshing token', error: err.message });
    }
});
exports.default = router;
