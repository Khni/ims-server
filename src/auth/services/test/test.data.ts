import {
  OauthProvider,
  User,
} from "../../../../prisma/generated/prisma/index.js";

export const mockUser: User = {
  id: "1",
  isActive: true,
  createdAt: new Date("2024-01-01T12:00:00.000Z"),
  updatedAt: new Date("2024-06-01T12:00:00.000Z"),
  email: "test@example.com",
  firstName: "John",
  lastName: "Doe",
  password: "hashed_password", // hashed password stub
  picture: "https://example.com/avatar.png",
  oauthProvider: OauthProvider.NONE,
  oauthId: null,
};
