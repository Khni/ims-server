import { describe, it, expect, vi, beforeEach } from "vitest";
import nodemailer from "nodemailer";
import pug from "pug";
import MailSender from "./mailer.service.js";

// Mock nodemailer and pug
vi.mock("nodemailer", () => {
  return {
    default: {
      createTransport: vi.fn(),
    },
  };
});
vi.mock("../../config/envSchema.js", () => ({
  config: vi.fn(() => ({
    MAIL_SERVICE: "gmail",
    MAIL_HOST: "smtp.test.com",
    MAIL_USER: "testuser",
    MAIL_PASS: "testpass",
    EMAIL_TEMPLATES_PATH: "templates",
  })),
}));

vi.mock("pug", () => ({
  default: {
    renderFile: vi.fn(),
  },
}));

describe("MailSender", () => {
  const sendMailMock = vi.fn();
  const renderFileMock = pug.renderFile as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset mocks before each test
    sendMailMock.mockReset();
    renderFileMock.mockReset();

    // Setup mock for createTransport
    (
      nodemailer.createTransport as unknown as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      sendMail: sendMailMock,
    });

    renderFileMock.mockReturnValue("<p>Hello Template</p>");
  });

  it("sends email with correct template and data", async () => {
    const mailSender = new MailSender();

    const mockInfo = { messageId: "123" };
    sendMailMock.mockResolvedValue(mockInfo);

    const data = { name: "Test User" };

    const result = await mailSender.sendMailWithTemplate(
      "test@example.com",
      "Test Subject",
      "welcome",
      data
    );

    expect(renderFileMock).toHaveBeenCalledWith(
      expect.stringContaining("welcome.pug"),
      {
        ...data,
        subject: "Test Subject",
      }
    );

    expect(sendMailMock).toHaveBeenCalledWith({
      from: `"www.juvni.com - Admin"`,
      to: "test@example.com",
      subject: "Test Subject",
      html: "<p>Hello Template</p>",
    });

    expect(result).toEqual(mockInfo);
  });

  it("throws error if sendMail fails", async () => {
    const mailSender = new MailSender();

    sendMailMock.mockRejectedValue(new Error("SMTP Error"));

    await expect(
      mailSender.sendMailWithTemplate("fail@example.com", "Fail", "error", {})
    ).rejects.toThrow("SMTP Error");
  });
});
