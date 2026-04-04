import { deflateSync, inflateSync } from 'fflate';


export function compressAndBase64(txt) {
  const bytes = new TextEncoder().encode(txt);

  // deflateSync removes the 18-byte Gzip header/footer bloat
  // level 9 = maximum compression effort
  const compressed = deflateSync(bytes, { level: 9 });

  // Use a more efficient binary-to-string conversion
  const binary = String.fromCharCode(...compressed);
  const base64 = btoa(binary);

  // Convert to Base64URL to avoid % escaping in the URL
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64DecodeAndUncompress(compressed) {
  // 1. Convert Base64URL back to standard Base64
  let base64 = compressed.replace(/-/g, '+').replace(/_/g, '/');
  
  // 2. Restore padding (=)
  while (base64.length % 4) {
    base64 += '=';
  }

  // 3. Decode Base64 to a binary string
  const binary = atob(base64);

  // 4. Convert binary string to Uint8Array
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  // 5. Decompress using inflateSync (counterpart to deflateSync)
  const decompressed = inflateSync(bytes);

  // 6. Convert the byte array back into a UTF-8 string
  return new TextDecoder().decode(decompressed);
}
