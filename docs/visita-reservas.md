# Visite e reserva de mesa

## Telas

- `/visite`: proposta da visita em Aracaju, imagem conceitual e informações reais em definição. Não inventa endereço, contato, mapa ou acessibilidade.
- `/reservas/nova`: acionador de perfil fictício, formulário de pessoas/data/horário, consulta de disponibilidade e envio de proposta pendente ao cenário compartilhado.
- `/politicas/reservas`: política-base demonstrativa P07, com índice, versão `demo-approval-v1` e atualização editorial em 05/11/2026.
- `/conta/reservas` e detalhe: acompanhamento do cliente.
- `/operacao/reservas` e detalhe: análise, aprovação/recusa, remarcação, cancelamento e chegada/ausência pela equipe simulada.

## Cenário compartilhado

Detalhes em `docs/paineis-e1.md`. O provider raiz mantém os dados em memória enquanto se navega pelos links. Recarregar, abrir outra aba ou reiniciar o cenário restaura os fixtures. Nada é enviado ao bar; não há conta real, API, banco, notificações ou controle de acesso real.

Relógio fixo: 05/11/2026 às 18h30 em Aracaju. A consulta usa agenda, capacidade, regras, bloqueios e alocações do reducer compartilhado. A biblioteca `src/lib/reservations/demo.ts` permanece como referência do protótipo anterior e de formatação; as ações atuais usam `src/lib/workspace/model.ts`.

Solicitar não bloqueia mesa. Aprovar revalida e aloca, recusar exige motivo; cancelar e remarcar seguem regras demonstrativas. A janela padrão continua de 60 dias, duração de 120 min, antecedência/cancelamento de 120 min e tolerância de 15 min. O editor de gestão pode versionar regras do cenário. Duração, tolerância e cancelamento de solicitações anteriores são preservados.

## Links e política pública

Política acessível no rodapé, em Visite e junto ao consentimento/regras da reserva. Links da reserva abrem em outra aba com aviso; essa nova aba tem seu próprio cenário inicial. A política-base pública não é republicada pelo editor gerencial. Reserva e painéis explicam essa diferença.

## Pendências para operação real

Autenticação/sessão, API/MySQL, autorização, transações/idempotência, notificações e auditoria durável. Dados reais e prazo de análise ainda indefinidos. Múltiplas faixas de funcionamento e operação comercial de mesas exigem as integrações previstas nas próximas entregas.
