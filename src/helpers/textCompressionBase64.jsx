import { deflateSync } from 'fflate';


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
