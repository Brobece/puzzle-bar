import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import styles from "./site-shell.module.css";

const navigation = [
  { label: "Cardápio", href: "/cardapio" },
  { label: "A casa", href: "/sobre" },
  { label: "Programação", href: "/#programacao" },
  { label: "Visite", href: "/visite" },
];

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logoLink}>
          <Wordmark className={styles.wordmark} />
        </Link>

        <nav className={styles.desktopNav} aria-label="Navegação principal">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className={styles.reserveButton} href="/reservas/nova">
          Reservar mesa
        </Link>

        <details className={styles.mobileMenu}>
          <summary aria-label="Abrir menu">
            <span />
            <span />
          </summary>
          <nav aria-label="Navegação para celular">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/reservas/nova">Reservar mesa</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
