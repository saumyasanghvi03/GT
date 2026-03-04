"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const supported =
  typeof navigator !== "undefined" && "wakeLock" in navigator;

export function useWakeLock() {
  const [isActive, setIsActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  const request = useCallback(async () => {
    if (!supported) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      setIsActive(true);
      wakeLockRef.current.addEventListener("release", () => {
        setIsActive(false);
      });
    } catch {
      setIsActive(false);
    }
  }, []);

  const release = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      setIsActive(false);
    }
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "visible" && isActive) {
        request();
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      release();
    };
  }, [isActive, request, release]);

  return { isActive, isSupported: supported, request, release };
}
