# Interfaces comerciais: inventário e entrega

Atualização: 06/11/2026. Esta entrega implementa as 26 telas ausentes identificadas na revisão do catálogo, além das ampliações das sete páginas existentes. A autorização do autor foi manter tudo demonstrativo, incluindo provedor de pagamento, estornos e condições de compra. Não foram definidos contatos, prazos comerciais ou taxas reais.

**Conferência posterior:** todas as rotas existem, mas a revisão dirigida encontrou lacunas de ações/indicadores e uma falha na busca da nova rodada. Ver `docs/conferencia-final-telas.md` para o parecer atual de completude. A cobertura de páginas não equivale à conclusão integral das interfaces.

## Inventário das novas telas

| ID do plano | Tela | Rota |
| --- | --- | --- |
| P09 | Condições de compra | `/politicas/compras` |
| C05 | Carrinho | `/carrinho` |
| C06 | Revisão da compra | `/checkout` |
| C07 | Retorno de pagamento | `/checkout/retorno` |
| C08 | Histórico de pedidos | `/conta/pedidos` |
| C09 | Pedido do cliente | `/conta/pedidos/[id]` |
| O04 | Mesas e visitas | `/operacao/mesas` |
| O05 | Comanda | `/operacao/comandas/[id]` |
| O06 | Nova rodada | `/operacao/comandas/[id]/pedidos/novo` |
| O07 | Preparação | `/operacao/preparo` |
| O08 | Retiradas | `/operacao/retiradas` |
| O09 | Recebimento da conta | `/operacao/contas/[id]` |
| O10 | Pagamentos | `/operacao/pagamentos` |
| O11 | Estorno | `/operacao/pagamentos/[id]/estorno` |
| O12 | Caixa | `/operacao/caixa` |
| G08 | Clientes | `/gestao/clientes` |
| G08 | Detalhe do cliente | `/gestao/clientes/[id]` |
| G09 | Estoque | `/gestao/estoque` |
| G09 | Detalhe do insumo | `/gestao/estoque/[id]` |
| G10 | Fichas técnicas | `/gestao/fichas-tecnicas` |
| G11 | Fornecedores | `/gestao/fornecedores` |
| G12 | Compras | `/gestao/compras` |
| G12 | Detalhe/recebimento da compra | `/gestao/compras/[id]` |
| G13 | Inventário e perdas | `/gestao/estoque/ajustes` |
| G14 | Relatórios | `/gestao/relatorios` |
| G17 | Integrações | `/gestao/integracoes` |

Os três detalhes sem URL definida no plano foram implementados com `[id]`, seguindo o padrão das demais rotas. Os 23 itens ausentes do catálogo correspondem, assim, a 26 páginas. Não há página comercial restante da lista de revisão sem uma rota nesta entrega.

## Páginas ampliadas

- Produto público: quantidade, adicionais, observação, estimativa e carrinho demonstrativo; indisponibilidade respeitada. O texto editorial público continua vindo do mock original, enquanto o seletor consulta o catálogo gerenciado do cenário e mostra a estimativa atual.
- Minha conta: pedidos ativos, histórico e atalho ao carrinho.
- Resumo do turno: comandas e pedidos em andamento, acesso ao salão, preparação e retiradas.
- Gestão: resumo comercial com vendas, recebimentos e estornos separados; acesso aos novos destinos pela navegação.
- Produto administrativo: cadastro/edição/inativação de adicionais, preço e limites mínimo/máximo do grupo demonstrativo.
- Funcionamento: segunda faixa semanal do salão, com preservação de reservas e prevalência de exceções; faixas do canal de retirada e pausa de novos pedidos.
- Auditoria: histórico comercial com data, ação, alvo, autor e instante, além da base de auditoria existente.

## Direção visual

Extensão do sistema existente, sem substituir a identidade: azul `#101328`, superfície `#171C32`, papel `#F2F1F7`, lavanda `#C4AEFA`, rosa `#EEB8CE` e cinza `#A8A9BC`; Syne para títulos e Manrope para tarefas e leitura. Operação e gestão priorizam tabelas, formulários e filas por estado. A página de condições usa a composição de leitura das políticas. Formulários ficam empilhados no celular; tabelas conservam rolagem própria. Não há gráficos decorativos ou métricas financeiras apresentadas como lucro.

## Cenário e regras demonstráveis

`CommerceProvider`, dentro de `DemoProvider`, compartilha o reducer puro de `src/lib/commerce/model.ts`. Não usa banco, armazenamento local ou chamadas de API. Recarregar restaura os fixtures; links Next preservam as alterações. Reiniciar o cenário nos painéis reinicia ambas as bases. Relógio: 05/11/2026 às 18h30, no horário de Aracaju.

- Dinheiro é calculado em centavos inteiros e formatado em BRL. Carrinho é estimativo; checkout revalida o catálogo. Mudança de preço exige atualizar o orçamento antes de criar o pedido.
- Pedido para retirada nasce aguardando pagamento. Confirmação fictícia libera preparação; falha/expiração liberam a reserva de estoque. Nova confirmação revalida o saldo. Pagamento já confirmado não é processado novamente.
- Comandas, rodadas e pagamentos são registros distintos. Mesa com comanda ativa não recebe outra visita. Reserva próxima impede entrada avulsa; chegada registrada pode ser vinculada à comanda.
- Fechamento bloqueia novas rodadas; recebimento não excede saldo. Encerrar exige quitação e rodadas entregues/canceladas. Visita vinculada passa a concluída e libera ocupação no cenário de reservas. Ocupação de comanda avulsa também participa da disponibilidade.
- A mesma rodada tem chave local para impedir reenvio do mesmo rascunho. Não é uma implementação distribuída de idempotência.
- Preparação filtra setor e busca. Transições respeitam os estados. Preparação não registra entrega à mesa; atendimento/gerência pode registrar. Retirada exige código correto e pedido pronto.
- Cancelamento preserva histórico e motivo. Cliente cancela somente seu pedido ainda não pago; após pagamento, a gerência avalia no cenário. Estorno tem processamento e resultado separados, sem apagar o pagamento original. Valores em processamento já reduzem o elegível.
- Caixa registra abertura, dinheiro aplicado, troco, suprimento, sangria e contagem. Cartão/Pix não aumentam dinheiro em gaveta. Devolução de dinheiro exige caixa aberto e saldo, sendo atribuída à sessão da devolução. Diferença de contagem é preservada.
- Estoque mostra físico, reservado, disponível e mínimo. As bases iniciais são fictícias em unidades, não receitas reais. Ficha técnica aceita unidade base, composição do produto e dos adicionais; pedidos conservam snapshot. Reserva ocorre no checkout/envio de rodada; início de preparo consome uma vez. Cancelamento após consumo não repõe fisicamente o insumo.
- Compra pode ter vários itens, é recebida integralmente e não duplica entrada. Contagem e perda exigem motivo e não podem reduzir físico abaixo do reservado.
- Clientes são somente os perfis fictícios necessários ao atendimento, sem exportação em massa. Gerência acessa cadastros; Caixa/Gerência acessam recebimentos; Preparação acessa sua fila. Esses controles são simulação de interface, não segurança de produção.
- Relatórios usam a data comercial fixa, mostram critérios de vendas/recebimentos/estornos e quantidades por produto, reservas e consumo/perdas. Não calculam lucro, taxas ou repasses.

## Limites e decisões ainda abertas

O front-end permite percorrer os fluxos, mas não conclui as entregas funcionais do servidor. Permanecem autenticação, autorização real, persistência, transações/concorrência, sessão, OpenAPI, envio de e-mail, provedor financeiro, webhooks, expiração por relógio real, observabilidade e implantação.

O estado do e-mail em Integrações é visual; não conecta os formulários de acesso a um serviço. O pagamento fictício influencia o checkout e os resultados simulados. Receitas, adicionais e informações alimentares precisam de validação real. Os adicionais sem composição cadastrada não geram consumo extra, o que está informado no editor de ficha.

Alertas de atraso e métricas de preparo reais dependem de eventos e relógio persistidos; a interface informa essa limitação, sem inventar SLA. Taxas de serviço e regras definitivas de desconto/cancelamento/devolução não foram acrescentadas como políticas reais. Fuso/moeda continuam fixos no cenário, e a retirada demonstrativa trabalha com faixas no mesmo dia. O conteúdo institucional original não é republicado automaticamente pelas edições administrativas.

## Verificação

- TypeScript, ESLint e build Webpack concluídos; as 26 rotas novas aparecem na compilação.
- 11 grupos de regras da E1 e 11 grupos comerciais aprovados: estoque atômico local, pagamento/retentativa, rodada repetida, saldo/troco, estornos, compra recebida uma vez, permissões, snapshots, ocupação/liberação, múltiplas faixas, mudança de preço e limites/composição dos adicionais.
- Navegador: compra completa até preparação e retirada com código; atendimento presencial com rodada, entrega, fechamento, abertura de caixa, recebimento com troco e liberação da mesa.
- As 26 páginas foram conferidas a 1280, 390 e 320 px, com um único título principal e sem transbordamento do documento. Tabelas têm sua região de rolagem.
- As sete páginas ampliadas também passaram em 390 e 768 px, com um título principal e sem transbordamento. Recebimento de compra foi conferido no navegador: entrada de 20 unidades refletida no estoque e repetição bloqueada.
- Sem certificação de acessibilidade ou teste completo em Safari/iOS, leitores de tela, dispositivos físicos ou rede/concorrência real.
