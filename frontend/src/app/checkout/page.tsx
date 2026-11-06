import { CheckoutPage } from '../commerce/shop';
import { PublicCommerce } from '../commerce/ui';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'STEREO — Demonstração comercial', robots: { index: false, follow: false } };
export default function Page() { return <PublicCommerce><CheckoutPage/></PublicCommerce>; }
