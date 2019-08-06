declare module multihashes {
   function toHexString(i: Buffer): string;
   function fromHexString(s: string): Buffer;
   function toB58String(b: Buffer): string;
   function fromB58String(i: string | Buffer): Buffer;
   function decode(
      b: Buffer
   ): { code: number; name: string; length: number; digest: Buffer };
   function encode(
      digest: Buffer,
      code: string | number,
      length?: number
   ): Buffer;
   function coerceCode(name: string | number): number;
   function appCode(code: number): boolean;
   function validCode(code: number): boolean;
   function validate(multihash: Buffer): void;
   function prefix(multihash: Buffer): void;

   const names: { [name: string]: number };
   const codes: { [hexCode: number]: string };
   const defaultLengths: { [hexCode: number]: number };
}

export = multihashes;
