import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { IRandomTokenGenerator } from "./IRandomTokenGenerator.js";

export class UuidTokenGenerator implements IRandomTokenGenerator {
  generateHexToken(byteLength: number): string {
    return crypto.randomBytes(byteLength).toString("hex"); // fallback to crypto
  }

  generateBase64UrlToken(byteLength: number): string {
    return crypto.randomBytes(byteLength).toString("base64url");
  }

  generateUUID(): string {
    return uuidv4();
  }
}
