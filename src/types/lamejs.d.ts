declare module 'lamejs' {
  export interface Mp3Encoder {
    encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
    flush(): Int8Array;
  }
  
  export function Mp3Encoder(channels: number, sampleRate: number, bitRate: number): Mp3Encoder;
}
