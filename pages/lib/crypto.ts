// 암호화를 위한, 코드파일
import CryptoJS from 'crypto-js';

const secretKey = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY; // 시크릿키 (?=솔트키)
const iterations = 1000; // 반복 횟수


// 암호화 함수
export const encrypt = (plaintext: string): string => {
  const ciphertext = CryptoJS.PBKDF2(
    plaintext, // 평문(받아온 값)
    secretKey,
    {
      keySize: 512 / 32, // 키 길이
      iterations, // 반복 횟수
    }
  ).toString();
  return ciphertext;
};


// 복호화 함수
export const decrypt = (ciphertext: string): string => {
  const bytes = CryptoJS.PBKDF2(
    ciphertext, // 받아온, 암호화된 문자열.
    secretKey,
    {
      keySize: 512 / 32, // 키 길이
      iterations, // 반복 횟수
    }
  );
  const decryptedPlaintext = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedPlaintext;
};