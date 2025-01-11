
import CryptoJS from 'crypto-js';

const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY;
const iterations = 1000; // 반복 횟수

export const encrypt = (plaintext: string): string => {
  const ciphertext = CryptoJS.PBKDF2(
    plaintext,
    secretKey,
    {
      keySize: 512 / 32, // 키 길이
      iterations, // 반복 횟수
    }
  ).toString();
  return ciphertext;
};

export const decrypt = (ciphertext: string): string => {
  const bytes = CryptoJS.PBKDF2(
    ciphertext,
    secretKey,
    {
      keySize: 512 / 32, // 키 길이
      iterations, // 반복 횟수
    }
  );
  const decryptedPlaintext = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedPlaintext;
};