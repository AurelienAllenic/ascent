"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import styles from "./contact.module.scss";
import TitleSection from "../TitleSection/TitleSection";
import { useLanguage } from "@/app/context/LanguageContext";
import { useEditableContent } from "@/app/context/EditableContentContext";
import { useTrackSectionArrival } from "@/hooks/useTrackSectionArrival";
import { useAnalytics } from "@/hooks/useAnalytics";

export interface ContactFormFieldType {
  id: string;
  field_nameEn: string;
  field_nameFr: string;
  field_typeEn: string;
  field_typeFr: string;
  required: boolean;
  order: number;
  contact_section_id: string;
}

export interface ContactSectionType {
  id: string;
  user_id: string;
  image_url: string;
  titleEn: string;
  titleFr: string;
  titleEn2: string;
  titleFr2: string;
  buttonTextEn: string;
  buttonTextFr: string;
  buttonLink: string;
  formTitle1En: string;
  formTitle2En: string;
  formTitle1Fr: string;
  formTitle2Fr: string;
  submitButtonTextEn: string;
  submitButtonTextFr: string;
  updatedAt: string;
  formFields: ContactFormFieldType[];
}


export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const secondImageRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const learnMoreRef = useRef<HTMLButtonElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [isMainImgZoomed, setIsMainImgZoomed] = useState(false);
  const { language } = useLanguage();
  const { contactSection } = useEditableContent();
  const { trackClick } = useAnalytics();
  useTrackSectionArrival("section_contact");

  // Modal et données du formulaire
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    accepted: false,
  });

  if (!contactSection) return null;

  // Gestion des inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  

  const sendMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    trackClick("section_contact_submit");
    const { name, email, message, accepted } = formData;
  
    if (!name || !email || !message || !accepted) {
      alert(
        language === "fr"
          ? "Merci de remplir tous les champs et cocher la case"
          : "Please fill all fields and check the box"
      );
      return;
    }

    setFormData({
      name: "",
      email: "",
      message: "",
      accepted: false,
    });

    const body = document.body;
    body.style.overflow = "hidden";
  
    setIsModalOpen(true);

    setTimeout(() => {
      setIsModalOpen(false);
      body.style.overflow = "auto";
    }, 1200);
  };
  

  useEffect(() => {
    if (
      !imageRef.current ||
      !overlayRef.current ||
      !textRef.current ||
      !secondImageRef.current ||
      !formRef.current ||
      !closeRef.current ||
      !learnMoreRef.current
    ) return;

    const formElement = formRef.current;
    const formParent = formElement.parentElement;
    if (!formParent) return;

    let initialInnerHeight = window.innerHeight;

    const handleResize = () => {
      const currentInnerHeight = window.innerHeight;
      if (currentInnerHeight < initialInnerHeight * 0.7) return;
      if (isMainImgZoomed) return;

      gsap.set(textRef.current, { autoAlpha: 1 });
      gsap.set(formParent, { autoAlpha: 0, y: 0, display: "none" });
      gsap.set(closeRef.current, { autoAlpha: 0, display: "none" });
      gsap.set(learnMoreRef.current, { autoAlpha: 1, display: "block" });
      gsap.set(imageRef.current, { scale: 1, width: "50%", x: 0, overflow: "hidden" });
      gsap.set(secondImageRef.current, { scale: 1, width: "100%", x: 0, y: 0 });
      gsap.set(overlayRef.current, { autoAlpha: 0 });

      const tlInstance = gsap.timeline({ paused: true });
      const isMobile = window.innerWidth <= 767;
      const zoomWidth = isMobile ? "150%" : "200%";
      const xOffset = isMobile ? "0%" : "-100%";

      tlInstance.to(textRef.current, { autoAlpha: isMobile ? 1 : 0, y: 0, duration: 0.5, ease: "power2.out" }, 0);
      tlInstance.to(imageRef.current, { width: zoomWidth, duration: 1, ease: "power3.inOut", onStart: () => { setIsMainImgZoomed(true); if (imageRef.current && isMobile) imageRef.current.style.overflow = "visible"; } }, 0);
      tlInstance.to(imageRef.current, { x: xOffset, duration: 1, ease: "power3.inOut" }, 0);
      tlInstance.to(imageRef.current, { overflow: "visible", duration: 0 }, 0);
      tlInstance.to(secondImageRef.current, { width: "100%", x: isMobile ? "0%" : "-15%", y: isMobile ? 0 : -20, duration: 1, ease: "power3.inOut" }, 0);
      tlInstance.to(overlayRef.current, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.1);
      tlInstance.to(formParent, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out", display: "block" }, 0.3);
      tlInstance.to(closeRef.current, { autoAlpha: 1, duration: 0.5, ease: "power2.out", display: "block" }, 0.3);

      tl.current = tlInstance;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMainImgZoomed]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting && entry.intersectionRatio < 0.1 && isMainImgZoomed && !document.querySelector("#footer")?.contains(entry.target)) {
          closeModal();
        }
      },
      { threshold: [0, 0.1], rootMargin: "100px" }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isMainImgZoomed]);

  useEffect(() => {
    if (!formRef.current) return;
    const preventScrollInterference = (e: TouchEvent) => {
      if (isMainImgZoomed && formRef.current?.contains(e.target as Node)) e.stopPropagation();
    };
    formRef.current.addEventListener("touchstart", preventScrollInterference, { passive: false });
    return () => formRef.current?.removeEventListener("touchstart", preventScrollInterference);
  }, [isMainImgZoomed]);

  const openModal = () => {
    trackClick("section_contact_learn_more");
    tl.current?.play();
    if (window.innerWidth <= 767 && learnMoreRef.current) {
      gsap.set(learnMoreRef.current, { autoAlpha: 0, display: "none" });
    }
  };

  const closeModal = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    trackClick("section_contact_close");
    if (tl.current && tl.current.progress() > 0) {
      tl.current.reverse().then(() => {
        setIsMainImgZoomed(false);
        if (imageRef.current) gsap.set(imageRef.current, { scale: 1, width: "50%", x: 0, overflow: "hidden" });
        if (secondImageRef.current) gsap.set(secondImageRef.current, { scale: 1, width: "100%", x: 0, y: 0 });
        if (formRef.current && formRef.current.parentElement) gsap.set(formRef.current.parentElement, { display: "none" });
        if (closeRef.current) gsap.set(closeRef.current, { display: "none" });
        if (overlayRef.current) gsap.set(overlayRef.current, { autoAlpha: 0 });
        if (learnMoreRef.current) gsap.set(learnMoreRef.current, { autoAlpha: 1, display: "block" });
      });
    }
  };

  return (
    <section className={styles.contactSection} id="contact" ref={sectionRef}>
      <TitleSection titleEn="CONTACT" titleFr="CONTACT" color="white" />
      <div className={styles.contactContent}>
        <div ref={textRef} className={styles.textContent}>
          <h2 className={styles.title}>
            {language === "fr" ? contactSection.titleFr : contactSection.titleEn}
          </h2>
          <h2 className={styles.secondTitle}>
            {language === "fr" ? contactSection.titleFr2 : contactSection.titleEn2}
          </h2>
          <div className={styles.learnMoreContainer}>
            <button ref={learnMoreRef} className={styles.learnMore} onClick={openModal}>
              {language === "fr" ? contactSection.buttonTextFr : contactSection.buttonTextEn}
            </button>
          </div>
        </div>
        <div ref={imageRef} className={styles.imageContainer}>
          <div ref={overlayRef} className={styles.overlay}></div>
          <button ref={closeRef} className={styles.closeBtn} onClick={closeModal}>×</button>
          <Image src="/assets/contact/center.jpg" alt="Main" fill className={`${styles.mainImage} ${isMainImgZoomed ? styles.zoomed : ""}`} priority />
          <div className={styles.formWrapper}>
            <form ref={formRef} className={styles.form}>
              <div className={styles.formRow}>
                <label>{language === "fr" ? contactSection.formTitle1Fr : contactSection.formTitle1En}</label>
                <div className={styles.inputsRow}>
                  <div className={styles.inputAndLabel}>
                    <label>{language === "fr" ? "Votre nom" : "Your Name"}</label>
                    <input type="text" name="name" placeholder={language === "fr" ? "Nom" : "Name"} value={formData.name} onChange={handleChange} />
                  </div>
                  <div className={styles.inputAndLabel}>
                    <label>{language === "fr" ? "Votre email" : "Your Email"}</label>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
              </div>
              <div className={styles.formRow}>
                <label>{language === "fr" ? contactSection.formTitle2Fr : contactSection.formTitle2En}</label>
                <textarea name="message" placeholder={language === "fr" ? "Veuillez décrire votre projet ici..." : "Please, describe your project here..."} value={formData.message} onChange={handleChange} />
              </div>
              <div className={styles.checkboxValidate}>
                <div className={styles.containerCheckbox}>
                  <input type="checkbox" id="check" name="accepted" checked={formData.accepted} onChange={handleChange} />
                  <label htmlFor="check">{language === "fr" ? "En envoyant ce message, je consent à être recontacté via l'email que j'ai fourni" : "By sending this message, I consent to being recontacted through the email I provided"}</label>
                </div>
                <div className={styles.containerValidateForm}>
                  <button className={styles.validateFormBtn} onClick={sendMessage}>
                    {language === "fr" ? contactSection.submitButtonTextFr : contactSection.submitButtonTextEn}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div ref={secondImageRef} className={styles.secondImageContainer}>
          <Image src="/assets/contact/right.jpg" alt="Building" fill className={styles.secondImage} priority />
        </div>
      </div>

      {/* MODALE DE CONFIRMATION */}
      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p>{language === "fr" ? "Message envoyé !" : "Message sent!"}</p>
          </div>
        </div>
      )}
    </section>
  );
}
