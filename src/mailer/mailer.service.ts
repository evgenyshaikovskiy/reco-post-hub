import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { join } from 'path';
import { IEmailConfig } from 'src/config/interfaces/email-config.interface';
import { ITemplateData } from './interfaces/template-data.interface';
import { ITemplates } from './interfaces/templates.interface';
import { IUser } from 'src/users/interfaces/user.interface';
import Handlebars from 'handlebars';

@Injectable()
export class MailerService {
  private readonly loggerService: LoggerService;
  private readonly transport: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly email: string;
  private readonly domain: string;
  private readonly templates: ITemplates;

  constructor(private readonly configService: ConfigService) {
    const emailConfig = this.configService.get<IEmailConfig>('emailService');
    this.transport = createTransport(emailConfig);
    this.email = `"RecoPostHub" <${emailConfig.auth.user}>`;
    this.domain = this.configService.get<string>('domain');
    this.loggerService = new Logger(MailerService.name);

    this.templates = {
      confirmation: MailerService._parseTemplate('confirmation.hbs'),
      resetPassword: MailerService._parseTemplate('reset-password.hbs'),
    };
  }

  public sendEmail(to: string, subject: string, html: string, log?: string) {
    this.transport
      .sendMail({ from: this.email, to, subject, html })
      .then(() => this.loggerService.log(log ?? `Email to ${to} was sent`))
      .catch((error) => this.loggerService.error(error));
  }

  public sendConfirmationEmail(user: IUser, token: string): void {
    const { email, name } = user;
    const subject = 'Confirm your email to sign up';
    // TODO: change localhost to suitable domain
    const html = this.templates.confirmation({
      name,
      link: `https://localhost:5000/auth/confirm/${token}`,
    });

    this.sendEmail(email, subject, html, 'A new confirmation was email sent');
  }

  public sendResetPasswordEmail(user: IUser, token: string): void {
    const { email, name } = user;
    const subject = 'Reset your password';
    // TODO: change localhost to suitable domain
    const html = this.templates.resetPassword({
      name,
      link: `https://localhost:4200/forgot-password/reset/${token}`,
    });
    this.sendEmail(email, subject, html, 'A new reset password was sent');
  }

  private static _parseTemplate(
    templateName: string,
  ): Handlebars.TemplateDelegate<ITemplateData> {
    const templateContent = readFileSync(
      join(__dirname, 'templates', templateName),
      'utf-8',
    );
    return Handlebars.compile<ITemplateData>(templateContent, { strict: true });
  }
}
