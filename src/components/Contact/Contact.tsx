"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import styles from "./contact.module.scss";
import TitleSection from "../TitleSection/TitleSection";

export default function ContactSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const secondImageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [isMainImgZoomed, setIsMainImgZoomed] = useState(false);

  useEffect(() => {
    if (
      !imageRef.current ||
      !overlayRef.current ||
      !textRef.current ||
      !secondImageRef.current ||
      !formRef.current ||
      !closeRef.current
    )
      return;

    gsap.set(textRef.current, { autoAlpha: 1 });
    gsap.set(formRef.current.parentElement, {
      autoAlpha: 0,
      y: 0,
      display: "none",
    });
    gsap.set(closeRef.current, { autoAlpha: 0, display: "none" });
    gsap.set(imageRef.current, {
      scale: 1,
      width: "50%",
      x: 0,
      overflow: "hidden",
    });
    gsap.set(secondImageRef.current, {
      scale: 1,
      width: "100%",
      x: 0,
      y: 0,
    });
    gsap.set(overlayRef.current, {
      autoAlpha: 0,
    });

    tl.current = gsap.timeline({ paused: true });

    tl.current
      .to(
        textRef.current,
        {
          autoAlpha: 0,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        0
      )
      .to(
        imageRef.current,
        {
          width: "200%",
          duration: 1,
          ease: "power3.inOut",
          onStart: () => setIsMainImgZoomed(true), // Active le zoom
        },
        0
      )
      .to(
        imageRef.current,
        {
          x: "-100%",
          duration: 1,
          ease: "power3.inOut",
        },
        0
      )
      .to(
        secondImageRef.current,
        {
          width: "100%",
          x: "-15%",
          y: -20,
          duration: 1,
          ease: "power3.inOut",
        },
        0
      )
      .to(
        overlayRef.current,
        {
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        0.1
      )
      .to(
        formRef.current.parentElement,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          display: "block",
        },
        0.3
      )
      .to(
        closeRef.current,
        {
          autoAlpha: 1,
          duration: 0.5,
          ease: "power2.out",
          display: "block",
        },
        0.3
      )
      .to(
        imageRef.current,
        {
          overflow: "visible",
          duration: 0,
        },
        0
      );
  }, []);

  const openModal = () => {
    tl.current?.play();
  };

  const closeModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    tl.current?.reverse().then(() => {
      setIsMainImgZoomed(false); // Désactive le zoom après reverse
      if (imageRef.current)
        gsap.set(imageRef.current, {
          scale: 1,
          width: "50%",
          x: 0,
          overflow: "hidden",
        });
      if (secondImageRef.current)
        gsap.set(secondImageRef.current, {
          scale: 1,
          width: "100%",
          x: 0,
          y: 0,
        });
      if (formRef.current)
        gsap.set(formRef.current.parentElement, { display: "none" });
      if (closeRef.current) 
        gsap.set(closeRef.current, { display: "none" });
      if (overlayRef.current) 
        gsap.set(overlayRef.current, { autoAlpha: 0 });
    });
  };


  const sendMessage = () => {
    

  }


  return (
    <section className={styles.contactSection} id="contact">
        <TitleSection title="CONTACT" color="white" />
      <div className={styles.contactContent}>
        <div ref={textRef} className={styles.textContent}>

          <h2 className={styles.title}>
            WE CAN TAKE <span>CARE</span>
          </h2>
          <h2 className={styles.secondTitle}>
            OF YOUR <span>PROJECTS</span>
          </h2>
          <div className={styles.learnMoreContainer}>
            <button className={styles.learnMore} onClick={openModal}>
                Learn more
            </button>
          </div>
        </div>

        <div ref={imageRef} className={styles.imageContainer}>
          <div ref={overlayRef} className={styles.overlay}></div>
          <button
                ref={closeRef}
                className={styles.closeBtn}
                onClick={closeModal}
              >
                ×
              </button>
          <Image
            src="/assets/contact/center.jpg"
            alt="Main"
            fill
            className={`${styles.mainImage} ${isMainImgZoomed ? styles.zoomed : ""}`}
            priority
          />
          <div className={styles.formWrapper}>
          
            <form ref={formRef} className={styles.form}>
              <div className={styles.formRow}>
                <label>Who are you?</label>
                <div className={styles.inputsRow}>
                    <div className={styles.inputAndLabel}>
                        <label>Your Name</label>
                        <input type="text" placeholder="Name" />
                    </div>
                    <div className={styles.inputAndLabel}>
                        <label>Your Email</label>
                        <input type="email" placeholder="Email" />
                    </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <label>What is your project ?</label>
                <textarea placeholder="Please, describe your project here..." />
              </div>
              <div className={styles.checkboxValidate}>
                    <div className={styles.containerCheckbox}>
                        <input type="checkbox" id="check"/>
                        <label htmlFor="check">By sending this message, I consent to being
                        recontacted through the email I provided</label>
                    </div>
                    <div className={styles.containerValidateForm}>
                        <button className={styles.validateFormBtn} onClick={sendMessage}>
                            Send a message
                        </button>
                    </div>
              </div>
            </form>
          </div>
        </div>

        <div ref={secondImageRef} className={styles.secondImageContainer}>
          <Image
            src="/assets/contact/right.jpg"
            alt="Building"
            fill
            className={styles.secondImage}
            priority
          />
        </div>
      </div>
    </section>
  );
}