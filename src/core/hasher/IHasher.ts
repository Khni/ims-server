export interface IHasher {
  hash(text: string): Promise<string>;
  compare(text: string, hash: string): Promise<boolean>;
}
