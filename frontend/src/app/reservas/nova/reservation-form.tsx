"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { addDays, canCancelRequest, checkAvailability, demoPolicy, findTable, formatVisitDate, interval, todayInAracaju } from '../../../lib/reservations/demo';
import type { Allocation, ReservationRequest } from '../../../lib/reservations/demo';
import styles from './reservas.module.css';

const labels = { PENDING_APPROVAL: 'Aguardando aprovação', CONFIRMED: 'Confirmada na simulação', REJECTED: 'Não aprovada', CANCELLED: 'Cancelada' };

export function ReservationForm() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [dateRange, setDateRange] = useState({ min: '', max: '' });
  const [date, setDate] = useState('');
  const [people, setPeople] = useState('4');
  const [slots, setSlots] = useState<{ time: string; available: boolean }[] | null>(null);
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [requests, setRequests] = useState<ReservationRequest[]>([]);
  const [allocations, setAllocations] = useState<(Allocation & { requestId: string })[]>([]);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const current = requests.find(request => request.id === submittedId);

  useEffect(() => { resultHeading.current?.focus(); }, [current?.status]);

  function enterDemo() {
    const today = todayInAracaju();
    let suggested = addDays(today, 1);
    if (new Date(`${suggested}T12:00:00Z`).getUTCDay() === 1) suggested = addDays(suggested, 1);
    setDateRange({ min: today, max: addDays(today, demoPolicy.maxAdvanceDays) });
    setDate(suggested); setLoggedIn(true);
  }
  function invalidate() { setSlots(null); setTime(''); setAccepted(false); setMessage(''); }
  function updateStatus(status: ReservationRequest['status']) {
    if (!current) return;
    setRequests(previous => previous.map(request => request.id === current.id ? { ...request, status } : request));
    setMessage('');
  }
  function approve() {
    if (!current || current.status !== 'PENDING_APPROVAL') return;
    const table = findTable(current, allocations);
    if (!table) { setMessage('Esse horário não está mais disponível. A solicitação continua pendente; cancele e escolha outra opção.'); return; }
    setAllocations(previous => [...previous, { requestId: current.id, tableId: table.id, ...interval(current.date, current.time) }]);
    updateStatus('CONFIRMED');
  }
  function reject() {
    if (!current || current.status !== 'PENDING_APPROVAL') return;
    if (!reason.trim()) { setMessage('Informe um motivo para simular a recusa.'); return; }
    setRejectionReasons(previous => ({ ...previous, [current.id]: reason.trim() }));
    updateStatus('REJECTED');
  }
  function cancel() {
    if (!current || !['PENDING_APPROVAL', 'CONFIRMED'].includes(current.status)) return;
    if (!canCancelRequest(current)) { setMessage('O prazo de cancelamento desta reserva terminou.'); return; }
    setAllocations(previous => previous.filter(allocation => allocation.requestId !== current.id));
    updateStatus('CANCELLED');
  }
  function newRequest() { setSubmittedId(null); invalidate(); setReason(''); setNotes(''); }
  function leaveDemo() {
    setLoggedIn(false); setRequests([]); setAllocations([]); setSubmittedId(null); setReason(''); setNotes(''); setRejectionReasons({}); invalidate();
  }

  return <div className={styles.layout}>
    <section className={styles.panel} aria-label="Solicitar uma mesa">
      <ol className={styles.steps} aria-label="Etapas da solicitação"><li aria-current={!loggedIn ? 'step' : undefined}>Acesso</li><li aria-current={loggedIn && !current ? 'step' : undefined}>Sua visita</li><li aria-current={current ? 'step' : undefined}>Aprovação</li></ol>
      {!loggedIn ? <div className={styles.login}><span className={styles.loginIcon} aria-hidden="true">✳</span><h2>O primeiro passo<br/>é entrar.</h2><p>Para solicitar uma mesa, você precisa estar logado. Nesta prévia, use um perfil de exemplo e experimente o fluxo sem informar dados pessoais.</p><button type="button" className="button button-light" onClick={enterDemo}>Usar conta de demonstração <span aria-hidden="true">↗</span></button><small>Sem cadastro, senha ou autenticação real.</small></div> : <>
        <div className={styles.session}><span>Perfil de demonstração</span><button type="button" onClick={leaveDemo}>Sair e limpar dados</button></div>
        {!current ? <>
          <form className={styles.visitForm} onSubmit={event => {
            event.preventDefault();
            const result = checkAvailability(date, Number(people), allocations);
            setSlots(result.slots); setTime(''); setAccepted(false); setMessage(result.error ?? '');
          }}>
            <h2>Quando a gente se encontra?</h2><p className={styles.helper}>Escolha o tamanho do grupo e o dia da visita.</p>
            <div className={styles.fields}><label>Quantidade de pessoas<input type="number" required min="1" max="20" step="1" value={people} onChange={event => { setPeople(event.target.value); invalidate(); }}/></label><label>Data da visita<input type="date" required min={dateRange.min} max={dateRange.max} value={date} onChange={event => { setDate(event.target.value); invalidate(); }}/></label></div>
            <button type="submit" className={styles.primary}>Consultar disponibilidade</button>
          </form>
          {slots && slots.some(slot => slot.available) && <form className={styles.requestForm} onSubmit={event => {
            event.preventDefault();
            if (!loggedIn || !accepted || !time) { setMessage('Escolha um horário e aceite a condição de aprovação.'); return; }
            if (!findTable({ date, partySize: Number(people), time }, allocations)) { setMessage('O horário deixou de estar disponível. Consulte as opções novamente.'); setTime(''); return; }
            const id = `DEMO-${String(requests.length + 1).padStart(3, '0')}`;
            setRequests(previous => [...previous, { id, date, time, partySize: Number(people), notes: notes.trim(), status: 'PENDING_APPROVAL' }]);
            setSubmittedId(id); setMessage('');
          }}>
            <fieldset className={styles.times}><legend>Há opções para o seu grupo.</legend><p className={styles.helper}>Escolha um horário de chegada. A consulta não bloqueia a mesa.</p><div>{slots.map(slot => <label key={slot.time} className={!slot.available ? styles.timeUnavailable : ''}><input type="radio" name="arrival-time" value={slot.time} required disabled={!slot.available} checked={time === slot.time} onChange={() => { setTime(slot.time); setMessage(''); }}/><span>{slot.time}{!slot.available && <small>Indisponível</small>}</span></label>)}</div></fieldset>
            {time && <div className={styles.review}><h3>Seu encontro</h3><p>{Number(people)} {Number(people) === 1 ? 'pessoa' : 'pessoas'} em {formatVisitDate(date)}, às {time}.</p><span>Período previsto de 2 horas, no horário de Aracaju.</span></div>}
            <label className={styles.notes}>Observação <span>(opcional)</span><textarea maxLength={240} rows={3} value={notes} onChange={event => setNotes(event.target.value)} placeholder="Não informe dados pessoais nesta demonstração."/><small>Preferências não garantem atendimento. Até 240 caracteres.</small></label>
            <label className={styles.consent}><input type="checkbox" required checked={accepted} onChange={event => setAccepted(event.target.checked)}/><span>Entendi que a solicitação depende da aprovação da equipe e que a consulta não garante uma mesa.</span></label>
            <button type="submit" className={styles.primary} disabled={!time || !accepted}>Enviar solicitação</button>
          </form>}
        </> : <div className={styles.result}>
          <span className={styles.status} data-status={current.status}>{labels[current.status]}</span>
          <h2 ref={resultHeading} tabIndex={-1}>{current.status === 'PENDING_APPROVAL' ? 'Sua proposta está na fila.' : current.status === 'CONFIRMED' ? 'Mesa aceita na demonstração.' : current.status === 'REJECTED' ? 'Vamos tentar outra noite?' : 'Solicitação cancelada.'}</h2>
          <p>{current.status === 'PENDING_APPROVAL' ? 'A solicitação foi criada neste exemplo e precisa ser aceita pela equipe. Sua mesa ainda não está confirmada.' : current.status === 'CONFIRMED' ? 'A equipe simulada aceitou a proposta e a mesa foi alocada na agenda local. Esta confirmação não representa uma reserva real.' : current.status === 'REJECTED' ? `Motivo informado na simulação: ${rejectionReasons[current.id]}` : 'Você pode consultar outra data e enviar uma nova proposta.'}</p>
          <dl className={styles.summary}><div><dt>Protocolo de exemplo</dt><dd>{current.id}</dd></div><div><dt>Dia da visita</dt><dd>{formatVisitDate(current.date)}</dd></div><div><dt>Chegada</dt><dd>{current.time} (Aracaju)</dd></div><div><dt>Grupo</dt><dd>{current.partySize} {current.partySize === 1 ? 'pessoa' : 'pessoas'}</dd></div></dl>
          {current.notes && <p className={styles.requestNotes}>Observação: {current.notes}</p>}
          <div className={styles.resultActions}><button type="button" className={styles.secondary} onClick={newRequest}>Nova solicitação</button>{['PENDING_APPROVAL', 'CONFIRMED'].includes(current.status) && <button type="button" className={styles.textButton} onClick={cancel}>Cancelar solicitação</button>}</div>
          {current.status === 'PENDING_APPROVAL' && <details className={styles.team}><summary>Simular análise da equipe</summary><p>Somente para testar a interface. Não existe controle de acesso ou painel administrativo real nesta etapa.</p><label>Motivo da recusa <span>(necessário apenas para recusar)</span><textarea maxLength={240} rows={2} value={reason} onChange={event => setReason(event.target.value)}/></label><div><button type="button" className={styles.primary} onClick={approve}>Simular aprovação</button><button type="button" className={styles.secondary} onClick={reject}>Simular recusa</button></div></details>}
        </div>}
        {requests.length > 1 && <details className={styles.history}><summary>Solicitações desta sessão ({requests.length})</summary><ul>{requests.map(request => <li key={request.id}><span>{request.id} / {formatVisitDate(request.date)} às {request.time}</span><strong>{labels[request.status]}</strong></li>)}</ul></details>}
      </>}
      {message && <p role="alert" className={styles.error}>{message}</p>}
    </section>
    <aside className={styles.sidebar}>
      <div><span className={styles.sidebarSymbol} aria-hidden="true">✳</span><h2>A mesa vem depois<br/>do aceite.</h2><p>Uma opção disponível permite enviar a proposta. A equipe confere a agenda e só então confirma a reserva.</p></div>
      <details className={styles.policy} open><summary>Regras desta demonstração</summary><ul><li>Mesas para grupos de até 8 pessoas, sem junção automática.</li><li>Terça a domingo, das 18h à meia-noite. São horários fictícios para testar a interface.</li><li>Visitas com duração de 2 horas e antecedência mínima de 2 horas.</li><li>Solicitações para até 60 dias à frente, no fuso de Aracaju.</li><li>Solicitações pendentes não bloqueiam mesas. A aprovação verifica a disponibilidade novamente.</li><li>Cancelamento de reserva aprovada até 2 horas antes; pendente pode ser cancelada antes do aceite.</li></ul></details>
      <Link className="text-link" href="/visite">Conheça a proposta da visita <span aria-hidden="true">↗</span></Link>
    </aside>
  </div>;
}
