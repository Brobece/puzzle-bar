# Conferência de cobertura e completude das telas

Data: 06/11/2026. Revisão do catálogo inteiro do planejamento contra os arquivos atuais, conteúdo dos componentes e um teste dirigido no navegador. Esta revisão não altera a implementação.

## Resultado

Os 53 itens identificados por P, A, C, O e G no catálogo possuem rota. Existem 57 arquivos `page.tsx`: os 53 destinos principais e quatro detalhes de produto administrativo, cliente, estoque e compra. Não falta criar uma página do catálogo. A contagem não significa que todas as ações, indicadores e estados estão completos.

Os 22 grupos de testes de regras foram executados novamente e passaram. Esses testes não cobrem todas as interações da interface; a divergência de busca abaixo não foi detectada por eles.

## Pendências identificadas

| Prioridade | Local | Constatação | Ajuste necessário |
| --- | --- | --- | --- |
| Alta | Nova rodada, `commerce/operations.tsx`, função `NewRound` | Busca filtra as opções, mas não sincroniza o produto usado pelo formulário. No navegador, buscar Água mostra Água com Gás a R$ 7,00 no seletor, porém mantém estimativa de R$ 32,00 e adiciona Neon Tônica. | Usar uma seleção válida dentro dos resultados; não permitir adicionar quando a busca estiver vazia/sem resultados; verificar identidade e preço do item adicionado. |
| Alta | Pedidos online pagos, `commerce/shop.tsx` e `commerce/operations.tsx` | Cliente não pode cancelar após pagamento, conforme regra, mas também não existe ação correspondente de cancelamento gerencial de pedido online nas telas da equipe. O cancelamento da operação está exposto somente para rodadas presenciais. Estorno está disponível, mas não cancela o pedido. | Expor avaliação/cancelamento gerencial com motivo para pedido online, mantendo o estorno separado. |
| Média | Comanda/preparação, `commerce/operations.tsx` | Existe comando para cancelar item no reducer, mas as telas só expõem cancelamento da rodada inteira. | Acrescentar cancelamento justificado por item, com papel adequado, histórico e tratamento da situação de preparo. |
| Média | Relatórios, `commerce/admin.tsx`, função `ReportsPage` | Apresenta vendas, recebimentos, estornos, produtos, reservas e movimentos, mas não todos os indicadores da seção 13 do planejamento. | Completar ticket médio presencial/online e detalhamento de recebimentos por origem/meio; completar métricas de preparo quando os marcos estiverem disponíveis. |
| Média | Turno e preparação | O texto informa que tempos reais não são medidos. Não há apresentação calculada de tempo em fila ou destaque de atraso. | Completar a representação desses estados; limites de atraso precisam de definição operacional, sem inventar SLA. |

## Integrações e conteúdo real

Continuam pendentes, por escopo autorizado, autenticação, sessão, persistência, API, autorização de servidor, notificações, pagamentos e estornos reais. Estados de rede, envio em andamento, reconexão e sessão expirada precisam acompanhar a integração. Políticas definitivas, contatos, endereço, horários e receitas reais dependem das definições do estabelecimento.

Esses itens são diferentes das páginas ausentes: podem exigir componentes, estados e ações nas rotas existentes, sem obrigar novas páginas.

## Parecer

Cobertura de rotas: concluída. Completude das interfaces: ainda possui as pendências acima. Prontidão para produção: não concluída, conforme o caráter demonstrativo aprovado. A afirmação de que todas as telas estariam completas deve ser lida com esta correção, e não como aprovação integral dos fluxos.
