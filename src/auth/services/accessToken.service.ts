import jwt from "jsonwebtoken";
import { config } from "../../config/envSchema.js";

export const createAccessToken = ({
  email,
  id,
}: {
  email: string;
  id: string;
}) => {
  return jwt.sign({ email, id }, config.JWT_SECRET, {
    expiresIn: `${config.ACCSESS_TOKEN_EXPIRES_IN_MINUTES}m`,
  });
};
