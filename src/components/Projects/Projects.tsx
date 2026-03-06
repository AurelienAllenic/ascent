"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight, Trash2, Plus } from "lucide-react";
import styles from "./projects.module.scss";
import TitleSection from "../TitleSection/TitleSection";
import { useLanguage } from "@/app/context/LanguageContext";
import { useEditableContent, ProjectType } from "@/app/context/EditableContentContext";
import { useAuth } from "@/app/context/AuthContext";
import { useTrackSectionArrival } from "@/hooks/useTrackSectionArrival";
import { useAnalytics } from "@/hooks/useAnalytics";

type ProjectsProps = { isEditMode?: boolean };

const Projects: React.FC<ProjectsProps> = ({ isEditMode }) => {
  const { projects, setProjects, loading, error } = useEditableContent();
  const { isLoggedIn } = useAuth();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailCurrentIndex, setDetailCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [captionEn, setCaptionEn] = useState("Feel free to explore our projects");
  const [captionFr, setCaptionFr] = useState("N'hésitez pas à explorer nos projets");
  const [positionStyles, setPositionStyles] = useState({
    translateX: "200%",
    scale: 0.75,
    heightScale: 0.75,
  });
  const [carouselAnimating, setCarouselAnimating] = useState(false);
  const { language } = useLanguage();
  const { trackClick } = useAnalytics();
  useTrackSectionArrival("section_projects");
  const editActive = Boolean(isEditMode && isLoggedIn);
  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const animating = useRef(false);
  const pendingCarouselDirection = useRef<"left" | "right" | null>(null);
  const detailAnimating = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailCarouselRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const totalProjects = projects?.length || 0;

  const positionConfig = [
    { maxWidth: 768, translateX: "100%", scale: 0.75, heightScale: 0.75 },
    { maxWidth: 1024, translateX: "125%", scale: 0.75, heightScale: 0.75 },
    { maxWidth: 1469, translateX: "150%", scale: 0.75, heightScale: 0.75 },
    { maxWidth: 1650, translateX: "200%", scale: 0.75, heightScale: 0.75 },
    { maxWidth: Infinity, translateX: "230%", scale: 0.75, heightScale: 0.75 },
  ];

  useEffect(() => {
    const updatePositionStyles = () => {
      const vw = window.innerWidth;
      const config =
        positionConfig.find((cfg) => vw <= cfg.maxWidth) ||
        positionConfig[positionConfig.length - 1];
      setPositionStyles({
        translateX: config.translateX,
        scale: config.scale,
        heightScale: config.heightScale,
      });

      if (detailCarouselRef.current) {
        detailCarouselRef.current.classList.add(styles.noTransition);
      }

      if (detailCarouselRef.current && selectedProject !== null && projects) {
        const detailItems = detailCarouselRef.current.querySelectorAll(
          `.${styles.carouselItem}`
        );
        const totalImages = Math.max(1, getProjectImages(projects[selectedProject]).length);
        detailItems.forEach((item, index) => {
          const itemIndex =
            (detailCurrentIndex + index - 1 + totalImages) % totalImages;
          gsap.set(item, {
            x:
              index === 0
                ? `-${config.translateX}`
                : index === 1
                ? "0%"
                : config.translateX,
            scaleX: index === 1 ? 1 : config.scale,
            scaleY: index === 1 ? 1 : config.heightScale,
            opacity: index === 1 ? 1 : 0.8,
            zIndex: index === 1 ? 1 : 0,
            immediateRender: true,
          });
        });
        detailCarouselRef.current.classList.remove(styles.noTransition);
      }
    };

    updatePositionStyles();
    window.addEventListener("resize", updatePositionStyles);
    return () => window.removeEventListener("resize", updatePositionStyles);
  }, [detailCurrentIndex, selectedProject, projects]);

  useEffect(() => {
    if (!projectsRef.current || !carouselRef.current || !projects) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          selectedProject === null &&
          entry.isIntersecting &&
          !isTransitioning
        ) {
          const carouselItems = carouselRef.current!.querySelectorAll(
            `.${styles.carouselItem}`
          );
          gsap.set(carouselItems, {
            x: 0,
            scaleX: positionStyles.scale,
            scaleY: positionStyles.heightScale,
            opacity: 0.8,
            zIndex: 1,
          });
          gsap.set(`.${styles.projects}`, { opacity: 0 });

          const timeline = gsap.timeline({
            onComplete: () => {
              setIsTransitioning(false);
            },
          });
          timeline.to(`.${styles.projects}`, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.in",
          });
          carouselItems.forEach((item, index) => {
            const positionIndex = index;
            timeline.to(
              item,
              {
                x:
                  positionIndex === 0
                    ? `-${positionStyles.translateX}`
                    : positionIndex === 1
                    ? "0%"
                    : positionStyles.translateX,
                scaleX: positionIndex === 1 ? 1 : positionStyles.scale,
                scaleY: positionIndex === 1 ? 1 : positionStyles.heightScale,
                opacity: positionIndex === 1 ? 1 : 0.8,
                zIndex: positionIndex === 1 ? 5 : 1,
                duration: 0.5,
                ease: "power2.out",
              },
              0
            );
          });
        }
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(projectsRef.current);
    return () => {
      if (projectsRef.current) {
        observer.unobserve(projectsRef.current);
      }
    };
  }, [selectedProject, isTransitioning, positionStyles, projects]);

  useEffect(() => {
    if (selectedProject === null || isTransitioning || !projectsRef.current)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.1) {
          handleBack();
        }
      },
      { root: null, threshold: [0.1] }
    );

    observer.observe(projectsRef.current);
    return () => {
      if (projectsRef.current) {
        observer.unobserve(projectsRef.current);
      }
    };
  }, [selectedProject, isTransitioning]);

  const getItemIndex = (offset: number) =>
    (currentIndex + offset + totalProjects) % totalProjects;

  const getDetailItemIndex = (offset: number, totalImages: number) =>
    (detailCurrentIndex + offset + totalImages) % totalImages;

  const handleImageClick = (positionIndex: number) => {
    if (isDragging.current || animating.current || isTransitioning) return;
    const projectIndex = getItemIndex(positionIndex - 1);
    const project = projects?.[projectIndex];
    if (project && !editActive) {
      const slug = (language === "fr" ? project.titleFr : project.titleEn)?.replace(/\s+/g, "_") || String(projectIndex);
      trackClick(`project_${slug}`);
    }
    setIsTransitioning(true);

    if (carouselRef.current) {
      const items = carouselRef.current.querySelectorAll(
        `.${styles.carouselItem}`
      );
      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.set(`.${styles.projects}`, { opacity: 0 });
          setSelectedProject(projectIndex);
          setDetailCurrentIndex(0);
          if (
            titleRef.current &&
            descriptionRef.current &&
            detailCarouselRef.current &&
            buttonRef.current
          ) {
            gsap.set(titleRef.current, { opacity: 0, x: -50 });
            gsap.set(descriptionRef.current, { opacity: 0, x: -50 });
            gsap.set(buttonRef.current, { opacity: 0, x: -50 });
            const detailItems = detailCarouselRef.current.querySelectorAll(
              `.${styles.carouselItem}`
            );
            gsap.set(detailItems, { opacity: 0, x: -50 });
            gsap.to(`.${styles.projects}`, {
              opacity: 1,
              duration: 0.2,
              ease: "power2.in",
              onComplete: () => {
                const detailTimeline = gsap.timeline({
                  onComplete: () => setIsTransitioning(false),
                });
                detailTimeline
                  .to(titleRef.current, {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out",
                  })
                  .to(
                    descriptionRef.current,
                    {
                      opacity: 1,
                      x: 0,
                      duration: 0.4,
                      ease: "power2.out",
                    },
                    "-=0.2"
                  )
                  .to(
                    detailItems,
                    {
                      opacity: 1,
                      x: 0,
                      duration: 0.4,
                      ease: "power2.out",
                      stagger: 0.2,
                    },
                    "-=0.2"
                  )
                  .to(
                    buttonRef.current,
                    {
                      opacity: 1,
                      x: 0,
                      duration: 0.4,
                      ease: "power2.out",
                    },
                    "-=0.2"
                  );
              },
            });
          } else {
            gsap.to(`.${styles.projects}`, {
              opacity: 1,
              duration: 0.2,
              ease: "power2.in",
              onComplete: () => setIsTransitioning(false),
            });
          }
        },
      });

      items.forEach((item) => {
        timeline.to(
          item,
          {
            x: 0,
            scaleX: positionStyles.scale,
            scaleY: positionStyles.heightScale,
            opacity: 0.8,
            zIndex: 1,
            duration: 0.3,
            ease: "power2.in",
          },
          0
        );
      });
    } else {
      gsap.to(`.${styles.projects}`, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          setSelectedProject(projectIndex);
          setDetailCurrentIndex(0);
          if (
            titleRef.current &&
            descriptionRef.current &&
            detailCarouselRef.current &&
            buttonRef.current
          ) {
            gsap.set(titleRef.current, { opacity: 0, x: -50 });
            gsap.set(descriptionRef.current, { opacity: 0, x: -50 });
            gsap.set(buttonRef.current, { opacity: 0, x: -50 });
            const detailItems = detailCarouselRef.current.querySelectorAll(
              `.${styles.carouselItem}`
            );
            gsap.set(detailItems, { opacity: 0, x: -50 });
            gsap.to(`.${styles.projects}`, {
              opacity: 1,
              duration: 0.2,
              ease: "power2.in",
              onComplete: () => {
                const detailTimeline = gsap.timeline({
                  onComplete: () => setIsTransitioning(false),
                });
                detailTimeline
                  .to(titleRef.current, {
                    opacity: 1,
                    x: 0,
                    duration: 0.4,
                    ease: "power2.out",
                  })
                  .to(
                    descriptionRef.current,
                    {
                      opacity: 1,
                      x: 0,
                      duration: 0.4,
                      ease: "power2.out",
                    },
                    "-=0.2"
                  )
                  .to(
                    detailItems,
                    {
                      opacity: 1,
                      x: 0,
                      duration: 0.4,
                      ease: "power2.out",
                      stagger: 0.2,
                    },
                    "-=0.2"
                  )
                  .to(
                    buttonRef.current,
                    {
                      opacity: 1,
                      x: 0,
                      duration: 0.4,
                      ease: "power2.out",
                    },
                    "-=0.2"
                  );
              },
            });
          } else {
            gsap.to(`.${styles.projects}`, {
              opacity: 1,
              duration: 0.2,
              ease: "power2.in",
              onComplete: () => setIsTransitioning(false),
            });
          }
        },
      });
    }
  };

  const handleBack = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const timeline = gsap.timeline({
      onComplete: () => {
        setSelectedProject(null);
        setDetailCurrentIndex(0);
        if (carouselRef.current) {
          const items = carouselRef.current.querySelectorAll(
            `.${styles.carouselItem}`
          );
          items.forEach((item, index) => {
            const positionIndex = index;
            gsap.set(item, {
              x:
                positionIndex === 0
                  ? `-${positionStyles.translateX}`
                  : positionIndex === 1
                  ? "0%"
                  : positionStyles.translateX,
              scaleX: positionIndex === 1 ? 1 : positionStyles.scale,
              scaleY: positionIndex === 1 ? 1 : positionStyles.heightScale,
              opacity: positionIndex === 1 ? 1 : 0.8,
              zIndex: positionIndex === 1 ? 5 : 1,
              immediateRender: true,
            });
          });
        }
        gsap.to(`.${styles.projects}`, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => setIsTransitioning(false),
        });
      },
    });

    if (
      titleRef.current &&
      descriptionRef.current &&
      detailCarouselRef.current &&
      buttonRef.current &&
      carouselRef.current
    ) {
      const detailItems = detailCarouselRef.current.querySelectorAll(
        `.${styles.carouselItem}`
      );
      const carouselItems = carouselRef.current.querySelectorAll(
        `.${styles.carouselItem}`
      );

      gsap.set(carouselItems, { x: 50, opacity: 0 });

      timeline
        .to(detailItems, {
          opacity: 0,
          x: 50,
          duration: 0.2,
          ease: "power2.in",
        })
        .to(
          descriptionRef.current,
          { opacity: 0, x: 50, duration: 0.2, ease: "power2.in" },
          0
        )
        .to(
          titleRef.current,
          { opacity: 0, x: 50, duration: 0.2, ease: "power2.in" },
          0
        )
        .to(
          buttonRef.current,
          { opacity: 0, x: 50, duration: 0.2, ease: "power2.in" },
          0
        )
        .to(
          carouselItems,
          {
            x:
              (i) =>
                i === 0
                  ? `-${positionStyles.translateX}`
                  : i === 1
                  ? "0%"
                  : positionStyles.translateX,
            scaleX: (i) => (i === 1 ? 1 : positionStyles.scale),
            scaleY: (i) => (i === 1 ? 1 : positionStyles.heightScale),
            opacity: (i) => (i === 1 ? 1 : 0.8),
            zIndex: (i) => (i === 1 ? 5 : 1),
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.1,
          },
          0.2
        );
    }
  };

  const animateCarousel = (direction: "left" | "right") => {
    if (animating.current || !carouselRef.current) return;
    animating.current = true;

    const items = carouselRef.current.querySelectorAll(
      `.${styles.carouselItem}`
    );
    if (!items || items.length !== 3) {
      animating.current = false;
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        animating.current = false;
        setCarouselAnimating(false);
        setCurrentIndex((prev) =>
          direction === "left"
            ? (prev - 1 + totalProjects) % totalProjects
            : (prev + 1) % totalProjects
        );
      },
    });

    const { translateX, scale, heightScale } = positionStyles;

    const duration = 0.32;
    const ease = "power2.out" as const;
    if (direction === "left") {
      timeline
        .to(items[2], { x: translateX, opacity: 0.7, scaleX: scale, scaleY: heightScale, duration, ease }, 0)
        .to(items[1], { x: `-${translateX}`, opacity: 0.7, scaleX: scale, scaleY: heightScale, duration, ease }, 0)
        .to(items[0], { x: "0%", opacity: 1, scaleX: 1, scaleY: 1, duration, ease }, 0);
    } else {
      timeline
        .to(items[0], { x: `-${translateX}`, opacity: 0.7, scaleX: scale, scaleY: heightScale, duration, ease }, 0)
        .to(items[1], { x: translateX, opacity: 0.7, scaleX: scale, scaleY: heightScale, duration, ease }, 0)
        .to(items[2], { x: "0%", opacity: 1, scaleX: 1, scaleY: 1, duration, ease }, 0);
    }
  };

  const animateDetailCarousel = (direction: "left" | "right") => {
    if (
      detailAnimating.current ||
      !detailCarouselRef.current ||
      selectedProject === null ||
      !projects
    )
      return;
    detailAnimating.current = true;

    const totalImages = Math.max(1, getProjectImages(projects[selectedProject]).length);
    const items = detailCarouselRef.current.querySelectorAll(
      `.${styles.carouselItem}`
    );
    if (!items || items.length !== 3) {
      detailAnimating.current = false;
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        detailAnimating.current = false;
        setDetailCurrentIndex((prev) =>
          direction === "left"
            ? (prev - 1 + totalImages) % totalImages
            : (prev + 1) % totalImages
        );
      },
    });

    const { translateX, scale, heightScale } = positionStyles;

    const duration = 0.32;
    const ease = "power2.out" as const;
    if (direction === "left") {
      timeline
        .to(items[2], { x: translateX, opacity: 0.7, scaleX: scale, scaleY: heightScale, duration, ease }, 0)
        .to(items[1], { x: `-${translateX}`, opacity: 0.7, scaleX: scale, scaleY: heightScale, duration, ease }, 0)
        .to(items[0], { x: "0%", opacity: 1, scaleX: 1, scaleY: 1, duration, ease }, 0);
    } else {
      timeline
        .to(items[0], { x: `-${translateX}`, opacity: 0.7, scaleX: scale, scaleY: heightScale, duration, ease }, 0)
        .to(items[1], { x: translateX, opacity: 0.7, scaleX: scale, scaleY: heightScale, duration, ease }, 0)
        .to(items[2], { x: "0%", opacity: 1, scaleX: 1, scaleY: 1, duration, ease }, 0);
    }
  };

  const goLeft = () => {
    if (animating.current) return;
    setCarouselAnimating(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => animateCarousel("left"));
    });
  };

  const goRight = () => {
    if (animating.current) return;
    setCarouselAnimating(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => animateCarousel("right"));
    });
  };

  const goDetailLeft = () => {
    if (detailAnimating.current) return;
    animateDetailCarousel("left");
  };

  const goDetailRight = () => {
    if (detailAnimating.current) return;
    animateDetailCarousel("right");
  };

  const getProjectImages = (p: ProjectType | undefined) => (p?.images ?? []);

  const handleProjectChange = (projectIndex: number, field: keyof ProjectType, value: string) => {
    setProjects((prev) =>
      prev
        ? prev.map((p, i) =>
            i === projectIndex
              ? { ...p, images: getProjectImages(p), [field]: value }
              : p
          )
        : null
    );
  };

  const handleImageDescChange = (
    projectIndex: number,
    imageIndex: number,
    field: "descriptionEn" | "descriptionFr",
    value: string
  ) => {
    setProjects((prev) => {
      if (!prev) return null;
      const next = [...prev];
      const proj = next[projectIndex];
      const images = [...getProjectImages(proj)];
      if (imageIndex < 0 || imageIndex >= images.length) return prev;
      images[imageIndex] = { ...images[imageIndex], [field]: value };
      next[projectIndex] = { ...proj, images };
      return next;
    });
  };

  const handleDeleteProject = async (projectIndex: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const project = projects?.[projectIndex];
    const id = project?.id;
    if (!id) return;
    if (!confirm(language === "fr" ? "Supprimer ce projet ?" : "Delete this project?")) return;
    try {
      const res = await fetch(`/api/projectsSection?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setProjects((prev) => (prev ? prev.filter((p) => p.id !== id) : null));
      if (selectedProject === projectIndex) {
        setSelectedProject(null);
        setDetailCurrentIndex(0);
      } else if (selectedProject !== null && selectedProject > projectIndex) {
        setSelectedProject(selectedProject - 1);
      }
    } catch (err) {
      setSaveMessage(language === "fr" ? "Erreur lors de la suppression." : "Error deleting.");
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleFeaturedImageChange = async (projectIndex: number, file: File) => {
    const project = projects?.[projectIndex];
    if (!project?.id || !file?.size) return;
    try {
      const fd = new FormData();
      fd.append("id", project.id);
      fd.append("featuredImage", file);
      const res = await fetch("/api/projectsSection/upload-featured", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const updated = await res.json();
      setProjects((prev) => (prev ? prev.map((p) => (p.id === updated.id ? updated : p)) : null));
      setSaveMessage(language === "fr" ? "Image à la une mise à jour." : "Featured image updated.");
      setTimeout(() => setSaveMessage(null), 2500);
    } catch (err) {
      setSaveMessage(language === "fr" ? "Erreur upload image." : "Error uploading image.");
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleAddProject = () => setShowAddModal(true);

  const submitAddProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const titleEn = (formData.get("titleEn") as string)?.trim();
    const titleFr = (formData.get("titleFr") as string)?.trim();
    const featuredFile = formData.get("featuredImage") as File | null;
    if (!titleEn || !titleFr || !featuredFile?.size) {
      setSaveMessage(language === "fr" ? "Titre et image requises." : "Title and image required.");
      return;
    }
    const fd = new FormData();
    fd.append("titleEn", titleEn);
    fd.append("titleFr", titleFr);
    fd.append("generalDescriptionEn", (formData.get("generalDescriptionEn") as string) || "");
    fd.append("generalDescriptionFr", (formData.get("generalDescriptionFr") as string) || "");
    fd.append("featuredImage", featuredFile);
    try {
      const res = await fetch("/api/projectsSection", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      setProjects((prev) => [...(prev || []), created]);
      setShowAddModal(false);
      form.reset();
      setSaveMessage(language === "fr" ? "Projet ajouté." : "Project added.");
      setTimeout(() => setSaveMessage(null), 2500);
    } catch (err) {
      setSaveMessage(language === "fr" ? "Erreur lors de l'ajout." : "Error adding project.");
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (isTransitioning) return;
    isDragging.current = false;
    dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current === null || isTransitioning) return;

    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const delta = currentX - dragStartX.current;
    const threshold = window.innerWidth < 768 ? 30 : 50;

    if (Math.abs(delta) > threshold) {
      isDragging.current = true;
      if (delta > 0) {
        selectedProject === null ? goLeft() : goDetailLeft();
      } else {
        selectedProject === null ? goRight() : goDetailRight();
      }
      dragStartX.current = null;
    }
  };

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div className={styles.containerProjects} id="projects">
        <div className={styles.containerTitleSection}>
          <TitleSection
            titleEn="PROJECTS"
            titleFr="PROJETS"
            color=""
          />
        </div>
        <div className={styles.projects}>
          <p>Error loading projects: {error}</p>
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className={styles.containerProjects} id="projects">
        <div className={styles.containerTitleSection}>
          <TitleSection titleEn="PROJECTS" titleFr="PROJETS" color="" />
        </div>
        <div className={styles.projects}>
          <p>{language === "fr" ? "Aucun projet." : "No projects available."}</p>
          {editActive && (
            <>
              <button type="button" className={styles.addProjectBtn} onClick={handleAddProject}>
                <Plus size={18} style={{ verticalAlign: "middle", marginRight: 4 }} />
                {language === "fr" ? "Ajouter un projet" : "Add project"}
              </button>
              {showAddModal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                  <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                    <h3>{language === "fr" ? "Ajouter un projet" : "Add project"}</h3>
                    <form onSubmit={submitAddProject}>
                      <label>{language === "fr" ? "Titre (EN)" : "Title (EN)"} *</label>
                      <input type="text" name="titleEn" required />
                      <label>{language === "fr" ? "Titre (FR)" : "Title (FR)"} *</label>
                      <input type="text" name="titleFr" required />
                      <label>{language === "fr" ? "Description (EN)" : "Description (EN)"}</label>
                      <textarea name="generalDescriptionEn" />
                      <label>{language === "fr" ? "Description (FR)" : "Description (FR)"}</label>
                      <textarea name="generalDescriptionFr" />
                      <label>{language === "fr" ? "Image à la une *" : "Featured image *"}</label>
                      <input type="file" name="featuredImage" accept="image/*" required />
                      <div className={styles.modalActions}>
                        <button type="button" onClick={() => setShowAddModal(false)}>{language === "fr" ? "Annuler" : "Cancel"}</button>
                        <button type="submit">{language === "fr" ? "Créer" : "Create"}</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.containerProjects} id="projects">
      <div
        className={styles.overlayCarousel}
        style={
          selectedProject !== null
            ? { background: "rgba(0, 0, 0, 0.50)" }
            : undefined
        }
      ></div>

      <div
        className={styles.projectsContainer}
        style={
          selectedProject !== null && projects?.[selectedProject]?.featuredImage
            ? {
                backgroundImage: `url(${projects[selectedProject].featuredImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        <div className={styles.containerTitleSection}>
          <TitleSection
            titleEn="PROJECTS"
            titleFr="PROJETS"
            color={selectedProject !== null ? "white" : ""}
          />
        </div>
        <div
          className={styles.projects}
          ref={projectsRef}
          style={{ pointerEvents: isTransitioning ? "none" : "auto" }}
        >
          {selectedProject === null ? (
            <>
              <div className={styles.carouselWithArrows}>
                <button
                  type="button"
                  className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                  onClick={(e) => { e.stopPropagation(); goLeft(); }}
                  aria-label={language === "fr" ? "Projet précédent" : "Previous project"}
                >
                  <ChevronLeft size={28} strokeWidth={2} />
                </button>
                <div
                  className={styles.carousel}
                  ref={carouselRef}
                  onMouseDown={handleStart}
                  onMouseMove={handleMove}
                  onMouseUp={() => (dragStartX.current = null)}
                  onTouchStart={handleStart}
                  onTouchMove={handleMove}
                  onTouchEnd={() => (dragStartX.current = null)}
                >
                  {[getItemIndex(-1), getItemIndex(0), getItemIndex(1)].map(
                    (projectIndex, positionIndex) => {
                      const project = projects[projectIndex];
                      return (
                        <div
                          key={`main-${positionIndex}`}
                          className={styles.carouselItem}
                        style={{
                          cursor: carouselAnimating ? "wait" : "pointer",
                          transition: carouselAnimating
                            ? "none"
                            : "transform 0.28s ease-out, opacity 0.28s ease-out",
                        }}
                          onClick={() => handleImageClick(positionIndex)}
                        >
                          {editActive ? (
                            <div className={styles.carouselItemEditWrap}>
                              <input
                                type="text"
                                className={styles.editableInput}
                                value={language === "fr" ? project.titleFr : project.titleEn}
                                onChange={(e) =>
                                  handleProjectChange(
                                    projectIndex,
                                    language === "fr" ? "titleFr" : "titleEn",
                                    e.target.value
                                  )
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                              <img
                                src={project.featuredImage}
                                alt=""
                                loading="lazy"
                              />
                              {project.id && (
                                <button
                                  type="button"
                                  className={styles.carouselItemDeleteBtn}
                                  onClick={(e) => handleDeleteProject(projectIndex, e)}
                                  aria-label={language === "fr" ? "Supprimer le projet" : "Delete project"}
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          ) : (
                            <>
                              <p>{language === "fr" ? project.titleFr : project.titleEn}</p>
                              <img
                                src={project.featuredImage}
                                alt={language === "fr" ? project.titleFr : project.titleEn}
                                loading="lazy"
                              />
                            </>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
                <button
                  type="button"
                  className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                  onClick={(e) => { e.stopPropagation(); goRight(); }}
                  aria-label={language === "fr" ? "Projet suivant" : "Next project"}
                >
                  <ChevronRight size={28} strokeWidth={2} />
                </button>
              </div>
              <div className={styles.carouselCaption}>
                {editActive ? (
                  <div className={styles.carouselCaptionEditBand}>
                    <div>
                      <label>{language === "fr" ? "Texte d'accroche (EN)" : "Caption (EN)"}</label>
                      <input
                        type="text"
                        value={captionEn}
                        onChange={(e) => setCaptionEn(e.target.value)}
                        placeholder="Feel free to explore our projects"
                      />
                    </div>
                    <div>
                      <label>{language === "fr" ? "Texte d'accroche (FR)" : "Caption (FR)"}</label>
                      <input
                        type="text"
                        value={captionFr}
                        onChange={(e) => setCaptionFr(e.target.value)}
                        placeholder="N'hésitez pas à explorer nos projets"
                      />
                    </div>
                    <button type="button" className={styles.addProjectBtnBand} onClick={handleAddProject} aria-label={language === "fr" ? "Ajouter un projet" : "Add project"}>
                      <Plus size={20} strokeWidth={2.5} />
                      {language === "fr" ? "Ajouter un projet" : "Add project"}
                    </button>
                  </div>
                ) : (
                  <p>{language === "fr" ? captionFr : captionEn}</p>
                )}
              </div>
              {saveMessage && (
                <div style={{ position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", background: "#333", color: "#fff", padding: "0.5rem 1rem", borderRadius: 6, zIndex: 20 }}>
                  {saveMessage}
                </div>
              )}
            </>
          ) : (() => {
              const currentProject = projects?.[selectedProject!];
              const detailImages = getProjectImages(currentProject);
              const detailCount = Math.max(1, detailImages.length);
              const displayImages = detailImages.length > 0
                ? detailImages
                : [{ url: currentProject?.featuredImage ?? "", descriptionEn: "", descriptionFr: "", id: undefined as string | undefined }];
              if (!currentProject) return null;
              return (
            <>
              <div className={styles.projectDetail}>
                {editActive ? (
                  <div className={styles.projectDetailEditForm}>
                    <div className={styles.projectDetailEditGroup} ref={titleRef}>
                      <label>{language === "fr" ? "Titre (FR)" : "Title (EN)"}</label>
                      <input
                        type="text"
                        className={styles.editableInput}
                        value={language === "fr" ? currentProject.titleFr : currentProject.titleEn}
                        onChange={(e) => handleProjectChange(selectedProject!, language === "fr" ? "titleFr" : "titleEn", e.target.value)}
                      />
                    </div>
                    <div className={styles.projectDetailEditGroup}>
                      <label>{language === "fr" ? "Titre (EN)" : "Title (FR)"}</label>
                      <input
                        type="text"
                        className={styles.editableInput}
                        value={language === "fr" ? currentProject.titleEn : currentProject.titleFr}
                        onChange={(e) => handleProjectChange(selectedProject!, language === "fr" ? "titleEn" : "titleFr", e.target.value)}
                      />
                    </div>
                    <div className={styles.projectDetailEditGroup} ref={descriptionRef}>
                      <label>{language === "fr" ? "Description (FR)" : "Description (EN)"}</label>
                      <textarea
                        className={styles.editableTextarea}
                        value={language === "fr" ? (currentProject.generalDescriptionFr ?? "") : (currentProject.generalDescriptionEn ?? "")}
                        onChange={(e) => handleProjectChange(selectedProject!, language === "fr" ? "generalDescriptionFr" : "generalDescriptionEn", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className={styles.projectDetailEditGroup}>
                      <label>{language === "fr" ? "Description (EN)" : "Description (FR)"}</label>
                      <textarea
                        className={styles.editableTextarea}
                        value={language === "fr" ? (currentProject.generalDescriptionEn ?? "") : (currentProject.generalDescriptionFr ?? "")}
                        onChange={(e) => handleProjectChange(selectedProject!, language === "fr" ? "generalDescriptionEn" : "generalDescriptionFr", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className={styles.projectDetailFeaturedBlock}>
                      <label>{language === "fr" ? "Image à la une" : "Featured image"}</label>
                      <img src={currentProject.featuredImage} alt="" className={styles.projectDetailFeaturedPreview} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleFeaturedImageChange(selectedProject!, f);
                          e.target.value = "";
                        }}
                      />
                    </div>
                    <div className={styles.editActions}>
                      <p className={styles.editActionsHint}>
                        {language === "fr" ? "Enregistrez avec le bouton « Sauvegarder » en haut de la page." : "Save using the « Save » button at the top of the page."}
                      </p>
                      {currentProject.id && (
                        <button type="button" className={styles.deleteProjectBtn} onClick={() => handleDeleteProject(selectedProject!)}>
                          {language === "fr" ? "Supprimer le projet" : "Delete project"}
                        </button>
                      )}
                      {saveMessage && <span className={styles.editSaveMessage}>{saveMessage}</span>}
                    </div>
                    {detailImages.length > 0 && (
                      <div className={styles.imageDescriptionsBlock}>
                        <p className={styles.imageDescriptionsTitle}>{language === "fr" ? "Descriptions des images" : "Image descriptions"}</p>
                        {detailImages.map((img, imageIndex) => (
                          <div key={img.id ?? imageIndex} className={styles.imageDescriptionEdit}>
                            <img src={img.url} alt="" className={styles.imageDescriptionThumb} />
                            <label>EN</label>
                            <input
                              type="text"
                              className={styles.editableInput}
                              value={img.descriptionEn ?? ""}
                              onChange={(e) => handleImageDescChange(selectedProject!, imageIndex, "descriptionEn", e.target.value)}
                            />
                            <label>FR</label>
                            <input
                              type="text"
                              className={styles.editableInput}
                              value={img.descriptionFr ?? ""}
                              onChange={(e) => handleImageDescChange(selectedProject!, imageIndex, "descriptionFr", e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <h2 ref={titleRef}>
                      {language === "fr" ? currentProject.titleFr : currentProject.titleEn}
                    </h2>
                    <p ref={descriptionRef} className={styles.generalDescription}>
                      {language === "fr" ? currentProject.generalDescriptionFr : currentProject.generalDescriptionEn}
                    </p>
                  </>
                )}
                <div className={styles.carouselWithArrows}>
                  <button
                    type="button"
                    className={`${styles.carouselArrow} ${styles.carouselArrowLeft} ${styles.detailCarouselArrow}`}
                    onClick={(e) => { e.stopPropagation(); goDetailLeft(); }}
                    aria-label={language === "fr" ? "Image précédente" : "Previous image"}
                  >
                    <ChevronLeft size={28} strokeWidth={2} />
                  </button>
                  <div
                    className={styles.detailCarousel}
                    ref={detailCarouselRef}
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={() => (dragStartX.current = null)}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={() => (dragStartX.current = null)}
                  >
                    {[
                      getDetailItemIndex(-1, detailCount),
                      getDetailItemIndex(0, detailCount),
                      getDetailItemIndex(1, detailCount),
                    ].map((imageIndex, positionIndex) => {
                      const img = displayImages[imageIndex % displayImages.length];
                      if (!img?.url) return null;
                      return (
                      <div
                        key={`${imageIndex}-${positionIndex}`}
                        className={styles.carouselItem}
                        style={{
                          cursor: detailAnimating.current ? "wait" : "pointer",
                          transition: detailAnimating.current
                            ? "none"
                            : "transform 0.28s ease-out, opacity 0.28s ease-out",
                        }}
                      >
                        <img
                          src={img.url}
                          alt={`${language === "fr" ? currentProject.titleFr : currentProject.titleEn} - ${imageIndex}`}
                          loading="lazy"
                        />
                        <p>
                          {language === "fr" ? img.descriptionFr : img.descriptionEn}
                        </p>
                      </div>
                    );})}
                  </div>
                  <button
                    type="button"
                    className={`${styles.carouselArrow} ${styles.carouselArrowRight} ${styles.detailCarouselArrow}`}
                    onClick={(e) => { e.stopPropagation(); goDetailRight(); }}
                    aria-label={language === "fr" ? "Image suivante" : "Next image"}
                  >
                    <ChevronRight size={28} strokeWidth={2} />
                  </button>
                </div>
              </div>
              <button ref={buttonRef} onClick={handleBack}>
                {language === "fr" ? "Retour aux projets" : "RETURN TO THE PROJECTS"}
              </button>
            </>
              );
            })()}
        </div>
      </div>

      {editActive && showAddModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>{language === "fr" ? "Ajouter un projet" : "Add project"}</h3>
            <form onSubmit={submitAddProject}>
              <label>{language === "fr" ? "Titre (EN)" : "Title (EN)"} *</label>
              <input type="text" name="titleEn" required />
              <label>{language === "fr" ? "Titre (FR)" : "Title (FR)"} *</label>
              <input type="text" name="titleFr" required />
              <label>{language === "fr" ? "Description (EN)" : "Description (EN)"}</label>
              <textarea name="generalDescriptionEn" />
              <label>{language === "fr" ? "Description (FR)" : "Description (FR)"}</label>
              <textarea name="generalDescriptionFr" />
              <label>{language === "fr" ? "Image à la une *" : "Featured image *"}</label>
              <input type="file" name="featuredImage" accept="image/*" required />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setShowAddModal(false)}>{language === "fr" ? "Annuler" : "Cancel"}</button>
                <button type="submit">{language === "fr" ? "Créer" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;