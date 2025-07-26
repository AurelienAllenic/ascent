"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./projects.module.scss";
import projectsData from "./projects.json";
import TitleSection from "../TitleSection/TitleSection";
import { url } from "inspector";

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailCurrentIndex, setDetailCurrentIndex] = useState(0);
  const [positionStyles, setPositionStyles] = useState({
    translateX: "200%",
    scale: 1.0,
    heightScale: 0.75,
  });
  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const animating = useRef(false);
  const detailAnimating = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailCarouselRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0); // entre 0 et 1

  const totalProjects = projectsData.projects.length;

  const positionConfig = [
    { maxWidth: 768, translateX: "100%", scale: 0.85, heightScale: 0.75 },
    { maxWidth: 1024, translateX: "125%", scale: 0.9, heightScale: 0.75 },
    { maxWidth: 1469, translateX: "150%", scale: 0.95, heightScale: 0.75 },
    { maxWidth: Infinity, translateX: "200%", scale: 1.0, heightScale: 0.75 },
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

      // Appliquer la classe noTransition pour le carrousel de détail
      if (detailCarouselRef.current) {
        detailCarouselRef.current.classList.add(styles.noTransition);
      }

      // Mettre à jour le carrousel de détail
      if (detailCarouselRef.current && selectedProject !== null) {
        const detailItems = detailCarouselRef.current.querySelectorAll(
          `.${styles.carouselItem}`
        );
        detailItems.forEach((item, index) => {
          const totalImages =
            projectsData.projects[selectedProject].images.length;
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
            zIndex: index === 1 ? 5 : 1,
            immediateRender: true,
          });
        });
        // Retirer la classe noTransition après l'initialisation
        detailCarouselRef.current.classList.remove(styles.noTransition);
      }
    };

    updatePositionStyles();
    window.addEventListener("resize", updatePositionStyles);
    return () => window.removeEventListener("resize", updatePositionStyles);
  }, [detailCurrentIndex, selectedProject]);

  const getItemIndex = (offset: number) =>
    (currentIndex + offset + totalProjects) % totalProjects;

  const getDetailItemIndex = (offset: number, totalImages: number) =>
    (detailCurrentIndex + offset + totalImages) % totalImages;

  const handleImageClick = (positionIndex: number) => {
    if (isDragging.current || animating.current) return;
    const projectIndex = getItemIndex(positionIndex - 1);
    setSelectedProject(projectIndex);
    setDetailCurrentIndex(0);
  };

  const handleBack = () => {
    setSelectedProject(null);
    setDetailCurrentIndex(0);
  };

  const touchStartY = useRef<number | null>(null);

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
            scaleX: scale,
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
            scaleX: scale,
            scaleY: heightScale,
            duration: 0.5,
          },
          0
        )
        .to(
          items[0],
          { x: "0%", opacity: 1, scaleX: 1, scaleY: 1, duration: 0.5 },
          0
        );
    } else {
      timeline
        .to(
          items[0],
          {
            x: `-${translateX}`,
            opacity: 0.7,
            scaleX: scale,
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
            scaleX: scale,
            scaleY: heightScale,
            duration: 0.5,
          },
          0
        )
        .to(
          items[2],
          { x: "0%", opacity: 1, scaleX: 1, scaleY: 1, duration: 0.5 },
          0
        );
    }
  };

  const animateDetailCarousel = (direction: "left" | "right") => {
    if (
      detailAnimating.current ||
      !detailCarouselRef.current ||
      selectedProject === null
    )
      return;
    detailAnimating.current = true;

    const totalImages = projectsData.projects[selectedProject].images.length;
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

    if (direction === "left") {
      timeline
        .to(
          items[2],
          {
            x: translateX,
            opacity: 0.7,
            scaleX: scale,
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
            scaleX: scale,
            scaleY: heightScale,
            duration: 0.5,
          },
          0
        )
        .to(
          items[0],
          { x: "0%", opacity: 1, scaleX: 1, scaleY: 1, duration: 0.5 },
          0
        );
    } else {
      timeline
        .to(
          items[0],
          {
            x: `-${translateX}`,
            opacity: 0.7,
            scaleX: scale,
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
            scaleX: scale,
            scaleY: heightScale,
            duration: 0.5,
          },
          0
        )
        .to(
          items[2],
          { x: "0%", opacity: 1, scaleX: 1, scaleY: 1, duration: 0.5 },
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

  const goDetailLeft = () => {
    if (detailAnimating.current) return;
    animateDetailCarousel("left");
  };

  const goDetailRight = () => {
    if (detailAnimating.current) return;
    animateDetailCarousel("right");
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
        selectedProject === null ? goLeft() : goDetailLeft();
      } else {
        selectedProject === null ? goRight() : goDetailRight();
      }
      dragStartX.current = null;
    }
  };

  return (
    <div className={styles.containerProjects}>
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
          selectedProject !== null
            ? {
                backgroundImage: `url(${projectsData.projects[selectedProject].featuredImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
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
                            ? `translateX(-${positionStyles.translateX}) scale(${positionStyles.scale}, ${positionStyles.heightScale})`
                            : positionIndex === 1
                            ? "translateX(0) scale(1, 1)"
                            : `translateX(${positionStyles.translateX}) scale(${positionStyles.scale}, ${positionStyles.heightScale})`,
                        opacity: positionIndex === 1 ? 1 : 0.8,
                        zIndex: positionIndex === 1 ? 5 : 1,
                        transition: animating.current
                          ? "none"
                          : "transform 0.3s ease, opacity 0.3s ease",
                      }}
                      onClick={() => handleImageClick(positionIndex)}
                    >
                      <p>{projectsData.projects[projectIndex].title}</p>
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
            <>
              <div className={styles.projectDetail}>
                <h2>{projectsData.projects[selectedProject].title}</h2>
                <p className={styles.generalDescription}>
                  {projectsData.projects[selectedProject].generalDescription}
                </p>
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
                    getDetailItemIndex(
                      -1,
                      projectsData.projects[selectedProject].images.length
                    ),
                    getDetailItemIndex(
                      0,
                      projectsData.projects[selectedProject].images.length
                    ),
                    getDetailItemIndex(
                      1,
                      projectsData.projects[selectedProject].images.length
                    ),
                  ].map((imageIndex, positionIndex) => (
                    <div
                      key={imageIndex}
                      className={styles.carouselItem}
                      style={{
                        cursor: detailAnimating.current ? "wait" : "pointer",
                        transform:
                          positionIndex === 0
                            ? `translateX(-${positionStyles.translateX}) scale(${positionStyles.scale}, ${positionStyles.heightScale})`
                            : positionIndex === 1
                            ? "translateX(0) scale(1, 1)"
                            : `translateX(${positionStyles.translateX}) scale(${positionStyles.scale}, ${positionStyles.heightScale})`,
                        opacity: positionIndex === 1 ? 1 : 0.8,
                        zIndex: positionIndex === 1 ? 5 : 1,
                        transition: detailAnimating.current
                          ? "none"
                          : "transform 0.3s ease, opacity 0.3s ease",
                      }}
                    >
                      <img
                        src={
                          projectsData.projects[selectedProject].images[
                            imageIndex
                          ].url
                        }
                        alt={`${projectsData.projects[selectedProject].title} - ${imageIndex}`}
                        loading="lazy"
                      />
                      <p>
                        {
                          projectsData.projects[selectedProject].images[
                            imageIndex
                          ].description
                        }
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleBack}>RETURN TO THE PROJECTS</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
