export interface IRandomTokenGenerator {
  generateHexToken(byteLength: number): string;
  generateBase64UrlToken(byteLength: number): string;
  generateUUID(): string;
}
