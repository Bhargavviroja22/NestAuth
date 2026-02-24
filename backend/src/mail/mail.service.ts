import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('MAIL_HOST'),
      port: this.configService.getOrThrow<number>('MAIL_PORT'),
      secure: this.configService.get<number>('MAIL_PORT') === 465,
      auth: {
        user: this.configService.getOrThrow<string>('MAIL_USER'),
        pass: this.configService.getOrThrow<string>('MAIL_PASS'),
      },
    });

    this.logger.log('Nodemailer transporter initialized');
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');
    const mailFrom = this.configService.getOrThrow<string>('MAIL_FROM');
    const verifyUrl = `${clientUrl}/verify-email?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"AuthApp" <${mailFrom}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Verify Your Email</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="560" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <tr>
                      <td style="background-color: #4f46e5; padding: 32px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Email Verification</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 32px;">
                        <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
                          Hi there! Thanks for signing up. Please verify your email address by clicking the button below.
                        </p>
                        <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 0 0 32px;">
                          This link will expire once used. If you didn't create an account, you can safely ignore this email.
                        </p>
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center">
                              <a href="${verifyUrl}" 
                                 style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600;">
                                Verify Email Address
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="color: #999; font-size: 12px; line-height: 1.6; margin: 32px 0 0; word-break: break-all;">
                          If the button doesn't work, copy and paste this link into your browser:<br />
                          <a href="${verifyUrl}" style="color: #4f46e5;">${verifyUrl}</a>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background-color: #f9fafb; padding: 20px 32px; text-align: center;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                          &copy; ${new Date().getFullYear()} AuthApp. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      });

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${email}`,
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }
}
