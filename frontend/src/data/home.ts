// Conteúdo temporário para o protótipo. Trocar pela API quando os contratos existirem.
export const menuHighlights = [
  {
    name: "House Bitter",
    description: "Cobre, maltada e sem pressa. A primeira pint da casa.",
    note: "Chope da casa",
    tone: "brass",
  },
  {
    name: "Schnitzel de balcão",
    description: "Crocante, mostarda escura e salada de batata morna.",
    note: "Para dividir — ou não",
    tone: "oxblood",
  },
  {
    name: "Pretzel & butter",
    description: "Assado no dia, sal grosso e manteiga batida com ervas.",
    note: "Sai quente",
    tone: "forest",
  },
] as const;

export const weeklyHours = [
  { days: "Segunda", hours: "Fechado" },
  { days: "Terça — Quinta", hours: "18h — 00h" },
  { days: "Sexta — Sábado", hours: "18h — 02h" },
  { days: "Domingo", hours: "17h — 23h" },
] as const;

export const events = [
  {
    day: "QUI",
    date: "08",
    title: "Pub quiz",
    detail: "Times de até 6 pessoas · 20h",
  },
  {
    day: "SEX",
    date: "09",
    title: "Vinil no balcão",
    detail: "Soul, indie e clássicos · 21h",
  },
] as const;
