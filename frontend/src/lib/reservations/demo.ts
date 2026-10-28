export type Table = { id: string; capacity: number; active: boolean };
export type Allocation = { tableId: string; startsAt: string; endsAt: string };
export type Visit = { date: string; partySize: number; time: string };
export type ReservationRequest = Visit & {
  id: string;
  status: 'PENDING_APPROVAL' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
  notes: string;
};
export const demoTables: Table[] = [
  { id: 'm02', capacity: 2, active: true },
  { id: 'm04', capacity: 4, active: true },
  { id: 'm06', capacity: 6, active: true },
  { id: 'm08', capacity: 8, active: true },
  { id: 'm12-inactive', capacity: 12, active: false },
];
export const demoPolicy = { durationMinutes: 120, minNoticeMinutes: 120, maxAdvanceDays: 60, version: 'demo-approval-v1' } as const;
export const timeOptions = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];
export function todayInAracaju(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  return ['year', 'month', 'day'].map(key => parts.find(part => part.type === key)!.value).join('-');
}
export function addDays(date: string, days: number) {
  return new Date(Date.parse(`${date}T12:00:00Z`) + days * 86400000).toISOString().slice(0, 10);
}
export function interval(date: string, time: string) {
  const startsAt = `${date}T${time}:00-03:00`;
  return { startsAt, endsAt: new Date(Date.parse(startsAt) + demoPolicy.durationMinutes * 60000).toISOString() };
}
function seededAllocations(date: string): Allocation[] {
  return [
    { tableId: 'm02', startsAt: `${date}T19:00:00-03:00`, endsAt: `${date}T21:00:00-03:00` },
    { tableId: 'm04', startsAt: `${date}T19:00:00-03:00`, endsAt: `${date}T21:00:00-03:00` },
    { tableId: 'm08', startsAt: `${date}T19:00:00-03:00`, endsAt: `${date}T21:00:00-03:00` },
    { tableId: 'm06', startsAt: `${date}T20:00:00-03:00`, endsAt: `${date}T22:00:00-03:00` },
  ];
}
export function validateVisit(date: string, partySize: number, now = new Date()): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(`${date}T12:00:00Z`)) || new Date(`${date}T12:00:00Z`).toISOString().slice(0, 10) !== date) return 'Escolha uma data válida.';
  const today = todayInAracaju(now);
  if (date < today || date > addDays(today, demoPolicy.maxAdvanceDays)) return 'Escolha uma data entre hoje e os próximos 60 dias.';
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 20) return 'Informe entre 1 e 20 pessoas.';
  if (partySize > Math.max(...demoTables.filter(table => table.active).map(table => table.capacity))) return 'Neste exemplo, as mesas atendem grupos de até 8 pessoas. Não há junção automática de mesas. Tente um grupo menor.';
  if (new Date(`${date}T12:00:00Z`).getUTCDay() === 1) return 'Segunda-feira está fechada na agenda demonstrativa. Escolha outro dia.';
  return null;
}
export function findTable(visit: Visit, allocations: Allocation[] = [], now = new Date()) {
  if (validateVisit(visit.date, visit.partySize, now) || !timeOptions.includes(visit.time)) return undefined;
  const { startsAt, endsAt } = interval(visit.date, visit.time);
  const start = Date.parse(startsAt), end = Date.parse(endsAt);
  if (start < now.getTime() + demoPolicy.minNoticeMinutes * 60000) return undefined;
  const blocks = [...seededAllocations(visit.date), ...allocations];
  return [...demoTables].filter(table => table.active && table.capacity >= visit.partySize)
    .sort((a, b) => a.capacity - b.capacity || a.id.localeCompare(b.id))
    .find(table => !blocks.some(block => block.tableId === table.id && start < Date.parse(block.endsAt) && end > Date.parse(block.startsAt)));
}
export function checkAvailability(date: string, partySize: number, allocations: Allocation[] = [], now = new Date()) {
  const error = validateVisit(date, partySize, now);
  if (error) return { error, slots: [] };
  const slots = timeOptions.map(time => ({ time, available: !!findTable({ date, partySize, time }, allocations, now) }));
  return { error: slots.some(slot => slot.available) ? null : 'Não há horários disponíveis para esse grupo nessa data. Tente outro dia ou uma quantidade menor de pessoas.', slots };
}
export function formatVisitDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date(`${date}T12:00:00Z`));
}

export function canCancelRequest(request: ReservationRequest, now = new Date()) {
  return request.status === 'PENDING_APPROVAL' || (request.status === 'CONFIRMED' && Date.parse(interval(request.date, request.time).startsAt) >= now.getTime() + demoPolicy.minNoticeMinutes * 60000);
}
