import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../../site-chrome';
import { demoPolicy, demoTables } from '../../../lib/reservations/demo';
import styles from './politicas.module.css';

export const metadata: Metadata = {
  title: 'Política de reservas — STEREO',
  description: 'Conheça as regras demonstrativas de solicitação, aprovação, horários e cancelamento de reservas do STEREO.',
};

const topics = [
  ['solicitacao', 'Solicitação e aprovação'],
  ['horarios', 'Datas e horários'],
  ['grupos', 'Pessoas e mesas'],
  ['cancelamento', 'Cancelamento e alterações'],
  ['chegada', 'Chegada e permanência'],
  ['demonstracao', 'Sobre esta demonstração'],
] as const;

export default function ReservationPolicyPage() {
  const maxPeople = Math.max(...demoTables.filter(table => table.active).map(table => table.capacity));

  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader/>
    <main id="conteudo" className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Caminho da página"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Política de reservas</span></nav>
      <header className={styles.intro}>
        
        <h1>Uma boa noite<br/>começa com clareza.</h1>
        <p>Entenda como solicitar sua mesa, acompanhar o aceite e mudar os planos quando precisar.</p>
        <div className={styles.version}><span>Política de reservas · versão demonstrativa</span><span>Atualizada em <time dateTime="2026-11-05">05/11/2026</time></span></div>
      </header>
      <aside className={styles.notice} aria-label="Política demonstrativa"><span aria-hidden="true">✳</span><div><strong>A casa ainda está em preparação.</strong><p>Estas regras descrevem o protótipo de reservas. Não há reserva real, cobrança ou envio de dados para o bar. A política de operação será publicada antes da abertura.</p></div></aside>
      <div className={styles.layout}>
        <nav className={styles.index} aria-label="Nesta política"><p>Nesta política</p><ol>{topics.map(([id, title]) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}</ol><Link className="text-link" href="/reservas/nova">Experimentar a reserva <span aria-hidden="true">↗</span></Link></nav>
        <article className={styles.content} aria-label="Regras da reserva">
          <section id="solicitacao" aria-labelledby="titulo-solicitacao"><h2 id="titulo-solicitacao">Solicitar ainda não é confirmar.</h2><p>Escolha a quantidade de pessoas, a data e um horário disponível. Na demonstração, o acesso é feito por um perfil fictício, sem cadastro ou senha.</p><p>Ao enviar, sua solicitação fica <strong>aguardando aprovação</strong>. Consultar horários e enviar uma proposta não bloqueiam uma mesa. A disponibilidade é verificada novamente no momento do aceite.</p><p>A reserva só fica <strong>confirmada depois da aprovação da equipe</strong>. Se houver recusa, o motivo aparece no resultado. Se não houver mais mesa no aceite, a proposta permanece pendente.</p><p>O prazo de resposta da equipe ainda será definido. A demonstração permite simular aprovação e recusa no painel de operação; isso não representa atendimento real.</p></section>
          <section id="horarios" aria-labelledby="titulo-horarios"><h2 id="titulo-horarios">Tempo para chegar e ficar.</h2><dl className={styles.facts}><div><dt>Duração prevista</dt><dd>{demoPolicy.durationMinutes / 60} horas</dd></div><div><dt>Antecedência mínima</dt><dd>{demoPolicy.minNoticeMinutes / 60} horas</dd></div><div><dt>Até quando solicitar</dt><dd>{demoPolicy.maxAdvanceDays} dias à frente</dd></div><div><dt>Referência de horário</dt><dd>Horário de Aracaju</dd></div></dl><p>A agenda fictícia funciona de terça a domingo, das 18h à meia-noite, com chegadas a cada 30 minutos, entre 18h e 22h. Segunda-feira está fechada nesta simulação.</p><p>O último período vai das 22h à meia-noite do dia seguinte. Datas e horários reais de funcionamento ainda serão anunciados; a agenda do protótipo serve apenas para experimentar o fluxo.</p></section>
          <section id="grupos" aria-labelledby="titulo-grupos"><h2 id="titulo-grupos">Uma mesa para o seu encontro.</h2><p>As mesas ativas da demonstração atendem grupos de até <strong>{maxPeople} pessoas</strong>. Cada solicitação corresponde a uma mesa, sem junção automática. O sistema procura uma mesa com capacidade compatível com o grupo.</p><p>Observações são opcionais e não garantem o atendimento de preferências. Não informe nome, telefone, e-mail ou outros dados pessoais no campo de observação desta prévia.</p></section>
          <section id="cancelamento" aria-labelledby="titulo-cancelamento"><h2 id="titulo-cancelamento">Cancele dentro do prazo.</h2><ul><li><strong>Solicitação pendente:</strong> pode ser cancelada antes da decisão da equipe.</li><li><strong>Reserva aprovada:</strong> pode ser cancelada até {demoPolicy.minNoticeMinutes / 60} horas antes do horário de chegada. Dentro desse prazo, o cancelamento libera a mesa na agenda local.</li><li><strong>Depois do prazo:</strong> o cancelamento da reserva aprovada fica bloqueado no protótipo. O canal de atendimento real ainda será divulgado.</li></ul><p>Use a ação de cancelar no resultado da solicitação. Depois, você pode consultar outra data e enviar uma nova proposta, sujeita a nova aprovação. A equipe pode simular a remarcação no painel de operação, com nova verificação de disponibilidade.</p><p>Não há cobrança de sinal ou pagamento nesta demonstração.</p></section>
          <section id="chegada" aria-labelledby="titulo-chegada"><h2 id="titulo-chegada">O encontro tem seu tempo.</h2><p>O planejamento prevê uma tolerância de <strong>15 minutos</strong> para a chegada a uma reserva confirmada. Os painéis de operação permitem simular check-in e ausência no relógio fixo do cenário, com essa tolerância.</p><p>Na operação planejada, a equipe fará o registro de chegada ou ausência. Não haverá cancelamento automático apenas pelo relógio. Permanecer além do período previsto dependerá de avaliação da equipe e das reservas seguintes.</p></section>
          <section id="demonstracao" aria-labelledby="titulo-demonstracao"><h2 id="titulo-demonstracao">Tudo acontece só nesta sessão.</h2><p>As solicitações e decisões ficam apenas na memória desta navegação. Os links entre reserva e painéis mantêm o cenário; recarregar, abrir uma nova aba ou reiniciar o cenário restaura os dados fictícios iniciais. O protocolo de exemplo não comprova uma reserva real.</p><p>Não há conta real, persistência, notificações ou confirmação por e-mail. Endereço, contatos, horários reais e prazo de análise ainda estão em definição.</p><p>Referência das regras do protótipo: <span className={styles.reference}>{demoPolicy.version}</span>. Esta é uma versão demonstrativa, sem vigência para atendimento real.</p></section>
        </article>
      </div>
      <section className={styles.invite} aria-labelledby="titulo-convite"><h2 id="titulo-convite">Escolha a noite.<br/>Imagine o encontro.</h2><p>Experimente a solicitação de mesa com os dados da demonstração.</p><div><Link className="button button-light" href="/reservas/nova">Experimentar a reserva <span aria-hidden="true">↗</span></Link><Link className="text-link" href="/visite">Conheça a proposta da visita <span aria-hidden="true">↗</span></Link></div></section>
    </main>
    <SiteFooter/>
  </>;
}
