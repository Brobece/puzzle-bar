import Link from 'next/link';
import { MobileMenu } from './mobile-menu';

export function StereoMark() {
  return <span className="stereo-mark" aria-hidden="true"><i/><i/><i/><i/><i/></span>;
}

export function SiteHeader({ about = false, menu = false, visit = false, reserve = false, access = false }: { about?: boolean; menu?: boolean; visit?: boolean; reserve?: boolean; access?: boolean }) {
  return <header className="site-header">
    <Link className="brand" href="/" aria-label="STEREO, início"><StereoMark/>STEREO</Link>
    <nav className="desktop-nav" aria-label="Navegação principal">
      <Link href="/sobre" aria-current={about ? 'page' : undefined}>Sobre</Link>
      <Link href="/visite" aria-current={visit ? 'page' : undefined}>Visite</Link>
      <Link href="/cardapio" aria-current={menu ? 'page' : undefined}>Cardápio</Link>
      <Link href="/#agenda">Convidados</Link>
      <Link href="/entrar" aria-current={access ? 'page' : undefined}>Entrar</Link>
    </nav>
    <Link className="button button-outline header-visit" href="/reservas/nova" aria-current={reserve ? 'page' : undefined}>Reservar mesa <span aria-hidden="true">↗</span></Link>
    <MobileMenu about={about} menu={menu} visit={visit} reserve={reserve} access={access}/>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <Link className="brand" href="/" aria-label="STEREO, início"><StereoMark/>STEREO</Link>
    <p>Eletrohits, encontros e bons momentos.</p>
    <nav className="footer-links" aria-label="Links úteis"><Link href="/politicas/reservas">Política de reservas</Link><Link href="/privacidade">Privacidade</Link><Link href="/politicas/compras">Condições de compra</Link><Link href="/carrinho">Carrinho</Link><Link href="/conta">Explorar minha conta</Link></nav>
    <span>Feito para Aracaju.</span>
  </footer>;
}
