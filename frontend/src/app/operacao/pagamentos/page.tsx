import { PaymentsPage } from '../../commerce/operations';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'STEREO — Demonstração comercial', robots: { index: false, follow: false } };
export default function Page() { return <PaymentsPage/>; }
