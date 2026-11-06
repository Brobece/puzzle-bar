import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../../site-chrome';
import styles from './produto.module.css';

export default function ProductNotFound() {
  return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><SiteHeader menu/>
    <main id="conteudo" className={styles.page}><div className={styles.notFound}>
      <p className={styles.eyebrow}>Cardápio / 404</p>
      <h1>Esse sabor não está por aqui.</h1>
      <p>Não encontramos este produto no cardápio público. Explore a seleção demonstrativa da casa.</p>
      <Link className="button button-light" href="/cardapio">Voltar ao cardápio <span aria-hidden="true">↗</span></Link>
    </div></main><SiteFooter/></>;
}
