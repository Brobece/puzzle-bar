import type { Metadata } from 'next';
import { AuthShell } from '../auth-shell';

export const metadata: Metadata = { title: 'Entrar — STEREO', description: 'Experimente o acesso demonstrativo à sua conta STEREO.' };
export default function LoginPage() { return <AuthShell mode="login"/>; }
