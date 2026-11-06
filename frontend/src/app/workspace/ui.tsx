"use client";
import { cloneElement, createContext, isValidElement, useContext, useEffect, useId, useRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { useDemo } from './provider';
import { statusLabels } from '../../lib/workspace/model';
import type { Status, Visit } from '../../lib/workspace/model';
import styles from './workspace.module.css';

export function Heading({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <header className={styles.heading}><div><h1>{title}</h1><p>{description}</p></div>{action}</header>;
}
export function Panel({ title, children, aside }: { title: string; children: ReactNode; aside?: ReactNode }) {
  return <section className={styles.panel}><div className={styles.panelHeading}><h2>{title}</h2>{aside}</div>{children}</section>;
}
const FormErrors = createContext<Record<string, string>>({});
export function Field({ label, hint, error: ownError, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  const generatedId = useId();
  const errors = useContext(FormErrors);
  const control = isValidElement<InputHTMLAttributes<HTMLInputElement>>(children) ? children : null;
  const id = control?.props.id ?? generatedId;
  const error = ownError ?? errors[control?.props.name ?? ''];
  const describedBy = [control?.props['aria-describedby'], hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return <div className={styles.field}><label htmlFor={id}>{label}</label>{control ? cloneElement(control, { id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined }) : children}{hint && <small id={`${id}-hint`}>{hint}</small>}{error && <small id={`${id}-error`} className={styles.fieldError}>{error}</small>}</div>;
}
export function GroupError({ name, id }: { name: string; id: string }) {
  const errors = useContext(FormErrors);
  return <p id={id} hidden={!errors[name]} className={styles.fieldError}>{errors[name]}</p>;
}
export function Toggle({ label, name, checked, disabled }: { label: string; name: string; checked?: boolean; disabled?: boolean }) {
  return <label className={styles.toggle}><input name={name} type="checkbox" defaultChecked={checked} disabled={disabled}/>{label}</label>;
}
export function Editor({ children, onSave, submit = 'Salvar na demonstração', scope }: { children: ReactNode; onSave: (data: FormData) => void; submit?: string; scope?: string }) {
  const { state } = useDemo();
  const summary = useRef<HTMLDivElement>(null);
  const feedback = scope && state.feedback?.scope === scope ? state.feedback : null;
  const errors = feedback?.fields ?? {};
  useEffect(() => { if (feedback?.error) summary.current?.focus(); }, [feedback]);
  return <FormErrors.Provider value={errors}><form className={styles.form} onSubmit={event => { event.preventDefault(); onSave(new FormData(event.currentTarget)); }}>
    {feedback?.error && <div ref={summary} tabIndex={-1} role="alert" className={styles.errorSummary}><p>{feedback.text}</p><ul>{Object.entries(errors).map(([name, message]) => <li key={name}><button type="button" onClick={event => { const control = event.currentTarget.form?.elements.namedItem(name); if (control instanceof RadioNodeList) (control[0] as HTMLElement)?.focus(); else if (control instanceof HTMLElement) control.focus(); }}>{message}</button></li>)}</ul></div>}
    {children}<button className={styles.primary} type="submit">{submit}</button></form></FormErrors.Provider>;
}
export const value = (data: FormData, key: string) => String(data.get(key) ?? '').trim();
export const number = (data: FormData, key: string) => Number(data.get(key));
export const checked = (data: FormData, key: string) => data.has(key);
export function VisitFields({ visit }: { visit?: Visit }) {
  return <div className={styles.fields}><Field label="Data"><input name="date" type="date" required defaultValue={visit?.date ?? '2026-11-06'}/></Field><Field label="Horário" hint="Horário de Aracaju, a cada 30 minutos."><input name="time" type="time" step={1800} required defaultValue={visit?.time ?? '20:00'}/></Field><Field label="Pessoas"><input name="partySize" type="number" min={1} max={20} required defaultValue={visit?.partySize ?? 4}/></Field></div>;
}
export const readVisit = (data: FormData): Visit => ({ date: value(data, 'date'), time: value(data, 'time'), partySize: number(data, 'partySize') });
export function Badge({ status }: { status: Status }) { return <span className={styles.badge} data-status={status}>{statusLabels[status]}</span>; }
export function Empty({ title = 'Nada por aqui ainda.', text, href, label }: { title?: string; text: string; href?: string; label?: string }) {
  return <div className={styles.empty}><span aria-hidden="true">✳</span><h2>{title}</h2><p>{text}</p>{href && <Link className={styles.secondary} href={href}>{label ?? 'Voltar'}</Link>}</div>;
}
export function Feedback() {
  const { state, dispatch } = useDemo();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (state.feedback && !state.feedback.fields) ref.current?.focus(); }, [state.feedback]);
  if (!state.feedback || state.feedback.fields) return null;
  return <div ref={ref} tabIndex={-1} role={state.feedback.error ? 'alert' : 'status'} className={styles.feedback} data-error={state.feedback.error}><p>{state.feedback.text}</p><button type="button" aria-label="Fechar mensagem" onClick={() => dispatch({ type: 'clear' })}>×</button></div>;
}
export function dateLabel(date: string) { return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo' }).format(new Date(`${date}T12:00:00Z`)); }
export const money = (price: string) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(price));
