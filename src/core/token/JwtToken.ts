import jwt from "jsonwebtoken";
import { IToken } from "./IToken.js";

export class JwtTokenService implements IToken {
  constructor(private secret: string) {}

  sign(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: "1h" });
  }

  verify(token: string): object | null {
    try {
      return jwt.verify(token, this.secret) as object;
    } catch {
      return null;
    }
  }
}
