import { ITransactionRepository } from "../../core/database/interfaces/ITransaction.js";

import {
  UserCreateInput,
  UserModel,
  UserUpdateInput,
  UserWhereUniqueInput,
} from "../types/UserTypes.js";

export interface IUserRepository {
  create(params: { data: UserCreateInput; tx?: unknown }): Promise<UserModel>;

  update(params: {
    data: UserUpdateInput;
    where: UserWhereUniqueInput;
    tx?: unknown;
  }): Promise<UserModel>;

  findMany(params: {
    offset: number;
    limit: number;
    orderBy?: Partial<Record<keyof UserModel, "asc" | "desc">>;
    where?: Partial<UserModel>;
  }): Promise<UserModel[]>;

  delete(params: {
    where: UserWhereUniqueInput;
    tx?: unknown;
  }): Promise<{ id: string }>;

  findUnique(params: {
    where: UserWhereUniqueInput;
  }): Promise<UserModel | null>;

  count(params?: { where?: Partial<UserModel> }): Promise<number>;
  createTransaction<T>(callback: (tx: unknown) => Promise<T>): Promise<T>;
}
