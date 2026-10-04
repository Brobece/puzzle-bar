import Link from "next/link";
import { events, menuHighlights, weeklyHours } from "@/data/home";
import styles from "./home.module.css";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" />
      <path d="M12 7v5l3.5 2" fill="none" stroke="currentColor" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <p className={styles.heroKicker}>O pub onde a cidade se encontra.</p>
            <h1 id="hero-title">
              Sua mesa.
              <br />
              <span>Boas histórias.</span>
            </h1>
            <p className={styles.heroText}>
              Cerveja bem tirada, comida honesta e música na medida. O resto da
              noite a gente descobre junto.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/reservas/nova">
                Reservar uma mesa
                <ArrowIcon />
              </Link>
              <Link className={styles.textLink} href="/cardapio">
                Ver o cardápio
              </Link>
            </div>
          </div>

          <div className={styles.signStage} aria-label="The Puzzle Public House">
            <div className={styles.signArm} aria-hidden="true" />
            <div className={styles.signChain} aria-hidden="true" />
            <div className={styles.pubSign}>
              <span className={styles.signTop}>The</span>
              <strong>Puzzle</strong>
              <span className={styles.signDivider} />
              <span className={styles.signBottom}>Public House</span>
              <span className={styles.signSince}>Est. soon</span>
            </div>
            <div className={styles.openNote}>
              <ClockIcon />
              <span>
                Hoje
                <strong>18h — 00h</strong>
              </span>
            </div>
          </div>
        </div>

        <div className={styles.heroFooter}>
          <span>No dress code. Just good taste.</span>
          <a href="#a-casa" aria-label="Conheça a casa">
            <span />
          </a>
        </div>
      </section>

      <div className={styles.runningLine} aria-hidden="true">
        <span>Good drinks</span>
        <i />
        <span>Better company</span>
        <i />
        <span>Stay for the story</span>
        <i />
        <span>Find your table</span>
      </div>

      <section className={styles.manifesto} id="a-casa">
        <div className={styles.sectionIndex}>A casa</div>
        <div className={styles.manifestoCopy}>
          <h2>Um lugar para voltar antes mesmo de ir embora.</h2>
          <p>
            O The Puzzle nasceu para ser mais do que um lugar para beber. É uma
            mesa para encontrar os amigos, uma boa música tocando ao fundo e
            aquela sensação de que não existe motivo para encerrar a conversa
            tão cedo.
          </p>
          <Link className={styles.inlineLink} href="/sobre">
            Conheça a nossa história
            <ArrowIcon />
          </Link>
        </div>
        <blockquote>
          “Inspirado pelos pubs ingleses e alemães. Feito com hospitalidade
          brasileira.”
        </blockquote>
      </section>

      <section className={styles.menuSection} id="destaques">
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.sectionIndex}>Favoritos da casa</span>
            <h2>Vale pedir outra rodada.</h2>
          </div>
          <Link className={styles.inlineLink} href="/cardapio">
            Cardápio completo
            <ArrowIcon />
          </Link>
        </div>

        <div className={styles.menuGrid}>
          {menuHighlights.map((item, index) => (
            <article className={styles.menuItem} key={item.name}>
              <div
                className={`${styles.menuVisual} ${styles[item.tone]}`}
                aria-hidden="true"
              >
                <span className={styles.visualNumber}>0{index + 1}</span>
                <div className={styles.plate} />
                <div className={styles.glass} />
              </div>
              <div className={styles.menuItemCopy}>
                <span>{item.note}</span>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.tonight} id="programacao">
        <div className={styles.tonightIntro}>
          <span className={styles.sectionIndex}>Nesta semana</span>
          <h2>A trilha muda. A conversa continua.</h2>
          <p>
            Programação sem palco demais: quiz, discos e encontros que combinam
            com uma mesa cheia.
          </p>
        </div>

        <div className={styles.eventList}>
          {events.map((event) => (
            <article key={event.title}>
              <time>
                <span>{event.day}</span>
                <strong>{event.date}</strong>
              </time>
              <div>
                <h3>{event.title}</h3>
                <p>{event.detail}</p>
              </div>
              <Link href="/reservas/nova" aria-label={`Reservar para ${event.title}`}>
                <ArrowIcon />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.visitSection}>
        <div className={styles.hoursPanel}>
          <span className={styles.sectionIndex}>Quando a porta abre</span>
          <h2>Chegue cedo. Fique à vontade.</h2>
          <div className={styles.hoursList}>
            {weeklyHours.map((item) => (
              <div key={item.days}>
                <span>{item.days}</span>
                <strong>{item.hours}</strong>
              </div>
            ))}
          </div>
          <Link className={styles.inlineLink} href="/visite">
            Endereço e como chegar
            <ArrowIcon />
          </Link>
        </div>

        <div className={styles.addressPanel}>
          <div className={styles.mapMark} aria-hidden="true">
            <span>TP</span>
          </div>
          <p>Rua das Conversas, 42</p>
          <strong>Centro · sua cidade</strong>
          <small>Endereço ilustrativo para o protótipo</small>
        </div>
      </section>

      <section className={styles.finalCta}>
        <p>No dress code. Just good taste.</p>
        <h2>Escolha sua mesa.<br />A gente cuida do resto.</h2>
        <div>
          <Link className={styles.lightButton} href="/reservas/nova">
            Quero reservar
            <ArrowIcon />
          </Link>
          <Link className={styles.darkButton} href="/cardapio">
            Pedir para retirar
            <ArrowIcon />
          </Link>
        </div>
      </section>
    </main>
  );
}
