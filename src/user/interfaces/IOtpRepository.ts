import {
  OtpCreateInput,
  OtpModel,
  OtpUpdateInput,
  OtpWhereUniqueInput,
} from "../types/OtpTypes.js";

export interface IOtpRepository {
  create(params: { data: OtpCreateInput; tx?: unknown }): Promise<OtpModel>;
  findFirst({
    where,
    orderBy,
  }: {
    where: Partial<OtpModel>;
    orderBy?: Partial<Record<keyof OtpModel, "asc" | "desc">>;
  }): Promise<OtpModel | null>;
  update(params: {
    data: OtpUpdateInput;
    where: OtpWhereUniqueInput;
    tx?: unknown;
  }): Promise<OtpModel>;

  findMany(params: {
    offset: number;
    limit: number;
    orderBy?: Partial<Record<keyof OtpModel, "asc" | "desc">>;
    where?: Partial<OtpModel>;
  }): Promise<OtpModel[]>;

  delete(params: {
    where: OtpWhereUniqueInput;
    tx?: unknown;
  }): Promise<{ id: string }>;

  findUnique(params: { where: OtpWhereUniqueInput }): Promise<OtpModel | null>;

  count(params?: { where?: Partial<OtpModel> }): Promise<number>;
  createTransaction<T>(callback: (tx: unknown) => Promise<T>): Promise<T>;
}
