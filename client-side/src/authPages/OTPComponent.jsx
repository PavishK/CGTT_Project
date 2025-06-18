import { useRef, useEffect, useState } from 'react';
import { getOTPLimit, setOTPLimit, removeOTPLimit } from '../service/StorageService';

const MAX_RESEND = 3;
const COOLDOWN_TIME = 40; // seconds
const RESET_INTERVAL = 8 * 60 * 60 * 1000; 

export default function OTPComponent({ onSubmit, resend }) {
  const formRef = useRef(null);
  const [resendCount, setResendCount] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');

  // Load state from localStorage
  useEffect(() => {
  const stored = getOTPLimit()|| {};
  const { count = 0, lastReset = Date.now(), lastSentTime = 0 } = stored;
  const now = Date.now();

  // Reset if 24 hours passed
  if (now - lastReset > RESET_INTERVAL) {
    const freshData = {
      count: 0,
      lastReset: now,
      lastSentTime: 0
    };
    setOTPLimit(freshData);
    setResendCount(0);
  } else {
    setResendCount(count);

    if (count >= MAX_RESEND) {
      setResendDisabled(true);
      setResendMessage("You've reached the resend limit. Try again tomorrow.");
    }

    const timeElapsed = Math.floor((now - lastSentTime) / 1000);
    if (timeElapsed < COOLDOWN_TIME) {
      setCooldown(COOLDOWN_TIME - timeElapsed);
    }
  }
}, []);

  // Cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // OTP field handling
  useEffect(() => {
    const form = formRef.current;
    const inputs = [...form.querySelectorAll('input[type=text]')];
    const submit = form.querySelector('button[type=submit]');

    const handleKeyDown = (e) => {
      if (!/^[0-9]{1}$/.test(e.key) && !['Backspace', 'Delete', 'Tab'].includes(e.key)) {
        e.preventDefault();
      }
      if (['Backspace', 'Delete'].includes(e.key)) {
        const index = inputs.indexOf(e.target);
        if (index > 0) {
          inputs[index - 1].value = '';
          inputs[index - 1].focus();
        }
      }
    };

    const handleInput = (e) => {
      const { target } = e;
      const index = inputs.indexOf(target);
      if (target.value) {
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        } else {
          submit.focus();
        }
      }
    };

    const handleFocus = (e) => e.target.select();

    const handlePaste = (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text');
      const digits = text.split('');
      const inputs = [...form.querySelectorAll('input[type=text]')];
      if (digits.length === inputs.length && digits.every(d => /^\d$/.test(d))) {
        inputs.forEach((input, i) => (input.value = digits[i]));
        submit.focus();
      }
    };

    inputs.forEach((input) => {
      input.addEventListener('input', handleInput);
      input.addEventListener('keydown', handleKeyDown);
      input.addEventListener('focus', handleFocus);
      input.addEventListener('paste', handlePaste);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener('input', handleInput);
        input.removeEventListener('keydown', handleKeyDown);
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('paste', handlePaste);
      });
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = [...formRef.current.querySelectorAll('input')].map((i) => i.value).join('');
    onSubmit?.(otp);
  };

  const handleResend = () => {
  const MAX_RESEND_COUNT = 4;
  const COOLDOWN_PERIOD = 80 * 1000; // 80 seconds
  const now = Date.now();

  const stored = getOTPLimit() || {};
  const isCooldownOver = now - (stored.time || 0) >= COOLDOWN_PERIOD;

  // Reset count if cooldown is over
  if (stored.count >= MAX_RESEND_COUNT && isCooldownOver) {
    setOTPLimit({ count: 0, time: now });
  }

  const updated = getOTPLimit() || {};

  if (updated.count >= MAX_RESEND_COUNT) {
    setResendDisabled(true);
    setResendMessage("You've reached the resend limit. Try again after 30 seconds.");
    return;
  }

  const newInfo = {
    count: (updated.count || 0) + 1,
    time: updated.time || now,
    lastSentTime: now,
    attempts: updated.attempts || 0
  };

  setOTPLimit(newInfo);
  setResendCount(newInfo.count);
  setResendMessage(`OTP resent (${newInfo.count}/${MAX_RESEND_COUNT})`);
  setCooldown(COOLDOWN_PERIOD / 1000); // in seconds

  if (typeof resend === 'function') {
    resend();
  }
};



  return (
    <div className="w-full bg-white">
      <h2 className="text-2xl font-bold mb-2 text-center">Email Verification</h2>
      <p className="text-sm text-gray-500 text-center mb-6">
        Enter the 6-digit verification code sent to your email address.
      </p>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="flex justify-center gap-2 mb-6">
          {Array(6)
            .fill()
            .map((_, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                pattern="\d*"
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-100 text-black rounded outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 border"
              />
            ))}
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors duration-200"
        >
          Verify Email
        </button>
      </form>

      <div className="text-sm text-center mt-4 text-gray-600">
        Didn’t receive code?{' '}
        <button
          onClick={handleResend}
          disabled={resendDisabled || cooldown > 0}
          className={`${
            resendDisabled || cooldown > 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-indigo-600 hover:underline'
          }`}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend'}
        </button>
        {resendMessage && (
          <p className="mt-1 text-red-500 text-xs">{resendMessage}</p>
        )}
      </div>
    </div>
  );
}
