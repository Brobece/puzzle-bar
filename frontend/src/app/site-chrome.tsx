import Link from 'next/link';
import { MobileMenu } from './mobile-menu';

export function StereoMark() {
  return <span className="stereo-mark" aria-hidden="true"><i/><i/><i/><i/><i/></span>;
}

export function SiteHeader({ about = false, menu = false, visit = false, reserve = false }: { about?: boolean; menu?: boolean; visit?: boolean; reserve?: boolean }) {
  return <header className="site-header">
    <Link className="brand" href="/" aria-label="STEREO, início"><StereoMark/>STEREO</Link>
    <nav className="desktop-nav" aria-label="Navegação principal">
      <Link href="/sobre" aria-current={about ? 'page' : undefined}>Sobre</Link>
      <Link href="/visite" aria-current={visit ? 'page' : undefined}>Visite</Link>
      <Link href="/cardapio" aria-current={menu ? 'page' : undefined}>Cardápio</Link>
      <Link href="/#agenda">Convidados</Link>
    </nav>
    <Link className="button button-outline header-visit" href="/reservas/nova" aria-current={reserve ? 'page' : undefined}>Reservar mesa <span aria-hidden="true">↗</span></Link>
    <MobileMenu about={about} menu={menu} visit={visit} reserve={reserve}/>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <Link className="brand" href="/" aria-label="STEREO, início"><StereoMark/>STEREO</Link>
    <p>Eletrohits, encontros e bons momentos.</p>
    <span>Feito para Aracaju.</span>
  </footer>;
}
