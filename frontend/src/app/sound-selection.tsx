"use client";
import { useState } from 'react';
const selections = [
  { name: 'Eletrohits', mood: 'A memória sabe o caminho.', description: 'Refrões que ficaram, sintetizadores que você conhece. Os clássicos da eletrônica têm lugar cativo na nossa ideia de noite.', genres: ['Dance dos anos 2000', 'Electropop', 'Clássicos de pista'], label: 'A essência do STEREO' },
  { name: 'Pra conversar', mood: 'O papo também tem seu ritmo.', description: 'House leve, grooves e descobertas para acompanhar a mesa. Uma seleção que deixa espaço para a conversa acontecer.', genres: ['Deep house', 'Nu disco', 'Grooves leves'], label: 'Pra chegar e ficar' },
  { name: 'Com convidados', mood: 'Outra seleção. A mesma sintonia.', description: 'Em noites especiais, DJs convidados trazem suas referências para a casa. Cada encontro, um jeito de ouvir a noite.', genres: ['House', 'Disco', 'Seleções autorais'], label: 'Em noites especiais' },
];
export function SoundSelection() {
  const [active, setActive] = useState(0);
  const selection = selections[active];
  return <div className="sound-player"><div className="sound-options" role="group" aria-label="Conheça os momentos musicais">{selections.map((item, index) => <button key={item.name} type="button" aria-pressed={active === index} onClick={() => setActive(index)}>{item.name}</button>)}</div><div className="sound-content" aria-live="polite"><div className="record" aria-hidden="true"><div className="record-label">stereo<span>♪</span></div></div><div className="record-info"><span className="selection-label">{selection.label}</span><h3>{selection.mood}</h3><p>{selection.description}</p><ul>{selection.genres.map(genre => <li key={genre}>{genre}</li>)}</ul></div></div><div className="sound-footnote"><span className="equalizer" aria-hidden="true"><i/><i/><i/><i/></span>Um pouco do que inspira a casa. Sem reprodução de áudio.</div></div>;
}
