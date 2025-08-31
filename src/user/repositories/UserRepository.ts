import { Prisma } from "../../../prisma/generated/prisma/index.js";
import { PrismaTransactionManager } from "../../core/database/PrismaTransactionManager.js";
import prisma from "../../database/prisma.js";
import { IUserRepository } from "../interfaces/IUserRepository.js";
import {
  UserCreateInput,
  UserModel,
  UserUpdateInput,
  UserWhereUniqueInput,
} from "../types/UserTypes.js";

export class UserRepository implements IUserRepository {
  public db = prisma.user;
  async createTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    try {
      return await prisma.$transaction(async (tx) => {
        return await callback(tx);
      });
    } catch (error) {
      throw new Error(`Error: User Transaction failed`, {
        cause: error,
      });
    }
  }
  // Create a new user with error handling
  async create({
    data,
    tx,
  }: {
    data: UserCreateInput;
    tx?: PrismaTransactionManager | undefined;
  }): Promise<UserModel> {
    const db = tx ? tx.user : this.db;
    try {
      return await db.create({
        data,
      });
    } catch (error: any) {
      throw new Error(`Error while creating user: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Update an existing user with error handling
  async update({
    data,
    where,
    tx,
  }: {
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
    tx?: PrismaTransactionManager;
  }): Promise<UserModel> {
    const db = tx ? tx.user : this.db;
    try {
      return await db.update({
        data,
        where,
      });
    } catch (error: any) {
      throw new Error(`Error while updating user: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Find multiple users with error handling
  async findMany({
    where,
    limit,
    offset,
    orderBy,
  }: {
    offset: number;
    limit: number;
    orderBy?: Partial<Record<keyof UserModel, "asc" | "desc">>;
    where?: Partial<UserModel> | undefined;
  }): Promise<UserModel[]> {
    try {
      return await this.db.findMany({
        where,
        take: limit,
        orderBy,
        skip: offset,
      });
    } catch (error: any) {
      throw new Error(`Error fetching users: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Delete a user with error handling
  async delete({
    where,
    tx,
  }: {
    where: UserWhereUniqueInput;
    tx?: PrismaTransactionManager | undefined;
  }): Promise<{ id: string }> {
    const db = tx ? tx.user : this.db;
    try {
      return await db.delete({ where, select: { id: true } });
    } catch (error: any) {
      throw new Error(`Error deleting user: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Find a unique user with error handling
  async findUnique({ where }: { where: UserWhereUniqueInput }) {
    try {
      return await this.db.findUnique({
        where,
      });
    } catch (error: any) {
      throw new Error(`Error finding user: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Count users with error handling
  async count(params?: { where?: Partial<UserModel> }) {
    try {
      return await this.db.count({
        where: params?.where,
      });
    } catch (error: any) {
      throw new Error(`Error counting users: ${error.message}`, {
        cause: error,
      });
    }
  }
}
