import type { Metadata } from 'next';
import { AuthFrame } from '../auth-shell';
import { RecoveryFlow } from '../access-flow';

export const metadata: Metadata = { title: 'Recuperar senha — STEREO', description: 'Experimente a recuperação de acesso do STEREO.', robots: { index: false, follow: false }, referrer: 'no-referrer' };

export default function RecoveryPage() {
  return <AuthFrame breadcrumb="Recuperar senha" title={<>Vamos recuperar<br/>seu acesso.</>} description="Um caminho para voltar à sua conta e aos seus encontros com a casa." panelLabel="Recuperação de senha"><RecoveryFlow/></AuthFrame>;
}
