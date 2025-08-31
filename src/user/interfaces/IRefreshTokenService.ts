import { RefreshTokenModel } from "../types/RefreshTokenTypes.js";

export interface IRefreshTokenService {
  create(userId: string, tx?: unknown): Promise<RefreshTokenModel>;
}
