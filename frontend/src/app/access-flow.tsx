'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import Link from 'next/link';
import type { DemoLinkCase } from '../lib/access-demo';
import styles from './auth.module.css';

function Result({ title, children }: { title: string; children: ReactNode }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <div className={styles.result}><h2 ref={heading} tabIndex={-1}>{title}</h2>{children}</div>;
}

function PreviewLinks({ verification }: { verification: boolean }) {
  const route = verification ? '/verificar-email' : '/redefinir-senha';
  return <details className={styles.preview}>
    <summary>Experimentar os estados desta tela</summary>
    <p>Links fictícios para revisar a interface. Não confirmam contas nem permitem alterar senhas reais.</p>
    <ul>{([['valido', 'Link válido'], ['expirado', 'Link expirado'], ['usado', 'Link já utilizado'], ['invalido', 'Link inválido']] as const).map(([value, label]) => <li key={value}><Link href={`${route}?exemplo=${value}`}>{label}</Link></li>)}</ul>
  </details>;
}

function EmailRequest({ verification = false }: { verification?: boolean }) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [requested, setRequested] = useState(false);
  const [coolingDown, setCoolingDown] = useState(false);
  const [sent, setSent] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const status = useRef<HTMLParagraphElement>(null);

  // Local fixture only. The server will define and enforce the actual sending limit.
  useEffect(() => {
    if (!coolingDown) return;
    const timer = setTimeout(() => setCoolingDown(false), 30_000);
    return () => clearTimeout(timer);
  }, [coolingDown]);
  useEffect(() => { if (sent) status.current?.focus(); }, [sent]);

  function send() {
    if (coolingDown) return;
    setRequested(true); setEmail(''); setCoolingDown(true); setSent(previous => previous + 1);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.trim().length > 254) {
      setError('Informe um e-mail válido, como cliente@stereo.example.'); input.current?.focus(); return;
    }
    setError(''); send();
  }

  return <>
    {requested ? <div className={styles.result}>
      <h2>Solicitação simulada.</h2>
      <p ref={status} tabIndex={-1} role="status">{verification ? 'Se houver uma conta que precise de confirmação para esse e-mail, as instruções serão enviadas no fluxo definitivo.' : 'Se houver uma conta para esse e-mail, as instruções de recuperação serão enviadas no fluxo definitivo.'}</p>
      <div className={styles.resultNote}>Nenhum e-mail foi enviado. O endereço preenchido foi descartado. Use o link fictício abaixo para continuar a demonstração.</div>
      <Link className={styles.submit} href={`${verification ? '/verificar-email' : '/redefinir-senha'}?exemplo=valido`}>{verification ? 'Abrir confirmação de exemplo' : 'Abrir redefinição de exemplo'}</Link>
      <div className={styles.requestActions}>
        <button type="button" className={styles.textButton} disabled={coolingDown} onClick={send}>Simular novo envio</button>
        <button type="button" className={styles.textButton} onClick={() => { setRequested(false); setError(''); }}>Usar outro e-mail</button>
      </div>
    </div> : <>
      <div className={styles.formHeading}><h2>{verification ? 'Receber outro link.' : 'Recupere seu acesso.'}</h2><p>{verification ? 'Informe o e-mail do cadastro para experimentar o reenvio.' : 'Informe seu e-mail para começar a recuperação.'}</p></div>
      <button type="button" className={styles.exampleButton} onClick={() => { setEmail('cliente@stereo.example'); setError(''); }}>Preencher com e-mail de exemplo</button>
      <form className={styles.form} onSubmit={submit} noValidate>
        <div><label htmlFor={id}>E-mail</label><input ref={input} id={id} name="email" type="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} required maxLength={254} value={email} onChange={event => { setEmail(event.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`}/><p className={styles.hint} id={`${id}-hint`}>Use um endereço fictício nesta prévia.</p>{error && <p id={`${id}-error`} className={styles.error}>{error}</p>}</div>
        <button type="submit" className={styles.submit} disabled={coolingDown}>{verification ? 'Simular reenvio de confirmação' : 'Simular recuperação'}</button>
      </form>
    </>}
    {coolingDown && <p className={styles.hint}>Novo envio disponível após uma pausa de 30 segundos neste exemplo. O limite real será definido na integração.</p>}
    <div className={styles.flowLinks}><Link href="/entrar">Voltar para entrar</Link>{verification && <Link href="/cadastro">Voltar ao cadastro</Link>}</div>
  </>;
}

const linkMessages = {
  expirado: ['Este link expirou.', 'Solicite outro link para continuar.'],
  usado: ['Este link já foi utilizado.', 'Se você já concluiu esta etapa, entre na sua conta. Se precisar, solicite outro link.'],
  invalido: ['Este link não é válido.', 'Confira o link recebido ou solicite outro para continuar.'],
} as const;

export function VerificationFlow({ linkCase }: { linkCase: DemoLinkCase }) {
  const [confirmed, setConfirmed] = useState(false);
  if (confirmed) return <Result title="Confirmação simulada."><p>Você chegou ao fim da confirmação de e-mail de exemplo.</p><div className={styles.resultNote}>Nenhuma conta foi confirmada. A entrada continua usando apenas as credenciais fictícias da demonstração.</div><Link className={styles.submit} href="/entrar">Experimentar o acesso</Link></Result>;
  return <>
    {linkCase === 'valido' ? <>
      <div className={styles.formHeading}><h2>Seu link está pronto.</h2><p>Este link fictício permite experimentar a confirmação do e-mail. Nenhuma conta real será alterada.</p></div>
      <button className={styles.submit} type="button" onClick={() => setConfirmed(true)}>Simular confirmação de e-mail</button>
      <div className={styles.flowLinks}><Link href="/entrar">Voltar para entrar</Link></div>
    </> : <>
      {linkCase === 'ausente' ? <p className={styles.flowIntro}>Após o cadastro, você confirmará seu endereço pelo link recebido por e-mail. Nesta prévia, experimente o reenvio abaixo.</p> : <div className={styles.linkNotice}><h2>{linkMessages[linkCase][0]}</h2><p>{linkMessages[linkCase][1]}</p></div>}
      <EmailRequest verification/>
    </>}
    <PreviewLinks verification/>
  </>;
}

export function RecoveryFlow() {
  return <><EmailRequest/><PreviewLinks verification={false}/></>;
}

export function ResetFlow({ linkCase }: { linkCase: DemoLinkCase }) {
  const id = useId();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmation?: string }>({});
  const [done, setDone] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: typeof errors = {};
    if (password.length < 12 || password.length > 128) next.password = 'Use de 12 a 128 caracteres. Espaços são permitidos.';
    if (!confirmation || confirmation !== password) next.confirmation = 'Repita a nova senha. As senhas precisam ser iguais.';
    setErrors(next);
    if (Object.keys(next).length) {
      (form.current?.elements.namedItem(Object.keys(next)[0]) as HTMLInputElement | null)?.focus(); return;
    }
    setPassword(''); setConfirmation(''); setVisible(false); setDone(true);
  }

  if (done) return <Result title="Redefinição simulada."><p>A nova senha passou pela validação local e foi descartada.</p><div className={styles.resultNote}>Nenhuma senha ou sessão foi alterada. Para experimentar a entrada, continue usando a conta e a senha de exemplo publicadas na tela de acesso.</div><Link className={styles.submit} href="/entrar">Voltar para entrar</Link></Result>;
  return <>
    {linkCase === 'valido' ? <>
      <div className={styles.formHeading}><h2>Escolha uma nova senha.</h2><p>Use uma senha fictícia. Você pode colar ou usar um gerenciador de senhas.</p></div>
      <form ref={form} className={styles.form} onSubmit={submit} noValidate>
        <div><label htmlFor={`${id}-password`}>Nova senha</label><div className={styles.password}><input id={`${id}-password`} name="password" type={visible ? 'text' : 'password'} autoComplete="new-password" required minLength={12} maxLength={128} value={password} onChange={event => { setPassword(event.target.value); setErrors(previous => ({ ...previous, password: undefined })); }} aria-invalid={!!errors.password} aria-describedby={`${id}-hint${errors.password ? ` ${id}-password-error` : ''}`}/><button type="button" aria-label={visible ? 'Ocultar senhas' : 'Mostrar senhas'} aria-controls={`${id}-password ${id}-confirmation`} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? 'Ocultar' : 'Mostrar'}</button></div><p id={`${id}-hint`} className={styles.hint}>De 12 a 128 caracteres, sem regras de composição. Espaços são permitidos.</p>{errors.password && <p id={`${id}-password-error`} className={styles.error}>{errors.password}</p>}</div>
        <div><label htmlFor={`${id}-confirmation`}>Confirmar nova senha</label><input id={`${id}-confirmation`} name="confirmation" type={visible ? 'text' : 'password'} autoComplete="new-password" required minLength={12} maxLength={128} value={confirmation} onChange={event => { setConfirmation(event.target.value); setErrors(previous => ({ ...previous, confirmation: undefined })); }} aria-invalid={!!errors.confirmation} aria-describedby={errors.confirmation ? `${id}-confirmation-error` : undefined}/>{errors.confirmation && <p id={`${id}-confirmation-error`} className={styles.error}>{errors.confirmation}</p>}</div>
        <button type="submit" className={styles.submit}>Simular redefinição de senha</button>
      </form>
      <div className={styles.flowLinks}><Link href="/recuperar-senha">Solicitar outro link</Link><Link href="/entrar">Voltar para entrar</Link></div>
    </> : <div className={styles.linkNotice}><h2>{linkCase === 'ausente' ? 'Você precisa de um link.' : linkMessages[linkCase][0]}</h2><p>{linkCase === 'ausente' ? 'Comece pela recuperação para receber as instruções. Nesta prévia, você poderá abrir um link fictício.' : linkMessages[linkCase][1]}</p><Link className={styles.submit} href="/recuperar-senha">Solicitar novo link</Link><div className={styles.flowLinks}><Link href="/entrar">Voltar para entrar</Link></div></div>}
    <PreviewLinks verification={false}/>
  </>;
}
