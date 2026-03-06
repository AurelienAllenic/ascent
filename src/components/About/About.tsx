"use client";

import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./about.module.scss";
import TitleSection from "../TitleSection/TitleSection";
import { useLanguage } from "@/app/context/LanguageContext";
import { useEditableContent } from "@/app/context/EditableContentContext";
import { useTrackSectionArrival } from "@/hooks/useTrackSectionArrival";
import { useAnalytics } from "@/hooks/useAnalytics";

gsap.registerPlugin(ScrollTrigger);

export type AboutSectionType = {
  id: string;
  leftPartTitleEn: string;
  leftPartTitleFr: string;
  rightPartContent1En: string;
  rightPartContent2En?: string;
  rightPartContent1Fr: string;
  rightPartContent2Fr?: string;
  btnTextEn: string;
  btnTextFr: string;
  btnLink: string;
};

type AboutProps = {
  onSave?: (data: AboutSectionType) => Promise<void>;
  isEditMode?: boolean;
};

export default function About({ onSave, isEditMode }: AboutProps) {
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const leftPartRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const rightPartRef = useRef<HTMLDivElement>(null);
  const firstTextRef = useRef<HTMLDivElement>(null);
  const secondTextRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { editableAbout, setEditableAbout } = useEditableContent();
  const { trackClick } = useAnalytics();
  useTrackSectionArrival("section_about");
  const isLoggedIn = true;

  useLayoutEffect(() => {
    if (!gsap || !ScrollTrigger) {
      console.error("GSAP or ScrollTrigger not loaded");
      return;
    }

    if (!aboutContentRef.current) {
      console.error("About content container not found");
      return;
    }

    const tl = gsap.timeline({ paused: true });

    tl.set(leftPartRef.current, {
      scaleY: 0,
      transformOrigin: "top center",
    })
      .set(imageContainerRef.current, {
        clipPath: "inset(100% 0% 0% 0%)",
      })
      .set([firstTextRef.current, secondTextRef.current, buttonRef.current], {
        opacity: 0,
        y: 100,
      })
      .to(leftPartRef.current, {
        scaleY: 1,
        duration: 2,
        ease: "power2.out",
      })
      .to(
        imageContainerRef.current,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 2,
          ease: "power2.out",
        },
        0
      )
      .to(
        [firstTextRef.current, secondTextRef.current, buttonRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "power2.out",
        },
        0
      );

    tl.eventCallback("onReverseComplete", () => {
      gsap.set(leftPartRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
      });
      gsap.set(imageContainerRef.current, {
        clipPath: "inset(100% 0% 0% 0%)",
      });
      gsap.set(
        [firstTextRef.current, secondTextRef.current, buttonRef.current],
        {
          opacity: 0,
          y: 100,
        }
      );
    });

    ScrollTrigger.create({
      trigger: aboutContentRef.current,
      start: "top 80%",
      end: "bottom 20%",
      markers: false,
      onEnter: () => {
        tl.restart();
      },
      onEnterBack: () => {
        tl.restart();
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      tl.kill();
    };
  }, []);

  const handleChange = (field: keyof AboutSectionType, value: string) => {
    setEditableAbout(prev => (prev ? { ...prev, [field]: value } : null));
  };



  const leftText = language === "fr" ? editableAbout?.leftPartTitleFr : editableAbout?.leftPartTitleEn;
  const firstRightText = language === "fr" ? editableAbout?.rightPartContent1Fr : editableAbout?.rightPartContent1En;
  const secondRightText = language === "fr" ? editableAbout?.rightPartContent2Fr : editableAbout?.rightPartContent2En;
  const btnText = language === "fr" ? editableAbout?.btnTextFr : editableAbout?.btnTextEn;

  return (
    <div className={styles.aboutContainer} id="about">
      <TitleSection titleEn="ABOUT" titleFr="À PROPOS" />
      
      {isLoggedIn && isEditMode ? (
      <div className={styles.aboutContent} ref={aboutContentRef}>
        <div className={styles.aboutleftPartContainer} ref={leftPartRef}>
          <textarea
            className={styles.editableTextarea}
            value={leftText || ""}
            onChange={(e) => handleChange(language === "fr" ? "leftPartTitleFr" : "leftPartTitleEn", e.target.value)}
          />
        </div>

        <div className={styles.aboutImageContainer} ref={imageContainerRef}>
          <Image
            src="/assets/about/about.jpg"
            alt="About Image"
            fill
            style={{ objectFit: "cover" }}
            className={styles.aboutImage}
          />
        </div>

        <div className={styles.aboutRightPartContainer} ref={rightPartRef}>
          <div className={styles.aboutRightPartSubContainer}>
            <div className={styles.aboutPartContainer} ref={firstTextRef}>
              <textarea
                className={styles.editableTextarea}
                value={firstRightText || ""}
                onChange={(e) => handleChange(language === "fr" ? "rightPartContent1Fr" : "rightPartContent1En", e.target.value)}
              />
            </div>

            <div className={styles.aboutPartContainer} ref={secondTextRef}>
              <textarea
                className={styles.editableTextarea}
                value={secondRightText || ""}
                onChange={(e) => handleChange(language === "fr" ? "rightPartContent2Fr" : "rightPartContent2En", e.target.value)}
              />
            </div>

            <div className={styles.aboutBtnContainer} ref={buttonRef}>
              <input
                type="text"
                className={styles.editableInput}
                value={btnText || ""}
                onChange={(e) => handleChange(language === "fr" ? "btnTextFr" : "btnTextEn", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div className={styles.aboutContent} ref={aboutContentRef}>
        <div className={styles.aboutleftPartContainer} ref={leftPartRef}>
          <p className={styles.aboutleftPartContent}>
            {leftText}
          </p>
        </div>

        <div className={styles.aboutImageContainer} ref={imageContainerRef}>
          <Image
            src="/assets/about/about.jpg"
            alt="About Image"
            fill
            style={{ objectFit: "cover" }}
            className={styles.aboutImage}
          />
        </div>

        <div className={styles.aboutRightPartContainer} ref={rightPartRef}>
          <div className={styles.aboutRightPartSubContainer}>
            <div className={styles.aboutPartContainer} ref={firstTextRef}>
              <p className={styles.aboutRightText}>
                {firstRightText}
              </p>
            </div>

            <div className={styles.aboutPartContainer} ref={secondTextRef}>
              <p className={styles.aboutRightText}>
                {secondRightText}
              </p>
            </div>

            <div className={styles.aboutBtnContainer} ref={buttonRef}>
              <button className={styles.aboutBtn} onClick={() => trackClick("section_about_cta")}>{btnText}</button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
