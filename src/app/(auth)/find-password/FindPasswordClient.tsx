'use client';

import { useState } from 'react';
import Step1Form from './Step1Form';
import Step2Form from './Step2Form';
import Step3Complete from './Step3Complete';

export type FindPasswordStep = 1 | 2 | 3;

export default function FindPasswordClient() {
  const [step, setStep] = useState<FindPasswordStep>(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <>
      <p className="text-text-secondary text-sm font-medium text-center mb-6">
        주짓수 커뮤니티에 오신 것을 환영합니다
      </p>

      <div
        className={`max-w-150 w-full bg-bg-white rounded-[32px] p-8 shadow-sm border-none ${step === 3 ? 'h-auto' : 'h-[500px]'}`}
      >
        <h2 className="text-2xl font-bold text-center text-text-primary mb-8">
          {step === 1
            ? '비밀번호 찾기'
            : step === 2
              ? '비밀번호 재설정'
              : '재설정 완료'}
        </h2>

        {step === 1 && (
          <Step1Form
            name={name}
            email={email}
            setName={setName}
            setEmail={setEmail}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <Step2Form name={name} email={email} onNext={() => setStep(3)} />
        )}
        {step === 3 && <Step3Complete />}
      </div>
    </>
  );
}
