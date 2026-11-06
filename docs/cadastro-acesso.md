# Cadastro e acesso demonstrativos

## Referência

Implementa as interfaces A01 (`/entrar`) e A02 (`/cadastro`) do planejamento, seções 8.1, 17.3, 18.2 e 20.1. A documentação já define nome, e-mail, telefone opcional e senha no cadastro; entrada por e-mail e senha. O e-mail permanece como identificador, não o nome ou telefone. Cadastro público definitivo terá apenas papel CLIENT e verificação de e-mail.

## Interfaces

Componentes compartilhados `auth-shell.tsx`, `auth-form.tsx` e `auth.module.css`. Cabeçalho/rodapé, identidade visual STEREO, vinil estático, breadcrumb e layout responsivo. Links de entrada no cabeçalho desktop e no menu móvel; cadastro no menu móvel, na entrada e na reserva. A reserva mantém um acionador explícito de perfil demonstrativo. O sucesso da entrada leva à área `/conta`, com os mesmos fixtures compartilhados entre reserva e painéis; isso não cria sessão autenticada.

- Cadastro: nome entre 2 e 120 caracteres após trim; e-mail com validação básica de formato e até 254 caracteres; telefone opcional com até 32 caracteres, formato de telefone e 10 a 15 dígitos quando preenchido; senha e confirmação.
- Critério provisório da interface para nova senha: 12 a 128 caracteres, espaços e colagem permitidos, sem exigência de composição. Esse intervalo não estava definido no planejamento e deve ser alinhado ao algoritmo e às validações do Spring antes de uso real.
- Rótulos explícitos, autocomplete, teclados apropriados, alternância de visibilidade de senha, erros por campo associados por `aria-describedby`, `aria-invalid` e foco no primeiro campo inválido. Feedback de credenciais genérico e resultado com foco.
- Preenchimento com dados fictícios disponível. Telefone é deixado em branco no exemplo para evitar usar contato real.
- Entrada demonstrativa aceita apenas `cliente@stereo.example` e senha pública fictícia `encontro-stereo`. Outras credenciais mostram erro, sem consultar contas reais.
- Sucesso do cadastro significa validação local, sem criar conta. Sucesso da entrada é uma simulação e não autoriza recursos. Os resultados deixam isso explícito. Senhas e demais campos são limpos ao concluir; não há armazenamento em cookies, localStorage ou sessionStorage, nem chamadas de API ou logs de credenciais.

## Integrações pendentes

Spring Security, banco, unicidade de e-mail, hash de senha, cookies de sessão, CSRF, limites de tentativas, papéis e verificação de e-mail. Cadastro não cadastra credenciais para a entrada simulada; ela usa apenas a conta fictícia publicada. As páginas de verificação, recuperação e redefinição de senha permanecem pendentes, sem links quebrados para essas rotas. A reserva e os painéis usam o perfil fictício compartilhado; os dados digitados no cadastro/entrada não substituem esse perfil nem criam autenticação.

## Validação

Lint, TypeScript e build aprovados, com geração estática das duas rotas. No navegador: campos obrigatórios e foco no primeiro inválido; telefone inválido; confirmação divergente; cadastro válido com telefone vazio; navegação para entrada; credenciais incorretas e sucesso da conta fictícia; alternância de visibilidade da senha. Revisão visual desktop e celular de 390 px, sem transbordamento horizontal no cadastro.
