import { useState, useRef, useCallback } from "react";

export function useOtpInput(length = 6) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (index: number, value: string, onClearError?: () => void) => {
      if (!/^\d*$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      onClearError?.();
      if (value && index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp, length],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>, onClearError?: () => void) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData("text/plain").slice(0, length);
      if (/^\d+$/.test(pasteData)) {
        const pasteArray = pasteData.split("");
        const newOtp = [...otp];
        pasteArray.forEach((char, i) => {
          if (i < length) newOtp[i] = char;
        });
        setOtp(newOtp);
        onClearError?.();
      }
    },
    [otp, length],
  );

  const getFullOtp = useCallback(() => otp.join(""), [otp]);

  const resetOtp = useCallback(() => {
    setOtp(new Array(length).fill(""));
    inputRefs.current[0]?.focus();
  }, [length]);

  return {
    otp,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    getFullOtp,
    resetOtp,
  };
}
