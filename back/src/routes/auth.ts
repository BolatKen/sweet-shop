import express from "express" 
import prisma from "../lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router();

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({data : {email, passwordHash: hashedPassword}})
        res.status(201).json({message: "User registered successfully"});
    } catch(err : any) {
        res.status(500).json({message: "Error registing user", error: err.message});
    }
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.status(200).json({ token, message: 'Logged in successfully' });
    } catch (err: any) {
        res.status(500).json({message: "Error logging in", error: err.message});
    }
})

export default router;