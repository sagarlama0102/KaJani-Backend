import { computeStatus } from "../../utils/compute-status";

describe("computeStatus", () => {
  it("returns cancelled when status is cancelled", () => {
    expect(computeStatus({ status: "cancelled" })).toBe("cancelled");
  });

  it("returns upcoming when endDate/endTime are missing", () => {
    expect(computeStatus({ date: "2026-01-01", time: "10:00" })).toBe("upcoming");
  });

  it("returns upcoming when now is before the start", () => {
    const now = new Date("2026-01-01T09:00:00");
    const plan = { date: "2026-01-01", time: "10:00", endDate: "2026-01-01", endTime: "12:00" };
    expect(computeStatus(plan, now)).toBe("upcoming");
  });

  it("returns ongoing when now is between start and end", () => {
    const now = new Date("2026-01-01T11:00:00");
    const plan = { date: "2026-01-01", time: "10:00", endDate: "2026-01-01", endTime: "12:00" };
    expect(computeStatus(plan, now)).toBe("ongoing");
  });

  it("returns completed when now is after the end", () => {
    const now = new Date("2026-01-01T13:00:00");
    const plan = { date: "2026-01-01", time: "10:00", endDate: "2026-01-01", endTime: "12:00" };
    expect(computeStatus(plan, now)).toBe("completed");
  });

  it("returns upcoming for malformed dates (safe fallback)", () => {
    const plan = { date: "bad", time: "bad", endDate: "bad", endTime: "bad" };
    expect(computeStatus(plan)).toBe("upcoming");
  });

});