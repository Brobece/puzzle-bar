# Cardápio demonstrativo do STEREO

## Referência e escopo

Baseado no planejamento, seções 6.3 (modelo lógico), 17.3 (modelo físico), 8.1 (P03/P04) e 20.1 (publicação e disponibilidade). Páginas de consulta em `/cardapio` e `/cardapio/[slug]`, sem back-end, pedidos ou carrinho. Cada cartão oferece acesso à página individual e uma prévia rápida em diálogo acessível. Produtos, preços, receitas, alergênicos e imagens são exemplos fictícios, explicitados na interface.

## Modelo dos mocks

| Coleção | Relação e função |
| --- | --- |
| categories | Pertence a um estabelecimento; nome, slug, ordem e ativo |
| products | `categoryId` referencia categoria; preço, setor de preparo, ativo, disponível e alcoólico são propriedades independentes |
| productImages | `productId` referencia produto; chave do arquivo local, texto alternativo e ordem |
| allergens | Vocabulário de alergênicos com ID, nome e código |
| productAllergens | Associação produto/alergênico com `CONTAINS` ou `MAY_CONTAIN`; declarações explícitas para receitas fictícias |

Tipos em `frontend/src/lib/catalog/types.ts`; fixtures em `mock-data.ts`; montagem do catálogo público em `catalog.ts`. As coleções representam as relações previstas no banco; não colocamos categorias ou alergênicos como textos soltos em cada produto. IDs legíveis são referências locais dos mocks, não UUIDs de produção. Preços são strings decimais com duas casas, alinhadas a DECIMAL(12,2); conversão para Number ocorre apenas na formatação BRL/pt-BR, sem cálculo financeiro.

`getPublicCatalog()` monta o modelo de leitura com categoria, imagens ordenadas e avisos de alergênicos. Executa no servidor da página, excluindo produtos/categorias inativos antes de enviar ao componente interativo. A futura integração pode substituir essa fonte por consultas à API, mantendo os tipos e o componente de apresentação após adaptação do contrato real. Os nomes e avisos alimentares não são inferidos pela interface.

## Amostras e regras verificáveis

- 4 categorias públicas: Drinks, Cervejas, Pra dividir e Sem álcool.
- 11 produtos públicos e ilustrados. Sunset Spritz está ativo, porém indisponível, para demonstrar pausa operacional.
- Um produto arquivado e uma categoria inativa com um produto ativo permanecem apenas nos fixtures e não são publicados.
- Produto sem associações alimentares mostra informação não cadastrada; não recebe alegação de ausência de alergênicos.
- Busca por nome, descrição/ingredientes e categoria ignora acentos e caixa, combinada com categoria e disponibilidade.
- Estado sem resultados permite limpar todos os filtros.
- Diálogo apresenta descrição completa, preço, disponibilidade e avisos. Fecha por botão, Escape ou clique no fundo e devolve foco ao acionador.
- Imagens SVG locais ilustrativas em `frontend/public/images/menu/`, criadas em código. Sem dependência de URLs externas.
- Sem adicionais/opções ainda: grupo_opcao e opcao_produto pertencem à E2 no planejamento. Sem carrinho/pagamento (E3).

## Página individual de produto (P04 — E1)

Implementada em `/cardapio/[slug]`, por exemplo `/cardapio/neon-tonica`. Reutiliza `getPublicCatalog()` por meio de `getPublicProduct(slug)`, sem duplicar fixtures. Produtos inativos, categorias inativas e slugs inexistentes acionam `notFound()` com uma tela própria e link de retorno; produtos ativos indisponíveis continuam públicos, com aviso explícito.

Apresenta imagens ordenadas (ou fallback sem imagem), categoria, nome, descrição, preço em BRL, disponibilidade, indicação de bebida alcoólica e associações explícitas de alergênicos. Sem associações, informa que os dados não foram cadastrados, sem declarar ausência de alergênicos. Sugestões da mesma categoria usam apenas produtos públicos, excluindo o atual. Cabeçalho/rodapé compartilhados, breadcrumb, link para pular conteúdo e retorno ao cardápio. Layout em duas colunas no desktop e empilhado no celular.

As 11 páginas públicas são pré-renderizadas a partir dos mocks, com título e descrição por produto. Adicionais e carrinho continuam nas entregas futuras previstas no planejamento.

Validação da P04: lint, TypeScript e build aprovados; respostas HTTP 200 para Neon Tônica, Mini Burgers e Sunset Spritz (indisponível), e 404 para produto arquivado, categoria inativa e slug inexistente. Revisão visual em desktop e celular de 390 px, navegação entre cardápio/produto e prévia rápida com Escape e retorno de foco verificadas no navegador.

## Direção e validação

Preserva cores e fontes do STEREO. Abertura editorial curta, categorias e busca acima da grade de produtos, ilustrações com fundo azul e acentos rosa/lavanda. Layout em três, duas ou uma coluna conforme a largura. Navegação de home/Sobre aponta ao cardápio; seção de balcão da home possui convite para explorá-lo.

Verificados lint, TypeScript, build, integridade dos IDs/referências, preços decimais, unicidades, arquivos de imagens, publicação de ativos e associações de alergênicos. No navegador: detalhes com contém/pode conter, Escape e retorno do foco, busca sem acentos, resultado vazio, limpeza e combinação de categoria/disponibilidade. Revisão responsiva de desktop e celular.
