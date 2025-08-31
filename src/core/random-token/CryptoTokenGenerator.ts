import crypto from "crypto";

import { IRandomTokenGenerator } from "./IRandomTokenGenerator.js";

export class CryptoTokenGenerator implements IRandomTokenGenerator {
  generateHexToken(byteLength: number): string {
    return crypto.randomBytes(byteLength).toString("hex");
  }

  generateBase64UrlToken(byteLength: number): string {
    return crypto.randomBytes(byteLength).toString("base64url");
  }

  generateUUID(): string {
    return crypto.randomUUID();
  }
}
