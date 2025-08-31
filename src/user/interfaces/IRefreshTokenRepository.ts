import { PrismaTransactionManager } from "../../core/database/PrismaTransactionManager.js";
import {
  RefreshTokenCreateInput,
  RefreshTokenModel,
  RefreshTokenUpdateInput,
  RefreshTokenWhereUniqueInput,
} from "../types/RefreshTokenTypes.js";

export interface IRefreshTokenRepository {
  create(params: {
    data: RefreshTokenCreateInput;
    tx?: unknown;
  }): Promise<RefreshTokenModel>;

  update(params: {
    data: RefreshTokenUpdateInput;
    where: RefreshTokenWhereUniqueInput;
    tx?: unknown;
  }): Promise<RefreshTokenModel>;

  findMany(params: {
    offset: number;
    limit: number;
    orderBy?: Partial<Record<keyof RefreshTokenModel, "asc" | "desc">>;
    where?: Partial<RefreshTokenModel>;
  }): Promise<RefreshTokenModel[]>;

  delete(params: {
    where: RefreshTokenWhereUniqueInput;
    tx?: PrismaTransactionManager;
  }): Promise<{ id: string } | null>;

  findUnique(params: {
    where: RefreshTokenWhereUniqueInput;
  }): Promise<RefreshTokenModel | null>;

  count(params?: { where?: Partial<RefreshTokenModel> }): Promise<number>;
  createTransaction<T>(callback: (tx: unknown) => Promise<T>): Promise<T>;
}
