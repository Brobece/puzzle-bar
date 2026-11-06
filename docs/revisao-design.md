# Revisão de design do STEREO

Data: 05/11/2026. O diagnóstico abaixo registra a revisão inicial da interface com a skill `frontend-design`. O acabamento autorizado posteriormente está registrado ao final deste documento.

## Parecer

A identidade é coerente com um bar de eletrohits: marca tipográfica forte, fotografia de ambiente, azul profundo, lavanda, rosa e elementos musicais reconhecíveis. A home tem um elemento memorável e as páginas mantêm a mesma família visual. A base pode ser preservada.

Ainda há ajustes antes de considerar o acabamento concluído: contraste das bordas dos campos, tamanho de leitura, abertura dos formulários no celular, um transbordamento na página Sobre e simplificação dos painéis. “Atual” é uma avaliação de adequação ao público e à tarefa; não há uma aparência única obrigatória para sites contemporâneos.

## Como foi revisado

- Inspeção do planejamento, estilos, componentes e navegação.
- Visita a 29 URLs, cobrindo os 27 padrões de rota implementados e os estados extras de produto indisponível e criação de produto.
- Medições de largura, títulos e tipografia no navegador a 1280 px, 390 px e 320 px; amostra adicional do cabeçalho a 768 px. A largura útil desconta a barra de rolagem: por exemplo, 390 px de viewport corresponderam a 375 px úteis em parte das capturas.
- Capturas representativas de home, Sobre, Visite, cardápio, produto, política, acesso, reserva e painéis. Estados de formulário fechado são parte do levantamento; não houve execução exaustiva de cada estado interativo.
- Menu móvel: abertura e Escape com retorno do foco. Modal do cardápio: abertura, Escape e foco no acionador. Link de pular conteúdo: alcançado pelo teclado, com contorno rosa visível.
- Critérios técnicos comparados às explicações oficiais da WCAG 2.2. Sem avaliação completa com leitor de tela, Safari/iOS, zoom de texto a 200%, Core Web Vitals ou dispositivos físicos; não é uma certificação de acessibilidade.

## Achados por prioridade

### P1 — Bordas de campos vazios têm pouco contraste

O cadastro/entrada usa fundo `#101328` e borda branca com aproximadamente 25% de opacidade. O contraste calculado da borda é aproximadamente **2,2:1 contra o interior** e **2,0:1 contra o painel externo**. Nos campos dos painéis, a borda branca com 20,8% fica em aproximadamente **1,9:1 contra o interior**.

Essas bordas identificam a área editável quando o campo está vazio; devem ser reforçadas ou acompanhadas de outra indicação visual suficiente. A referência para informação visual necessária à identificação de controles é **3:1**, com as exceções descritas pelo W3C. Não é necessário reforçar toda linha decorativa do site. [WCAG 1.4.11 — contraste não textual](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

Pontos de implementação: [auth.module.css](C:/Users/jguic/Documentos/puzzle-bar/frontend/src/app/auth.module.css:29) e [workspace.module.css](C:/Users/jguic/Documentos/puzzle-bar/frontend/src/app/workspace/workspace.module.css:78).

### P2 — A leitura está pequena em muitas tarefas

Campos de acesso medem 13 px; campos dos painéis, 12 px; seletores de papel, 11 px. Textos auxiliares, metadados, avisos e tabelas frequentemente ficam entre 9 e 11 px. Textos minúsculos nos rótulos dos vinis são decorativos e não foram tratados como o mesmo problema de conteúdo essencial.

Recomendo uma escala com corpo de 16 px como ponto inicial, 14–16 px em interfaces densas e 12–14 px para informação secundária. Ajustar por função e testar o conjunto, sem ampliar indiscriminadamente tudo. **Esses tamanhos são uma recomendação de projeto, não um mínimo em pixels exigido pela WCAG.** A WCAG exige contraste e possibilidade de ampliação de texto sem perda de conteúdo/funcionalidade. [Contraste de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [ampliação de texto](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html).

A paleta de texto principal não precisa ser substituída: o cinza `#A8A9BC` sobre `#101328` apresentou aproximadamente **7,9:1** de contraste. A prioridade é escala e uso, além dos contornos de controles.

### P2 — A abertura do login empurra a tarefa para baixo

No viewport de 390 × 844 px, o primeiro campo da entrada começou em **y ≈ 849 px**, e o botão de entrada em **y ≈ 1011 px**. No cadastro, o primeiro campo começou em **y ≈ 824 px**. Introdução, texto explicativo, aviso e ação de preencher exemplo ocupam quase a primeira tela antes do formulário.

Para acesso e cadastro, compactar a abertura móvel e aproximar os campos do título. Manter um aviso claro de demonstração, evitando repetir a mesma explicação em vários blocos. O hero expressivo continua adequado para a home; em acesso e edição, a tarefa merece prioridade.

Referências: [auth-shell.tsx](C:/Users/jguic/Documentos/puzzle-bar/frontend/src/app/auth-shell.tsx:10) e [auth.module.css](C:/Users/jguic/Documentos/puzzle-bar/frontend/src/app/auth.module.css:47).

### P2 — Sobre apresenta pequeno transbordamento horizontal

Em `/sobre`, com viewport de 390 px, o documento mediu **387 px de conteúdo para 375 px úteis**, com barra horizontal visível: aproximadamente 12 px excedentes. A causa exata deve ser isolada antes da correção, incluindo transformações/pseudoelementos do elemento decorativo; não foi determinada só pelas caixas dos elementos.

Não apareceu transbordamento do documento nas outras URLs medidas a 390 px, nem nas 29 URLs a 320 px. A tabela administrativa usa uma região própria de rolagem. Não atribuo falha automática ao critério de reflow em 320 px, pois esse teste não apresentou o problema. [WCAG 1.4.10 — reflow e suas exceções](https://www.w3.org/WAI/WCAG22/Understanding/reflow/).

Referência: [sobre.module.css](C:/Users/jguic/Documentos/puzzle-bar/frontend/src/app/sobre/sobre.module.css:10). Corrigir o elemento responsável, evitando apenas ocultar o transbordamento do documento inteiro.

### P2 — Painéis podem ser mais diretos

A gestão repete os mesmos destinos na navegação e em oito cartões grandes. No celular, cabeçalho, lista de áreas, navegação, aviso e indicadores antecedem as tarefas. A consistência existe, mas há pouca diferença entre o destaque de uma ação e o de um aviso ou atalho.

Recomendo agrupar os cadastros em listas compactas, reservar cartões para informações que precisem de agrupamento e reduzir repetições. Usar nomes funcionais nos títulos internos, como “Produtos” e “Agenda de reservas”, mantendo a voz musical nos espaços institucionais. Trata-se de hierarquia e eficiência, não de proibir cartões ou linguagem de marca.

Referências: [management.tsx](C:/Users/jguic/Documentos/puzzle-bar/frontend/src/app/workspace/management.tsx:12) e [workspace.module.css](C:/Users/jguic/Documentos/puzzle-bar/frontend/src/app/workspace/workspace.module.css:42).

### P2 — Erros de negócio precisam orientar o campo correto

O acesso já possui mensagens associadas aos campos. Parte da gestão, porém, concentra feedback no topo e usa mensagens que enumeram vários campos ao mesmo tempo. No produto, por exemplo, uma duplicidade de slug pode produzir uma lista genérica sobre nome, slug, descrição, preço, categoria, imagem e alergênicos.

Retornar motivo específico, marcar o campo correspondente e preservar o resumo quando houver vários erros. O foco no feedback geral é útil, mas não substitui a orientação junto à entrada.

Referências: [model.ts](C:/Users/jguic/Documentos/puzzle-bar/frontend/src/lib/workspace/model.ts:163) e [ui.tsx](C:/Users/jguic/Documentos/puzzle-bar/frontend/src/app/workspace/ui.tsx:36). Achado por inspeção do código; não foi provocado cada erro no navegador nesta revisão.

### P3 — Padronização de detalhes

- A seta diagonal aparece tanto em links quanto em botões de salvar. Remover a indicação de navegação de ações que apenas salvam; manter ícones quando ajudarem a compreender o resultado.
- Evitar labels decorativos e títulos repetidos em tarefas internas. Números de seção da política não precisam parecer etapas obrigatórias.
- Centralizar escala de texto, espaçamento, bordas e superfícies em tokens, aproveitando as variáveis existentes. Hoje há muitas repetições de valores de superfície e tipografia.
- Definir áreas de toque confortáveis, especialmente em fechar mensagem e ações secundárias. WCAG 2.2 AA admite alvos de 24 × 24 CSS px ou suas exceções, incluindo espaçamento; 44 px é uma meta de conforto para ações frequentes, não uma exigência AA universal. Não declaro falha de alvo só pelo tamanho do ícone. [WCAG 2.5.8 — tamanho mínimo de alvo](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum/).

## O que preservar

- Marca ampla e fotografia de ambiente na home: apresentam o bar e a convivência.
- Syne e Manrope, com funções distintas e identidade consistente.
- Paleta de azul, lavanda, rosa e branco gelo; contrastes principais favoráveis nas combinações medidas.
- Layout de produto com imagem, preço, disponibilidade e informações alimentares identificáveis.
- Rótulos visíveis, idioma pt-BR, foco de teclado, link de pular conteúdo, modal nativo e estados descritos por texto.
- Movimento discreto e ausência de áudio automático. A animação do menu acionada por clique é uma preferência explícita já documentada; foi respeitada na revisão.
- Avisos de conteúdo fictício. Podem ser mais compactos sem perder clareza.

## Direção para uma próxima passagem de refinamento

Preservar seis cores: azul-base `#101328`, superfície `#171C32`, branco gelo `#F2F1F7`, lavanda `#C4AEFA`, rosa `#EEB8CE` e cinza `#A8A9BC`. Criar papéis de borda/foco/estado com contraste verificado, em vez de multiplicar opacidades avulsas.

Manter Syne na marca e títulos; Manrope no conteúdo e controles, com escala mais legível. Conteúdo alinhado à esquerda, exceto encerramentos institucionais deliberadamente centralizados. Priorizar uma expressão marcante na home e clareza nos painéis.

```text
Site:     marca + ambiente → proposta da casa → cardápio / visita
Acesso:   título curto → aviso compacto → campos → ação principal
Painéis:  título funcional + ação → filtros → lista / editor → feedback
```

Ordem de trabalho: contraste dos controles e tipografia; abertura móvel dos formulários e transbordamento; hierarquia dos painéis e erros; acabamento dos tokens/ícones. Não há necessidade identificada de substituir a identidade visual.

## Acabamento aplicado

A identidade do STEREO foi preservada: Syne e Manrope, azul profundo, lavanda, rosa, fotografia de ambiente, marca ampla e elementos musicais. A passagem de acabamento usou `frontend-design` e o roteiro de refinamento de `impeccable`, com contexto obtido diretamente da documentação e do código existentes.

- **Controles:** borda semântica `--control-border: #777B95`, aplicada a acesso, cadastro, busca do cardápio, reservas e editores dos painéis. Contraste calculado: **4,41:1** contra `#101328`, **4,05:1** contra `#171C32` e **3,47:1** contra `#242842`. As divisórias decorativas continuam discretas.
- **Leitura:** corpo base de 16 px, campos editáveis de 16 px e informação auxiliar de pelo menos 12 px nos fluxos revisados. Textos pequenos de vinis continuam decorativos. Tabelas usam algarismos tabulares.
- **Acesso móvel:** abertura mais curta, aviso demonstrativo compacto, credenciais sob divulgação opcional e política junto ao formulário. A ação de preencher exemplo continua disponível. O primeiro campo da entrada passou de aproximadamente **y = 849 px para y = 586 px** em 390 × 844 px; a ação principal passou de y = 1011 px para y = 760 px. No cadastro, o primeiro campo passou de y = 824 px para y = 540 px.
- **Sobre:** o transbordamento do pseudoelemento transformado foi contido no próprio vinil com `overflow: clip`, preservando a rotação e a sombra. O documento passou a medir **375 px de conteúdo para 375 px úteis** na largura de 390 px.
- **Painéis:** títulos funcionais, remoção dos rótulos redundantes sobre os títulos e agrupamento dos oito atalhos administrativos em três listas: Cardápio, Operação e Administração. No celular, um seletor substitui a lista extensa de navegação, mantendo as transições dentro do mesmo cenário.
- **Validação:** perfil, produtos e categorias têm resumo de erros com foco e atalhos para os campos. Rótulos, instruções e erros são ligados por identificadores e `aria-describedby`; controles inválidos recebem `aria-invalid`. O formulário conserva o preenchimento até a correção. A simulação de senha também identifica o campo correspondente.
- **Detalhes:** ações de salvar deixaram de usar seta de navegação; fechar mensagens e prévias ganhou alvo de 44 px; o reinício fecha sua confirmação; a entrada ganhou indicação de página atual. A política deixou de numerar tópicos que não são etapas. A preferência de animação do menu foi mantida.
- **Quebras de largura:** botões da seleção musical podem ocupar novas linhas em telas estreitas. O menu compacto do site aparece até 900 px para acomodar a escala de leitura maior em tablets.

### Verificação do acabamento

Build de produção e ESLint concluídos. Os **11 grupos de testes** do domínio passaram, incluindo identificação dos campos inválidos, preservação de registros e recuperação após correção. O build também concluiu a verificação de TypeScript.

No navegador, foram conferidos os fluxos de acesso com dados de exemplo, cadastro inválido, erro e correção do perfil, navegação móvel e erros simultâneos do editor de produto. Também foram verificados o bloqueio por papel simulado, o fechamento da confirmação de reinício, menu e diálogo com Escape e retorno de foco.

As **29 URLs passaram sem transbordamento do documento a 320, 390 e 1280 px**, com um único título principal por página. A amostra de **10 URLs a 768 px** também passou sem transbordamento após o ajuste do cabeçalho. A tabela administrativa conserva sua região própria de rolagem. As limitações da revisão inicial para dispositivos físicos, Safari/iOS, leitor de tela completo, zoom de texto e métricas de desempenho continuam aplicáveis.

Este acabamento mantém o escopo demonstrativo da E1: não acrescenta autenticação real, persistência, envio ao bar ou publicação das alterações administrativas no catálogo público.

### Correção do ambiente de desenvolvimento

Após o acabamento, foi relatada uma divergência de hidratação em `/gestao`: o HTML continha a navegação móvel nova enquanto o cliente esperava diretamente o bloco de identidade anterior. O código atual renderizava as duas variantes de navegação no servidor e no cliente; uma abertura nova não reproduziu o erro. Os logs registravam bloqueio dos recursos de atualização automática para a origem `127.0.0.1`, consistente com uma aba usando código antigo.

A configuração passou a permitir explicitamente essa origem local com `allowedDevOrigins`. A instância de desenvolvimento na porta 3000 foi reiniciada, e somente o cache gerado `.next/dev` foi removido para recompilação. O componente mantém as duas variantes na árvore inicial, com visibilidade controlada por CSS.

Verificação: abertura e recarga em `localhost:3000` e `127.0.0.1:3000`, navegação móvel para Produtos e atualização Fast Refresh concluída sem erros de hidratação. TypeScript e ESLint da configuração passaram. Abas abertas antes do reinício devem ser recarregadas para receber o cliente atual.
