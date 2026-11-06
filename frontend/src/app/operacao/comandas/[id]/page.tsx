import { TabPage } from '../../../commerce/operations';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'STEREO — Demonstração comercial', robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <TabPage id={(await params).id}/>; }
