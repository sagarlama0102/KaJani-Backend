import request from "supertest";
import app from "../../app";

describe("Authorization", () => {
  // Helper: register + return the token
  async function registerAndGetToken(email: string) {
    const res = await request(app).post("/api/auth/register").send({
      email,
      password: "password123",
      confirmPassword: "password123",
    });
    return res.body.data.token; // adjust if your register token is elsewhere
  }

  describe("Protected routes require auth", () => {
    it("rejects a request with no token (401)", async () => {
      const res = await request(app).get("/api/auth/whoami");
      expect(res.status).toBe(401);
    });

    it("rejects a request with an invalid token (401)", async () => {
      const res = await request(app)
        .get("/api/auth/whoami")
        .set("Authorization", "Bearer invalid.token.here");
      expect(res.status).toBe(401);
    });

    it("allows a request with a valid token", async () => {
      const token = await registerAndGetToken("authuser@example.com");
      const res = await request(app)
        .get("/api/auth/whoami")
        .set("Authorization", `Bearer ${token}`);
      expect(res.status).toBe(200);
    });
  });

  describe("Admin-gating on plan creation", () => {
    it("rejects a non-admin creating a plan (403)", async () => {
      const token = await registerAndGetToken("normaluser@example.com");
      const res = await request(app)
        .post("/api/plans")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Event",
          description: "This is a test event description",
          category: "social",
          location: "Kathmandu",
          date: "2026-12-01",
          time: "10:00",
          endDate: "2026-12-01",  
          endTime: "12:00",         
          isPublic: true,         
          maxMembers: 10, 
        });
        console.log("Response:", res.body);
      expect(res.status).toBe(403); // non-admins can't create
    });
  });
});