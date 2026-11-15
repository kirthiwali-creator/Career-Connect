// Small helper functions used on many pages

// "2026-09-22T10:00:00Z" -> "22 Sep 2026"
export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Shorten long text for cards
export function shorten(text = "", max = 110) {
  return text.length > max ? text.slice(0, max).trim() + "..." : text;
}

// A field may be a plain id ("65a...") or a populated object ({ _id, name })
export function idOf(value) {
  if (!value) return null;
  return typeof value === "object" ? value._id : value;
}

// Turns a list of connections into { mentorId: "pending" | "accepted" | "rejected" }
export function statusByMentor(connections = []) {
  const map = {};
  connections.forEach((c) => {
    map[idOf(c.mentorId)] = c.status;
  });
  return map;
}
