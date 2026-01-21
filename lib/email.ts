import nodemailer from 'nodemailer';
import { Submission } from './types';

const MANAGER_EMAILS = process.env.MANAGER_EMAILS || 'prathemkumar35@gmail.com,prathemkumar36@gmail.com';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

console.log("Email Config Loaded:", {
    user: SMTP_USER,
    pass: SMTP_PASS
});

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

    const htmlContent = `
    <h2>New Submission for Approval</h2>
    <p><strong>Title:</strong> ${submission.title}</p>
    <p><strong>Preview:</strong> ${submission.content.substring(0, 100)}...</p>
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

        await transporter.sendMail({
            from: '"Aura VMS" <system@auravms.com>',
            to: MANAGER_EMAILS?.split(',')[0].trim(),
            subject: `Action Required: ${submission.title}`,
            html: htmlContent,
        });
        console.log(`Email sent to: ${MANAGER_EMAILS?.split(',')[0].trim()}`);
        await transporter.sendMail({
            from: '"Aura VMS" <system@auravms.com>',
            to: MANAGER_EMAILS?.split(',')[1].trim(),
            subject: `Action Required: ${submission.title}`,
            html: htmlContent,
        });
        console.log(`Email sent to: ${MANAGER_EMAILS?.split(',')[1].trim()}`);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}
