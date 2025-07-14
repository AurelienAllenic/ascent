"use client";

import React, { useState, useRef } from "react";
import gsap from "gsap";
import styles from "./projects.module.scss";
import projectsData from "./projects.json";
import TitleSection from "../TitleSection/TitleSection";

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const animating = useRef(false);

  const totalProjects = projectsData.projects.length;
  const carouselRef = useRef<HTMLDivElement>(null);

  // Calcule l'index correct dans la boucle circulaire
  const getItemIndex = (offset: number) =>
    (currentIndex + offset + totalProjects) % totalProjects;

  const handleImageClick = (positionIndex: number) => {
    if (isDragging.current || animating.current) return;
    // positionIndex 1 = centre, 0 = gauche, 2 = droite
    const projectIndex = getItemIndex(positionIndex - 1);
    setSelectedProject(projectIndex);
  };

  const handleBack = () => {
    setSelectedProject(null);
  };

  // Animation GSAP pour changer la slide
  const animateCarousel = (direction: "left" | "right") => {
    if (animating.current) return;
    animating.current = true;

    const items = carouselRef.current?.querySelectorAll(
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

    if (direction === "left") {
      timeline
        .to(items[2], { x: "50%", opacity: 0.7, scale: 0.7, duration: 0.5 }, 0) // droite sort à droite
        .to(items[1], { x: "0%", opacity: 0.7, scale: 0.8, duration: 0.5 }, 0) // centre devient droite
        .to(items[0], { x: "50%", opacity: 1, scale: 1, duration: 0.5 }, 0); // gauche devient centre
    } else {
      timeline
        .to(
          items[0],
          { x: "-150%", opacity: 0.7, scale: 0.7, duration: 0.5 },
          0
        ) // gauche sort à gauche
        .to(items[1], { x: "45%", opacity: 0.7, scale: 0.8, duration: 0.5 }, 0) // centre devient gauche
        .to(items[2], { x: "0%", opacity: 1, scale: 1, duration: 0.5 }, 0); // droite devient centre
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

    if (Math.abs(delta) > 50) {
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
                          ? "translateX(-45%) scale(0.8)"
                          : positionIndex === 1
                          ? "translateX(0) scale(1)"
                          : "translateX(45%) scale(0.8)",
                      opacity: positionIndex === 1 ? 1 : 0.7,
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
                    />
                  </div>
                )
              )}
            </div>
            <p>Feel free to explore our projects</p>
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
