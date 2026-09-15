// lib/email.ts

import { createTransport } from 'nodemailer';
import * as config from '../config';

/**
 * Email service for sending emails using Resend.
 */
export class EmailService {
  private transporter;

  constructor() {
    // Initialize the transport with your SMTP credentials
    this.transporter = createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  }

  /**
   * Sends an email.
   *
   * @param {string} to - The recipient's email address.
   * @param {string} subject - The email subject.
   * @param {string} text - The plain text content of the email.
   * @returns {Promise<void>} A promise that resolves when the email is sent.
   */
  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: config.smtp.from,
        to,
        subject,
        text,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  /**
   * Sends a welcome email to a new user.
   *
   * @param {string} to - The recipient's email address.
   * @param {string} username - The username of the new user.
   * @returns {Promise<void>} A promise that resolves when the email is sent.
   */
  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    const subject = 'Welcome to Our Service!';
    const text = `Hello ${username},\n\nWelcome to our service! We're glad to have you on board.`;
    await this.sendEmail(to, subject, text);
  }
}

// Usage example:
const emailService = new EmailService();
emailService.sendWelcomeEmail('user@example.com', 'JohnDoe');