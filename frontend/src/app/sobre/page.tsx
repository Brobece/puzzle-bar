import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { SiteHeader, SiteFooter, StereoMark } from '../site-chrome';
import styles from './sobre.module.css';

export const metadata: Metadata = {
  title: 'Sobre o STEREO — Um bar na frequência de Aracaju',
  description: 'Conheça a ideia por trás do STEREO: um bar em Aracaju onde eletrohits, conversas e encontros dividem a mesma mesa. Abertura em breve.',
};

export default function AboutPage() {
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader about/>
    <main id="conteudo" className={styles.page}>
      <section className={styles.intro} aria-labelledby="sobre-title">
        <nav className={styles.breadcrumb} aria-label="Caminho da página"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Sobre</span></nav>
        <div className={styles.introGrid}>
          <div><p className={styles.eyebrow}>Sobre o STEREO</p><h1 id="sobre-title">O som aproxima.<br/>A mesa reúne.</h1><p className={styles.introText}>Um bar que nasce em Aracaju para quem sente falta de um lugar onde a música e a conversa combinam.</p></div>
          <div className={styles.discArtwork} aria-hidden="true"><div className={styles.discLabel}><span>STEREO</span><StereoMark/><small>Aracaju, no nosso ritmo.</small></div></div>
        </div>
      </section>

      <figure className={styles.venue}>
        <div className={styles.venueImage}><Image src="/images/stereo-interior.webp" alt="Proposta visual do STEREO: um bar amplo com mesas, balcão e luz violeta, pensado para encontros e música ambiente" fill priority sizes="(max-width: 700px) 88vw, 92vw"/><div className={styles.photoShade}/><p>Seu lugar entre<br/>uma música e outra.</p></div>
        <figcaption><span>É esse clima que a gente imagina.</span><span>Imagem conceitual. O espaço está em planejamento.</span></figcaption>
      </figure>

      <section className={styles.origin} aria-labelledby="origin-title">
        <div><p className={styles.eyebrow}>De onde vem a ideia</p><h2 id="origin-title">Faltava um lugar.<br/>Nasceu uma vontade.</h2></div>
        <div className={styles.prose}><p className={styles.lead}>Sair, ouvir eletrônica e ter uma mesa para chamar de ponto de encontro.</p><p>O STEREO parte dessa vontade: ampliar os espaços para quem gosta de música eletrônica em Aracaju. Um bar relativamente grande, com espaço para reunir os amigos e aproveitar a noite no próprio ritmo.</p><p>A ideia é simples. Você chega pelo som, encontra uma boa companhia e percebe que dá para ficar mais um pouco. A música acompanha a noite, e o encontro faz ela acontecer.</p></div>
      </section>

      <section className={styles.frequency} aria-labelledby="frequency-title">
        <div className={styles.frequencyTitle}><StereoMark/><h2 id="frequency-title">A nossa frequência<br/>é feita de encontros.</h2><p>Tem música que traz uma lembrança.<br/>Tem noite que vira uma.</p></div>
        <div className={styles.principles}>
          <article><h3>Eletrohits no dia a dia.</h3><p>Aproximadamente 85% do som ambiente será de eletrohits. Aqueles refrões conhecidos e batidas que acompanham o papo e dão vontade de cantar junto.</p></article>
          <article><h3>Espaço para ficar à vontade.</h3><p>A proposta é uma casa ampla, com mesas, balcão e espaço para estar junto. Um lugar para brindar, dividir alguma coisa e deixar a conversa render.</p></article>
          <article><h3>Novas seleções, algumas noites.</h3><p>Em ocasiões especiais, como nos fins de semana, DJs convidados trazem outras referências para a casa. A programação será divulgada quando estiver definida.</p></article>
        </div>
      </section>

      <section className={styles.city} aria-labelledby="city-title"><p className={styles.eyebrow}>Daqui, para se encontrar aqui.</p><h2 id="city-title">Aracaju no endereço.<br/>Eletrohits na memória.</h2><p>O STEREO ainda está tomando forma. O que já tem lugar certo é a vontade de fazer parte das noites de Aracaju.</p><div className={styles.cityActions}><Link className="button button-light" href="/#som">Conheça o som da casa <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/#agenda">Sobre os convidados <span aria-hidden="true">↗</span></Link></div></section>

      <section className={styles.invitation} aria-labelledby="invitation-title"><span className={styles.opening}>Abertura em breve</span><h2 id="invitation-title">A próxima boa noite<br/>começa com um encontro.</h2><p>Estamos preparando a casa. Endereço, horários e reservas<br className={styles.desktopBreak}/> serão divulgados por aqui quando estiver tudo pronto.</p><Link className={styles.returnLink} href="/">Voltar para o início <span aria-hidden="true">↗</span></Link></section>
    </main>
    <SiteFooter/>
  </>;
}
