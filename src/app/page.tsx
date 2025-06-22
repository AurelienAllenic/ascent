import Image from "next/image";
import styles from "./page.module.scss";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Numbers from "@/components/Numbers/Numbers";

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
      <About />
      <Numbers />
    </div>
  );
}
