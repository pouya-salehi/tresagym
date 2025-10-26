export function normalizePhone(input = "") {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const englishDigits = "0123456789";
  let s = String(input).trim();
  for (let i = 0; i < persianDigits.length; i++) {
    s = s.replaceAll(persianDigits[i], englishDigits[i]);
  }
  s = s.replace(/\D/g, "");
  if (s.length === 10 && s.startsWith("9")) s = "0" + s;
  return s;
}
