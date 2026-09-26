import bcryptjs from "bcryptjs";

describe("password hashing", () => {
  it("hashes a password to something different from the original", async () => {
    const password = "mySecret123";
    const hash = await bcryptjs.hash(password, 10);

    expect(hash).not.toBe(password);      // never store plain text
    expect(hash.length).toBeGreaterThan(20); // bcrypt hashes are long
  });

  it("verifies a correct password against its hash", async () => {
    const password = "mySecret123";
    const hash = await bcryptjs.hash(password, 10);

    const isValid = await bcryptjs.compare(password, hash);
    expect(isValid).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const password = "mySecret123";
    const hash = await bcryptjs.hash(password, 10);

    const isValid = await bcryptjs.compare("wrongPassword", hash);
    expect(isValid).toBe(false);
  });

  it("produces different hashes for the same password (salted)", async () => {
    const password = "mySecret123";
    const hash1 = await bcryptjs.hash(password, 10);
    const hash2 = await bcryptjs.hash(password, 10);

    expect(hash1).not.toBe(hash2); // bcrypt salts each hash uniquely
  });
});