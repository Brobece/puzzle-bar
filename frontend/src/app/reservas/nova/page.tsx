import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../../site-chrome';
import { ReservationForm } from './reservation-form';
import styles from './reservas.module.css';

export const metadata: Metadata = { title: 'Reservar mesa — STEREO', description: 'Experimente a solicitação demonstrativa de mesa no STEREO. Consulte a disponibilidade e acompanhe a aprovação da equipe.' };
export default function ReservationPage() {
  return <><a className="skip-link" href="#conteudo">Pular para o conteúdo</a><SiteHeader reserve/>
    <main id="conteudo" className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Caminho da página"><Link href="/">Início</Link><span aria-hidden="true">/</span><Link href="/visite">Visite</Link><span aria-hidden="true">/</span><span aria-current="page">Reservar mesa</span></nav>
      <header className={styles.intro}><p>Tem lugar para o seu encontro.</p><h1>Escolha a noite.<br/>Reúna sua turma.</h1><p>Consulte as opções e envie sua solicitação.<br/>A equipe aprova antes de confirmar a mesa.</p></header>
      <div className={styles.notice}><strong>Modo de demonstração.</strong> Sem conta real ou envio para o bar. Os dados ficam apenas nesta página e são apagados ao recarregar.</div>
      <ReservationForm/>
    </main><SiteFooter/></>;
}
