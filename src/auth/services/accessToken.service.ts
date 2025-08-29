import jwt from "jsonwebtoken";
import { config } from "../../config/envSchema.js";

export const createAccessToken = ({
  email,
  id,
}: {
  email: string;
  id: string;
}) => {
  const env = config();
  return jwt.sign({ email, id }, env.JWT_SECRET, {
    expiresIn: `${env.ACCSESS_TOKEN_EXPIRES_IN_MINUTES}m`,
  });
};
