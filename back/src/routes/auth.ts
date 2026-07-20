import express from "express" 
import prisma from "../lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const router = express.Router();

router.post('/register', async (req, res) => {
    const {email, password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({data : {email, passwordHash: hashedPassword}})
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

        const accessToken = jwt.sign
            ({ id: user.id, role: user.role },
            process.env.JWT_SECRET!, 
            { expiresIn: '15m' });

        const refreshToken = jwt.sign
            ({ id: user.id, role: user.role}, 
            process.env.JWT_SECRET!, 
            { expiresIn: '720h'});

        await prisma.user.update({
            where: { id: user.id },
            data: { refreshToken }
            })

        res.status(200).json({ accessToken, refreshToken, message: 'Logged in successfully' });
    } catch (err: any) {
        res.status(500).json({message: "Error logging in", error: err.message});
    }
})

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body
  try {
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token missing' })

    const user = await prisma.user.findFirst({ where: { refreshToken } })
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' })

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    )

    res.json({ accessToken })
  } catch (err: any) {
    res.status(500).json({ message: 'Error refreshing token', error: err.message })
  }
})

export default router;