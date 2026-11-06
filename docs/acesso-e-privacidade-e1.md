# Complemento das interfaces da E1: acesso e privacidade

Data: 06/11/2026. Referências: planejamento, seções 8.1, 8.5, 17.3, 18.2 e 20.1; critérios de formulário em `cadastro-acesso.md`. Escopo desta entrega: as quatro páginas restantes da E1, sem antecipar E2–E4 ou integrar o back-end.

## Direção visual

Extensão da identidade existente. Acesso é uma tarefa de operação; privacidade é uma superfície de leitura. Azul-base `#101328`, superfície `#171C32`, branco gelo `#F2F1F7`, lavanda `#C4AEFA`, rosa `#EEB8CE` e cinza `#A8A9BC`. Syne nos títulos e Manrope nos formulários/textos. Conteúdo alinhado à esquerda, formulário em uma coluna, campos de 16 px e controles com foco visível.

```text
Acesso:     cabeçalho → caminho → título/vinil | aviso + tarefa + resultado
Celular:    cabeçalho → caminho → título → aviso + tarefa + resultado
Privacidade: cabeçalho → título/aviso → índice | texto por assunto
```

O vinil já estabelecido fica somente no acesso desktop. Não foram acrescentados cartões decorativos ou animações. A sugestão genérica de hospitality obtida na busca de design não se aplicava ao fluxo de acesso; foi descartada em favor do sistema existente. A busca específica de autenticação acessível confirmou colagem e gerenciadores de senha, rótulos e semântica nativa. A arquitetura continua prevendo Spring como responsável por autenticação e regras, sem criar Server Actions de negócio.

## Telas e navegação

| Interface | Implementação |
| --- | --- |
| P08 `/privacidade` | Documento demonstrativo sobre formulários, cenário em memória, acesso fictício, solicitações de dados e definições pendentes. Índice por assunto e links para perfil, dados pessoais e política de reservas. |
| A03 `/verificar-email` | Sem link: explica o cadastro e permite simular reenvio. Link de exemplo válido: confirmação explícita e resultado. Expirado, utilizado ou inválido: motivo e caminho de reenvio. |
| A04 `/recuperar-senha` | E-mail, validação junto ao campo, resposta genérica para qualquer endereço de formato válido e link fictício para continuar. |
| A05 `/redefinir-senha` | Sem link ou link inválido/expirado/utilizado: orienta a solicitar outro. Link de exemplo válido: senha de 12–128 caracteres e confirmação, alternância de visibilidade, validação e conclusão local. |

Cadastro bem-sucedido oferece a verificação. A entrada oferece “Esqueci minha senha” e confirmação de e-mail. Privacidade está no rodapé compartilhado, junto aos formulários de acesso e reserva, na navegação dos painéis e na área de dados pessoais.

## Limites do protótipo

- O autor confirmou que P08 permanece demonstrativa nesta etapa. Não foram inventados responsável, endereço de contato, base legal, prazo de retenção ou prazo de atendimento definitivos.
- O parâmetro público `exemplo` aceita `valido`, `expirado`, `usado` e `invalido`. Não é um token, não concede acesso e não possui validade de segurança. Valores desconhecidos/repetidos e URLs contendo `token` não liberam o formulário de redefinição. Nenhum token é validado ou exibido.
- As telas de verificação/redefinição usam `searchParams` assíncrono no servidor e estado inicial determinístico. Trocar o estado do link remonta o fluxo. As três rotas de acesso novas têm `noindex` e política de referência `no-referrer`.
- Recuperação e reenvio produzem a mesma resposta para qualquer e-mail sintaticamente válido. Não consultam existência de conta. Endereço é limpo após simular a solicitação.
- Um bloqueio local de 30 segundos após cada solicitação demonstra o estado de limite de envio. É fixture de interface, explicitado na tela, sem representar política definitiva ou proteção real contra abuso. O prazo real deverá ser definido e aplicado no Spring.
- Nova senha e confirmação ficam apenas no componente, são limpas ao concluir e não entram no cenário compartilhado. Não há alteração de credenciais, sessão ou conta; o login fictício original permanece igual.
- Não há chamada de API, envio de e-mail, armazenamento persistente ou consumo real/atômico de token. A integração deverá implementar expiração, uso único, rate limiting, tratamento de falhas e a política de invalidação de sessões.

## Verificação

TypeScript e ESLint das alterações aprovados. Build de produção Webpack gerou as quatro rotas novas; privacidade/recuperação são estáticas e verificação/redefinição são renderizadas por requisição por usarem `searchParams`.

No navegador: cadastro → verificação → reenvio → confirmação demonstrativa; entrada → recuperação → redefinição; erro de e-mail vazio com foco; senha vazia e confirmação divergente com foco e mensagens associadas; mostrar senha; conclusão com limpeza dos campos; links ausentes, expirados, utilizados e inválidos. Resposta de recuperação não depende da existência de conta. O botão de novo envio fica desabilitado durante o limite local.

As quatro páginas foram medidas em 320, 390, 768 e 1280 px: um único título principal e nenhum transbordamento do documento. Inspeção visual no desktop e a 390 px. Esta verificação não substitui testes de segurança do servidor, leitor de tela completo, Safari/iOS ou dispositivos físicos.

## Continuação

Não restam páginas-base da E1 no catálogo documentado. Ainda faltam integrações e estados decorrentes delas para cumprir os critérios funcionais: banco/migrations, contratos, identidade, catálogo publicado, estabelecimento, reserva transacional, notificações, auditoria durável e validação integrada. Convites e múltiplas faixas de funcionamento também precisam dos refinamentos previstos. As páginas comerciais de E2–E4 foram implementadas em uma entrega posterior, registrada em `docs/telas-comerciais.md`, também demonstrativa.
