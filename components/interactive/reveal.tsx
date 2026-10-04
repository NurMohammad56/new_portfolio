"use client";

import type { ReactNode } from "react";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
} from "motion/react";

const premiumEase = [0.16, 1, 0.3, 1] as const;

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.72, ease: premiumEase }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  amount?: number;
};

export function Reveal({ children, className }: RevealProps) {
  return (
    <div className={`reveal-block${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
};

export function TextReveal({ text, className, delay = 0 }: TextRevealProps) {
  return (
    <span
      className={`hero-text-reveal${className ? ` ${className}` : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {text}
    </span>
  );
}
