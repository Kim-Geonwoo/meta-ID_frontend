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
      router.replace("/");
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
  const [submitted, setSubmitted] = useState(null);
  const errors_pw = [];
  const errors_hp = [];
  const errors_email = [];
  


  //비밀번호 형식 검증
  if (password.length < 4) {
    errors_pw.push("비밀번호는 4자 이상이어야 합니다.");
  }
  if ((password.match(/[A-Z]/g) || []).length < 1) {
    errors_pw.push("비밀번호에는 최소 1개의 대문자가 포함되어야 합니다.");
  }
  if ((password.match(/[^a-z0-9]/gi) || []).length < 1) {
    errors_pw.push("비밀번호에는 최소 1개의 기호가 포함되어야 합니다.");
  }

  //전화번호 형식 검증
  if (phoneNumber.match(/^\d{3}-\d{4}-\d{4}$/)) {
    errors_hp.push("전화번호 형식이 올바르지 않습니다.");
  }

  //이메일 형식 검증
  if (email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
    errors_email.push("이메일 형식이 올바르지 않습니다.");
  }


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
          router.replace("/");
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


  

  return (
    <div className="overflow-hidden flex flex-col items-center bg-black">
      {isHelloPage && (
        <>
         <div className="mt-2 w-[calc(100%-4rem)] h-[calc(100%-13rem)] flex flex-col justify-start items-start text-white font-semibold text-2xl text-start">
          <div>
              <Image
                alt="logo"
                className="mb-2"
                height={50}
                src="/icons/icon-512-maskable.png"
                width={50}
              />
              디지털 명함으로 만나요.
              <br />
              공유하는 | 메타 ID
              
                
            </div>
            {/* <div className="flex flex-row items-center justify-between">
              
              <Button
                className="flex flex-col w-40 mt-4 self-end"
                size="md"
                radius="none"
                onPress={() => setIsHelloPage(false)}
              >
                휴대폰 번호로 시작하기
              </Button> 
            </div> */}
          </div>
          <div className="flex flex-col items-center w-[calc(100%-4rem)] h-[calc(100%-13rem)]">
                <Image
                  layout="responsive"
                  width={400}
                  height={700}
                  alt="hero"
                    src="/icons/display_example-1.png"
                  />
              </div>
        </>
      )}

      {!isHelloPage && (
        <button className="absolute top-2 left-4" onClick={handleHelloPage}>
          <i className="ri-arrow-left-line ri-2x text-white" />
        </button>
      )}

      <div className="mt-[2.5rem] w-[calc(100%-4rem)] h-[calc(100%-13rem)]">
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
      {/* {!isHelloPage && !isCodeSent && (
        <Button
          className="mt-8 w-64"
          isDisabled={disableButton}
          radius="none"
          type="submit"
          onPress={handlePhoneSignIn}
        >
          인증 코드 받기
        </Button>
      )} */}

      {/* 코드를 발송했다면, 표시 */}
      {!isHelloPage && !isVerified && isCodeSent && (
        <div className="mt-8 w-[calc(100%-4rem)] h-[calc(100%-13rem)]">
          <Input
            autoComplete="one-time-code"
            className="py-1 text-white"
            label="인증 코드"
            radius="none"
            size="md"
            type="text"
            value={verificationCode}
            variant="bordered"
            onChange={handleVerificationCodeChange}
          />
          {/* <Button
            className="mt-8 w-64"
            isDisabled={disableButton}
            radius="none"
            onPress={handleVerifyCode}
          >
            인증 확인
          </Button> */}
        </div>
      )}
      {/* 전화번호 인증이 완료됬다면, 표시 */}
      {/* 미사용 */}
      {/* {!isHelloPage && isVerified && (
        <>
          <span className="mb-0.5 flex text-start self-start text-white font-medium text-xl">
             eslint-disable-next-line jsx-a11y/anchor-is-valid 
            벌써<a className="font-semibold items-start text-blue-600 px-0.5"> 마지막 </a>
            이에요!
          </span>
          <span className="mb-0.5 flex text-white self-start font-semibold text-xl items-start">
            원활한 서비스 이용을 위해서
          </span>
          <span className="mb-0.5 flex text-white self-start font-semibold text-lg items-start">
             eslint-disable-next-line jsx-a11y/anchor-is-valid 
            <a className="font-medium text-lg underline-offset underline pr-0.5">
              이메일과 비밀번호를
            </a>
            입력해주세요.
          </span>
          <Input
            className="py-1 pt-2 text-white"
            label="이메일"
            radius="none"
            size="md"
            type="email"
            value={email}
            variant="bordered"
            onChange={handleEmailChange}
          />
          <Input
            className="py-1 pt-2 text-white"
            label="비밀번호"
            radius="none"
            size="md"
            type="password"
            value={password}
            variant="bordered"
            onChange={handlePasswordChange}
          />
           마지막, 가입완료 처리버튼 
           <Button
            className="fixed bottom-3 w-[calc(100%-3rem)]"
            isDisabled={disableButton}
            radius="none"
            onPress={handleLinkAccount}
          >
            회원 가입
          </Button> 
        </>
      )} */}
      <div className="absolute bottom-0">
      {isHelloPage && (
        <Button
        className="flex flex-col w-40 mb-6 self-end text-white bg-black border-white"
        size="md"
        radius="sm"
        onPress={() => setIsHelloPage(false)}
      >
        휴대폰 번호로 시작하기
      </Button>
      )}


      {/* 인증단계 시작 */}
      {!isHelloPage && !isCodeSent && (
        <>
        <Button
          className="flex mt-[-2px] mb-6 w-64 justify-center static bottom-0 text-white bg-black border-red-500"
          isDisabled={disableButton}
          radius="sm"
          variant={disableButton ? "bordered" : "light"}
          type="submit"
          onPress={handlePhoneSignIn}
        >
          인증 코드 받기
        </Button>
        </>
      )}
      
      {/* 코드를 발송했다면, 표시 */}
      {!isHelloPage && !isVerified && isCodeSent && (
        <Button
        className="flex mt-8 mb-6 w-64 justify-center static bottom-0 text-white bg-black border-red-500"
        isDisabled={disableButton}
        color="primary"
        radius="sm"
        variant={disableButton ? "bordered" : "light"}
        onPress={handleVerifyCode}
      >
        인증 확인
      </Button>
      )}
      {/* 전화번호 인증이 완료됬다면, 표시 */}
      {!isHelloPage && isVerified && (
        <Button
        className="flex mt-8 mb-6 w-64 justify-center static bottom-0"
        isDisabled={disableButton}
        radius="sm"
        onPress={handleLinkAccount}
            >
        회원 가입
            </Button>
      )}

        </div>
    </div>
  );
};

export default HelloApp;
