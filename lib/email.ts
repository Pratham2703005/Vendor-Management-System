import nodemailer from 'nodemailer';
import { Submission } from './types';

const MANAGER_EMAILS = process.env.MANAGER_EMAILS;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SITE_URL = process.env.SITE_URL;

// Environment variables would be used here in a real app
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
    },
});

export async function sendApprovalRequest(submission: Submission) {
    const approvalLink = `${SITE_URL}/api/respond?id=${submission.id}&action=approve`;
    const rejectionLink = `${SITE_URL}/api/respond?id=${submission.id}&action=reject`;

    // Extract first 100 chars
    const previewText = submission.content.slice(0, 100) + (submission.content.length > 100 ? '...' : '');

    const htmlContent = `
    <h2>New Submission for Approval</h2>
    <p><strong>Title:</strong> ${submission.title}</p>
    <p><strong>Preview:</strong> ${previewText}</p>
    <br/>
    <p>
      <a href="${approvalLink}" style="padding: 10px 20px; background: green; color: white; text-decoration: none;">Approve</a>
      &nbsp;
      <a href="${rejectionLink}" style="padding: 10px 20px; background: red; color: white; text-decoration: none;">Reject</a>
    </p>
  `;

    try {
        if (!SMTP_USER) {
            console.warn('SMTP configuration missing - Email skipped');
            return;
        }

        if (!MANAGER_EMAILS) {
            console.warn('MANAGER_EMAILS environment variable is not set. No emails will be sent.');
            return;
        }

        const emails = MANAGER_EMAILS.split(',').map(e => e.trim()).filter(Boolean);

        for (const email of emails) {
            await transporter.sendMail({
                from: `"Aura VMS" <${SMTP_USER}>`,
                to: email,
                subject: `Action Required: ${submission.title}`,
                html: htmlContent,
            });
        }
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}
