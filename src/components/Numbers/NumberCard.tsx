"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./numberCard.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger);

interface NumberCardProps {
  number: number | string;
  unit?: string;
  textFr: string;
  textEn: string;
  size: "small" | "medium" | "large";
  customClass?: string;
  animationDelay: number;
  isEditMode?: boolean;
  onChange?: (field: string, value: string) => void;
}

const NumberCard: React.FC<NumberCardProps> = ({
  number,
  unit,
  textFr,
  textEn,
  size,
  customClass,
  animationDelay,
  isEditMode,
  onChange,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const { language } = useLanguage();

  useLayoutEffect(() => {
    if (!gsap || !ScrollTrigger) {
      console.error("GSAP or ScrollTrigger not loaded");
      return;
    }
    if (isEditMode) return;

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
        tl.restart();
      },
      onLeave: () => {
        gsap.to(cardRef.current, {
          opacity: 0,
          y: 50,
          duration: 0.5,
          ease: "power2.in",
        });
      },
      onLeaveBack: () => {
        gsap.to(cardRef.current, {
          opacity: 0,
          y: -50,
          duration: 0.5,
          ease: "power2.in",
        });
      },
    });

    return () => {
      tl.kill();
      trigger.kill();
    };
  }, [number, unit, animationDelay]);

  return (
    <>
      {isEditMode ? (
        <div
          className={`${styles.numberCardInputs} ${customClass || ""}`}
          ref={cardRef}
        >
          <input
            type="text"
            className={`${styles.numberInput} ${styles[size]}`}
            value={number}
            onChange={(e) => onChange?.("number", e.target.value)}
          />
          <input
            type="text"
            className={styles.unitInput}
            value={unit || ""}
            onChange={(e) => onChange?.("unit", e.target.value)}
            placeholder="Unit (optional)"
          />
          <textarea
            className={`${styles.textInput} ${styles[size]}`}
            value={language === "fr" ? textFr : textEn}
            onChange={(e) =>
              onChange?.(
                language === "fr" ? "textFr" : "textEn",
                e.target.value
              )
            }
          />
          <select
            className={styles.sizeInput}
            value={size}
            onChange={(e) => onChange?.("size", e.target.value)}
          >
            <option value="small">
              {language === "en" ? "Size: Small" : "Taille : Petite"}
            </option>
            <option value="medium">
              {language === "en" ? "Size: Medium" : "Taille : Moyenne"}
            </option>
            <option value="large">
              {language === "en" ? "Size: Large" : "Taille : Grande"}
            </option>
          </select>
        </div>
      ) : (
        <div
          className={`${styles.numberCard} ${customClass || ""}`}
          ref={cardRef}
        >
          <span className={`${styles.number} ${styles[size]}`} ref={numberRef}>
            {number}
            {unit && <span className={styles.unit}>{unit}</span>}
          </span>
          <p className={`${styles.text} ${styles[size]}`}>
            {language === "fr" ? textFr : textEn}
          </p>
        </div>
      )}
    </>
  );
};

export default NumberCard;
