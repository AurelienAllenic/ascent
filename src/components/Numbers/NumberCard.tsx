"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./numberCard.module.scss";

gsap.registerPlugin(ScrollTrigger);

interface NumberCardProps {
  number: number | string;
  unit?: string;
  text: string;
  size: "small" | "medium" | "large";
  customClass?: string;
  animationDelay: number;
}

const NumberCard: React.FC<NumberCardProps> = ({
  number,
  unit,
  text,
  size,
  customClass,
  animationDelay,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!gsap || !ScrollTrigger) {
      console.error("GSAP or ScrollTrigger not loaded");
      return;
    }

    if (!cardRef.current || !numberRef.current) {
      console.error(
        "Card or number element not found. Card class:",
        styles.numberCard,
        "Number class:",
        styles.number
      );
      return;
    }

    const numberText =
      typeof number === "string"
        ? number.replace(/[^0-9]/g, "")
        : number.toString();
    const targetNumber = parseInt(numberText, 10);
    const isPlus = typeof number === "string" && number.includes("+");
    const startNumber = Math.max(0, targetNumber - 50);

    gsap.set(cardRef.current, { opacity: 0, y: 50 });
    gsap.set(numberRef.current, { innerText: startNumber });
    numberRef.current.textContent = startNumber + (isPlus ? "+" : unit || "");

    const tl = gsap.timeline({ paused: true });
    tl.to(cardRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
      delay: animationDelay,
    }).to(
      numberRef.current,
      {
        innerText: targetNumber,
        duration: 3,
        ease: "power2.out",
        snap: { innerText: 1 },
        onUpdate: function () {
          numberRef.current!.textContent =
            Math.round(this.targets()[0].innerText) +
            (isPlus ? "+" : unit || "");
        },
      },
      animationDelay + 0.2
    );

    const trigger = ScrollTrigger.create({
      trigger: cardRef.current,
      start: "top 90%",
      end: "bottom 10%",
      toggleActions: "play none none none",
      markers: false,
      onEnter: () => {
        tl.restart();
      },
      onEnterBack: () => {
        gsap.set(cardRef.current, { y: -50 });
        tl.restart();
      },
      onLeave: () => {
        gsap.set(cardRef.current, { opacity: 0, y: 50 });
        gsap.set(numberRef.current, { innerText: startNumber });
        if (numberRef.current) {
          numberRef.current.textContent =
            startNumber + (isPlus ? "+" : unit || "");
        }
        tl.pause(0);
      },
      onLeaveBack: () => {
        gsap.set(cardRef.current, { opacity: 0, y: -50 });
        gsap.set(numberRef.current, { innerText: startNumber });
        if (numberRef.current) {
          numberRef.current.textContent =
            startNumber + (isPlus ? "+" : unit || "");
        }
        tl.pause(0);
      },
    });

    return () => {
      tl.kill();
      trigger.kill();
    };
  }, [number, unit, animationDelay]);

  return (
    <div className={`${styles.numberCard} ${customClass || ""}`} ref={cardRef}>
      <span className={`${styles.number} ${styles[size]}`} ref={numberRef}>
        {number}
        {unit && <span className={styles.unit}>{unit}</span>}
      </span>
      <p className={`${styles.text} ${styles[size]}`}>{text}</p>
    </div>
  );
};

export default NumberCard;
