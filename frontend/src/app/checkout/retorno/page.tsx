import { PaymentReturn } from '../../commerce/shop';
import { PublicCommerce } from '../../commerce/ui';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'STEREO — Demonstração comercial', robots: { index: false, follow: false } };
export default async function Page({ searchParams }: { searchParams: Promise<{ id?: string | string[] }> }) { const query = await searchParams; return <PublicCommerce><PaymentReturn id={typeof query.id === 'string' ? query.id : undefined}/></PublicCommerce>; }
