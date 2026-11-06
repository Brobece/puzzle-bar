import { categories, products, productImages, productAllergens } from '../catalog/mock-data';
import type { Product, Category } from '../catalog/types';

// A fixed scenario makes the prototype reproducible, including arrival windows.
export const scenarioDate = '2026-11-05';
export const scenarioNow = '2026-11-05T18:30:00-03:00';
export const customerId = 'cliente-demo';
export type Role = 'Atendimento' | 'Gerente' | 'Proprietário' | 'Preparação';
export type Status = 'PENDING_APPROVAL' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'CHECK_IN' | 'NO_SHOW';
export const statusLabels: Record<Status, string> = { PENDING_APPROVAL: 'Aguardando aprovação', CONFIRMED: 'Confirmada', REJECTED: 'Recusada', CANCELLED: 'Cancelada', CHECK_IN: 'Chegada registrada', NO_SHOW: 'Não compareceu' };
export type Visit = { date: string; time: string; partySize: number };
export type Reservation = Visit & { id: string; customerId: string; name: string; email: string; phone: string; notes: string; status: Status; tableId?: string; reason?: string; duration: number; cancelNotice: number; tolerance: number; policyVersion: string; history: string[] };
export type Room = { id: string; name: string; active: boolean };
export type Table = { id: string; code: string; roomId: string; capacity: number; active: boolean };
export type Block = { id: string; tableId: string; date: string; time: string; end: string; reason: string };
export type Rules = { duration: number; notice: number; advance: number; cancelNotice: number; tolerance: number; version: number };
export type Hours = { day: number; open: boolean; start: string; end: string; nextDay: boolean };
export type Exception = { date: string; closed: boolean; start: string; end: string; nextDay: boolean; reason: string };
export type Member = { id: string; name: string; email: string; role: Role; active: boolean };
export type ManagedProduct = Product & { image: string; alt: string; contains: string[]; mayContain: string[] };
export type PrivacyRequest = { id: string; type: string; detail: string; status: string };
export type Audit = { id: string; action: string; target: string; actor: string; detail: string; at: string };
export type DemoState = {
  role: Role; profile: { name: string; email: string; phone: string };
  reservations: Reservation[]; rooms: Room[]; tables: Table[]; blocks: Block[];
  rules: Rules; hours: Hours[]; exceptions: Exception[]; products: ManagedProduct[]; categories: Category[];
  team: Member[]; privacy: PrivacyRequest[]; audit: Audit[];
  config: { name: string; city: string; address: string; contact: string; timezone: string; currency: string };
  feedback: { error: boolean; text: string; sequence: number; scope?: string; fields?: Record<string, string> } | null;
};
export function initialState(): DemoState {
  const fixture = (id: string, name: string, status: Status, date: string, time: string, partySize: number, tableId?: string, own = false): Reservation => ({ id, name, status, date, time, partySize, tableId, customerId: own ? customerId : `convidado-${id}`, email: own ? 'cliente@stereo.example' : 'convidado@stereo.example', phone: '', notes: 'Solicitação fictícia para demonstrar a interface.', duration: 120, cancelNotice: 120, tolerance: 15, policyVersion: 'demo-approval-v1', history: ['Solicitação criada na agenda demonstrativa.'], ...(status === 'REJECTED' ? { reason: 'Sem capacidade para o período solicitado.' } : {}) });
  return {
    role: 'Gerente', profile: { name: 'Alex Exemplo', email: 'cliente@stereo.example', phone: '' },
    reservations: [
      fixture('DEMO-001', 'Alex Exemplo', 'PENDING_APPROVAL', scenarioDate, '21:00', 6, undefined, true),
      fixture('DEMO-002', 'Marina Exemplo', 'CONFIRMED', scenarioDate, '18:30', 4, 'm04'),
      fixture('DEMO-003', 'Rui Exemplo', 'CONFIRMED', scenarioDate, '18:00', 2, 'm02'),
      fixture('DEMO-004', 'Dani Exemplo', 'CHECK_IN', scenarioDate, '18:00', 8, 'm08'),
      fixture('DEMO-005', 'Alex Exemplo', 'CONFIRMED', '2026-11-06', '20:00', 4, 'm04', true),
      fixture('DEMO-006', 'Alex Exemplo', 'REJECTED', '2026-11-04', '19:00', 6, undefined, true),
      fixture('DEMO-007', 'Alex Exemplo', 'CANCELLED', '2026-11-03', '18:00', 2, undefined, true),
      fixture('DEMO-008', 'Bia Exemplo', 'PENDING_APPROVAL', scenarioDate, '21:00', 6),
    ],
    rooms: [{ id: 'salao', name: 'Salão principal', active: true }, { id: 'externa', name: 'Área externa', active: true }],
    tables: [2, 4, 6, 8].map(capacity => ({ id: `m0${capacity}`, code: `M0${capacity}`, capacity, roomId: capacity === 8 ? 'externa' : 'salao', active: true })), blocks: [],
    rules: { duration: 120, notice: 120, advance: 60, cancelNotice: 120, tolerance: 15, version: 1 },
    hours: Array.from({ length: 7 }, (_, day) => ({ day, open: day !== 1, start: '18:00', end: '00:00', nextDay: true })), exceptions: [],
    products: products.map(product => ({ ...product, image: productImages.find(image => image.productId === product.id)?.storageKey ?? '', alt: productImages.find(image => image.productId === product.id)?.altText ?? '', contains: productAllergens.filter(link => link.productId === product.id && link.noticeType === 'CONTAINS').map(link => link.allergenId), mayContain: productAllergens.filter(link => link.productId === product.id && link.noticeType === 'MAY_CONTAIN').map(link => link.allergenId) })),
    categories: categories.map(category => ({ ...category })),
    team: [{ id: 'owner', name: 'Jo Exemplo', email: 'proprietario@stereo.example', role: 'Proprietário', active: true }, { id: 'manager', name: 'Sam Exemplo', email: 'gerencia@stereo.example', role: 'Gerente', active: true }, { id: 'host', name: 'Nina Exemplo', email: 'atendimento@stereo.example', role: 'Atendimento', active: true }],
    privacy: [], audit: [{ id: 'AUD-001', action: 'Cenário iniciado', target: 'Demonstração', actor: 'Sistema', detail: 'Dados fictícios; nenhuma operação no servidor.', at: scenarioNow }],
    config: { name: 'STEREO', city: 'Aracaju, SE', address: '', contact: '', timezone: 'America/Sao_Paulo', currency: 'BRL' }, feedback: null,
  };
}
export const isManager = (role: Role) => role === 'Gerente' || role === 'Proprietário';
export const startOf = (visit: Visit) => Date.parse(`${visit.date}T${visit.time}:00-03:00`);
const clock = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
const overlaps = (start: number, end: number, otherStart: number, otherEnd: number) => start < otherEnd && end > otherStart;
export const allocated = (reservation: Reservation) => ['CONFIRMED', 'CHECK_IN'].includes(reservation.status);
export function visitError(state: DemoState, visit: Visit, duration = state.rules.duration) {
  const stamp = Date.parse(`${visit.date}T12:00:00-03:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(visit.date) || !Number.isFinite(stamp) || new Date(stamp).toISOString().slice(0, 10) !== visit.date || !/^([01]\d|2[0-3]):(00|30)$/.test(visit.time)) return 'Informe uma data válida e um horário em intervalos de 30 minutos.';
  if (!Number.isInteger(visit.partySize) || visit.partySize < 1 || visit.partySize > 20) return 'Informe de 1 a 20 pessoas. Não há junção automática de mesas.';
  const start = startOf(visit), now = Date.parse(scenarioNow);
  if (start < now + state.rules.notice * 60000 || visit.date > new Date(Date.parse(`${scenarioDate}T12:00:00Z`) + state.rules.advance * 86400000).toISOString().slice(0, 10)) return 'O período está fora da antecedência ou da janela permitida na agenda demonstrativa.';
  const exception = state.exceptions.find(item => item.date === visit.date);
  const hours = state.hours.find(item => item.day === new Date(stamp).getUTCDay())!;
  const activeHours = exception ? { open: !exception.closed, ...exception } : hours;
  const minute = clock(visit.time), end = clock(activeHours.end) + (activeHours.nextDay ? 1440 : 0);
  if (!activeHours.open || minute < clock(activeHours.start) || minute + duration > end) return 'O período inteiro precisa caber no funcionamento do salão.';
  return null;
}
export function availableTable(state: DemoState, visit: Visit, excludeId?: string, duration = state.rules.duration) {
  if (visitError(state, visit, duration)) return undefined;
  const start = startOf(visit), end = start + duration * 60000;
  return [...state.tables].filter(table => table.active && table.capacity >= visit.partySize && state.rooms.some(room => room.id === table.roomId && room.active)).sort((a, b) => a.capacity - b.capacity || a.code.localeCompare(b.code)).find(table =>
    !state.reservations.some(item => item.id !== excludeId && item.tableId === table.id && allocated(item) && overlaps(start, end, startOf(item), item.status === 'CHECK_IN' ? Infinity : startOf(item) + item.duration * 60000)) &&
    !state.blocks.some(block => block.tableId === table.id && overlaps(start, end, startOf({ ...block, partySize: 1 }), Date.parse(`${block.date}T${block.end}:00-03:00`)))
  );
}
export function canCancel(reservation: Reservation) {
  return reservation.status === 'PENDING_APPROVAL' || (reservation.status === 'CONFIRMED' && startOf(reservation) >= Date.parse(scenarioNow) + reservation.cancelNotice * 60000);
}
export type Command =
  | { type: 'role'; role: Role } | { type: 'clear' } | { type: 'reset' }
  | { type: 'reservation'; id: string; action: 'approve' | 'reject' | 'cancel' | 'checkin' | 'no-show' | 'reschedule'; customer?: boolean; reason?: string; visit?: Visit }
  | { type: 'create-reservation'; visit: Visit; notes: string; customer: boolean; name?: string; email?: string; phone?: string }
  | { type: 'profile'; profile: DemoState['profile'] }
  | { type: 'password' }
  | { type: 'privacy'; kind: string; detail: string }
  | { type: 'product'; product: ManagedProduct }
  | { type: 'category'; category: Category }
  | { type: 'table'; table: Table } | { type: 'room'; room: Room } | { type: 'block'; block: Omit<Block, 'id'> }
  | { type: 'hours'; hours: Hours[] } | { type: 'exception'; exception: Exception }
  | { type: 'rules'; rules: Rules } | { type: 'member'; member: Member }
  | { type: 'config'; config: DemoState['config'] };

export function demoReducer(state: DemoState, command: Command): DemoState {
  if (command.type === 'reset') return initialState();
  if (command.type === 'clear') return { ...state, feedback: null };
  if (command.type === 'role') return { ...state, role: command.role, feedback: null };
  const fail = (text: string) => ({ ...state, feedback: { error: true, text, sequence: (state.feedback?.sequence ?? 0) + 1 } });
  const invalid = (scope: string, fields: Record<string, string>) => ({ ...state, feedback: { error: true, text: 'Revise os campos indicados e tente salvar novamente.', sequence: (state.feedback?.sequence ?? 0) + 1, scope, fields } });
  const done = (patch: Partial<DemoState>, action: string, target: string, detail = 'Alteração aplicada apenas na memória desta demonstração.') => ({ ...state, ...patch, feedback: { error: false, text: `${action} na demonstração.`, sequence: (state.feedback?.sequence ?? 0) + 1 }, audit: [...state.audit, { id: `AUD-${state.audit.length + 1}`, action, target, at: scenarioNow, actor: ['profile', 'privacy', 'password'].includes(command.type) || (command.type === 'reservation' && command.customer) || (command.type === 'create-reservation' && command.customer) ? state.profile.name : state.role, detail }] });
  if (command.type === 'profile') {
    const profile = { ...command.profile, name: command.profile.name.trim(), email: command.profile.email.trim().toLowerCase(), phone: command.profile.phone.trim() };
    const fields: Record<string, string> = {};
    if (profile.name.length < 2 || profile.name.length > 120) fields.name = 'Nome: use de 2 a 120 caracteres.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email) || profile.email.length > 254) fields.email = 'E-mail: informe um endereço válido, como cliente@stereo.example.';
    if (profile.phone && (!/^\+?[\d\s().-]+$/.test(profile.phone) || profile.phone.replace(/\D/g, '').length < 10 || profile.phone.replace(/\D/g, '').length > 15 || profile.phone.length > 32)) fields.phone = 'Telefone: use de 10 a 15 dígitos com DDD ou deixe em branco.';
    if (Object.keys(fields).length) return invalid('profile', fields);
    return done({ profile }, 'Perfil atualizado', customerId, 'As reservas anteriores preservam o contato registrado na solicitação. E-mail não é verificado neste protótipo.');
  }
  if (command.type === 'password') return done({}, 'Troca de senha simulada', customerId, 'Nenhuma senha foi armazenada ou alterada.');
  if (command.type === 'privacy') {
    if (!['Acesso aos dados', 'Exportação', 'Correção', 'Exclusão'].includes(command.kind) || command.detail.length > 500 || (command.kind === 'Correção' && !command.detail.trim())) return fail('Escolha a solicitação e descreva o que deseja corrigir, quando necessário.');
    const id = `DADOS-${state.privacy.length + 1}`;
    return done({ privacy: [...state.privacy, { id, type: command.kind, detail: command.detail.trim(), status: 'Aguardando análise (simulação)' }] }, 'Solicitação registrada', id, 'Protocolo local; nada enviado e nenhum dado excluído.');
  }
  if (command.type === 'create-reservation') {
    if (!command.customer && state.role === 'Preparação') return fail('O papel simulado não permite criar reservas.');
    const error = visitError(state, command.visit);
    if (error) return fail(error);
    if (!availableTable(state, command.visit)) return fail('Não há uma mesa compatível nesse período.');
    const name = command.customer ? state.profile.name : command.name?.trim();
    if (!name || name.length < 2 || command.notes.length > 240) return fail('Informe o nome fictício e uma observação com até 240 caracteres.');
    const id = `DEMO-${String(state.reservations.length + 1).padStart(3, '0')}`;
    return done({ reservations: [...state.reservations, { ...command.visit, id, customerId: command.customer ? customerId : `avulso-${id}`, name, email: command.customer ? state.profile.email : (command.email ?? ''), phone: command.customer ? state.profile.phone : (command.phone ?? ''), notes: command.notes, status: 'PENDING_APPROVAL', duration: state.rules.duration, cancelNotice: state.rules.cancelNotice, tolerance: state.rules.tolerance, policyVersion: `demo-approval-v${state.rules.version}`, history: ['Solicitação criada; aguardando análise e aprovação.'] }] }, 'Solicitação criada', id, 'Sem alocação de mesa; aprovação necessária.');
  }
  if (command.type === 'reservation') {
    const item = state.reservations.find(item => item.id === command.id);
    if (!item) return fail('Reserva não encontrada.');
    if (command.customer && (item.customerId !== customerId || command.action !== 'cancel')) return fail('Esta ação não está disponível para o cliente demonstrativo.');
    if (!command.customer && (state.role === 'Preparação' || (['approve', 'reject'].includes(command.action) && !isManager(state.role)))) return fail('Ação não permitida para o papel simulado.');
    const next = { ...item, history: [...item.history] };
    if (command.action === 'approve') {
      if (item.status !== 'PENDING_APPROVAL') return fail('Somente solicitações pendentes podem ser aprovadas.');
      const table = availableTable(state, item, item.id, item.duration);
      if (!table) return fail('Conflito de disponibilidade. A solicitação permanece pendente e nenhuma mesa foi alocada.');
      next.status = 'CONFIRMED'; next.tableId = table.id;
    } else if (command.action === 'reject') {
      if (item.status !== 'PENDING_APPROVAL' || !command.reason?.trim()) return fail('A recusa exige uma solicitação pendente e um motivo.');
      next.status = 'REJECTED'; next.reason = command.reason.trim();
    } else if (command.action === 'cancel') {
      if (command.customer ? !canCancel(item) : !['PENDING_APPROVAL', 'CONFIRMED'].includes(item.status) || !command.reason?.trim()) return fail('Cancelamento fora do prazo, estado incompatível ou motivo da equipe não informado.');
      next.status = 'CANCELLED'; next.tableId = undefined; next.reason = command.customer ? 'Cancelada pelo cliente demonstrativo.' : command.reason;
    } else if (command.action === 'checkin' || command.action === 'no-show') {
      const minutes = (Date.parse(scenarioNow) - startOf(item)) / 60000;
      if (item.status !== 'CONFIRMED' || (command.action === 'no-show' ? minutes < item.tolerance : minutes < -item.tolerance || minutes > item.tolerance)) return fail('Ação fora da janela de chegada ou estado incompatível. Confira o relógio do cenário.');
      next.status = command.action === 'checkin' ? 'CHECK_IN' : 'NO_SHOW';
      if (next.status === 'NO_SHOW') next.tableId = undefined;
    } else {
      if (!['PENDING_APPROVAL', 'CONFIRMED'].includes(item.status) || !command.visit || !command.reason?.trim()) return fail('Informe novo período e motivo para remarcar uma reserva pendente ou confirmada.');
      const error = visitError(state, command.visit, item.duration);
      if (error) return fail(error);
      const table = availableTable(state, command.visit, item.id, item.duration);
      if (!table) return fail('Novo período indisponível. A reserva original foi preservada.');
      Object.assign(next, command.visit, { tableId: item.status === 'CONFIRMED' ? table.id : undefined });
    }
    const action = { approve: 'Reserva aprovada', reject: 'Solicitação recusada', cancel: 'Reserva cancelada', checkin: 'Chegada registrada', 'no-show': 'Ausência registrada', reschedule: 'Reserva remarcada' }[command.action];
    next.history.push(`${action}${command.reason ? `: ${command.reason}` : '.'}`);
    return done({ reservations: state.reservations.map(item => item.id === next.id ? next : item) }, action, item.id, command.reason?.trim() || 'Decisão simulada no relógio fixo do cenário.');
  }
  if (!isManager(state.role)) return fail('Somente Gerente ou Proprietário pode alterar a gestão nesta simulação.');
  if (command.type === 'product') {
    const product = command.product;
    const fields: Record<string, string> = {};
    if (!product.name.trim() || product.name.length > 120) fields.name = 'Nome: informe até 120 caracteres.';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) fields.slug = 'Slug: use letras minúsculas, números e hífens entre palavras.';
    else if (state.products.some(item => item.id !== product.id && item.slug === product.slug)) fields.slug = 'Slug já utilizado: escolha outro identificador para este produto.';
    if (!product.description.trim() || product.description.length > 2000) fields.description = 'Descrição: informe até 2.000 caracteres.';
    if (!/^\d{1,10}\.\d{2}$/.test(product.price)) fields.price = 'Preço: informe um valor válido com duas casas decimais.';
    if (!state.categories.some(category => category.id === product.categoryId)) fields.category = 'Categoria: selecione uma categoria cadastrada.';
    if (product.image && !productImages.some(image => image.storageKey === product.image)) fields.image = 'Imagem: selecione uma das ilustrações locais.';
    if ((product.image && !product.alt.trim()) || product.alt.length > 300) fields.alt = 'Texto alternativo: descreva a imagem em até 300 caracteres.';
    if (product.contains.some(id => product.mayContain.includes(id))) fields.contains = 'Alergênicos: cada item deve estar em apenas um dos grupos.';
    if (Object.keys(fields).length) return invalid(`product:${product.id}`, fields);
    return done({ products: state.products.some(item => item.id === product.id) ? state.products.map(item => item.id === product.id ? product : item) : [...state.products, product] }, 'Produto salvo', product.name);
  }
  if (command.type === 'category') {
    const category = command.category;
    const fields: Record<string, string> = {};
    if (!category.name.trim() || category.name.length > 100) fields.name = 'Nome: informe até 100 caracteres para a categoria.';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(category.slug)) fields.slug = 'Slug: use letras minúsculas, números e hífens entre palavras.';
    else if (state.categories.some(item => item.id !== category.id && item.slug === category.slug)) fields.slug = 'Slug já utilizado: escolha outro identificador para a categoria.';
    if (!Number.isInteger(category.displayOrder) || category.displayOrder < 0) fields.order = 'Ordem: informe um número inteiro a partir de zero.';
    if (Object.keys(fields).length) return invalid(`category:${category.id}`, fields);
    return done({ categories: state.categories.some(item => item.id === category.id) ? state.categories.map(item => item.id === category.id ? category : item) : [...state.categories, category] }, 'Categoria salva', category.name);
  }
  if (command.type === 'room') {
    const room = command.room;
    if (!room.name.trim() || (!room.active && state.reservations.some(item => allocated(item) && state.tables.some(table => table.id === item.tableId && table.roomId === room.id)))) return fail('Ambiente sem nome ou com reservas alocadas. Resolva as reservas antes de inativar.');
    return done({ rooms: state.rooms.some(item => item.id === room.id) ? state.rooms.map(item => item.id === room.id ? room : item) : [...state.rooms, room] }, 'Ambiente salvo', room.name);
  }
  if (command.type === 'table') {
    const table = command.table;
    if (!table.code.trim() || !Number.isInteger(table.capacity) || table.capacity < 1 || table.capacity > 20 || !state.rooms.some(room => room.id === table.roomId && room.active) || state.tables.some(item => item.id !== table.id && item.code.toLowerCase() === table.code.toLowerCase())) return fail('Revise código único, capacidade de 1 a 20 e ambiente ativo.');
    const affected = state.reservations.filter(item => allocated(item) && item.tableId === table.id);
    if (affected.some(item => !table.active || item.partySize > table.capacity || state.tables.find(item => item.id === table.id)?.roomId !== table.roomId)) return fail(`${affected.length} reserva(s) alocada(s) podem ser afetadas. Resolva essas reservas antes de mudar a mesa.`);
    return done({ tables: state.tables.some(item => item.id === table.id) ? state.tables.map(item => item.id === table.id ? table : item) : [...state.tables, table] }, 'Mesa salva', table.code);
  }
  if (command.type === 'block') {
    const block = command.block, start = startOf({ ...block, partySize: 1 }), end = Date.parse(`${block.date}T${block.end}:00-03:00`);
    if (!block.reason.trim() || !Number.isFinite(start) || !Number.isFinite(end) || end <= start || start < Date.parse(scenarioNow) || !state.tables.some(table => table.id === block.tableId && table.active)) return fail('Informe mesa ativa, período futuro válido no mesmo dia e motivo.');
    if (state.reservations.some(item => allocated(item) && item.tableId === block.tableId && overlaps(start, end, startOf(item), item.status === 'CHECK_IN' ? Infinity : startOf(item) + item.duration * 60000))) return fail('O bloqueio conflita com uma reserva ou chegada registrada. A reserva foi preservada.');
    return done({ blocks: [...state.blocks, { ...block, id: `BLOQ-${state.blocks.length + 1}` }] }, 'Bloqueio criado', block.tableId);
  }
  if (command.type === 'hours' || command.type === 'exception') {
    const schedules = command.type === 'hours' ? command.hours : [command.exception];
    if (schedules.some(item => !/^([01]\d|2[0-3]):[0-5]\d$/.test(item.start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(item.end) || clock(item.end) + (item.nextDay ? 1440 : 0) <= clock(item.start) || clock(item.end) + (item.nextDay ? 1440 : 0) - clock(item.start) > 1440)) return fail('Revise os intervalos e a indicação de término no dia seguinte.');
    if (command.type === 'exception' && (!/^\d{4}-\d{2}-\d{2}$/.test(command.exception.date) || !command.exception.reason.trim())) return fail('Informe data e motivo da exceção.');
    const patch = command.type === 'hours' ? { hours: command.hours } : { exceptions: [...state.exceptions.filter(item => item.date !== command.exception.date), command.exception] };
    const candidate = { ...state, ...patch };
    if (state.reservations.some(item => allocated(item) && startOf(item) >= Date.parse(scenarioNow) && visitError({ ...candidate, rules: { ...candidate.rules, notice: 0 } }, item, item.duration))) return fail('O funcionamento proposto afeta reservas alocadas. Resolva essas reservas antes de salvar.');
    return done(patch, 'Funcionamento salvo', command.type === 'hours' ? 'Semana do salão' : command.exception.date);
  }
  if (command.type === 'rules') {
    const rules = command.rules;
    if (!Object.values(rules).every(Number.isInteger) || rules.duration < 30 || rules.duration > 360 || rules.duration % 15 !== 0 || rules.tolerance < 0 || rules.tolerance > 60 || rules.notice < 0 || rules.cancelNotice < 0 || rules.advance < 1 || rules.advance > 365) return fail('Duração: 30–360 min, múltiplo de 15; tolerância: 0–60; janela: 1–365 dias; antecedências não negativas.');
    return done({ rules: { ...rules, version: state.rules.version + 1 } }, 'Regras versionadas', `demo-approval-v${state.rules.version + 1}`, 'Novas solicitações usam a nova duração; períodos já solicitados são preservados.');
  }
  if (command.type === 'member') {
    const member = command.member;
    const previous = state.team.find(item => item.id === member.id);
    if (!member.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email) || state.team.some(item => item.id !== member.id && item.email.toLowerCase() === member.email.toLowerCase())) return fail('Informe nome e e-mail único válidos.');
    if (state.role !== 'Proprietário' && (member.role === 'Proprietário' || previous?.role === 'Proprietário')) return fail('Gerente não pode atribuir ou alterar o papel de Proprietário.');
    const team = previous ? state.team.map(item => item.id === member.id ? member : item) : [...state.team, member];
    if (!team.some(item => item.role === 'Proprietário' && item.active)) return fail('O último proprietário ativo não pode ser removido ou inativado.');
    return done({ team }, 'Equipe atualizada', member.name, 'Convite e mudança de permissões apenas simulados. Nenhum e-mail enviado.');
  }
  if (command.type === 'config') {
    if (!command.config.name.trim() || !command.config.city.trim() || command.config.timezone !== 'America/Sao_Paulo' || command.config.currency !== 'BRL') return fail('Informe nome e cidade; esta demonstração opera em BRL e no fuso America/Sao_Paulo.');
    return done({ config: command.config }, 'Configuração salva', command.config.name);
  }
  return state;
}
