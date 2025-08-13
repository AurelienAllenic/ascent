"use client";

import { useAuth } from "@/app/context/AuthContext";
import styles from "./userBar.module.scss";

export default function UserBar() {
  const { logout } = useAuth();

  return (
    <div className={styles.userBar}>
      <p className={styles.userBarText}>Vous êtes connecté !</p>
      <button className={styles.userBarLogout} onClick={logout}>Se déconnecter</button>
    </div>
  );
}
