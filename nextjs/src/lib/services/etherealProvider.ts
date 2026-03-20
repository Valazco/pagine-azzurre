// Ethereal Email Provider - Free unlimited email testing
// https://ethereal.email
// Emails are captured but never delivered - perfect for development

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface EtherealAccount {
  user: string;
  pass: string;
  smtp: {
    host: string;
    port: number;
    secure: boolean;
  };
  web: string;
}

export interface EtherealSendResult {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}

export class EtherealProvider {
  private transporter: Transporter | null = null;
  private account: EtherealAccount | null = null;
  private initialized: boolean = false;

  /**
   * Initialize with existing credentials or create new account
   */
  async initialize(existingCredentials?: { user: string; pass: string }): Promise<EtherealAccount> {
    if (existingCredentials?.user && existingCredentials?.pass) {
      // Use existing credentials
      this.account = {
        user: existingCredentials.user,
        pass: existingCredentials.pass,
        smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
        web: 'https://ethereal.email',
      };
    } else {
      // Create new test account
      const testAccount = await nodemailer.createTestAccount();
      this.account = {
        user: testAccount.user,
        pass: testAccount.pass,
        smtp: { host: testAccount.smtp.host, port: testAccount.smtp.port, secure: testAccount.smtp.secure },
        web: testAccount.web,
      };

      // Log credentials for reuse
      console.log('\n========================================');
      console.log('  ETHEREAL TEST ACCOUNT CREATED');
      console.log('========================================');
      console.log(`  User: ${this.account.user}`);
      console.log(`  Pass: ${this.account.pass}`);
      console.log(`  View emails: https://ethereal.email`);
      console.log('========================================\n');
    }

    // Create transporter
    this.transporter = nodemailer.createTransport({
      host: this.account.smtp.host,
      port: this.account.smtp.port,
      secure: this.account.smtp.secure,
      auth: {
        user: this.account.user,
        pass: this.account.pass,
      },
    });

    this.initialized = true;
    return this.account;
  }

  /**
   * Get current account credentials (for saving/reusing)
   */
  getCredentials(): { user: string; pass: string } | null {
    if (!this.account) return null;
    return {
      user: this.account.user,
      pass: this.account.pass,
    };
  }

  /**
   * Check if provider is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Send an email via Ethereal
   */
  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string,
    fromEmail?: string,
    fromName?: string
  ): Promise<EtherealSendResult> {
    if (!this.transporter || !this.account) {
      return {
        success: false,
        error: 'Ethereal provider not initialized. Call initialize() first.',
      };
    }

    try {
      const from = fromName
        ? `"${fromName}" <${fromEmail || this.account.user}>`
        : (fromEmail || this.account.user);

      const info = await this.transporter.sendMail({
        from,
        to,
        subject,
        text: textContent,
        html: htmlContent,
      });

      // Get preview URL from Nodemailer
      const previewUrl = nodemailer.getTestMessageUrl(info);

      console.log(`\n📧 [ETHEREAL] Email sent to: ${to}`);
      console.log(`   Subject: ${subject}`);
      if (previewUrl) {
        console.log(`   👁️  Preview URL: ${previewUrl}`);
      }

      return {
        success: true,
        messageId: info.messageId,
        previewUrl: previewUrl || undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Ethereal send error:', errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Verify connection to Ethereal SMTP
   */
  async verifyConnection(): Promise<boolean> {
    if (!this.transporter) return false;

    try {
      await this.transporter.verify();
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance for easy reuse
let etherealInstance: EtherealProvider | null = null;

export async function getEtherealProvider(
  credentials?: { user: string; pass: string }
): Promise<EtherealProvider> {
  if (!etherealInstance) {
    etherealInstance = new EtherealProvider();
    await etherealInstance.initialize(credentials);
  }
  return etherealInstance;
}

export function resetEtherealProvider(): void {
  etherealInstance = null;
}
