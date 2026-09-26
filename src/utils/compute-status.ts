export function computeStatus(
    plan: {
        status?: string;
        date?: string;
        time?: string;
        endDate?: string;
        endTime?: string;
    },
    now: Date = new Date(),
): "upcoming" | "ongoing" | "completed" | "cancelled" {
  if (plan.status === "cancelled") return "cancelled";
  if (!plan.endDate || !plan.endTime) return "upcoming";

  const planStart = new Date(`${plan.date}T${plan.time}`);
  const planEnd = new Date(`${plan.endDate}T${plan.endTime}`);

  if (isNaN(planStart.getTime()) || isNaN(planEnd.getTime())) return "upcoming";
  if (now < planStart) return "upcoming";
  if (now >= planStart && now < planEnd) return "ongoing";
  return "completed";
}