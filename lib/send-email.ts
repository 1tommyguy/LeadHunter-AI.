import nodemailer from "nodemailer";
import { decrypt } from "./encryption";

interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  password: string; // AES-encrypted
  fromEmail: string;
  fromName: string | null;
  secure: boolean;
}

export async function sendEmail({
  smtp,
  to,
  subject,
  text,
}: {
  smtp: SmtpConfig;
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  const password = decrypt(smtp.password);

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: { user: smtp.username, pass: password },
  });

  const from = smtp.fromName
    ? `${smtp.fromName} <${smtp.fromEmail}>`
    : smtp.fromEmail;

  await transporter.sendMail({ from, to, subject, text });
}
