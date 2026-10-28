"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';

export function MobileMenu({ about = false, menu = false, visit = false, reserve = false }: { about?: boolean; menu?: boolean; visit?: boolean; reserve?: boolean }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return <div className="mobile-nav" data-open={open} onKeyDown={(event) => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      trigger.current?.focus();
    }
  }}>
    <button ref={trigger} className="mobile-menu-trigger" type="button" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
      <svg className="menu-vinyl" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <circle className="vinyl-body" cx="16" cy="16" r="14.5"/>
        <circle className="vinyl-groove" cx="16" cy="16" r="11"/>
        <circle className="vinyl-groove" cx="16" cy="16" r="8.5"/>
        <path className="vinyl-reflection" d="M7 12a10 10 0 0 1 5-5M20 25a10 10 0 0 0 5-5"/>
        <circle className="vinyl-label" cx="16" cy="16" r="5.5"/>
        <path className="vinyl-label-stripe" d="M16 10.5v4"/>
        <circle className="vinyl-hole" cx="16" cy="16" r="1.5"/>
      </svg>
      <span>Menu</span>
    </button>
    <nav id="mobile-navigation" aria-label="Navegação móvel" inert={!open} onClick={() => setOpen(false)}>
      <Link href="/sobre" aria-current={about ? 'page' : undefined}>Sobre</Link>
      <Link href="/#som">O som</Link>
      <Link href="/cardapio" aria-current={menu ? 'page' : undefined}>Cardápio</Link>
      <Link href="/#agenda">Convidados</Link>
      <Link href="/visite" aria-current={visit ? 'page' : undefined}>Visite</Link>
      <Link href="/reservas/nova" aria-current={reserve ? 'page' : undefined}>Reservar mesa</Link>
    </nav>
  </div>;
}
