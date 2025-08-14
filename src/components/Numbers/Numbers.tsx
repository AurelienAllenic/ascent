"use client";

import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TitleSection from "../TitleSection/TitleSection";
import NumberCard from "@/components/Numbers/NumberCard";
import styles from "@/components/Numbers/numbers.module.scss";
import { useLanguage } from "@/app/context/LanguageContext";
import { useEditableContent } from "@/app/context/EditableContentContext";

gsap.registerPlugin(ScrollTrigger);

type NumbersProps = {
  onSave?: (data: any) => Promise<void>;
  isEditMode?: boolean;
};

export default function Numbers({ onSave, isEditMode }: NumbersProps) {
  const numbersSectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { editableNumberSection, setEditableNumberSection } = useEditableContent();
  const isLoggedIn = true;

  useLayoutEffect(() => {
    if (!gsap || !ScrollTrigger) {
      console.error("GSAP or ScrollTrigger not loaded");
      return;
    }

    if (!cardsContainerRef.current) {
      console.error("Cards container not found");
      return;
    }

    const cards = cardsContainerRef.current.children;
    const tl = gsap.timeline({ paused: true });

    tl.set(cards, {
      opacity: 0,
      y: 100,
    }).to(cards, {
      opacity: 1,
      y: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
    });

    ScrollTrigger.create({
      trigger: numbersSectionRef.current,
      start: "top 80%",
      end: "bottom 20%",
      markers: false,
      onEnter: () => tl.restart(),
      onEnterBack: () => tl.restart(),
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      tl.kill();
    };
  }, []);

  const handleChange = (index: number, field: string, value: string) => {
    setEditableNumberSection((prev) => {
      if (!prev) return null;
      const updatedCards = [...prev.cards];
      updatedCards[index] = { ...updatedCards[index], [field]: value };
      return { ...prev, cards: updatedCards };
    });
  };

  const handleSave = async () => {
    if (!editableNumberSection || !onSave) return;
    try {
      await onSave(editableNumberSection);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
    }
  };

  return (
    <section className={styles.numbersSection} id="numbers" ref={numbersSectionRef}>
      <TitleSection titleEn="NUMBERS" titleFr="CHIFFRES" color="white" />
      <div className={styles.cards} ref={cardsContainerRef}>
        {editableNumberSection?.cards.map((card, index) => (
          isLoggedIn && isEditMode ? (
            <div key={card.id} className={styles.editableCard}>
              <input
                type="text"
                className={styles.editableInput}
                value={card.number}
                onChange={(e) => handleChange(index, "number", e.target.value)}
              />
              <input
                type="text"
                className={styles.editableInput}
                value={card.unit || ""}
                onChange={(e) => handleChange(index, "unit", e.target.value)}
                placeholder="Unit (optional)"
              />
              <textarea
                className={styles.editableTextarea}
                value={language === "fr" ? card.textFr : card.textEn}
                onChange={(e) =>
                  handleChange(index, language === "fr" ? "textFr" : "textEn", e.target.value)
                }
              />
              <input
                type="text"
                className={styles.editableInput}
                value={card.size}
                onChange={(e) => handleChange(index, "size", e.target.value)}
                placeholder="Size (e.g., small, medium, large)"
              />
            </div>
          ) : (
            <NumberCard
              key={card.id}
              number={card.number}
              unit={card.unit}
              textFr={card.textFr}
              textEn={card.textEn}
              size={card.size}
              customClass={card.size}
              animationDelay={index * 0.2}
            />
          )
        ))}
      </div>
    </section>
  );
}