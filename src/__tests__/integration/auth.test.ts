import request from "supertest";
import app from "../../app"; // adjust path if your app.ts is elsewhere

describe("Auth endpoints", () => {
  const validUser = {
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  describe("POST /api/auth/register", () => {
    it("registers a new user and returns a token", async () => {
      const res = await request(app).post("/api/auth/register").send(validUser);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(validUser.email);
      expect(res.body.data.user.isOnboarded).toBe(false); // new user not onboarded
    });

    it("rejects registration with mismatched passwords", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test2@example.com",
        password: "password123",
        confirmPassword: "different",
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("rejects duplicate email", async () => {
      await request(app).post("/api/auth/register").send(validUser);
      const res = await request(app).post("/api/auth/register").send(validUser);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // register a user to log in with
      await request(app).post("/api/auth/register").send(validUser);
    });

    it("logs in with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: validUser.email,
        password: validUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
    });

    it("rejects login with wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: validUser.email,
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("rejects login for a non-existent email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nobody@example.com",
        password: "password123",
      });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});