import nodemailer, { Transporter } from "nodemailer";
import pug from "pug";
import path from "path";
import { IMailSender } from "./IMail.service.js";
import { config } from "../../config/envSchema.js";

class MailSender implements IMailSender {
  private transporter: Transporter;
  env = config();
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: this.env.MAIL_SERVICE,
      host: this.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: this.env.MAIL_USER,
        pass: this.env.MAIL_PASS,
      },
    });
  }

  private renderTemplate(templateName: string, data: any): string {
    const templatePath = path.join(
      __dirname,
      this.env.EMAIL_TEMPLATES_PATH,
      `${templateName}.pug`
    );
    return pug.renderFile(templatePath, data);
  }

  async sendMailWithTemplate(
    email: string,
    subject: string,
    templateName: string,
    data: Record<string, any>
  ) {
    try {
      const html = this.renderTemplate(templateName, { ...data, subject });

      const info = await this.transporter.sendMail({
        from: `"www.juvni.com - Admin"`,
        to: email,
        subject,
        html,
      });

      return info;
    } catch (error: any) {
      console.error("Email send error:", error.message);
      throw error;
    }
  }
}

export default MailSender;
