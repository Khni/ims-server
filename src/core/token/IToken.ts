export interface IToken {
  sign(payload: object): string;
  verify(token: string): object | null;
}
