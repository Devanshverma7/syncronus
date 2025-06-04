import { Router } from "express";
import { getAIMessages, sendAIMessage } from "../controllers/AIController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const AIRoutes = Router();

AIRoutes.post("/send", verifyToken, sendAIMessage);
AIRoutes.get("/get-ai-messages", verifyToken, getAIMessages);

export default AIRoutes;
