/**
 * Gera uma string aleatória criptograficamente segura.
 * Útil para senhas temporárias exigidas pelo backend que não serão usadas pelo usuário.
 */
export function generateSecurePassword(length: number = 20): string {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let retVal = "";

  // Se estiver em ambiente sem window.crypto (ex: SSR puro sem polyfill),
  // tentamos usar o global crypto do Node 19+ ou Web APIs.
  const cryptoObj =
    typeof window !== "undefined"
      ? window.crypto
      : (globalThis.crypto as Crypto);

  const values = new Uint32Array(length);
  cryptoObj.getRandomValues(values);

  for (let i = 0; i < length; i++) {
    retVal += charset.charAt(values[i] % charset.length);
  }

  return retVal;
}
