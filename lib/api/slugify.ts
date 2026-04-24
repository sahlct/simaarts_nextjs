export function slugify(text: string): string {
  if (!text || typeof text !== "string") return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")   // replace all special chars & spaces with "-"
    .replace(/^-+|-+$/g, "");      // remove starting & ending "-"
}

export function deslugify(slug: string): string {
  if (!slug || typeof slug !== "string") return "";

  return slug
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ")   // replace special chars with space
    .replace(/\s+/g, " ")          // remove extra spaces
    .trim();
}
