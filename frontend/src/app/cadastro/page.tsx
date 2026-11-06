import type { Metadata } from 'next';
import { AuthShell } from '../auth-shell';

export const metadata: Metadata = { title: 'Criar conta — STEREO', description: 'Conheça o cadastro demonstrativo do STEREO para solicitar sua mesa.' };
export default function RegisterPage() { return <AuthShell mode="register"/>; }
