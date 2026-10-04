# Organização de páginas

As rotas usam o App Router do Next.js e estão separadas por contexto com route
groups. Os nomes entre parênteses organizam o código e não aparecem na URL.

- `(site)`: páginas públicas e institucionais (P01–P09).
- `(auth)`: entrada, cadastro e recuperação de acesso (A01–A05).
- `(customer)`: conta, reservas, carrinho e pedidos do cliente (C01–C10).
- `(staff)`: telas da operação do pub (O01–O12).
- `(management)`: administração e relatórios (G01–G17).

Cada página deve manter seu `page.tsx` no segmento correspondente. Componentes,
dados e estilos exclusivos podem ficar próximos da página em pastas privadas como
`_components` e `_data`; elementos compartilhados entre páginas ficam em
`src/components`, e mocks reutilizáveis ficam em `src/data`.

Os arquivos `.gitkeep` preservam o mapa de rotas futuras sem publicar páginas
vazias. Ao implementar uma página, remova o `.gitkeep` daquele segmento.

## Página atual

A P01 (Início, `/`) está em `(site)/(home)`. O segundo grupo mantém a página
inicial em uma pasta própria sem alterar a URL.
