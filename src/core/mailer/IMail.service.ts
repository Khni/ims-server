export interface IMailSender {
  sendMailWithTemplate(
    email: string,
    subject: string,
    templateName: string,
    data: Record<string, any>
  ): Promise<any>;
}
