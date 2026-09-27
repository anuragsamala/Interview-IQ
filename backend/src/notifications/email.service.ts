import nodemailer from 'nodemailer';
import prisma from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@interviewiq.ai';
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Create reusable Gmail transporter if credentials are provided
const gmailTransporter = (GMAIL_USER && GMAIL_APP_PASSWORD)
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    })
  : null;

export interface SendEmailParams {
  userId?: string;
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ userId, to, subject, html }: SendEmailParams): Promise<boolean> {
  console.log(`\n======================================================`);
  console.log(`[EMAIL DISPATCH] To: ${to}`);
  console.log(`[EMAIL DISPATCH] Subject: ${subject}`);
  console.log(`[EMAIL DISPATCH] Html Snippet: ${html.substring(0, 150)}...`);
  console.log(`======================================================\n`);

  let status: 'SENT' | 'FAILED' = 'SENT';
  let errorMessage: string | null = null;

  // 1. Prioritize Gmail SMTP (Sends to ANY email address with 0 domain restrictions)
  if (gmailTransporter && GMAIL_USER) {
    try {
      await gmailTransporter.sendMail({
        from: `"InterviewIQ AI" <${GMAIL_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`[EMAIL DISPATCH SUCCESS] Real email dispatched via Gmail SMTP to: ${to}`);
    } catch (err: any) {
      console.error(`[EMAIL DISPATCH FAILED] Gmail SMTP error:`, err.message);
      status = 'FAILED';
      errorMessage = err.message;
    }
  }
  // 2. Fallback to Resend API
  else if (RESEND_API_KEY && RESEND_API_KEY !== 're_123456789') {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to,
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Resend API returned status ${response.status}: ${errorText}`);
      }

      console.log(`[EMAIL DISPATCH SUCCESS] Email successfully processed by Resend to: ${to}`);
    } catch (err: any) {
      console.error(`[EMAIL DISPATCH FAILED] Resend API error:`, err.message);
      status = 'FAILED';
      errorMessage = err.message;
    }
  } else {
    console.log(`[EMAIL DISPATCH LOCAL] Local fallback logging (No active email provider detected).`);
  }

  // Record dispatch outcome inside DB log table
  try {
    await prisma.emailLog.create({
      data: {
        userId,
        toEmail: to,
        subject,
        status,
        errorMessage,
      },
    });
  } catch (dbErr) {
    console.error('Failed to write email dispatch outcome to EmailLog table:', dbErr);
  }

  return status === 'SENT';
}

export async function sendOtpEmail(email: string, code: string, purpose: string, userId?: string): Promise<boolean> {
  const purposeText = purpose.replace(/_/g, ' ');
  const subject = `[InterviewIQ AI] Your ${purposeText} OTP Code`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e7; border-radius: 8px;">
      <h2 style="color: #6d28d9; text-align: center;">InterviewIQ AI</h2>
      <p>Hello,</p>
      <p>You have requested an OTP code for <strong>${purposeText}</strong>. Please use the verification code below to proceed:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; padding: 10px 20px; background-color: #f4f4f5; border-radius: 6px; border: 1px solid #e4e4e7; color: #18181b;">
          ${code}
        </span>
      </div>
      <p style="color: #ef4444; font-size: 13px;">This code will expire in 10 minutes. If you did not make this request, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 20px 0;" />
      <p style="font-size: 11px; color: #71717a; text-align: center;">© 2026 InterviewIQ AI. Practice, prepare, and excel.</p>
    </div>
  `;

  return sendEmail({ userId, to: email, subject, html });
}
