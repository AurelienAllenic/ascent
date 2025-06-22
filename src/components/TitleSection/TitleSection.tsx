import styles from "./titleSection.module.scss";

export default function TitleSection({
  title,
  color,
}: {
  title: string;
  color?: string;
}) {
  const titleClasses = `${styles.titleSection} ${
    color === "white" ? styles.titleSectionWhite : ""
  }`;

  return (
    <div className={styles.titleSectionContainer}>
      <p className={titleClasses}>{title}</p>
    </div>
  );
}
