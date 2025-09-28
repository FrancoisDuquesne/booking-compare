const hasWindow = typeof window !== 'undefined';
const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : undefined;
const decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : undefined;
const nodeBuffer =
  typeof globalThis !== 'undefined' && typeof (globalThis as any).Buffer !== 'undefined'
    ? (globalThis as any).Buffer
    : undefined;

function toBinary(value: string): string {
  if (!encoder) {
    return value;
  }

  const bytes = encoder.encode(value);
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return binary;
}

function fromBinary(value: string): string {
  if (!decoder) {
    return value;
  }

  const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0));
  return decoder.decode(bytes);
}

export function safeEncode(value: string): string {
  if (hasWindow && typeof window.btoa === 'function') {
    return window.btoa(toBinary(value));
  }

  if (nodeBuffer) {
    return nodeBuffer.from(value, 'utf-8').toString('base64');
  }

  throw new Error('No base64 encoder available in this environment');
}

export function safeDecode(value: string): string {
  if (hasWindow && typeof window.atob === 'function') {
    return fromBinary(window.atob(value));
  }

  if (nodeBuffer) {
    return nodeBuffer.from(value, 'base64').toString('utf-8');
  }

  throw new Error('No base64 decoder available in this environment');
}
