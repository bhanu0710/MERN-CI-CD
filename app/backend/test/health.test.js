const request = require("supertest");
const { createApp } = require("../src/app");

describe("health", () => {
  test("GET /api/health", async () => {
    const app = createApp({ corsOrigin: ["*"] });
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

