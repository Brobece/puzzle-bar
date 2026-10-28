import type { Metadata } from 'next';
import { Manrope, Syne } from 'next/font/google';
import './globals.css';
const bodyFont = Manrope({ variable: '--font-body', subsets: ['latin'], display: 'swap' });
const displayFont = Syne({ variable: '--font-display', subsets: ['latin'], display: 'swap' });
export const metadata: Metadata = {
  title: 'STEREO — Eletrohits e encontros em Aracaju',
  description: 'Um novo bar em Aracaju para encontrar os amigos, brindar e curtir eletrohits. Conheça a proposta do STEREO. Abertura em breve.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR" className={`${bodyFont.variable} ${displayFont.variable}`}><body>{children}</body></html>;
}
