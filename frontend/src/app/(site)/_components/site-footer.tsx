import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import styles from "./site-shell.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerMain}>
        <Wordmark className={styles.footerWordmark} />
        <p>Boa bebida. Boa comida. Melhor companhia.</p>

        <div className={styles.footerLinks}>
          <div>
            <strong>Encontre sua mesa</strong>
            <Link href="/reservas/nova">Reservar</Link>
            <Link href="/cardapio">Ver cardápio</Link>
            <Link href="/visite">Como chegar</Link>
          </div>
          <div>
            <strong>Fale com a casa</strong>
            <a href="tel:+5500000000000">(00) 00000-0000</a>
            <a href="mailto:hello@thepuzzle.pub">hello@thepuzzle.pub</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <span>© 2026 The Puzzle Public House</span>
        <div>
          <Link href="/privacidade">Privacidade</Link>
          <Link href="/politicas/reservas">Política de reservas</Link>
        </div>
      </div>
    </footer>
  );
}
