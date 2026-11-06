"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import type { FormEvent } from 'react';
import styles from './auth.module.css';

const example = { name: 'Alex Exemplo', email: 'cliente@stereo.example', phone: '', password: 'encontro-stereo' };
type Field = 'name' | 'email' | 'phone' | 'password' | 'confirmation';
type Values = Record<Field, string>;
const empty: Values = { name: '', email: '', phone: '', password: '', confirmation: '' };

export function AuthForm({ mode }: { mode: 'register' | 'login' }) {
  const register = mode === 'register';
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const result = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLParagraphElement>(null);

  useEffect(() => { if (success) result.current?.focus(); }, [success]);
  useEffect(() => { if (message) feedback.current?.focus(); }, [message]);

  function update(field: Field, value: string) {
    setValues(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    setMessage('');
  }
  function fillExample() {
    setValues({ ...example, confirmation: example.password }); setErrors({}); setMessage('');
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Partial<Record<Field, string>> = {};
    const email = values.email.trim();
    if (register && (values.name.trim().length < 2 || values.name.trim().length > 120)) next.name = 'Informe um nome entre 2 e 120 caracteres.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) next.email = 'Informe um e-mail válido, como cliente@stereo.example.';
    const digits = values.phone.replace(/\D/g, '');
    if (register && values.phone.trim() && (!/^\+?[\d\s().-]+$/.test(values.phone.trim()) || digits.length < 10 || digits.length > 15)) next.phone = 'Informe um telefone com DDD, incluindo o país se necessário (10 a 15 dígitos).';
    if (register ? values.password.length < 12 || values.password.length > 128 : !values.password || values.password.length > 128) next.password = register ? 'Use de 12 a 128 caracteres. Espaços são permitidos.' : 'Informe sua senha (até 128 caracteres).';
    if (register && values.confirmation !== values.password) next.confirmation = 'As senhas precisam ser iguais.';
    setErrors(next);
    if (Object.keys(next).length) {
      const field = Object.keys(next)[0] as Field;
      const control = form.current?.elements.namedItem(field);
      if (control instanceof HTMLInputElement) control.focus();
      return;
    }
    if (!register && (email.toLowerCase() !== example.email || values.password !== example.password)) {
      setMessage('E-mail ou senha não correspondem à conta de demonstração. Use os dados de exemplo para experimentar.');
      return;
    }
    setValues(empty); setVisible(false); setSuccess(true);
  }

  if (success) return <div className={styles.result}>
    <span className={styles.resultSymbol} aria-hidden="true">✳</span>
    <h2 ref={result} tabIndex={-1}>{register ? 'Tudo pronto para o próximo passo.' : 'Você está na frequência.'}</h2>
    <p>{register ? 'Os campos passaram pela validação local. No fluxo definitivo, a conta será criada e você receberá um e-mail para confirmar seu endereço.' : 'Os dados da conta de exemplo foram reconhecidos. Este resultado simula a entrada, sem criar uma sessão autenticada.'}</p>
    <div className={styles.resultNote}>{register ? 'Nenhuma conta foi criada e nenhum e-mail foi enviado. Os dados preenchidos foram descartados.' : 'Explore a área do cliente com o perfil fictício Alex Exemplo. Não há autenticação nem proteção de acesso neste protótipo.'}</div>
    <Link className="button button-light" href={register ? '/verificar-email' : '/conta'}>{register ? 'Experimentar a verificação' : 'Explorar minha conta'} <span aria-hidden="true">↗</span></Link>
    <button type="button" className={styles.textButton} onClick={() => { setSuccess(false); setMessage(''); setErrors({}); }}>{register ? 'Voltar ao cadastro' : 'Voltar à entrada'}</button>
  </div>;

  const fieldError = (field: Field) => errors[field] ? <p id={`${field}-error`} className={styles.error}>{errors[field]}</p> : null;

  return <>
    <div className={styles.formHeading}><h2>{register ? 'Crie sua conta.' : 'Entre na sua conta.'}</h2><p>{register ? <>Já tem uma conta? <Link href="/entrar">Entrar</Link></> : <>Primeiro encontro? <Link href="/cadastro">Criar conta</Link></>}</p></div>
    <button type="button" className={styles.exampleButton} onClick={fillExample}>Preencher com dados de exemplo</button>
    {!register && <details className={styles.credentials}><summary>Ver credenciais de exemplo</summary><p className={styles.exampleHint}>Conta fictícia: <span>{example.email}</span><br/>Senha de exemplo: <span>{example.password}</span></p></details>}
    <form ref={form} onSubmit={submit} noValidate className={styles.form}>
      {register && <div><label htmlFor="name">Nome</label><input id="name" name="name" autoComplete="name" required maxLength={120} value={values.name} onChange={event => update('name', event.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} placeholder="Como podemos chamar você?"/>{fieldError('name')}</div>}
      <div><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" autoComplete={register ? 'email' : 'username'} inputMode="email" autoCapitalize="none" spellCheck={false} required maxLength={254} value={values.email} onChange={event => update('email', event.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} placeholder="cliente@stereo.example"/>{fieldError('email')}</div>
      {register && <div><label htmlFor="phone">Telefone para contato <span>(opcional)</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={32} value={values.phone} onChange={event => update('phone', event.target.value)} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-help phone-error' : 'phone-help'} placeholder="DDD e número"/><p id="phone-help" className={styles.hint}>Pode deixar em branco nesta demonstração.</p>{fieldError('phone')}</div>}
      <div><label htmlFor="password">Senha</label><div className={styles.password}><input id="password" name="password" type={visible ? 'text' : 'password'} autoComplete={register ? 'new-password' : 'current-password'} required maxLength={128} value={values.password} onChange={event => update('password', event.target.value)} aria-invalid={!!errors.password} aria-describedby={[register ? 'password-help' : '', errors.password ? 'password-error' : ''].filter(Boolean).join(' ') || undefined}/><button type="button" aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'} aria-controls="password" aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? 'Ocultar' : 'Mostrar'}</button></div>{register && <p id="password-help" className={styles.hint}>De 12 a 128 caracteres. Pode usar espaços, colar ou usar um gerenciador de senhas. Use uma senha fictícia nesta prévia.</p>}{fieldError('password')}</div>
      {register && <div><label htmlFor="confirmation">Confirmar senha</label><input id="confirmation" name="confirmation" type={visible ? 'text' : 'password'} autoComplete="new-password" required maxLength={128} value={values.confirmation} onChange={event => update('confirmation', event.target.value)} aria-invalid={!!errors.confirmation} aria-describedby={errors.confirmation ? 'confirmation-error' : undefined}/>{fieldError('confirmation')}</div>}
      {!register && <div className={styles.flowLinks}><Link href="/recuperar-senha">Esqueci minha senha</Link><Link href="/verificar-email">Confirmar meu e-mail</Link></div>}
      {message && <p ref={feedback} tabIndex={-1} role="alert" className={styles.feedback}>{message}</p>}
      <button type="submit" className={styles.submit}>{register ? 'Simular cadastro' : 'Entrar na demonstração'}</button>
      <p className={styles.hint}>{register ? 'O cadastro público terá apenas o perfil de cliente. Você pode experimentar a verificação de e-mail na próxima tela.' : 'Apenas a conta fictícia acima funciona nesta prévia. Cadastro, recuperação e sessão segura dependem da integração com o servidor.'}</p>
    </form>
  </>;
}
