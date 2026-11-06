# Painéis demonstrativos da E1

## Escopo

Interfaces da área do cliente, operação, administração e dados pessoais, seguindo as seções 8, 17–20 do planejamento. Não implementa APIs, autenticação, banco ou operação comercial real. As interfaces demonstrativas de comandas, preparo, pagamentos, compras online e estoque foram implementadas posteriormente; ver `docs/telas-comerciais.md`. O restante deste documento registra a base original da E1.

| Grupo | Rotas implementadas |
| --- | --- |
| Cliente C01–C04 | `/conta`, `/conta/perfil`, `/conta/reservas`, `/conta/reservas/[id]` |
| Dados pessoais C10 | `/conta/privacidade` |
| Operação O01–O03 | `/operacao`, `/operacao/reservas`, `/operacao/reservas/[id]` |
| Gestão G02–G07/G16 | `/gestao/produtos`, `/gestao/produtos/[id]` (inclui `novo`), `/gestao/categorias`, `/gestao/mesas`, `/gestao/horarios`, `/gestao/regras-reserva`, `/gestao/equipe`, `/gestao/configuracoes` |
| Navegação gerencial | `/gestao`, com atalhos dos cadastros da E1, sem indicadores financeiros da G01/E2 |
| Base de auditoria G15/E1 | `/gestao/auditoria`, com autor, ação, alvo, instante do cenário e detalhe |

## Cenário e navegação

`DemoProvider` no layout raiz compartilha um reducer puro (`src/lib/workspace/model.ts`) entre as rotas. Navegar com os links Next mantém perfil, solicitações, decisões, cadastros e histórico. Recarregar, abrir outra aba ou confirmar “Reiniciar cenário” restaura os fixtures. Sem cookies/localStorage/sessionStorage, chamadas de API ou credenciais guardadas.

Relógio fixo em **05/11/2026 às 18h30**, fuso `America/Sao_Paulo`; explicitado nos painéis e na reserva. Isso permite repetir testes de chegada/ausência sem depender do relógio real. Contatos e nomes são fictícios; telefones começam vazios.

Entrada demonstrativa aponta para `/conta`. Rodapé público e menu móvel dão acesso ao painel. A navegação superior permite alternar Cliente/Operação/Gestão. O seletor de papéis simula permissões: Atendimento consulta/cria/remarca/cancela e registra chegada/ausência; Gerente/Proprietário aprovam/recusam e gerenciam cadastros. Preparação não participa da E1. **Isso não representa autenticação ou autorização de produção.**

## Cliente e solicitações de dados

- Visão geral com contagens, próximos encontros e atalhos; lista por período/estado; detalhes somente do cliente fictício, sem mesa interna, com histórico e cancelamento permitido.
- Perfil com nome, e-mail e telefone opcional validados. Reservas anteriores preservam o contato da solicitação. Alteração de senha é simulada, sem receber senha no reducer nem armazená-la; os campos são limpos ao concluir.
- Dados pessoais: pedidos locais de acesso, exportação, correção ou exclusão. Correção exige descrição; exclusão exige ciência na interface. Apenas protocolo e histórico na sessão: não exporta, exclui, envia e-mail ou promete prazo. A política pública demonstrativa está em `/privacidade`, com link nesta área e na navegação dos painéis. Política definitiva e canal reais pendentes.

## Reservas e operação

`/reservas/nova` usa o mesmo cenário dos painéis. Criação pública/manual gera `PENDING_APPROVAL`, sem alocação. Aceite de Gerente/Proprietário revalida período/capacidade, escolhe a menor mesa compatível e só então confirma. Recusa exige motivo. Conflito mantém a solicitação pendente. Cancelamento permitido libera a mesa; cliente não cancela reserva de outro perfil. Equipe precisa informar motivo.

Remarcação da equipe valida o novo período antes de mudar a reserva: conflito preserva data, estado e mesa originais. Pendente continua sem alocação. Duração, tolerância, prazo de cancelamento e versão são guardados na solicitação para não mudar retroativamente com o editor de regras.

Fixtures de teste: `DEMO-001` e `DEMO-008` disputam a mesa de 6 lugares às 21h; `DEMO-002` permite chegada no relógio do cenário; `DEMO-003` permite ausência após tolerância; `DEMO-004` já tem chegada registrada. Mesa com check-in não é liberada pelo fim previsto; sua ocupação permanece conservadoramente bloqueada neste protótipo, até reiniciar o cenário. Encerramento operacional pertence à E2.

## Gestão

- Produtos reutilizam todos os mocks do catálogo (incluindo inativos), com busca/filtros, criação/edição, preço decimal, categoria, setor, publicação/disponibilidade/álcool independentes, imagem local com texto alternativo e declarações explícitas de alergênicos. Slug duplicado, preço inválido ou alergênico nos dois grupos são rejeitados.
- Categorias: criar/editar, ordenar e inativar, mostrando produtos afetados. Sem exclusão destrutiva.
- Ambientes/mesas: criar/editar, capacidade, código único e estado. Impede inativar ambiente/mesa ou reduzir capacidade/mover mesa quando incompatível com alocações. Permite bloquear intervalo futuro no mesmo dia, com motivo e sem conflito com reserva/ocupação.
- Funcionamento: um intervalo por dia com indicação explícita de término no dia seguinte, e exceção por data que substitui a semana. Mudança que invalidaria reserva futura alocada é bloqueada. Múltiplas faixas diárias serão refinadas na integração definitiva.
- Regras: duração 30–360 min em múltiplos de 15, tolerância 0–60, janela 1–365 dias e antecedências não negativas. Incrementa a versão do cenário; não altera duração/tolerância/cancelamento de solicitações anteriores.
- Equipe: convite e edição simulados, papéis fixos, e-mails únicos; Gerente não atribui nem edita Proprietário; preserva o último proprietário ativo. Convites não enviam mensagens.
- Configuração: dados institucionais fictícios; moeda e fuso fixos para consistência do cenário.
- Auditoria: registra alterações locais bem-sucedidas, sem senhas, com pesquisa por ação/autor/alvo. Relógio fixo do cenário, sem auditoria durável de servidor.

As edições de catálogo, configurações e política nos painéis **não publicam conteúdo nas páginas públicas**, que continuam usando os mocks institucionais originais. Essa limitação aparece nos editores. Regras, agenda e mesas editadas alimentam as consultas do cenário compartilhado.

## Verificação

`node tests/workspace.cjs` executa verificações do reducer: conflito entre aprovações, cancelamento por proprietário/prazo, recusa e estados finais, permissões, chegada/ausência, remarcação sem perda, criação compartilhada/versionamento, proteção de alocações, integridade do catálogo, último proprietário e solicitações de privacidade sem exclusão.

Verificados nesta entrega:

- `node tests/workspace.cjs`: 10 verificações de regras aprovadas.
- ESLint, TypeScript (`tsc --noEmit`) e build Webpack aprovados; 18 rotas de painéis geradas, incluindo três rotas de detalhe dinâmicas.
- Navegador: aprovação na operação refletida na conta do cliente; conflito entre aprovações; chegada; edição de preço decimal; bloqueio de inativação de mesa alocada; acesso negado com papel incompatível; criação pelo site e acompanhamento/cancelamento na conta; protocolo de exportação sem exclusão; edição de perfil; filtros sem resultado e reinício do cenário.
- Revisão visual desktop e celular de 390 px, incluindo funcionamento e dados pessoais, sem transbordamento horizontal da página. Navegação pelos demais cadastros de gestão conferida.

Os testes do protótipo não substituem transações, concorrência, autorização e testes de integração com MySQL planejados para o servidor.
