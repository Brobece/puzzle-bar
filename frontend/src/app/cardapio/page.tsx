import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../site-chrome';
import { getPublicCatalog } from '../../lib/catalog/catalog';
import { Catalog } from './catalog';
import styles from './cardapio.module.css';

export const metadata: Metadata = {
  title: 'Cardápio — STEREO',
  description: 'Explore o cardápio demonstrativo do STEREO: drinks, cervejas, porções para dividir e opções sem álcool.',
};

export default function MenuPage() {
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader menu/>
    <main id="conteudo" className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Caminho da página"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Cardápio</span></nav>
      <header className={styles.intro}><div><p className={styles.eyebrow}>No balcão e na mesa</p><h1>O som pede<br/>um brinde.</h1></div><p>Um drink para começar.<br/>Uma porção para dividir.<br/>E tempo para mais uma música.</p></header>
      <div className={styles.demoNotice}><span className={styles.demoSymbol} aria-hidden="true">✳</span><p><strong>Uma prévia do nosso cardápio.</strong> Produtos, preços, ilustrações e informações alimentares são fictícios. Estamos preparando a seleção da casa.</p></div>
      <Catalog catalog={getPublicCatalog()}/>
      <aside className={styles.endnote}><h2>Por enquanto, é só um gostinho.</h2><p>A casa está em preparação. O cardápio final e os pedidos serão disponibilizados em outra etapa.</p><Link className="text-link" href="/sobre">Conheça a ideia do STEREO <span aria-hidden="true">↗</span></Link></aside>
    </main>
    <SiteFooter/>
  </>;
}
