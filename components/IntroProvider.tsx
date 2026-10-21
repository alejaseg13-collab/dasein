"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type IntroState = { running: boolean };

const IntroContext = createContext<IntroState>({ running: false });

export function useIntro() {
  return useContext(IntroContext);
}

const INTRO_END_MS = 1600;

let started = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function start() {
  if (started) return;
  started = true;
  listeners.forEach((listener) => listener());
}

export default function IntroProvider({ children }: { children: ReactNode }) {
  const running = useSyncExternalStore(subscribe, () => started, () => false);

  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    const unlock = () => {
      root.style.overflow = previous;
      root.style.scrollbarGutter = "";
    };
    root.style.overflow = "hidden";
    root.style.scrollbarGutter = "stable";
    const timer = window.setTimeout(unlock, INTRO_END_MS);
    const unlockOnFailure = () => unlock();
    window.addEventListener("error", unlockOnFailure);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("error", unlockOnFailure);
      unlock();
    };
  }, [running]);

  return (
    <IntroContext.Provider value={{ running }}>
      {children}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          [data-intro] {
            opacity: 1 !important;
            transform: none !important;
          }
          [data-intro-clip] {
            clip-path: inset(0% 0% 0% 0% round 0px) !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </IntroContext.Provider>
  );
}
