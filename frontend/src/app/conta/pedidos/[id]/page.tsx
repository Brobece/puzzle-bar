import { CustomerOrder } from '../../../commerce/shop';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'STEREO — Demonstração comercial', robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ id: string }> }) { return <CustomerOrder id={(await params).id}/>; }
