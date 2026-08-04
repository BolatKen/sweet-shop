"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const userInfo = await prisma_1.default.user.findUnique({
        where: { id: userId },
        include: {
            orders: {
                include: {
                    items: {
                        include: {
                            variant: {
                                include: {
                                    product: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    res.json(userInfo);
});
exports.default = router;
