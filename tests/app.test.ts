import request from "supertest";
import app from "../src/app";
const API_KEY = process.env.API_KEY || "91ff0343-001a-4abd-a7cf-ad818430d5c0";

describe("/chat endpoint", () => {
    jest.mock("openai", () => ({
        ...jest.requireActual("openai"),
        chat: {
            completions: {
                create: jest.fn().mockResolvedValue({
                    data: {
                        choices: [{ message: { content: "Mocked response" } }],
                    },
                }),
            },
        },
    }));

    it("should require a valid API key", async () => {
        const response = await request(app).post("/chat").send({
            sessionId: "test-session",
            userMessage: "Hello",
        });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid or missing API key");
    });

    it("should validate request body", async () => {
        const response = await request(app).post("/chat").set("x-api-key", API_KEY).send({});

        expect(response.status).toBe(400);
        expect(response.body.errors).toContain("Session ID is required");
        expect(response.body.errors).toContain("User message must be a non-empty string");
    });

    it("should return a reply on valid request", async () => {
        const response = await request(app).post("/chat").set("x-api-key", API_KEY).send({
            sessionId: "test-session",
            userMessage: "Hello",
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("reply");
    });
});
