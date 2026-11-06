import type { Metadata } from 'next';
import { AuthFrame } from '../auth-shell';
import { VerificationFlow } from '../access-flow';
import { demoLinkCase } from '../../lib/access-demo';

export const metadata: Metadata = { title: 'Verificar e-mail — STEREO', description: 'Experimente a confirmação de e-mail do STEREO.', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function VerificationPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const linkCase = query.token !== undefined ? 'invalido' : demoLinkCase(query.exemplo);
  return <AuthFrame breadcrumb="Verificar e-mail" title={<>Confirme<br/>seu e-mail.</>} description="A confirmação do endereço faz parte do cadastro planejado para sua conta." panelLabel="Verificação de e-mail"><VerificationFlow key={linkCase} linkCase={linkCase}/></AuthFrame>;
}
