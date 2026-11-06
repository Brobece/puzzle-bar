import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '../site-chrome';
import styles from '../politicas/reservas/politicas.module.css';
import privacy from './privacidade.module.css';

export const metadata: Metadata = {
  title: 'Privacidade — STEREO',
  description: 'Entenda o uso de dados na prévia demonstrativa do STEREO e as definições pendentes para a operação real.',
};

const topics = [
  ['previa', 'O que acontece nesta prévia'],
  ['informacoes', 'Informações nos formulários'],
  ['acesso', 'Cadastro, e-mail e senha'],
  ['armazenamento', 'Duração e armazenamento'],
  ['solicitacoes', 'Solicitações de dados pessoais'],
  ['operacao', 'Antes da operação real'],
] as const;

export default function PrivacyPage() {
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a><SiteHeader/>
    <main id="conteudo" className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Caminho da página"><Link href="/">Início</Link><span aria-hidden="true">/</span><span aria-current="page">Privacidade</span></nav>
      <header className={styles.intro}><h1>Seus dados<br/>com clareza.</h1><p>Entenda o que os formulários fazem nesta prévia e o que ainda será definido antes do atendimento real.</p><div className={styles.version}><span>Privacidade · versão demonstrativa</span><span>Atualizada em <time dateTime="2026-11-06">06/11/2026</time></span></div></header>
      <aside className={styles.notice} aria-label="Documento demonstrativo"><div><strong>Use apenas dados fictícios.</strong><p>O STEREO ainda está em preparação. Esta página descreve o protótipo atual; a política definitiva e o canal de privacidade serão publicados antes do uso com dados reais.</p></div></aside>
      <div className={styles.layout}>
        <nav className={styles.index} aria-label="Nesta página de privacidade"><p>Nesta página</p><ol>{topics.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ol><Link className="text-link" href="/conta/privacidade">Explorar dados pessoais</Link></nav>
        <article className={`${styles.content} ${privacy.reading}`} aria-label="Privacidade na demonstração">
          <section id="previa" aria-labelledby="titulo-previa"><h2 id="titulo-previa">Uma prévia, sem atendimento real.</h2><p>Você pode explorar o cardápio, experimentar o cadastro e o acesso, solicitar uma mesa fictícia e acompanhar o cenário nos painéis. Os formulários desta demonstração não enviam solicitações ao bar nem criam contas reais.</p><p>Os nomes e as informações iniciais do cenário são exemplos. Não informe seus dados reais, senhas de outros serviços ou informações pessoais de terceiros.</p></section>
          <section id="informacoes" aria-labelledby="titulo-informacoes"><h2 id="titulo-informacoes">O que você pode preencher.</h2><ul><li><strong>Cadastro e perfil:</strong> nome, e-mail e telefone opcional, para experimentar os campos de identificação e contato.</li><li><strong>Reserva:</strong> período desejado, quantidade de pessoas, contato e observação opcional. Esses dados permitem simular a análise e o acompanhamento da proposta.</li><li><strong>Acesso:</strong> e-mail, senha e confirmação, conforme a tarefa. Recuperação e reenvio usam apenas o campo de e-mail.</li><li><strong>Dados pessoais:</strong> tipo de solicitação e observação, para demonstrar acesso, exportação, correção e exclusão.</li></ul><p>As observações são campos livres. Use somente exemplos e evite incluir informações sensíveis ou dados de outras pessoas.</p></section>
          <section id="acesso" aria-labelledby="titulo-acesso"><h2 id="titulo-acesso">Acesso apenas demonstrativo.</h2><p>O cadastro valida os campos no navegador e os limpa ao concluir. Ele não cria uma conta. A entrada reconhece apenas a conta de exemplo publicada na própria tela, sem criar sessão autenticada.</p><p>Verificação de e-mail, recuperação e redefinição de senha também são simulações. Nenhum e-mail é enviado, nenhuma senha é alterada e nenhum endereço é confirmado. Os campos dessas etapas são limpos ao concluir ou descartados ao sair da tela.</p><p>As áreas de cliente, operação e gestão não possuem proteção de acesso real nesta prévia. A seleção de papel nos painéis serve para experimentar a interface.</p></section>
          <section id="armazenamento" aria-labelledby="titulo-armazenamento"><h2 id="titulo-armazenamento">O cenário dura nesta navegação.</h2><p>Perfil, reservas, edições administrativas e protocolos fictícios ficam na memória do cenário compartilhado. Navegar pelos links mantém essas alterações. Recarregar, abrir outra aba ou reiniciar o cenário restaura os exemplos iniciais.</p><p>Os formulários demonstrativos não utilizam banco de dados, cookies de autenticação, localStorage ou sessionStorage para guardar o cenário ou as credenciais. As senhas não fazem parte dos registros compartilhados.</p><p>A retenção e o tratamento de dados da operação definitiva, inclusive por serviços de hospedagem e e-mail, ainda precisam ser definidos. Esta página não estabelece prazos de armazenamento para essa futura operação.</p></section>
          <section id="solicitacoes" aria-labelledby="titulo-solicitacoes"><h2 id="titulo-solicitacoes">Conheça o caminho dos seus dados.</h2><p>A área <Link href="/conta/privacidade">Dados pessoais</Link> permite experimentar solicitações de acesso, exportação, correção e exclusão. Ela gera apenas um protocolo local, sem enviar pedido à equipe, exportar arquivos ou excluir dados reais.</p><p>Você também pode <Link href="/conta/perfil">editar o perfil fictício</Link>. Uma solicitação de exclusão não apaga automaticamente registros do cenário.</p><p>O canal real de contato, os responsáveis e os prazos de atendimento ainda não foram definidos. Nenhum prazo ou atendimento é prometido nesta demonstração.</p></section>
          <section id="operacao" aria-labelledby="titulo-operacao"><h2 id="titulo-operacao">O que será publicado antes da abertura.</h2><p>A política definitiva deverá descrever os responsáveis pelo tratamento, as finalidades e bases aplicáveis, os serviços envolvidos, as medidas adotadas, a retenção e o canal para solicitações. Essas informações dependem das decisões da operação.</p><p>Quando integrações e contas reais estiverem disponíveis, esta página será revisada para refletir o funcionamento efetivo. Até lá, continue explorando apenas com dados fictícios.</p><p>Para as regras da solicitação de mesa, consulte a <Link href="/politicas/reservas">política demonstrativa de reservas</Link>.</p></section>
        </article>
      </div>
    </main><SiteFooter/>
  </>;
}
