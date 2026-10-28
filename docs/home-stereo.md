# Home do STEREO

Primeira interface institucional em `/`. O estabelecimento está em planejamento: não há datas de abertura, endereço, horários, artistas, preços ou reservas disponíveis confirmados. Links navegam entre seções existentes, sem criar confirmações fictícias.

## Direção

Bar amplo em Aracaju-SE para conversar, encontrar amigos e ouvir eletrohits (aproximadamente 85% da música ambiente), com DJs convidados em algumas noites. A música acompanha a convivência.

Cores: azul profundo #101328; branco gelo #F2F1F7; lavanda #C4AEFA; rosa #EEB8CE; cinza #A8A9BC. Fontes Syne para marca/títulos e Manrope para leitura, hospedadas pelo Next.js. Tipografia de marca ampla é o elemento de destaque; demais seções têm composição tranquila.

Estrutura escolhida: marca ampla sobre cena do ambiente, textos alinhados à esquerda e encerramento centralizado. Uma abertura centrada em palco/DJ foi descartada porque colocaria a festa acima da experiência cotidiana de bar.

```text
[marca pequena]    [navegação]    [conheça]
[                  STEREO               ]
[ ambiente conceitual / título e convite ]
[ proposta da casa     | contexto local  ]
[ identidade musical  | seletor de clima ]
[ composição de drink | balcão          ]
[ convidados          | agenda em breve ]
[           visita / abertura em breve  ]
```

## Comportamento e validação

Navegação por âncoras, menu móvel com botão acessível, vinil com giro de 800 ms e painel com transição de opacidade e deslocamento na entrada e na saída e seletor musical com três estados em React; sem reprodução de áudio. Layout responsivo, foco visível, link de pular conteúdo, idioma pt-BR, títulos semânticos e rolagem sem animação quando há preferência por movimento reduzido; por solicitação explícita do autor, as transições acionadas pelo clique no menu permanecem ativas. Lint e compilação com Webpack; Turbopack apresentou falha de subprocesso neste ambiente, portanto os scripts usam Webpack.

O cardápio, as reservas e a programação ainda precisam de telas próprias e integração. O texto atual explicita a preparação da casa. A P01 é uma primeira versão institucional, não a conclusão funcional da E1.

## Imagem conceitual

Arquivo: `frontend/public/images/stereo-interior.webp`.
Gerada com a ferramenta integrada imagegen e convertida para WebP. Não retrata um estabelecimento existente.

Prompt utilizado:

> Use case: photorealistic-natural. Create a cinematic editorial architectural photograph, wide landscape aspect ratio, for the home page of STEREO, a future large electronic music listening bar in Aracaju Brazil. Imagined venue concept, NOT concert hall or dance nightclub. An inviting generous bar interior, long brushed steel bar counter at right, dark wood stools, cozy tables in foreground, architectural lavender light tubes overhead, subtle dusty pink light and warm table lamps, large hi-fi loudspeakers. A few adult friends seated in conversation in middle distance, no crowd, no DJ stage, no text, no logos. Wide angle professional photography at eye level, beautiful realistic materials, analog subtle grain, deep indigo shadows and lavender light, sophisticated hospitality editorial photograph. Main detail on right and center, left more atmospheric. The space should feel relaxed and social with electronic music in the background.

## Página Sobre (P02)

Implementada em `/sobre`, com cabeçalho/rodapé compartilhados com a home e indicação da rota atual. A navegação de ambas as páginas inclui Sobre e links para as seções musicais, de balcão, convidados e visita na home. O menu móvel mantém as transições do vinil e do painel.

A página apresenta a origem da proposta em Aracaju, eletrohits como aproximadamente 85% da música ambiente, espaço para convivência e convidados ocasionais. Mantém azul profundo, lavanda, rosa, Syne e Manrope. A abertura editorial combina texto à esquerda e vinil estático à direita, seguido do ambiente conceitual, contexto da ideia, experiência e convite final. Em celular as colunas se empilham. Reutiliza a imagem conceitual já gerada; não inventa datas, endereço ou programação.

```text
[cabeçalho compartilhado / Sobre ativo]
[caminho: Início / Sobre]
[manifesto da casa           | vinil]
[           ambiente conceitual    ]
[origem da ideia            | texto]
[encontros                  | música / espaço / convidados]
[          Aracaju / links à home  ]
[          abertura em breve       ]
[rodapé compartilhado]
```
