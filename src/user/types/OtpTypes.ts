export type OtpModel = {
  otp: string;
  id: string;
  type: "VERIFY_EMAIL" | "LOGIN" | "FORGET_PASSWORD";
  email: string;
  expiredIn: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type OtpCreateInput = Partial<OtpModel> & {
  otp: string;
  type: "VERIFY_EMAIL" | "LOGIN" | "FORGET_PASSWORD";
  email: string;
  expiredIn: Date;
};

export type OtpUpdateInput = Partial<OtpModel>;

export type OtpWhereUniqueInput = { id: string };
