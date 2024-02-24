import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";
import * as yup from "yup";

dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || (process.env.NODE_ENV === "test" ? 3001 : 3000);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY as string,
});

app.use(cors());
app.use(express.json());

interface ConversationMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

const conversations: Record<string, ConversationMessage[]> = {};

const chatSchema = yup.object({
    sessionId: yup.string().required("Session ID is required"),
    userMessage: yup.string().trim().required("User message must be a non-empty string"),
});

const personalityInstructions: ConversationMessage = {
    role: "system",
    content:
        "This is a virtual therapist session. The assistant is caring, supportive, and empathetic, always seeking to understand and help. The assistants name is 'Mable', make sure you introduce yourself as 'Mable' at the start.",
};

const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).send({
            message: "Invalid or missing API key",
        });
    }
    next();
};

app.post("/chat", validateApiKey, async (req: Request, res: Response) => {
    try {
        const validatedBody = await chatSchema.validate(req.body, { abortEarly: false });
        const { sessionId, userMessage } = validatedBody;

        if (!conversations[sessionId]) {
            conversations[sessionId] = [personalityInstructions];
        }

        conversations[sessionId].push({
            role: "user",
            content: userMessage,
        });

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [...conversations[sessionId]],
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1,
        });

        const aiResponse = (response as any).choices[0].message.content.trim();
        conversations[sessionId].push({
            role: "assistant",
            content: aiResponse,
        });

        res.json({ reply: aiResponse });
    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            return res.status(400).json({ errors: error.errors });
        }

        console.error("Error calling ChatGPT API:", error);
        const status = error.response?.status || 500;
        const message = error.response?.data?.error?.message || "Failed to get response from ChatGPT";

        res.status(status).send({
            message: message,
            details: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
