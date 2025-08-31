import bcrypt from "bcrypt";

import { IHasher } from "./IHasher.js";

export class BcryptHasher implements IHasher {
  async hash(text: string): Promise<string> {
    return bcrypt.hash(text, 10);
  }
  async compare(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }
}
