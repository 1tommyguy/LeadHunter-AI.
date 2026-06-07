import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "fallback-secret-change-me";
const KEY = scryptSync(secret, "leadhunter-smtp-salt", 32);

export function encrypt(text: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv("aes-256-cbc", KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encryptedText: string): string {
  const parts = encryptedText.split(":");
  if (parts.length !== 2) throw new Error("Invalid encrypted value");
  const iv = Buffer.from(parts[0], "hex");
  const encrypted = Buffer.from(parts[1], "hex");
  const decipher = createDecipheriv("aes-256-cbc", KEY, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
