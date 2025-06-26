"use client";

import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./about.module.scss";
import NavBar from "../Nav/Nav";
import TitleSection from "../TitleSection/TitleSection";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const aboutContentRef = useRef<HTMLDivElement>(null);
  const leftPartRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const rightPartRef = useRef<HTMLDivElement>(null);
  const firstTextRef = useRef<HTMLDivElement>(null);
  const secondTextRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!gsap || !ScrollTrigger) {
      console.error("GSAP or ScrollTrigger not loaded");
      return;
    }

    if (!aboutContentRef.current) {
      console.error("About content container not found");
      return;
    }

    // Créer un contexte GSAP complètement isolé
    const ctx = gsap.context(() => {
      // États initiaux
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

      // ScrollTrigger avec animation directe (pas de timeline)
      ScrollTrigger.create({
        trigger: aboutContentRef.current,
        start: "top 90%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        markers: false,
        id: "about-animation-trigger",
        animation: gsap
          .timeline()
          .to(leftPartRef.current, {
            scaleY: 1,
            duration: 1,
            ease: "power2.out",
          })
          .to(
            imageContainerRef.current,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1,
              ease: "power2.out",
            },
            0
          )
          .to(
            [firstTextRef.current, secondTextRef.current, buttonRef.current],
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
            },
            0
          ),
      });
    }, aboutContentRef.current);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div className={styles.aboutContainer}>
      <TitleSection title="ABOUT" />
      <div className={styles.aboutContent} ref={aboutContentRef}>
        <div className={styles.aboutleftPartContainer} ref={leftPartRef}>
          <p className={styles.aboutleftPartContent}>
            A MODERN CONCEPTION OF DESIGN
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
                Since 2025, Ascent is one of the first company to innovate
              </p>
            </div>

            <div className={styles.aboutPartContainer} ref={secondTextRef}>
              <p className={styles.aboutRightText}>
                Since 2025, Ascent is one of the first company to innovate
              </p>
            </div>

            <div className={styles.aboutBtnContainer} ref={buttonRef}>
              <button className={styles.aboutBtn}>Learn more</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
