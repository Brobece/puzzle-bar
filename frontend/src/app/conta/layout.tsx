import type { Metadata } from 'next';
import { WorkspaceShell } from '../workspace/shell';
export const metadata: Metadata = { title: 'Minha conta — STEREO Demo', robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) { return <WorkspaceShell area="cliente">{children}</WorkspaceShell>; }
