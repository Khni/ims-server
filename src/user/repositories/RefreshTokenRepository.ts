import { PrismaTransactionManager } from "../../core/database/PrismaTransactionManager.js";
import { Prisma } from "../../../prisma/generated/prisma/index.js";
import prisma from "../../database/prisma.js";
import { IRefreshTokenRepository } from "../interfaces/IRefreshTokenRepository.js";
import {
  RefreshTokenCreateInput,
  RefreshTokenModel,
  RefreshTokenUpdateInput,
  RefreshTokenWhereUniqueInput,
} from "../types/RefreshTokenTypes.js";

export class RefreshTokenRepository implements IRefreshTokenRepository {
  public db = prisma.refreshToken;
  async createTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    try {
      return await prisma.$transaction(async (tx) => {
        return await callback(tx);
      });
    } catch (error) {
      throw new Error(`Error: RefreshToken Transaction failed`, {
        cause: error,
      });
    }
  }
  // Create a new refreshToken with error handling
  async create({
    data,
    tx,
  }: {
    data: RefreshTokenCreateInput;
    tx?: PrismaTransactionManager | undefined;
  }): Promise<RefreshTokenModel> {
    const db = tx ? tx.refreshToken : this.db;
    try {
      return await db.create({
        data,
      });
    } catch (error: any) {
      throw new Error(`Error while creating refreshToken: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Update an existing refreshToken with error handling
  async update({
    data,
    where,
    tx,
  }: {
    data: RefreshTokenUpdateInput;
    where: RefreshTokenWhereUniqueInput;
    tx?: PrismaTransactionManager;
  }): Promise<RefreshTokenModel> {
    const db = tx ? tx.refreshToken : this.db;
    try {
      return await db.update({
        data,
        where,
      });
    } catch (error: any) {
      throw new Error(`Error while updating refreshToken: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Find multiple refreshTokens with error handling
  async findMany({
    where,
    limit,
    offset,
    orderBy,
  }: {
    offset: number;
    limit: number;
    orderBy?: Partial<Record<keyof RefreshTokenModel, "asc" | "desc">>;
    where?: Partial<RefreshTokenModel> | undefined;
  }): Promise<RefreshTokenModel[]> {
    try {
      return await this.db.findMany({
        where,
        take: limit,
        orderBy,
        skip: offset,
      });
    } catch (error: any) {
      throw new Error(`Error fetching refreshTokens: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Delete a refreshToken with error handling
  async delete({
    where,
    tx,
  }: {
    where: RefreshTokenWhereUniqueInput;
    tx?: PrismaTransactionManager | undefined;
  }): Promise<{ id: string } | null> {
    const db = tx ? tx.refreshToken : this.db;
    try {
      return await db.delete({ where, select: { id: true } });
    } catch (error: any) {
      throw new Error(`Error deleting refreshToken: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Find a unique refreshToken with error handling
  async findUnique({ where }: { where: RefreshTokenWhereUniqueInput }) {
    try {
      return await this.db.findUnique({
        where,
      });
    } catch (error: any) {
      throw new Error(`Error finding refreshToken: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Count refreshTokens with error handling
  async count(params?: { where?: Partial<RefreshTokenModel> }) {
    try {
      return await this.db.count({
        where: params?.where,
      });
    } catch (error: any) {
      throw new Error(`Error counting refreshTokens: ${error.message}`, {
        cause: error,
      });
    }
  }
}
