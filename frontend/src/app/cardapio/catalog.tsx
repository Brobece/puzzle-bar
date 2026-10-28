"use client";

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { CatalogProduct, PublicCatalog } from '../../lib/catalog/types';
import styles from './cardapio.module.css';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');

function ProductArtwork({ product }: { product: CatalogProduct }) {
  const image = product.images[0];
  return image ? <Image src={image.storageKey} alt={image.altText} width={480} height={320} className={styles.productImage}/> : <div className={styles.noImage}>Imagem em preparação</div>;
}

export function Catalog({ catalog }: { catalog: PublicCatalog }) {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selected, setSelected] = useState<CatalogProduct | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const query = normalize(search.trim());
  const results = catalog.products.filter(product =>
    (category === 'all' || product.categoryId === category) &&
    (!onlyAvailable || product.available) &&
    (!query || normalize(`${product.name} ${product.description} ${product.category.name}`).includes(query))
  );
  const hasFilters = category !== 'all' || search !== '' || onlyAvailable;

  function resetFilters() { setCategory('all'); setSearch(''); setOnlyAvailable(false); }
  function openProduct(product: CatalogProduct) { setSelected(product); dialog.current?.showModal(); }

  return <section className={styles.catalog} aria-label="Produtos do cardápio">
    <div className={styles.toolbar}>
      <div className={styles.categories} role="group" aria-label="Filtrar por categoria">
        <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>Tudo <span>{catalog.products.length}</span></button>
        {catalog.categories.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.name}<span>{catalog.products.filter(product => product.categoryId === item.id).length}</span></button>)}
      </div>
      <label className={styles.search}><span>Buscar no cardápio</span><div><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Nome ou ingrediente"/></div></label>
    </div>
    <div className={styles.resultBar}><p role="status">{results.length} {results.length === 1 ? 'produto encontrado' : 'produtos encontrados'}</p><div><label className={styles.availableFilter}><input type="checkbox" checked={onlyAvailable} onChange={event => setOnlyAvailable(event.target.checked)}/>Somente disponíveis</label>{hasFilters && <button type="button" className={styles.clear} onClick={resetFilters}>Limpar filtros</button>}</div></div>
    {results.length ? <ul className={styles.grid}>{results.map(product => <li className={styles.card} key={product.id}>
      <div className={`${styles.artwork} ${!product.available ? styles.unavailableArtwork : ''}`}><ProductArtwork product={product}/>{!product.available && <span className={styles.unavailable}>Indisponível no momento</span>}</div>
      <div className={styles.cardBody}><div className={styles.productMeta}><span>{product.category.name}</span>{product.alcoholic && <span>Com álcool</span>}</div><div className={styles.productTitle}><h2>{product.name}</h2><span className={styles.price}>{currency.format(Number(product.price))}</span></div><p className={styles.description}>{product.description}</p><button type="button" className={styles.detailsButton} aria-label={`Ver detalhes de ${product.name}`} onClick={() => openProduct(product)}>Ver detalhes <span aria-hidden="true">↗</span></button></div>
    </li>)}</ul> : <div className={styles.empty}><h2>Nenhum produto por aqui.</h2><p>Tente outro nome ou ingrediente, ou limpe os filtros para ver todo o cardápio.</p><button type="button" className="button button-light" onClick={resetFilters}>Ver todo o cardápio</button></div>}
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="product-name" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className={styles.dialogContent}>
        <form method="dialog" className={styles.dialogClose}><button type="submit" aria-label="Fechar detalhes do produto">×</button></form>
        {selected && <><div className={styles.dialogArtwork}><ProductArtwork product={selected}/></div><div className={styles.dialogBody}><p className={styles.productMeta}>{selected.category.name}{selected.alcoholic && ' / Com álcool'}</p><h2 id="product-name">{selected.name}</h2><p className={styles.dialogPrice}>{currency.format(Number(selected.price))}</p><span className={selected.available ? styles.inStock : styles.outOfStock}>{selected.available ? 'Disponível neste exemplo' : 'Indisponível no momento'}</span><p className={styles.fullDescription}>{selected.description}</p><section className={styles.allergens} aria-label="Informações alimentares"><h3>Alergênicos</h3>{selected.allergens.length ? <ul>{selected.allergens.map(allergen => <li key={`${allergen.id}-${allergen.noticeType}`}><strong>{allergen.noticeType === 'CONTAINS' ? 'Contém' : 'Pode conter'}:</strong> {allergen.name}</li>)}</ul> : <p>Informações de alergênicos não cadastradas neste exemplo. Isso não indica ausência de alergênicos.</p>}</section><p className={styles.dialogNotice}>Produto e informações demonstrativos. Não disponível para pedidos.</p></div></>}
      </div>
    </dialog>
  </section>;
}
