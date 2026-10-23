"use client";

import { useSyncExternalStore } from "react";

const START: 1 | -1 = 1;
let dir: 1 | -1 = START;
let lastY = 0;
let acc = 0;
const listeners = new Set<() => void>();

const handleScroll = () => {
  const y = window.scrollY;
  acc += y - lastY;
  lastY = y;
  if (acc > 8) {
    if (dir !== 1) {
      dir = 1;
      listeners.forEach((l) => l());
    }
    acc = 0;
  } else if (acc < -8) {
    if (dir !== -1) {
      dir = -1;
      listeners.forEach((l) => l());
    }
    acc = 0;
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  if (listeners.size === 1) {
    lastY = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("scroll", handleScroll);
  };
};

const getSnapshot = () => dir;
const getServerSnapshot = () => START;

/** 1 = el scroll baja, -1 = el scroll sube. */
export function useScrollDirection(): 1 | -1 {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
