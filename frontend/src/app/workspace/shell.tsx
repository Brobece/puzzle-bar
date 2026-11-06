"use client";
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { StereoMark } from '../site-chrome';
import { useDemo } from './provider';
import { Feedback } from './ui';
import type { Role } from '../../lib/workspace/model';
import { isManager } from '../../lib/workspace/model';
import styles from './workspace.module.css';

const menus = {
  cliente: [['/conta', 'Visão geral'], ['/conta/reservas', 'Minhas reservas'], ['/conta/perfil', 'Meu perfil'], ['/conta/privacidade', 'Dados pessoais']],
  operacao: [['/operacao', 'Resumo do turno'], ['/operacao/reservas', 'Agenda de reservas']],
  gestao: [['/gestao', 'Visão geral'], ['/gestao/produtos', 'Produtos'], ['/gestao/categorias', 'Categorias'], ['/gestao/mesas', 'Ambientes e mesas'], ['/gestao/horarios', 'Funcionamento'], ['/gestao/regras-reserva', 'Regras de reserva'], ['/gestao/equipe', 'Equipe'], ['/gestao/auditoria', 'Histórico de ações'], ['/gestao/configuracoes', 'Configurações']],
};
export function WorkspaceShell({ area, children }: { area: keyof typeof menus; children: ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { state, dispatch } = useDemo();
  const base = area === 'cliente' ? '/conta' : area === 'operacao' ? '/operacao' : '/gestao';
  const currentSection = menus[area].find(([href]) => href !== base && path.startsWith(href))?.[0] ?? base;
  const denied = area !== 'cliente' && (state.role === 'Preparação' || (area === 'gestao' && !isManager(state.role)));
  // Render both navigation variants during SSR and hydration; CSS handles viewport visibility.
  return <div className={styles.workspace}>
    <a className="skip-link" href="#painel">Pular para o conteúdo</a>
    <header className={styles.topbar}><Link className="brand" href="/" aria-label="STEREO, início"><StereoMark/>STEREO</Link><nav aria-label="Áreas da demonstração"><Link href="/conta" aria-current={area === 'cliente' ? 'page' : undefined}>Cliente</Link><Link href="/operacao" aria-current={area === 'operacao' ? 'page' : undefined}>Operação</Link><Link href="/gestao" aria-current={area === 'gestao' ? 'page' : undefined}>Gestão</Link></nav><Link className={styles.siteLink} href="/">Ver site <span aria-hidden="true">↗</span></Link></header>
    <div className={styles.frame}><aside className={styles.sidebar}>
      <p className={styles.sidebarLabel}>{area === 'cliente' ? 'Minha conta' : area === 'operacao' ? 'Atendimento' : 'Administração'}</p>
      <nav aria-label="Navegação do painel">{menus[area].map(([href, label]) => <Link key={href} href={href} aria-current={(href === base ? path === href : path.startsWith(href)) ? 'page' : undefined}><span>{label}</span><span aria-hidden="true">↗</span></Link>)}</nav>
      <label className={styles.mobileNavigation}>Navegar nesta área<select value={currentSection} onChange={event => { if (menus[area].some(([href]) => href === event.target.value)) router.push(event.target.value); }}>{menus[area].map(([href,label]) => <option value={href} key={href}>{label}</option>)}</select></label>
      <div className={styles.identity}><span className={styles.avatar}>{area === 'cliente' ? 'AX' : 'ST'}</span><div><strong>{area === 'cliente' ? state.profile.name : 'Equipe de exemplo'}</strong><small>{area === 'cliente' ? 'Perfil fictício' : 'Papéis simulados'}</small></div></div>
      <Link className={styles.subtleLink} href="/politicas/reservas">Política de reservas</Link>
    </aside>
    <main id="painel" className={styles.main}>
      <div className={styles.demoBar}><p><strong>Demonstração compartilhada</strong><span>Agenda de 05/11/2026 às 18h30 · dados fictícios · alterações apagadas ao recarregar.</span></p>{area !== 'cliente' && <label>Papel simulado<select aria-label="Papel simulado" value={state.role} onChange={event => dispatch({ type: 'role', role: event.target.value as Role })}>{(['Atendimento', 'Gerente', 'Proprietário', 'Preparação'] as Role[]).map(role => <option key={role}>{role}</option>)}</select></label>}<details className={styles.reset}><summary>Reiniciar cenário</summary><div><p>Descarta apenas as alterações desta demonstração.</p><button type="button" className={styles.secondary} onClick={event => { dispatch({ type: 'reset' }); event.currentTarget.closest('details')?.removeAttribute('open'); }}>Confirmar reinício</button></div></details></div>
      <Feedback/>
      {denied ? <div className={styles.empty}><h1>Acesso indisponível neste papel.</h1><p>Gestão exige Gerente ou Proprietário. Preparação não participa da E1. Escolha um papel compatível no seletor para explorar as telas.</p></div> : children}
      <footer className={styles.workspaceFooter}>STEREO · Protótipo da E1 <span>Sem autenticação, envio real ou proteção de acesso. Não informe dados pessoais.</span></footer>
    </main></div>
  </div>;
}
