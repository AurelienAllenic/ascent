"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./projects.module.scss";
import projectsData from "./projects.json";
import TitleSection from "../TitleSection/TitleSection";

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [detailCurrentIndex, setDetailCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [positionStyles, setPositionStyles] = useState({
    translateX: "200%",
    scale: 0.75,
    heightScale: 0.75,
  });
  const isDragging = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const animating = useRef(false);
  const detailAnimating = useRef(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const detailCarouselRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollYRef = useRef(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const totalProjects = projectsData.projects.length;

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
  }, [detailCurrentIndex, selectedProject]);

  // Destacking animation when entering project list
  useEffect(() => {
    if (!projectsRef.current || !carouselRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          selectedProject === null &&
          entry.isIntersecting &&
          !isTransitioning
        ) {
          console.log("Destacking triggered: section visible");
          const carouselItems = carouselRef.current!.querySelectorAll(
            `.${styles.carouselItem}`
          );
          // Initialize cards as stacked
          gsap.set(carouselItems, {
            x: 0,
            scaleX: positionStyles.scale,
            scaleY: positionStyles.heightScale,
            opacity: 0.8,
            zIndex: 1,
          });
          gsap.set(`.${styles.projects}`, { opacity: 0 });

          // Animate to final positions
          const timeline = gsap.timeline({
            onComplete: () => {
              console.log("Destacking complete");
              setIsTransitioning(false);
            },
          });
          timeline.to(`.${styles.projects}`, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.in",
          });
          carouselItems.forEach((item, index) => {
            const positionIndex = index; // -1, 0, 1 for left, center, right
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
      {
        root: null,
        threshold: 0.1, // Trigger when 10% of section is visible
      }
    );

    observer.observe(projectsRef.current);
    return () => {
      if (projectsRef.current) {
        observer.unobserve(projectsRef.current);
      }
    };
  }, [selectedProject, isTransitioning, positionStyles]);

  // Scroll-based return to project list
  useEffect(() => {
    if (selectedProject === null || isTransitioning || !projectsRef.current)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.5) {
          console.log("Triggering handleBack: section visibility < 50%");
          handleBack();
        }
      },
      {
        root: null,
        threshold: [0.5],
      }
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
    setIsTransitioning(true);

    const projectIndex = getItemIndex(positionIndex - 1);

    // Stack carousel items at center before transitioning
    if (carouselRef.current) {
      const items = carouselRef.current.querySelectorAll(
        `.${styles.carouselItem}`
      );
      const timeline = gsap.timeline({
        onComplete: () => {
          gsap.to(`.${styles.projects}`, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
              setSelectedProject(projectIndex);
              setDetailCurrentIndex(0);
              // Initialize detail elements off-screen
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
                // Fade in projects container
                gsap.to(`.${styles.projects}`, {
                  opacity: 1,
                  duration: 0.2,
                  ease: "power2.in",
                  onComplete: () => {
                    // Animate detail elements sequentially
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
        },
      });

      // Animate cards to stack at center
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

    // Animate out the detail elements and stack project carousel items
    const timeline = gsap.timeline({
      onComplete: () => {
        setSelectedProject(null);
        setDetailCurrentIndex(0);
        // Set carousel items to final positions
        if (carouselRef.current) {
          const items = carouselRef.current.querySelectorAll(
            `.${styles.carouselItem}`
          );
          items.forEach((item, index) => {
            const positionIndex = index; // -1, 0, 1 for left, center, right
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
        // Fade in projects container
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
      // Initialize project carousel items off-screen
      const carouselItems = carouselRef.current.querySelectorAll(
        `.${styles.carouselItem}`
      );
      gsap.set(carouselItems, { x: 50, opacity: 0 });

      // Fade out detail elements
      timeline
        .to(
          detailCarouselRef.current.querySelectorAll(`.${styles.carouselItem}`),
          {
            opacity: 0,
            x: 50,
            duration: 0.2,
            ease: "power2.in",
          },
          0
        )
        .to(
          descriptionRef.current,
          {
            opacity: 0,
            x: 50,
            duration: 0.2,
            ease: "power2.in",
          },
          0
        )
        .to(
          titleRef.current,
          {
            opacity: 0,
            x: 50,
            duration: 0.2,
            ease: "power2.in",
          },
          0
        )
        .to(
          buttonRef.current,
          {
            opacity: 0,
            x: 50,
            duration: 0.2,
            ease: "power2.in",
          },
          0
        );

      // Stack project carousel items
      carouselItems.forEach((item) => {
        timeline.to(
          item,
          {
            x: 0,
            scaleX: positionStyles.scale,
            scaleY: positionStyles.heightScale,
            opacity: 0.8,
            zIndex: 1,
            duration: 0.5,
            ease: "power2.in",
          },
          0.2 // Start after detail elements fade out
        );
      });
    } else {
      timeline.to(`.${styles.projects}`, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          setSelectedProject(null);
          setDetailCurrentIndex(0);
          if (carouselRef.current) {
            const items = carouselRef.current.querySelectorAll(
              `.${styles.carouselItem}`
            );
            items.forEach((item, index) => {
              const positionIndex = index; // -1, 0, 1 for left, center, right
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
          <TitleSection
            title="PROJECTS"
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
                <h2 ref={titleRef}>
                  {projectsData.projects[selectedProject].title}
                </h2>
                <p ref={descriptionRef} className={styles.generalDescription}>
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
              <button ref={buttonRef} onClick={handleBack}>
                RETURN TO THE PROJECTS
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
