import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicCatalog, getPublicProduct } from '../../../lib/catalog/catalog';
import { SiteHeader, SiteFooter } from '../../site-chrome';
import { ProductPurchase } from '../../commerce/shop';
import { CommerceFeedback } from '../../commerce/ui';
import styles from './produto.module.css';

type Props = { params: Promise<{ slug: string }> };
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export function generateStaticParams() {
  return getPublicCatalog().products.map(product => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getPublicProduct((await params).slug);
  if (!product) notFound();
  return {
    title: `${product.name} — Cardápio STEREO`,
    description: `Prévia demonstrativa: ${product.description}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = getPublicProduct((await params).slug);
  if (!product) notFound();
  const related = getPublicCatalog().products
    .filter(item => item.categoryId === product.categoryId && item.id !== product.id)
    .slice(0, 3);

  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader menu/>
    <main id="conteudo" className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Caminho da página">
        <Link href="/">Início</Link><span aria-hidden="true">/</span>
        <Link href="/cardapio">Cardápio</Link><span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <article className={styles.product}>
        <div className={styles.gallery}>
          {product.images.length ? product.images.map((image, index) => <figure className={styles.artwork} key={image.id}>
            <Image src={image.storageKey} alt={image.altText} width={720} height={480} sizes="(max-width: 800px) 88vw, 46vw" preload={index === 0}/>
            <figcaption>Ilustração demonstrativa</figcaption>
          </figure>) : <div className={styles.noImage}>Imagem em preparação</div>}
          <p className={styles.imageNote}>Uma prévia do que pode chegar à sua mesa.</p>
        </div>
        <div className={styles.details}>
          <p className={styles.eyebrow}>No balcão e na mesa <span aria-hidden="true">/</span> {product.category.name}</p>
          <h1>{product.name}</h1>
          <div className={styles.tags}>
            <span className={product.available ? styles.available : styles.unavailable}>{product.available ? 'Disponível neste exemplo' : 'Indisponível no momento'}</span>
            {product.alcoholic && <span>Com álcool</span>}
          </div>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.priceBlock}><p className={styles.price}>{currency.format(Number(product.price))}</p><span>Preço demonstrativo</span></div>
          <CommerceFeedback/><ProductPurchase productId={product.id}/><section className={styles.allergens} aria-labelledby="alergenicos">
            <h2 id="alergenicos">Informações alimentares</h2>
            {product.allergens.length ? <ul>{product.allergens.map(allergen => <li key={`${allergen.id}-${allergen.noticeType}`}><strong>{allergen.noticeType === 'CONTAINS' ? 'Contém' : 'Pode conter'}:</strong> {allergen.name}</li>)}</ul> : <p>Informações de alergênicos não cadastradas neste exemplo. Isso não indica ausência de alergênicos.</p>}
          </section>
          <aside className={styles.notice} aria-label="Cardápio demonstrativo"><strong>Por enquanto, é só um gostinho.</strong><p>Produto, preço, receita e informações alimentares são fictícios. A seleção final da casa será anunciada em breve. Compras podem ser experimentadas no cenário demonstrativo, sem cobrança ou envio real.</p></aside>
          <Link className="text-link" href="/cardapio"><span aria-hidden="true">←</span> Voltar ao cardápio</Link>
        </div>
      </article>
      {related.length > 0 && <section className={styles.related} aria-labelledby="mais-na-categoria">
        <div className={styles.relatedHeading}><div><p className={styles.eyebrow}>Continue explorando</p><h2 id="mais-na-categoria">Mais em {product.category.name.toLocaleLowerCase('pt-BR')}.</h2></div><Link className="text-link" href="/cardapio">Ver todo o cardápio <span aria-hidden="true">↗</span></Link></div>
        <ul className={styles.relatedGrid}>{related.map(item => <li key={item.id}><Link className={styles.relatedCard} href={`/cardapio/${item.slug}`}>
          {item.images[0] ? <Image src={item.images[0].storageKey} alt={item.images[0].altText} width={480} height={320} sizes="(max-width: 600px) 86vw, 28vw"/> : <div className={styles.noImage}>Imagem em preparação</div>}
          <div className={styles.relatedBody}><h3>{item.name} <span aria-hidden="true">↗</span></h3><p>{currency.format(Number(item.price))}</p>{!item.available && <span className={styles.unavailable}>Indisponível no momento</span>}</div>
        </Link></li>)}</ul>
      </section>}
    </main>
    <SiteFooter/>
  </>;
}
