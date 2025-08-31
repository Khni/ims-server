import { Prisma } from "../../../prisma/generated/prisma/index.js";
import { PrismaTransactionManager } from "../../core/database/PrismaTransactionManager.js";
import { Transaction } from "../../core/database/repositories/Transaction.js";
import prisma from "../../database/prisma.js";
import { IOtpRepository } from "../interfaces/IOtpRepository.js";
import {
  OtpCreateInput,
  OtpModel,
  OtpUpdateInput,
  OtpWhereUniqueInput,
} from "../types/OtpTypes.js";

export class OtpRepository implements IOtpRepository {
  public db = prisma.otp;
  async createTransaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>
  ): Promise<T> {
    try {
      return await prisma.$transaction(async (tx) => {
        return await callback(tx);
      });
    } catch (error) {
      throw new Error(`Error: Otp Transaction failed`, {
        cause: error,
      });
    }
  }
  // Create a new otp with error handling
  async create({
    data,
    tx,
  }: {
    data: OtpCreateInput;
    tx?: PrismaTransactionManager | undefined;
  }): Promise<OtpModel> {
    const db = tx ? tx.otp : this.db;
    try {
      return await db.create({
        data,
      });
    } catch (error: any) {
      throw new Error(`Error while creating otp: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Update an existing otp with error handling
  async update({
    data,
    where,
    tx,
  }: {
    data: OtpUpdateInput;
    where: OtpWhereUniqueInput;
    tx?: PrismaTransactionManager;
  }): Promise<OtpModel> {
    const db = tx ? tx.otp : this.db;
    try {
      return await db.update({
        data,
        where,
      });
    } catch (error: any) {
      throw new Error(`Error while updating otp: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Find multiple otps with error handling
  async findMany({
    where,
    limit,
    offset,
    orderBy,
  }: {
    offset: number;
    limit: number;
    orderBy?: Partial<Record<keyof OtpModel, "asc" | "desc">>;
    where?: Partial<OtpModel> | undefined;
  }): Promise<OtpModel[]> {
    try {
      return await this.db.findMany({
        where,
        take: limit,
        orderBy,
        skip: offset,
      });
    } catch (error: any) {
      throw new Error(`Error fetching otps: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Delete a otp with error handling
  async delete({
    where,
    tx,
  }: {
    where: OtpWhereUniqueInput;
    tx?: PrismaTransactionManager | undefined;
  }): Promise<{ id: string }> {
    const db = tx ? tx.otp : this.db;
    try {
      return await db.delete({ where, select: { id: true } });
    } catch (error: any) {
      throw new Error(`Error deleting otp: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Find a unique otp with error handling
  async findUnique({ where }: { where: OtpWhereUniqueInput }) {
    try {
      return await this.db.findUnique({
        where,
      });
    } catch (error: any) {
      throw new Error(`Error finding otp: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Find a unique otp with error handling
  async findFirst({
    where,
    orderBy,
  }: {
    where: Partial<OtpModel>;
    orderBy?: Partial<Record<keyof OtpModel, "asc" | "desc">>;
  }) {
    try {
      return await this.db.findFirst({
        where,
        orderBy,
      });
    } catch (error: any) {
      throw new Error(`Error finding otp: ${error.message}`, {
        cause: error,
      });
    }
  }

  // Count otps with error handling
  async count(params?: { where?: Partial<OtpModel> }) {
    try {
      return await this.db.count({
        where: params?.where,
      });
    } catch (error: any) {
      throw new Error(`Error counting otps: ${error.message}`, {
        cause: error,
      });
    }
  }
}
