import {
  OauthProvider,
  Prisma,
  RefreshToken,
} from "../../../prisma/generated/prisma/index.js";

export type RefreshTokenModel = RefreshToken;
export type RefreshTokenCreateInput = Partial<RefreshTokenModel> & {
  token: string;
  userId: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  expiresAt: Date;
  revokedAt?: Date | null;
};

export type RefreshTokenUpdateInput = Partial<RefreshTokenModel>;

export type RefreshTokenWhereUniqueInput = { token: string } | { id: string };
