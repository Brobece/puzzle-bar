import type { Metadata } from 'next';
import { WorkspaceShell } from '../workspace/shell';
export const metadata: Metadata = { title: 'Operação — STEREO Demo', robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) { return <WorkspaceShell area="operacao">{children}</WorkspaceShell>; }
