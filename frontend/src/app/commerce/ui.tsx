'use client';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../site-chrome';
import { useCommerce } from './provider';
import { Field } from '../workspace/ui';
import styles from '../workspace/workspace.module.css';
import local from './commerce.module.css';

export function CommerceFeedback() {
  const { state, act } = useCommerce(); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.feedback) ref.current?.focus(); }, [state.feedback]);
  return state.feedback && <div className={styles.feedback} ref={ref} tabIndex={-1} role={state.feedback.error ? 'alert' : 'status'} data-error={state.feedback.error}><p>{state.feedback.text}</p><button aria-label="Fechar mensagem comercial" type="button" onClick={() => act({ type: 'clear' })}>×</button></div>;
}
export function PublicCommerce({ children }: { children: ReactNode }) {
  return <><a className="skip-link" href="#compra">Pular para o conteúdo</a><SiteHeader/><main id="compra" className={local.publicPage}><nav className={local.breadcrumb} aria-label="Navegação da compra"><Link href="/cardapio">Cardápio</Link><Link href="/carrinho">Carrinho</Link><Link href="/conta/pedidos">Meus pedidos</Link></nav><p className={styles.note}>Compra demonstrativa para retirada. Nenhuma cobrança, envio ou reserva real de produtos. Use dados fictícios.</p><CommerceFeedback/>{children}</main><SiteFooter/></>;
}
export function State({ children }: { children: ReactNode }) { return <span className={styles.badge}>{String(children).replaceAll('_', ' ').toLocaleLowerCase('pt-BR')}</span>; }
export function Search({ query, setQuery, state, setState, states }: { query: string; setQuery: (v: string) => void; state?: string; setState?: (v: string) => void; states?: string[] }) {
  return <div className={styles.filters}><Field label="Buscar"><input type="search" value={query} onChange={e => setQuery(e.target.value)}/></Field>{setState && <Field label="Estado"><select value={state} onChange={e => setState(e.target.value)}><option value="">Todos</option>{states?.map(s => <option key={s}>{s}</option>)}</select></Field>}<button type="button" className={styles.secondary} onClick={() => { setQuery(''); setState?.(''); }}>Limpar filtros</button></div>;
}
export function DataTable({ headers, rows, empty = 'Nenhum registro nesta seleção.' }: { headers: string[]; rows: ReactNode[][]; empty?: string }) {
  return rows.length ? <div className={styles.tableWrap}><table className={styles.table}><thead><tr>{headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div> : <p className={styles.note}>{empty}</p>;
}
export const match = (value: string, query: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
