import { useCallback, useEffect, useRef, useState } from "react";

type UseCooldownResult = {
  isCoolingDown: boolean;
  remainingSeconds: number;
  resetCooldown: () => void;
  startCooldown: (seconds?: number) => void;
};

export function useCooldown(defaultSeconds: number): UseCooldownResult {
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const clearCooldownInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetCooldown = useCallback(() => {
    clearCooldownInterval();
    endTimeRef.current = null;
    setRemainingSeconds(0);
  }, [clearCooldownInterval]);

  const updateRemainingSeconds = useCallback(() => {
    if (endTimeRef.current === null) {
      setRemainingSeconds(0);
      return;
    }

    const secondsLeft = Math.max(
      0,
      Math.ceil((endTimeRef.current - Date.now()) / 1000),
    );

    setRemainingSeconds(secondsLeft);

    if (secondsLeft === 0) {
      resetCooldown();
    }
  }, [resetCooldown]);

  const startCooldown = useCallback(
    (seconds = defaultSeconds) => {
      const normalizedSeconds = Math.max(0, Math.floor(seconds));

      clearCooldownInterval();

      if (normalizedSeconds === 0) {
        resetCooldown();
        return;
      }

      endTimeRef.current = Date.now() + normalizedSeconds * 1000;
      setRemainingSeconds(normalizedSeconds);
      intervalRef.current = window.setInterval(updateRemainingSeconds, 250);
    },
    [clearCooldownInterval, defaultSeconds, resetCooldown, updateRemainingSeconds],
  );

  useEffect(() => {
    return () => clearCooldownInterval();
  }, [clearCooldownInterval]);

  return {
    isCoolingDown: remainingSeconds > 0,
    remainingSeconds,
    resetCooldown,
    startCooldown,
  };
}
