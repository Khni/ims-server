import dotenv from "dotenv";
dotenv.config();
import { config } from "../config/envSchema.js";
import { BcryptHasher } from "../core/hasher/BcryptHasher.js";
import { CryptoTokenGenerator } from "../core/random-token/CryptoTokenGenerator.js";
import { JwtTokenService } from "../core/token/JwtToken.js";
import { RefreshTokenRepository } from "./repositories/RefreshTokenRepository.js";

import { UserRepository } from "./repositories/UserRepository.js";
import { AuthService } from "./services/AuthService.js";
import { RefreshTokenService } from "./services/RefreshTokenService.js";
const parsedEnv = config();
const userRepo = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const cryptoTokenGenerator = new CryptoTokenGenerator();
const expiresAt = new Date();
expiresAt.setDate(expiresAt.getDate() + 15);
export const refreshTokenService = new RefreshTokenService(
  refreshTokenRepository,
  cryptoTokenGenerator,
  expiresAt
);
const hasher = new BcryptHasher();
const jwtService = new JwtTokenService(parsedEnv.JWT_SECRET);
export const authService = new AuthService(
  userRepo,
  refreshTokenService,
  hasher,
  jwtService
);
