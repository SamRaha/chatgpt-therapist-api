import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || (process.env.NODE_ENV === "test" ? 3001 : 3000);

const validateApiKey = (req: Request, res: Response, next: Function) => {
    const apiKey = req.header("x-api-key");
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).send("Invalid API Key");
    }
    next();
};

app.use(cors());
app.use(express.json());
app.use(validateApiKey);

// CRUD operations

app.post("/chat", async (req: Request, res: Response) => {
    const userMessage: string = req.body.message;

    const prompt: string = `You are a thoughtful and understanding therapist. Your responses should be empathetic, encouraging, and supportive. A user is reaching out to you for help. They say: "${userMessage}"`;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Send the ChatGPT response back to the client
        res.json({ reply: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error calling ChatGPT API:", error);
        res.status(500).send("Failed to get response from ChatGPT");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
