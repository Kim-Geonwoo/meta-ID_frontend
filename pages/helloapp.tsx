import React, { useState } from "react";
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from "./lib/auth";


import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { auth } from "./lib/firebaseClient";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
    recaptchaWidgetId: any;
    grecaptcha?: any;
  }
}

const HelloApp = () => {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  });

  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isHelloPage, setIsHelloPage] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [closeHelloPage, setCloseHelloPage] = useState(false);

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPhoneNumber(event.target.value);
  };

  const handleVerificationCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVerificationCode(event.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 리캡차 설정 (전화번호 인증시, 필수사용)
  const configureRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (_response: any) => {
          handlePhoneSignIn();
        },
      },
    );
  };

  // 전화번호로 인증코드 전송
  const handlePhoneSignIn = () => {
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, `+82 ${phoneNumber}`, appVerifier)
      .then((result) => {
        setConfirmationResult(result);
        setIsCodeSent(true);
      })
      .catch((error) => {
        setError("SMS 전송 중 오류가 발생했습니다: " + error.message);
      });
  };

  // 인증코드 유효성 검사
  const handleVerifyCode = () => {
    if (!confirmationResult) {
      setError("인증 결과를 찾을 수 없습니다.");

      return;
    }

    confirmationResult
      .confirm(verificationCode)
      .then((_result: { user: any }) => {
        setIsVerified(true);
        alert("전화번호 인증이 완료되었습니다.");
      })
      .catch((error: { message: string }) => {
        setError("인증 코드 확인 중 오류가 발생했습니다: " + error.message);
      });
  };

  // 전화번호 인증 후, 이메일 비밀번호 계정과 연동
  const handleLinkAccount = () => {
    const credential = EmailAuthProvider.credential(email, password);

    if (auth.currentUser) {
      linkWithCredential(auth.currentUser, credential)
        .then(() => {
          alert("계정이 성공적으로 연동되었습니다.");
          router.push("/");
        })
        .catch((error: { message: string }) => {
          setError("계정 연동 중 오류가 발생했습니다: " + error.message);
        });
    } else {
      setError("현재 사용자를 찾을 수 없습니다.");
    }
  };

  // 페이지 처음 로드시 설정
  // 리캡차 설정(전화번호 인증시, 필수사용)
  React.useEffect(() => {
    setIsHelloPage(true);
    configureRecaptcha();
  }, []);

  const handleHelloPage = () => {
    // hello page가 true일때면 나머지 컴포넌트 숨기기
    setIsHelloPage(true);
  };

  React.useEffect(() => {
    const isPhoneNumberValid = phoneNumber.length > 0;
    const isVerificationCodeValid = verificationCode.length > 0;
    const isEmailValid = email.length > 0;
    const isPasswordValid = password.length > 0;

    if (isHelloPage) {
      setDisableButton(false);
    } else if (!isCodeSent) {
      setDisableButton(!isPhoneNumberValid);
    } else if (!isVerified) {
      setDisableButton(!isVerificationCodeValid);
    } else {
      setDisableButton(!(isEmailValid && isPasswordValid));
    }
  }, [
    phoneNumber,
    verificationCode,
    email,
    password,
    isHelloPage,
    isCodeSent,
    isVerified,
  ]);

  const ImageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex justify-end w-[calc(100%-4rem)] h-[calc(100%-13rem)]">
      {children}
    </div>
  );

  

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-6.5rem)] bg-black">
      {isHelloPage && (
        <>
         <div className="flex flex-col ml-4 justify-center text-white font-semibold text-2xl text-start">
          <div>
              <Image
                alt="logo"
                className="mb-2 justify-start"
                height={50}
                src="/icons/icon-512-maskable.png"
                width={50}
              />
              디지털 명함으로 만나요.
              <br />
              공유하는 | 메타 ID
                <Image
                layout="responsive"
                width={400}
                height={700}
                alt="hero"
                  src="/icons/display_example-1.png"
                />
            </div>
            <Button
              className="flex flex-col w-48 mt-4 self-end"
              size="md"
              radius="none"
              onPress={() => setIsHelloPage(false)}
            >
              휴대폰 번호로 시작하기
            </Button>
          </div>
        </>
      )}

      {!isHelloPage && (
        <button className="absolute top-2 left-4" onClick={handleHelloPage}>
          <i className="ri-arrow-left-line ri-2x text-white" />
        </button>
      )}

      <div className="">
        {!isHelloPage && !isVerified && (
          <>
            <span className="flex text-white font-semibold text-xl items-start">
              안녕하세요!
            </span>
            <span className="flex text-white font-semibold text-xl items-start">
              휴대폰 번호로 가입해주세요.
            </span>

            {/* {error && <div style={{ color: "red" }}>{error}</div>} */}
            <Input
              className="py-1 text-white"
              label="전화번호"
              radius="none"
              size="md"
              type="tel"
              value={phoneNumber}
              variant="bordered"
              onChange={handlePhoneNumberChange}
            />
            <p className="text-xs text-gray-500 text-start pt-2">
              이 앱은 reCAPTCHA 및 Google의 보호를 받습니다.
              <br />
              <a
                className="text-gray-300 underline"
                href="https://policies.google.com/privacy"
              >
                개인 정보 보호 정책
              </a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a> 및 </a>
              <a
                className="text-gray-300 underline"
                href="https://policies.google.com/terms"
              >
                서비스 약관
              </a>{" "}
              적용.
            </p>
          </>
        )}
      </div>

      <div id="recaptcha-container" />
      {!isHelloPage && !isCodeSent && (
        <Button
          className="mt-8 w-64"
          isDisabled={disableButton}
          radius="none"
          type="submit"
          onPress={handlePhoneSignIn}
        >
          인증 코드 받기
        </Button>
      )}

      {/* 코드를 발송했다면, 표시 */}
      {!isHelloPage && !isVerified && isCodeSent && (
        <>
          <Input
            autoComplete="one-time-code"
            className="py-1 pt-2"
            label="인증 코드"
            radius="none"
            size="md"
            type="text"
            value={verificationCode}
            variant="bordered"
            onChange={handleVerificationCodeChange}
          />
          <Button
            className="fixed bottom-3 w-[calc(100%-3rem)]"
            isDisabled={disableButton}
            radius="none"
            onPress={handleVerifyCode}
          >
            인증 확인
          </Button>
        </>
      )}
      {/* 전화번호 인증이 완료됬다면, 표시 */}
      {!isHelloPage && isVerified && (
        <>
          <span className="flex text-white font-medium text-xl items-start">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            벌써<a className="font-semibold text-blue-600 px-0.5"> 마지막 </a>
            이에요!
          </span>
          <span className="flex text-white font-semibold text-xl items-start">
            원활한 서비스 이용을 위해서
          </span>
          <span className="flex text-white font-semibold text-xl items-start">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="font-medium text-lg underline-offset underline pr-0.5">
              이메일과 비밀번호를
            </a>
            입력해주세요.
          </span>
          <Input
            className="py-1 pt-2"
            label="이메일"
            radius="none"
            size="md"
            type="email"
            value={email}
            variant="bordered"
            onChange={handleEmailChange}
          />
          <Input
            className="py-1 pt-2"
            label="비밀번호"
            radius="none"
            size="md"
            type="password"
            value={password}
            variant="bordered"
            onChange={handlePasswordChange}
          />
          {/* 마지막, 가입완료 처리버튼 */}
          <Button
            className="fixed bottom-3 w-[calc(100%-3rem)]"
            isDisabled={disableButton}
            radius="none"
            onPress={handleLinkAccount}
          >
            회원 가입
          </Button>
        </>
      )}
    </div>
  );
};

export default HelloApp;
