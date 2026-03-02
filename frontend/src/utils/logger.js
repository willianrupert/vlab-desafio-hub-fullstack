export const logger = {
  info: (m, d) => console.log(`%c[INFO] ${m}`, "color:#3b82f6;font-weight:bold", d ?? ""),
  warn: (m, d) => console.warn(`%c[WARN] ${m}`, "color:#f59e0b;font-weight:bold", d ?? ""),
  error: (m, d) => console.error(`%c[ERROR] ${m}`, "color:#ef4444;font-weight:bold", d ?? ""),
  success: (m, d) => console.log(`%c[OK] ${m}`, "color:#10b981;font-weight:bold", d ?? ""),
};