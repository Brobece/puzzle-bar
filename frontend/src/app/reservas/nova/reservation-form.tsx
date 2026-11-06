"use client";
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useDemo } from '../../workspace/provider';
import { Feedback } from '../../workspace/ui';
import { availableTable, canCancel, customerId, scenarioDate, statusLabels, visitError } from '../../../lib/workspace/model';
import { formatVisitDate, timeOptions } from '../../../lib/reservations/demo';
import styles from './reservas.module.css';

export function ReservationForm() {
  const { state, dispatch } = useDemo();
  const [loggedIn, setLoggedIn] = useState(false);
  const [date, setDate] = useState('2026-11-06');
  const [people, setPeople] = useState('4');
  const [queried, setQueried] = useState(false);
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const current = state.reservations.find(item => item.id === submittedId && item.customerId === customerId);
  const slots = queried ? timeOptions.map(option => ({ time:option, available:!!availableTable(state,{date,time:option,partySize:Number(people)}) })) : [];
  useEffect(() => { if (current) resultHeading.current?.focus(); }, [current]);
  function invalidate() { setQueried(false); setTime(''); setAccepted(false); setMessage(''); }
  function resetForm() { setSubmittedId(null); setNotes(''); invalidate(); }
  const maxDate = new Date(Date.parse(`${scenarioDate}T12:00:00Z`)+state.rules.advance*86400000).toISOString().slice(0,10);

  return <><Feedback/><div className={styles.layout}>
    <section className={styles.panel} aria-label="Solicitar uma mesa">
      <ol className={styles.steps} aria-label="Etapas da solicitação"><li aria-current={!loggedIn ? 'step' : undefined}>Acesso</li><li aria-current={loggedIn && !current ? 'step' : undefined}>Sua visita</li><li aria-current={current ? 'step' : undefined}>Aprovação</li></ol>
      {!loggedIn ? <div className={styles.login}><span className={styles.loginIcon} aria-hidden="true">✳</span><h2>O primeiro passo<br/>é entrar.</h2><p>No fluxo real, a solicitação exige uma conta. Nesta prévia, use o perfil fictício para experimentar a jornada compartilhada com os painéis.</p><div className={styles.accessLinks}><Link href="/entrar">Conhecer a tela de entrada</Link><Link href="/cadastro">Criar conta demonstrativa</Link><Link href="/conta">Explorar minha conta</Link></div><button type="button" className="button button-light" onClick={() => setLoggedIn(true)}>Usar conta de demonstração <span aria-hidden="true">↗</span></button><small>Sem cadastro, senha ou autenticação real.</small></div> : <>
        <div className={styles.session}><span>{state.profile.name} · perfil fictício</span><button type="button" onClick={() => { setLoggedIn(false); resetForm(); }}>Sair desta prévia</button></div>
        {!current ? <><form className={styles.visitForm} onSubmit={event => { event.preventDefault(); const error = visitError(state,{date,time:timeOptions[0],partySize:Number(people)}); setQueried(true); setTime(''); setAccepted(false); setMessage(error && !error.includes('período inteiro') && !error.includes('antecedência') ? error : ''); }}>
          <h2>Quando a gente se encontra?</h2><p className={styles.helper}>Escolha o tamanho do grupo e o dia da visita.</p>
          <div className={styles.fields}><label>Quantidade de pessoas<input type="number" required min={1} max={20} step={1} value={people} onChange={event => { setPeople(event.target.value); invalidate(); }}/></label><label>Data da visita<input type="date" required min={scenarioDate} max={maxDate} value={date} onChange={event => { setDate(event.target.value); invalidate(); }}/></label></div><button type="submit" className={styles.primary}>Consultar disponibilidade</button>
        </form>
        {queried && !slots.some(slot => slot.available) && <p role="status" className={styles.error}>Não há horários disponíveis para esse grupo nessa data. Verifique a quantidade de pessoas ou tente outro dia.</p>}
        {slots.some(slot => slot.available) && <form className={styles.requestForm} onSubmit={event => {
          event.preventDefault();
          if (!accepted || !time || !availableTable(state,{date,time,partySize:Number(people)})) { setMessage('Revise o horário disponível e a condição de aprovação antes de enviar.'); return; }
          const id = `DEMO-${String(state.reservations.length+1).padStart(3,'0')}`;
          dispatch({ type:'create-reservation', visit:{date,time,partySize:Number(people)}, notes:notes.trim(), customer:true }); setSubmittedId(id); setMessage('');
        }}>
          <fieldset className={styles.times}><legend>Há opções para o seu grupo.</legend><p className={styles.helper}>A consulta não bloqueia mesa. O aceite precisa ser feito pela equipe.</p><div>{slots.map(slot => <label key={slot.time} className={!slot.available ? styles.timeUnavailable : ''}><input type="radio" name="arrival-time" value={slot.time} required disabled={!slot.available} checked={time === slot.time} onChange={() => { setTime(slot.time); setMessage(''); }}/><span>{slot.time}{!slot.available && <small>Indisponível</small>}</span></label>)}</div></fieldset>
          {time && <div className={styles.review}><h3>Seu encontro</h3><p>{people} pessoas em {formatVisitDate(date)}, às {time}.</p><span>{state.rules.duration} minutos previstos · versão demo-approval-v{state.rules.version}.</span></div>}
          <label className={styles.notes}>Observação <span>(opcional)</span><textarea maxLength={240} rows={3} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Não informe dados pessoais nesta demonstração."/></label>
          <label className={styles.consent}><input type="checkbox" required checked={accepted} onChange={event => setAccepted(event.target.checked)}/><span>Entendi que a solicitação depende da aprovação da equipe e que a consulta não garante uma mesa.</span></label>
          <p className={styles.policyLink}><Link href="/politicas/reservas" target="_blank" rel="noopener noreferrer">Leia a política-base de reservas (abre em outra aba)</Link>. Alterações gerenciais do cenário não publicam uma nova política. <Link href="/privacidade">Entenda o uso de dados nesta prévia</Link>.</p>
          <button type="submit" className={styles.primary} disabled={!time || !accepted}>Enviar solicitação</button>
        </form>}</> : <div className={styles.result}>
          <span className={styles.status} data-status={current.status}>{statusLabels[current.status]}</span><h2 ref={resultHeading} tabIndex={-1}>{current.status === 'PENDING_APPROVAL' ? 'Sua proposta está na fila.' : 'Seu encontro, atualizado.'}</h2><p>Esta solicitação faz parte do cenário local. A equipe pode aceitar ou recusar no painel de operação. Acompanhe o resultado em sua conta; nenhuma reserva real foi enviada.</p>
          <dl className={styles.summary}><div><dt>Protocolo fictício</dt><dd>{current.id}</dd></div><div><dt>Data e horário</dt><dd>{formatVisitDate(current.date)} · {current.time}</dd></div><div><dt>Grupo</dt><dd>{current.partySize} pessoas</dd></div><div><dt>Estado</dt><dd>{statusLabels[current.status]}</dd></div></dl>
          <div className={styles.resultActions}><Link className={styles.primary} href={`/conta/reservas/${current.id}`}>Acompanhar na minha conta</Link><button type="button" className={styles.secondary} onClick={resetForm}>Nova solicitação</button>{canCancel(current) && <button type="button" className={styles.textButton} onClick={() => dispatch({ type:'reservation', id:current.id, action:'cancel', customer:true })}>Cancelar solicitação</button>}</div>
          <div className={styles.team}><p>Para experimentar a análise da equipe, use o painel demonstrativo.</p><Link className="text-link" href={`/operacao/reservas/${current.id}`}>Abrir análise da equipe <span aria-hidden="true">↗</span></Link></div>
        </div>}
      </>}{message && <p role="alert" className={styles.error}>{message}</p>}
    </section>
    <aside className={styles.sidebar}><div><span className={styles.sidebarSymbol} aria-hidden="true">✳</span><h2>A mesa vem depois<br/>do aceite.</h2><p>Os painéis compartilham dados enquanto você navega pelos links. Recarregar ou reiniciar o cenário descarta as alterações.</p></div><details className={styles.policy} open><summary>Regras do cenário compartilhado</summary><ul><li>Relógio fixo: 05/11/2026 às 18h30, no horário de Aracaju.</li><li>Duração: {state.rules.duration} min. Antecedência mínima: {state.rules.notice} min.</li><li>Solicitações para até {state.rules.advance} dias à frente.</li><li>Cancelamento de confirmação até {state.rules.cancelNotice} min antes. Pendentes podem ser canceladas antes da decisão.</li><li>Agenda, regras e mesas podem ser editadas na gestão demonstrativa.</li></ul></details><p className={styles.policyLink}><Link href="/politicas/reservas" target="_blank" rel="noopener noreferrer">Política-base demonstrativa (outra aba)</Link></p><Link className="text-link" href="/conta/reservas">Minhas reservas <span aria-hidden="true">↗</span></Link></aside>
  </div></>;
}
