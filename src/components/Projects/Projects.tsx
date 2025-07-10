"use client";

import React, { useState } from "react";
import styles from "./projects.module.scss";
import projectsData from "./projects.json";
import TitleSection from "../TitleSection/TitleSection";

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedProject(index);
  };

  const handleBack = () => {
    setSelectedProject(null);
  };

  return (
    <div className={styles.projectsContainer}>
      <div className={styles.containerTitleSection}>
        <TitleSection title="PROJECTS" />
      </div>
      <div className={styles.projects}>
        {selectedProject === null ? (
          <>
            <div className={styles.carousel}>
              {projectsData.projects.map((project, index) => (
                <div
                  key={index}
                  className={styles.carouselItem}
                  onClick={() => handleImageClick(index)}
                >
                  <img src={project.featuredImage} alt={project.title} />
                </div>
              ))}
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
