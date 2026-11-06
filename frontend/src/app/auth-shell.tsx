import Link from 'next/link';
import type { ReactNode } from 'react';
import { SiteHeader, SiteFooter, StereoMark } from './site-chrome';
import { AuthForm } from './auth-form';
import styles from './auth.module.css';

export function AuthShell({ mode }: { mode: 'register' | 'login' }) {
  const register = mode === 'register';
  return <AuthFrame
    breadcrumb={register ? 'Cadastro' : 'Entrar'}
    title={register ? <>Entre na nossa<br/>frequência.</> : <>Bom ter você<br/>por aqui.</>}
    description={register ? 'Crie seu ponto de encontro com a casa. Uma conta para solicitar sua mesa e, em breve, acompanhar seus pedidos.' : 'Acesse sua conta para dar o próximo passo no seu encontro com o STEREO.'}
    panelLabel={register ? 'Criar conta' : 'Acessar conta'}
    access={!register}
  ><AuthForm mode={mode}/></AuthFrame>;
}

export function AuthFrame({ breadcrumb, title, description, panelLabel, access = false, children }: {
  breadcrumb: string; title: ReactNode; description: string; panelLabel: string; access?: boolean; children: ReactNode;
}) {
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a><SiteHeader access={access}/>
    <main id="conteudo" className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Caminho da página"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">{breadcrumb}</span></nav>
      <div className={styles.layout}>
        <section className={styles.intro} aria-labelledby="titulo-acesso">
          <h1 id="titulo-acesso">{title}</h1>
          <p>{description}</p>
          <div className={styles.record} aria-hidden="true"><div><StereoMark/><span>STEREO</span><small>Encontros na mesma frequência.</small></div></div>
        </section>
        <section className={styles.panel} aria-label={panelLabel}>
          <div className={styles.notice}><strong>Prévia demonstrativa</strong><p>Use dados fictícios. Sem conta ou sessão real; nada é enviado. Os campos são descartados ao sair.</p></div>
          {children}
          <p className={styles.policyNote}>Reservas dependem da aprovação da equipe. <Link href="/politicas/reservas">Conheça a política de reservas.</Link></p>
          <p className={styles.policyNote}><Link href="/privacidade">Privacidade e uso de dados nesta prévia.</Link></p>
        </section>
      </div>
    </main><SiteFooter/>
  </>;
}
