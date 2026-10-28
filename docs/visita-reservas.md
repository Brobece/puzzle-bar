# Visite e reserva de mesa

## Telas

- `/visite`: proposta da visita em Aracaju, imagem conceitual, informações reais ainda em definição e acesso à solicitação de mesa. Não inventa endereço, contato, mapa, acessibilidade nem horários reais.
- `/reservas/nova`: acesso demonstrativo, formulário de grupo/data, consulta de horários, revisão e solicitação pendente. Apresenta cancelamento e controles explícitos de simulação do aceite/recusa da equipe.

Preserva cores, tipografia, cabeçalho/rodapé e menu animado do STEREO. Home e navegação compartilhada apontam às novas rotas. Layout de reserva com formulário à esquerda e regras à direita; as colunas se empilham no celular. Visite combina texto e imagem do ambiente com recorte em arco.

## Decisão de negócio

O autor alterou o fluxo: reserva depende de conta e aprovação administrativa/moderação, em vez de confirmação automática. A disponibilidade é informativa. O envio cria `PENDING_APPROVAL`; só o aceite verifica novamente e aloca mesa/intervalo, retornando `CONFIRMED`. Recusa produz `REJECTED` e exige motivo. Cliente pode cancelar, gerando `CANCELLED`.

Pendências não retêm capacidade. Propostas concorrentes podem existir; o aceite precisa repetir a consulta e usar transação/constraints no back-end futuro. No modelo definitivo, período desejado pertence à proposta e a FK de alocação é nula até a confirmação. Gerente/Proprietário são o mapeamento inicial proposto para o aceite, sem construir novos níveis/editor de permissões nesta entrega.

## Recorte local implementado

Não há conta real, senhas, autenticação, permissões, API, banco, persistência ou notificações. O botão de acesso ativa um perfil fictício nesta página. Estado fica em memória do React e é apagado ao recarregar ou sair; navegação para outra página também descarta o formulário. Não são solicitados nome, telefone ou e-mail reais.

A seção “Simular análise da equipe” está disponível deliberadamente ao demonstrador para validar a interface. Não representa controle de acesso ou painel de produção. A interface diferencia sempre envio, aprovação e demonstração.

## Fixtures e cálculo

Regras em `frontend/src/lib/reservations/demo.ts`:

- Mesas ativas com capacidades 2, 4, 6 e 8; uma mesa de 12 inativa verifica exclusão por estado.
- Agenda fictícia de terça a domingo, 18h–00h; segunda fechada. Esses horários são apenas para testar e não definem a operação do bar.
- Slots de chegada a cada 30 min, 18h–22h, com duração de 120 min; último intervalo termina à meia-noite seguinte.
- Antecedência mínima de 2 horas e limite de 60 dias no fuso `America/Sao_Paulo`. Instantes dos fixtures usam o offset -03:00; integração futura deverá derivá-los da configuração IANA do estabelecimento.
- Bloqueios mockados para demonstrar indisponibilidade. Comparação por intervalos semiabertos `[início, fim)`, sem sobreposição nos limites exatos.
- Escolha da menor mesa ativa com capacidade suficiente, desempate por ID; sem junção automática.
- Consultar/enviar não aloca. Aceitar revalida e adiciona uma alocação local; cancelar confirmação a remove, se dentro do prazo. Pendente pode ser cancelada antes da decisão.
- Edição de pessoas/data invalida a consulta e o horário selecionado. Envio exige opção válida e aceite da condição de aprovação.
- Protocolos DEMO são identificadores locais, não códigos de reserva reais. Motivo de recusa é obrigatório. Estados finais não permitem repetir aceite/recusa.

## Validação

Lint, TypeScript e build. Verificações de regras: capacidade, mesa inativa, data inválida/passada/fora da janela, dia fechado, antecedência, limites dos intervalos, virada de dia, conflito entre aprovações e cancelamento. No navegador: bloqueio por acesso demonstrativo, grupo acima da capacidade, consulta, seleção, consentimento, envio pendente, aprovação, cancelamento/liberação, nova proposta, recusa com motivo obrigatório e revisão responsiva.

## Pendências para operação real

Autenticação e sessão no servidor; dados de contato e política pública; API e banco; autorização e auditoria de decisões; revalidação transacional e idempotência; gestão de calendário/exceções; notificações e acompanhamento de solicitações em conta própria. Prazo de análise e dados reais do estabelecimento devem ser definidos antes de publicar reservas reais.
