import type { Metadata } from 'next';
import { AuthFrame } from '../auth-shell';
import { ResetFlow } from '../access-flow';
import { demoLinkCase } from '../../lib/access-demo';

export const metadata: Metadata = { title: 'Redefinir senha — STEREO', description: 'Experimente a definição de uma nova senha no STEREO.', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default async function ResetPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const linkCase = query.token !== undefined ? 'invalido' : demoLinkCase(query.exemplo);
  return <AuthFrame breadcrumb="Redefinir senha" title={<>Uma nova senha.<br/>O mesmo encontro.</>} description="Defina uma nova senha para retomar seu acesso no fluxo definitivo." panelLabel="Redefinição de senha"><ResetFlow key={linkCase} linkCase={linkCase}/></AuthFrame>;
}
