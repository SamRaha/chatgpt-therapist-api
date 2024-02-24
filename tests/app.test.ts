import request from "supertest";
import app from "../src/app";
const API_KEY = process.env.API_KEY || "91ff0343-001a-4abd-a7cf-ad818430d5c0";

describe("CRUD operations for devices", () => {
    const sampleDevice = { name: "Test Device", model: "Test model" };

    // Test POST /devices
    it("should create a new device", async () => {
        const response = await request(app).post("/devices").set("x-api-key", API_KEY).send(sampleDevice);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.name).toBe(sampleDevice.name);
        expect(response.body.model).toBe(sampleDevice.model);
    });

    // Test GET /devices
    it("should get all devices", async () => {
        const response = await request(app).get("/devices").set("x-api-key", API_KEY);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // Test GET /devices/:id
    it("should get a single device by id", async () => {
        const createResponse = await request(app).post("/devices").set("x-api-key", API_KEY).send(sampleDevice);
        const deviceId = createResponse.body.id;

        const response = await request(app).get(`/devices/${deviceId}`).set("x-api-key", API_KEY);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining(sampleDevice));
    });

    // Test PUT /devices/:id
    it("should update a device", async () => {
        const createResponse = await request(app).post("/devices").set("x-api-key", API_KEY).send(sampleDevice);
        const deviceId = createResponse.body.id;

        const updatedDevice = { ...sampleDevice, model: "Updated model" };
        const response = await request(app).put(`/devices/${deviceId}`).set("x-api-key", API_KEY).send(updatedDevice);
        expect(response.status).toBe(200);
        expect(response.body.model).toBe(updatedDevice.model);
    });

    // Test DELETE /devices/:id
    it("should delete a device", async () => {
        const createResponse = await request(app).post("/devices").set("x-api-key", API_KEY).send(sampleDevice);
        const deviceId = createResponse.body.id;

        const deleteResponse = await request(app).delete(`/devices/${deviceId}`).set("x-api-key", API_KEY);
        expect(deleteResponse.status).toBe(204);

        // Verify the device is actually deleted
        const getResponse = await request(app).get(`/devices/${deviceId}`).set("x-api-key", API_KEY);
        expect(getResponse.status).toBe(404);
    });
});
