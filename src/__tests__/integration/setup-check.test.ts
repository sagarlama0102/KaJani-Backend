import mongoose from "mongoose";

describe("test DB setup", () => {
  it("connects to the in-memory database", () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });
});