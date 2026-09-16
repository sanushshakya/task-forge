// app/utils/sendEmail.ts

import resend from 'resend';

const client = new resend.Client('your_resend_api_key');

/**
 * Sends an email using the Resend service.
 * 
 * @param to - The email address of the recipient.
 * @param subject - The subject of the email.
 * @param html - The HTML content of the email body.
 */
export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    await client.emails.send({
      from: 'no-reply@dailylog.com',
      to,
      subject,
      html,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}