import styles from "./titleSection.module.scss";

export default function TitleSection({ title }: { title: string }) {
  return (
    <div className={styles.titleSectionContainer}>
      <p className={styles.titleSection}>{title}</p>
    </div>
  );
}
