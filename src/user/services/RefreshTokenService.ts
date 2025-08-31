import { IRefreshTokenRepository } from "../interfaces/IRefreshTokenRepository.js";

import { IRandomTokenGenerator } from "../../core/random-token/IRandomTokenGenerator.js";
import { IRefreshTokenService } from "../interfaces/IRefreshTokenService.js";
export class RefreshTokenService implements IRefreshTokenService {
  constructor(
    private refreshTokenRepository: IRefreshTokenRepository,
    private tokenService: IRandomTokenGenerator,
    private expiresAt: Date
  ) {}

  create = async (userId: string, tx?: unknown) => {
    const refreshtoken = await this.refreshTokenRepository.create({
      data: {
        token: this.tokenService.generateBase64UrlToken(40),
        expiresAt: this.expiresAt,
        userId,
      },
      tx,
    });

    return refreshtoken;
  };
}
