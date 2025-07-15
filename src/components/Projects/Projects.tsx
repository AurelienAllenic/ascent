"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./projects.module.scss";
import projectsData from "./projects.json";
import TitleSection from "../TitleSection/TitleSection";

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [positionStyles, setPositionStyles] = useState({
    translateX: "200%",
    scale: 1.0,
    heightScale: 0.75, // Fixé à 0.75 pour 25 % moins haut
  });
  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const animating = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const totalProjects = projectsData.projects.length;

  // Tableau de correspondances pour translateX, scale et heightScale
  const positionConfig = [
    { maxWidth: 768, translateX: "100%", scale: 0.85, heightScale: 0.75 },
    { maxWidth: 1024, translateX: "125%", scale: 0.9, heightScale: 0.75 },
    { maxWidth: 1469, translateX: "150%", scale: 0.95, heightScale: 0.75 },
    { maxWidth: Infinity, translateX: "200%", scale: 1.0, heightScale: 0.75 },
  ];

  // Mettre à jour les styles dynamiquement au redimensionnement
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

      // Mettre à jour les positions des éléments existants
      if (carouselRef.current) {
        const items = carouselRef.current.querySelectorAll(
          `.${styles.carouselItem}`
        );
        items.forEach((item, index) => {
          gsap.to(item, {
            x:
              index === 0
                ? `-${config.translateX}`
                : index === 1
                ? "0%"
                : config.translateX,
            scale: index === 1 ? 1 : config.scale,
            scaleY: index === 1 ? 1 : config.heightScale, // Réduire la hauteur des images latérales de 25 %
            opacity: index === 1 ? 1 : 0.8,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      }
    };

    updatePositionStyles();
    window.addEventListener("resize", updatePositionStyles);
    return () => window.removeEventListener("resize", updatePositionStyles);
  }, []);

  const getItemIndex = (offset: number) =>
    (currentIndex + offset + totalProjects) % totalProjects;

  const handleImageClick = (positionIndex: number) => {
    if (isDragging.current || animating.current) return;
    const projectIndex = getItemIndex(positionIndex - 1);
    setSelectedProject(projectIndex);
  };

  const handleBack = () => {
    setSelectedProject(null);
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
        setCurrentIndex((prev) =>
          direction === "left"
            ? (prev - 1 + totalProjects) % totalProjects
            : (prev + 1) % totalProjects
        );
      },
    });

    const { translateX, scale, heightScale } = positionStyles;

    if (direction === "left") {
      timeline
        .to(
          items[2],
          {
            x: translateX,
            opacity: 0.7,
            scale,
            scaleY: heightScale,
            duration: 0.5,
          },
          0
        )
        .to(
          items[1],
          {
            x: `-${translateX}`,
            opacity: 0.7,
            scale,
            scaleY: heightScale,
            duration: 0.5,
          },
          0
        )
        .to(
          items[0],
          { x: "0%", opacity: 1, scale: 1, scaleY: 1, duration: 0.5 },
          0
        );
    } else {
      timeline
        .to(
          items[0],
          {
            x: `-${translateX}`,
            opacity: 0.7,
            scale,
            scaleY: heightScale,
            duration: 0.5,
          },
          0
        )
        .to(
          items[1],
          {
            x: translateX,
            opacity: 0.7,
            scale,
            scaleY: heightScale,
            duration: 0.5,
          },
          0
        )
        .to(
          items[2],
          { x: "0%", opacity: 1, scale: 1, scaleY: 1, duration: 0.5 },
          0
        );
    }
  };

  const goLeft = () => {
    if (animating.current) return;
    animateCarousel("left");
  };

  const goRight = () => {
    if (animating.current) return;
    animateCarousel("right");
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = false;
    dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current === null) return;

    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const delta = currentX - dragStartX.current;
    const threshold = window.innerWidth < 768 ? 30 : 50;

    if (Math.abs(delta) > threshold) {
      isDragging.current = true;
      if (delta > 0) {
        goLeft();
      } else {
        goRight();
      }
      dragStartX.current = null;
    }
  };

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.containerTitleSection}>
        <TitleSection title="PROJECTS" />
      </div>
      <div className={styles.projects}>
        {selectedProject === null ? (
          <>
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
                (projectIndex, positionIndex) => (
                  <div
                    key={projectIndex}
                    className={styles.carouselItem}
                    style={{
                      cursor: animating.current ? "wait" : "pointer",
                      transform:
                        positionIndex === 0
                          ? `translateX(-${positionStyles.translateX}) scale(${positionStyles.scale}) scaleY(${positionStyles.heightScale})`
                          : positionIndex === 1
                          ? "translateX(0) scale(1) scaleY(1)"
                          : `translateX(${positionStyles.translateX}) scale(${positionStyles.scale}) scaleY(${positionStyles.heightScale})`,
                      opacity: positionIndex === 1 ? 1 : 0.8,
                      zIndex: positionIndex === 1 ? 5 : 1,
                      transition: animating.current
                        ? "none"
                        : "transform 0.3s ease, opacity 0.3s ease",
                    }}
                    onClick={() => handleImageClick(positionIndex)}
                  >
                    <img
                      src={projectsData.projects[projectIndex].featuredImage}
                      alt={projectsData.projects[projectIndex].title}
                      loading="lazy"
                    />
                  </div>
                )
              )}
            </div>
            <div className={styles.carouselCaption}>
              <p>Feel free to explore our projects</p>
            </div>
          </>
        ) : (
          <div className={styles.projectDetail}>
            <h2>{projectsData.projects[selectedProject].title}</h2>
            <p className={styles.generalDescription}>
              {projectsData.projects[selectedProject].generalDescription}
            </p>
            <div className={styles.detailCarousel}>
              {projectsData.projects[selectedProject].images.map(
                (imageObj, idx) => (
                  <div key={idx} className={styles.carouselItem}>
                    <img
                      src={imageObj.url}
                      alt={`${projectsData.projects[selectedProject].title} - ${idx}`}
                      loading="lazy"
                    />
                    <p>{imageObj.description}</p>
                  </div>
                )
              )}
            </div>
            <button onClick={handleBack}>Back to Projects</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
