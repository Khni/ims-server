export type UserModel = {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  password: string | null;
  picture: string | null;
  oauthProvider: "NONE" | "FACEBOOK" | "GOOGLE";
  oauthId: string | null;
};
export type UserCreateInput = Partial<UserModel> & {
  email: string;
  firstName: string;
  lastName: string;
  password: string | null;
};

export type UserUpdateInput = Partial<UserModel>;

export type UserWhereUniqueInput = { email: string } | { id: string };
