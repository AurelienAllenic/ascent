import Image from "next/image";
import styles from "./page.module.scss";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Numbers from "@/components/Numbers/Numbers";
import Projects from "@/components/Projects/Projects";
import Contact from "@/components/Contact/Contact";
import SecondNav from "@/components/Second-nav/SecondNav";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <div className={styles.page}>
      <Hero />
      <About />
      <SecondNav />
      <Numbers />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}
