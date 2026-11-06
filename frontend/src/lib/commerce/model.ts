import { products } from '../catalog/mock-data';
import type { DemoState } from '../workspace/model';
import { customerId, isManager, scenarioNow, startOf } from '../workspace/model';

export const cents = (value: string) => /^\d{1,9}(\.\d{1,2})?$/.test(value) ? Math.round(Number(value) * 100) : NaN;
export const brl = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value / 100);
export type Pick = { productId: string; quantity: number; optionIds: string[]; notes: string; quotedUnit?: number };
export type Option = { id: string; productId: string; name: string; price: number; active: boolean };
export type Ingredient = { id: string; name: string; unit: 'un' | 'ml' | 'g'; physical: number; reserved: number; minimum: number; active: boolean };
export type Recipe = { productId: string; optionId?: string; ingredientId: string; quantity: number };
export type Line = Pick & { id: string; name: string; unitPrice: number; options: string[]; station: string; status: 'PENDENTE' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE' | 'CANCELADO'; stock: { id: string; quantity: number }[]; consumed: boolean };
export type Order = { id: string; customerId: string; tabId?: string; status: string; code: string; contact: string; lines: Line[]; history: string[]; stockHeld: boolean };
export type Tab = { id: string; tableId: string; reservationId?: string; name: string; status: 'ABERTA' | 'EM_FECHAMENTO' | 'FECHADA'; history: string[] };
export type Payment = { id: string; account: string; amount: number; status: 'PENDENTE' | 'CONFIRMADO' | 'FALHOU' | 'EXPIRADO'; method: string; sessionId?: string; change: number };
export type Refund = { id: string; paymentId: string; amount: number; reason: string; sessionId?: string; status: 'PROCESSANDO' | 'CONFIRMADO' | 'FALHOU' };
export type Supplier = { id: string; name: string; contact: string; active: boolean };
export type Purchase = { id: string; supplierId: string; status: 'PLANEJADA' | 'RECEBIDA'; lines: { ingredientId: string; quantity: number; cost: number }[]; reference: string };
export type Commerce = {
  cart: Pick[]; orders: Order[]; tabs: Tab[]; payments: Payment[]; refunds: Refund[]; options: Option[]; optionRules: Record<string,{ min: number; max: number }>;
  ingredients: Ingredient[]; recipes: Recipe[]; suppliers: Supplier[]; purchases: Purchase[];
  movements: { id: string; ingredientId: string; quantity: number; reason: string }[];
  sessions: { id: string; initial: number; counted?: number; expected?: number; status: 'ABERTO' | 'FECHADO' }[];
  cashMoves: { sessionId: string; amount: number; reason: string }[];
  events: { id: string; action: string; target: string; actor: string; detail: string; at: string }[];
  integrations: { payment: boolean; email: boolean };
  pickup: { paused: boolean; start: string; end: string; ranges: { start: string; end: string }[] };
  releasedReservations: string[]; processedRequests: string[]; lastOrder?: string; lastTab?: string; sequence: number;
  feedback: { text: string; error: boolean; sequence: number } | null;
};
export type Action =
  | { type: 'reset' | 'clear' | 'requote' }
  | { type: 'cart-add'; item: Pick } | { type: 'cart-quantity'; index: number; quantity: number }
  | { type: 'checkout'; contact: string; accepted: boolean }
  | { type: 'open-tab'; tableId: string; name: string }
  | { type: 'send-order'; tabId: string; items: Pick[]; requestKey?: string }
  | { type: 'tab-close-request' | 'tab-close'; id: string }
  | { type: 'pay'; account: string; amount: number; method: string; tendered: number }
  | { type: 'payment-result'; id: string; result: Payment['status'] }
  | { type: 'prepare'; orderId: string; lineId: string; next: Line['status']; reason?: string }
  | { type: 'cancel-order'; id: string; reason: string; own?: boolean }
  | { type: 'pickup'; id: string; code: string }
  | { type: 'refund'; paymentId: string; amount: number; reason: string }
  | { type: 'refund-result'; id: string; result: Refund['status'] }
  | { type: 'ingredient'; ingredient: Ingredient }
  | { type: 'stock-adjust'; id: string; quantity: number; reason: string; kind: 'count' | 'loss' }
  | { type: 'recipe'; productId: string; optionId?: string; ingredientId: string; quantity: number }
  | { type: 'option-rules'; productId: string; min: number; max: number }
  | { type: 'supplier'; supplier: Supplier }
  | { type: 'purchase'; supplierId: string; lines: Purchase['lines']; reference: string }
  | { type: 'receive'; id: string }
  | { type: 'cash-open'; initial: number } | { type: 'cash-move'; amount: number; reason: string } | { type: 'cash-close'; counted: number }
  | { type: 'integration'; channel: 'payment' | 'email' }
  | { type: 'pickup-hours'; paused: boolean; start: string; end: string; ranges: { start: string; end: string }[] }
  | { type: 'option'; option: Option };

export function initialCommerce(): Commerce {
  const ingredients = products.map((p, i) => ({ id: `base-${p.id}`, name: `Base de exemplo: ${p.name}`, unit: 'un' as const, physical: i === 6 ? 8 : 60, reserved: 0, minimum: 10, active: true }));
  const state: Commerce = { cart: [], orders: [], tabs: [{ id: 'COM-001', tableId: 'm08', reservationId: 'DEMO-004', name: 'Dani Exemplo', status: 'ABERTA', history: ['Comanda aberta após chegada.'] }], payments: [], refunds: [],
    options: [{ id: 'op-burger', productId: 'p-burger', name: 'Adicional de exemplo', price: 300, active: true }], optionRules: {}, ingredients,
    recipes: products.map(p => ({ productId: p.id, ingredientId: `base-${p.id}`, quantity: 1 })),
    suppliers: [{ id: 'FOR-001', name: 'Fornecedor Exemplo', contact: 'fornecedor@stereo.example', active: true }],
    purchases: [{ id: 'CMP-001', supplierId: 'FOR-001', status: 'PLANEJADA', reference: 'Reposição fictícia', lines: [{ ingredientId: 'base-p-fries', quantity: 20, cost: 1000 }] }],
    movements: [], sessions: [], cashMoves: [], events: [], integrations: { payment: true, email: false }, pickup: { paused: false, start: '18:00', end: '23:00', ranges: [] }, releasedReservations: [], processedRequests: [], sequence: 10, feedback: null,
  };
  const fixture = (id: string, status: string, productId: string, quantity: number): Order => {
    const p = products.find(x => x.id === productId)!;
    return { id, status, customerId, code: id === 'PED-001' ? 'RET-101' : 'RET-102', contact: 'Alex Exemplo', lines: [{ id: `${id}-item`, productId, name: p.name, quantity, unitPrice: cents(p.price), optionIds: [], options: [], notes: '', station: p.preparationStation, status: status === 'PRONTO' ? 'PRONTO' : 'PENDENTE', consumed: status === 'PRONTO', stock: [{ id: `base-${p.id}`, quantity }] }], history: ['Pedido fictício criado às 18h20.'], stockHeld: true };
  };
  state.orders = [fixture('PED-001', 'PRONTO', 'p-fries', 1), fixture('PED-002', 'AGUARDANDO_PAGAMENTO', 'p-neon', 2)];
  state.ingredients.find(i => i.id === 'base-p-fries')!.physical -= 1;
  state.ingredients.find(i => i.id === 'base-p-neon')!.reserved = 2;
  state.payments = [{ id: 'PAG-001', account: 'PED-001', amount: 2800, status: 'CONFIRMADO', method: 'Provedor fictício', change: 0 }, { id: 'PAG-002', account: 'PED-002', amount: 6400, status: 'PENDENTE', method: 'Provedor fictício', change: 0 }];
  return state;
}
export const lineTotal = (line: Line) => line.status === 'CANCELADO' ? 0 : line.unitPrice * line.quantity;
export const orderTotal = (order: Order) => order.lines.reduce((sum, line) => sum + lineTotal(line), 0);
export function due(state: Commerce, account: string) {
  const tab = state.tabs.find(t => t.id === account);
  return state.orders.filter(o => tab ? o.tabId === account : o.id === account).reduce((sum, o) => sum + (o.status === 'CANCELADO' ? 0 : orderTotal(o)), 0);
}
export function paid(state: Commerce, account: string) { return state.payments.filter(p => p.account === account && p.status === 'CONFIRMADO').reduce((sum, p) => sum + p.amount, 0); }
export const balance = (state: Commerce, account: string) => Math.max(0, due(state, account) - paid(state, account));
export const eligible = (state: Commerce, paymentId: string) => {
  const p = state.payments.find(p => p.id === paymentId);
  return p?.status === 'CONFIRMADO' ? p.amount - state.refunds.filter(r => r.paymentId === paymentId && r.status !== 'FALHOU').reduce((s, r) => s + r.amount, 0) : 0;
};
export function cashExpected(s: Commerce) {
  const session = s.sessions.find(x => x.status === 'ABERTO');
  return session ? session.initial + s.cashMoves.filter(m => m.sessionId === session.id).reduce((sum, m) => sum + m.amount, 0) + s.payments.filter(p => p.sessionId === session.id && p.method === 'Dinheiro' && p.status === 'CONFIRMADO').reduce((sum, p) => sum + p.amount, 0) - s.refunds.filter(r=>r.sessionId===session.id && r.status==='CONFIRMADO').reduce((sum,r)=>sum+r.amount,0) : 0;
}
const code = (prefix: string, s: Commerce) => `${prefix}-${String(++s.sequence).padStart(3, '0')}`;
function stock(s: Commerce, id: string, quantity: number, reason: string) {
  const ingredient = s.ingredients.find(i => i.id === id)!; ingredient.physical += quantity;
  s.movements.unshift({ id: code('MOV', s), ingredientId: id, quantity, reason });
}
function hold(s: Commerce, lines: Line[]) {
  const totals: Record<string, number> = {};
  lines.filter(l => l.status !== 'CANCELADO' && !l.consumed).forEach(l => l.stock.forEach(r => { totals[r.id] = (totals[r.id] ?? 0) + r.quantity; }));
  for (const [id, quantity] of Object.entries(totals)) {
    const i = s.ingredients.find(i => i.id === id); if (!i?.active || i.physical - i.reserved < quantity) throw new Error('Estoque insuficiente. Revise os itens ou reponha o insumo na gestão.');
  }
  for (const [id, quantity] of Object.entries(totals)) s.ingredients.find(i => i.id === id)!.reserved += quantity;
}
function release(s: Commerce, order: Order) {
  if (!order.stockHeld) return;
  order.lines.filter(l => !l.consumed && l.status !== 'CANCELADO').forEach(l => l.stock.forEach(r => { s.ingredients.find(i => i.id === r.id)!.reserved -= r.quantity; })); order.stockHeld = false;
}
function consume(s: Commerce, line: Line) {
  if (line.consumed) return;
  line.stock.forEach(r => { s.ingredients.find(i => i.id === r.id)!.reserved -= r.quantity; stock(s, r.id, -r.quantity, `Consumo ${line.id}`); }); line.consumed = true;
}
function linesFor(s: Commerce, ctx: DemoState, items: Pick[]): Line[] {
  if (!items.length) throw new Error('Adicione pelo menos um item.');
  return items.map(item => {
    const p = ctx.products.find(p => p.id === item.productId);
    if (!p?.active || !p.available || !ctx.categories.find(c => c.id === p.categoryId)?.active) throw new Error('Um produto está indisponível. Revise a seleção.');
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99 || item.notes.length > 500) throw new Error('Quantidade deve ser de 1 a 99 e observação até 500 caracteres.');
    if (new Set(item.optionIds).size !== item.optionIds.length) throw new Error('Adicional repetido.');
    const options = item.optionIds.map(id => { const o = s.options.find(o => o.id === id && o.productId === p.id && o.active); if (!o) throw new Error('Adicional indisponível. Revise a seleção.'); return o; });
    const rules = s.optionRules[p.id] ?? { min: 0, max: 99 };
    if(options.length < rules.min || options.length > rules.max) throw new Error(`Selecione de ${rules.min} a ${rules.max} adicionais para ${p.name}.`);
    const baseRecipes = s.recipes.filter(r => r.productId === p.id && !r.optionId);
    const recipes = [...baseRecipes, ...s.recipes.filter(r=>r.productId===p.id && r.optionId && item.optionIds.includes(r.optionId))];
    if (!baseRecipes.length) throw new Error('Produto sem ficha técnica demonstrativa. Cadastre-a antes de enviar.');
    return { ...item, id: code('ITEM', s), name: p.name, unitPrice: cents(p.price) + options.reduce((sum, o) => sum + o.price, 0), options: options.map(o => o.name), station: p.preparationStation, status: 'PENDENTE', stock: recipes.map(r => ({ id: r.ingredientId, quantity: r.quantity * item.quantity })), consumed: false };
  });
}
export function reduceCommerce(previous: Commerce, action: Action, ctx: DemoState): Commerce {
  if (action.type === 'reset') return initialCommerce();
  if (action.type === 'clear') return { ...previous, feedback: null };
  const s: Commerce = structuredClone(previous);
    const managerActions = ['refund', 'refund-result', 'ingredient', 'stock-adjust', 'recipe', 'supplier', 'purchase', 'receive', 'integration', 'pickup-hours', 'option', 'option-rules'];
  const cashActions = ['pay', 'cash-open', 'cash-move', 'cash-close', 'tab-close'];
  try {
    if (managerActions.includes(action.type) && !isManager(ctx.role)) throw new Error('Esta ação exige Gerente ou Proprietário.');
    if (cashActions.includes(action.type) && !isManager(ctx.role) && String(ctx.role) !== 'Caixa') throw new Error('Esta ação exige Caixa, Gerente ou Proprietário.');
    if (['open-tab', 'send-order', 'tab-close-request', 'pickup'].includes(action.type) && ctx.role === 'Preparação') throw new Error('Esta ação exige atendimento.');
    switch (action.type) {
      case 'cart-add': { const line=linesFor(s, ctx, [action.item])[0]; s.cart.push({...action.item,quotedUnit:line.unitPrice}); break; }
      case 'requote': { const lines=linesFor(s,ctx,s.cart);s.cart=s.cart.map((item,index)=>({...item,quotedUnit:lines[index].unitPrice}));break; }
      case 'cart-quantity': if (!Number.isInteger(action.quantity) || action.quantity < 0 || action.quantity > 99) throw new Error('Quantidade inválida.'); if (action.quantity === 0) s.cart.splice(action.index, 1); else if (s.cart[action.index]) s.cart[action.index].quantity = action.quantity; break;
      case 'checkout': {
        if (!action.accepted || action.contact.trim().length < 2) throw new Error('Revise o contato e confirme a ciência das condições demonstrativas.');
        if (!s.integrations.payment) throw new Error('O provedor fictício está indisponível. Tente novamente após reativá-lo em Integrações.');
        const current = '18:30'; const windows = [{ start: s.pickup.start, end: s.pickup.end }, ...s.pickup.ranges];
        if (s.pickup.paused || !windows.some(w => w.start <= current && current < w.end)) throw new Error('Retirada pausada ou fora do horário do cenário.');
        const lines = linesFor(s, ctx, s.cart); if(lines.some((line,i)=>s.cart[i].quotedUnit!==line.unitPrice)) throw new Error('O preço mudou. Revise os valores e use Atualizar orçamento antes de criar o pedido.'); hold(s, lines);
        const id = code('PED', s); s.orders.unshift({ id, customerId, contact: action.contact, status: 'AGUARDANDO_PAGAMENTO', code: code('RET', s), lines, history: ['Orçamento revalidado no cenário; aguardando pagamento fictício.'], stockHeld: true });
        s.payments.unshift({ id: code('PAG', s), account: id, amount: due(s, id), status: 'PENDENTE', method: 'Provedor fictício', change: 0 }); s.cart = []; s.lastOrder = id; break;
      }
      case 'open-tab': {
        const table = ctx.tables.find(t => t.id === action.tableId);
        if (!table?.active || !ctx.rooms.find(r => r.id === table.roomId)?.active || s.tabs.some(t => t.tableId === table.id && t.status !== 'FECHADA')) throw new Error('Mesa indisponível ou com comanda ativa.');
        const checkedIn = ctx.reservations.find(r => r.tableId === table.id && r.status === 'CHECK_IN' && !s.releasedReservations.includes(r.id));
        if (ctx.blocks.some(b => b.tableId === table.id && Date.parse(`${b.date}T${b.time}:00-03:00`) <= Date.parse(scenarioNow) && Date.parse(`${b.date}T${b.end}:00-03:00`) > Date.parse(scenarioNow))) throw new Error('Mesa bloqueada neste período.');
        const next = ctx.reservations.find(r => r.tableId === table.id && r.status === 'CONFIRMED' && startOf(r) < Date.parse(scenarioNow) + 120 * 60000 && startOf(r) + r.duration * 60000 > Date.parse(scenarioNow));
        if (next) throw new Error('Há reserva próxima ou em andamento. Registre a chegada antes de abrir a comanda vinculada.');
        if (action.name.trim().length < 2) throw new Error('Informe um nome de identificação fictício.');
        const id = code('COM', s); s.tabs.unshift({ id, tableId: table.id, reservationId: checkedIn?.id, name: action.name, status: 'ABERTA', history: ['Visita aberta na demonstração.'] }); s.lastTab = id; break;
      }
      case 'send-order': {
        if (action.requestKey && s.processedRequests.includes(action.requestKey)) throw new Error('Esta rodada já foi enviada. Abra a comanda para conferir.');
        const tab = s.tabs.find(t => t.id === action.tabId); if (tab?.status !== 'ABERTA') throw new Error('A comanda já está em fechamento ou encerrada.');
        const lines = linesFor(s, ctx, action.items); hold(s, lines); lines.filter(l => l.station === 'SEM_PREPARO').forEach(l => { consume(s, l); l.status = 'PRONTO'; });
        const id = code('PED', s); s.orders.unshift({ id, tabId: tab.id, customerId: '', contact: tab.name, status: lines.every(l => l.status === 'PRONTO') ? 'PRONTO' : 'CONFIRMADO', code: '', lines, history: ['Rodada enviada para cozinha/bar.'], stockHeld: true }); s.lastOrder = id; if(action.requestKey)s.processedRequests.push(action.requestKey); break;
      }
      case 'tab-close-request': { const tab = s.tabs.find(t => t.id === action.id); if (tab?.status !== 'ABERTA') throw new Error('A comanda não está aberta.'); tab.status = 'EM_FECHAMENTO'; tab.history.push('Fechamento solicitado; novos lançamentos bloqueados.'); break; }
      case 'tab-close': {
        const tab = s.tabs.find(t => t.id === action.id); if (tab?.status !== 'EM_FECHAMENTO' || balance(s, tab.id) !== 0) throw new Error('Solicite o fechamento e quite o saldo antes de encerrar.');
        if (s.orders.some(o => o.tabId === tab.id && !['ENTREGUE', 'CANCELADO'].includes(o.status))) throw new Error('Entregue ou cancele as rodadas pendentes antes de encerrar.');
        tab.status = 'FECHADA'; tab.history.push('Conta quitada e visita encerrada.'); if (tab.reservationId) s.releasedReservations.push(tab.reservationId); break;
      }
      case 'pay': {
        const tab = s.tabs.find(t => t.id === action.account); if (tab?.status !== 'EM_FECHAMENTO') throw new Error('Recebimento presencial exige comanda em fechamento.');
        if (!Number.isInteger(action.amount) || action.amount <= 0 || action.amount > balance(s, action.account)) throw new Error('O valor deve ser positivo e não pode superar o saldo.');
        if (!['Dinheiro', 'Cartão', 'Pix'].includes(action.method)) throw new Error('Selecione um meio válido.');
        const session = s.sessions.find(x => x.status === 'ABERTO'); if (!session) throw new Error('Abra o caixa demonstrativo antes de receber.');
        if (action.method === 'Dinheiro' && (!Number.isInteger(action.tendered) || action.tendered < action.amount)) throw new Error('O dinheiro recebido deve cobrir o valor aplicado.');
        s.payments.unshift({ id: code('PAG', s), account: action.account, amount: action.amount, method: action.method, change: action.method === 'Dinheiro' ? action.tendered - action.amount : 0, status: 'CONFIRMADO', sessionId: session.id }); break;
      }
      case 'payment-result': {
        const p = s.payments.find(p => p.id === action.id); if (!p || p.status === 'CONFIRMADO') throw new Error('Pagamento já confirmado ou não encontrado; não será processado novamente.');
        const order = s.orders.find(o => o.id === p.account); if (!order || order.status === 'CANCELADO') throw new Error('Pedido indisponível para pagamento.');
        if (!s.integrations.payment) throw new Error('Provedor fictício indisponível.');
        if (action.result === 'CONFIRMADO') {
          if (!order.stockHeld) hold(s, order.lines); order.stockHeld = true; order.status = 'CONFIRMADO';
          order.lines.filter(l => l.station === 'SEM_PREPARO').forEach(l => { consume(s, l); l.status = 'PRONTO'; }); if (order.lines.every(l => l.status === 'PRONTO')) order.status = 'PRONTO';
        } else if (action.result === 'EXPIRADO' || action.result === 'FALHOU') { release(s, order); order.status = 'AGUARDANDO_PAGAMENTO'; }
        p.status = action.result; order.history.push(`Provedor fictício: ${action.result.toLowerCase()}.`); break;
      }
      case 'prepare': {
        const o = s.orders.find(o => o.id === action.orderId); const l = o?.lines.find(l => l.id === action.lineId);
        if (!o || !l || ['AGUARDANDO_PAGAMENTO', 'CANCELADO', 'ENTREGUE'].includes(o.status)) throw new Error('O pedido não está liberado para esta ação.');
        if (action.next === 'CANCELADO') {
          if (!isManager(ctx.role) || !action.reason?.trim()) throw new Error('Cancelamento de item exige gerência e motivo.');
          if (!l.consumed && o.stockHeld) l.stock.forEach(r => { s.ingredients.find(i => i.id === r.id)!.reserved -= r.quantity; }); l.status = 'CANCELADO'; o.history.push(`Item cancelado: ${action.reason}. Insumo consumido não é reposto automaticamente.`);
        } else {
          const allowed = { PENDENTE: 'EM_PREPARO', EM_PREPARO: 'PRONTO', PRONTO: 'ENTREGUE', ENTREGUE: '', CANCELADO: '' };
          if (allowed[l.status] !== action.next || (action.next === 'ENTREGUE' && ctx.role === 'Preparação')) throw new Error('Transição inválida para o estado ou papel atual.');
          if (action.next === 'EM_PREPARO') consume(s, l); l.status = action.next; o.history.push(`${l.name}: ${action.next.toLowerCase()}.`);
        }
        const valid = o.lines.filter(l => l.status !== 'CANCELADO'); o.status = !valid.length ? 'CANCELADO' : valid.every(l => l.status === 'ENTREGUE') ? 'ENTREGUE' : valid.every(l => ['PRONTO', 'ENTREGUE'].includes(l.status)) ? 'PRONTO' : 'EM_PREPARO'; break;
      }
      case 'cancel-order': {
        const o = s.orders.find(o => o.id === action.id); if (!o || ['CANCELADO', 'ENTREGUE'].includes(o.status)) throw new Error('Pedido já finalizado.');
        if (action.own ? o.customerId !== customerId || paid(s, o.id) > 0 : !isManager(ctx.role)) throw new Error('Após pagamento, o cancelamento exige avaliação da gerência.');
        if (!action.reason.trim()) throw new Error('Informe o motivo.'); release(s, o); o.status = 'CANCELADO'; o.history.push(`Cancelado: ${action.reason}. Devoluções são tratadas separadamente.`); break;
      }
      case 'pickup': { const o = s.orders.find(o => o.id === action.id && !o.tabId); if (o?.status !== 'PRONTO' || action.code.trim() !== o.code) throw new Error('Confira o código: o pedido precisa estar pronto para retirada.'); o.status = 'ENTREGUE'; o.lines.filter(l => l.status !== 'CANCELADO').forEach(l => { l.status = 'ENTREGUE'; }); o.history.push('Código conferido; retirada registrada.'); break; }
      case 'refund': {
        if (!Number.isInteger(action.amount) || action.amount <= 0 || action.amount > eligible(s, action.paymentId) || !action.reason.trim()) throw new Error('Informe motivo e valor dentro do limite elegível, descontando estornos em andamento.');
        s.refunds.unshift({ id: code('EST', s), paymentId: action.paymentId, amount: action.amount, reason: action.reason, status: 'PROCESSANDO' }); break;
      }
      case 'refund-result': { const r = s.refunds.find(r => r.id === action.id); if (r?.status !== 'PROCESSANDO') throw new Error('Estorno já finalizado.'); const p=s.payments.find(p=>p.id===r.paymentId)!; if(action.result==='CONFIRMADO'&&p.method==='Dinheiro'){const session=s.sessions.find(x=>x.status==='ABERTO');if(!session||cashExpected(s)<r.amount)throw new Error('Abra o caixa e confira o dinheiro disponível para devolver.');r.sessionId=session.id;} r.status = action.result; break; }
      case 'ingredient': { const i = action.ingredient; if (!i.name.trim() || !['un','g','ml'].includes(i.unit) || !Number.isFinite(i.minimum) || i.minimum < 0 || s.ingredients.some(x => x.id !== i.id && x.name.toLowerCase() === i.name.toLowerCase())) throw new Error('Informe nome único, unidade e mínimo válido.'); const old = s.ingredients.find(x => x.id === i.id); if (old) { if (!i.active && (old.reserved > 0 || s.recipes.some(r => r.ingredientId === old.id))) throw new Error('Resolva receitas e reservas antes de inativar o insumo.'); old.name = i.name; old.minimum = i.minimum; old.active = i.active; } else s.ingredients.push({ ...i, id: code('INS', s), physical: 0, reserved: 0 }); break; }
      case 'stock-adjust': { const i = s.ingredients.find(i => i.id === action.id); const next = i && action.kind === 'loss' ? i.physical - action.quantity : action.quantity; if (!i || !Number.isFinite(next) || !Number.isFinite(action.quantity) || action.quantity < 0 || next < i.reserved || !action.reason.trim()) throw new Error('Informe motivo e quantidade válida que preserve o saldo reservado.'); stock(s, i.id, next - i.physical, `${action.kind === 'loss' ? 'Perda' : 'Inventário'}: ${action.reason}`); break; }
      case 'recipe': { if (!s.ingredients.some(i => i.id === action.ingredientId && i.active) || !ctx.products.some(p => p.id === action.productId) || (action.optionId && !s.options.some(o=>o.id===action.optionId&&o.productId===action.productId)) || !Number.isFinite(action.quantity) || action.quantity < 0) throw new Error('Produto, insumo ou quantidade inválidos.'); s.recipes = s.recipes.filter(r => !(r.productId === action.productId && r.optionId === action.optionId && r.ingredientId === action.ingredientId)); if (action.quantity > 0) s.recipes.push({ productId: action.productId, optionId: action.optionId, ingredientId: action.ingredientId, quantity: action.quantity }); break; }
      case 'option-rules': if(!Number.isInteger(action.min)||!Number.isInteger(action.max)||action.min<0||action.max<action.min||action.max>99||action.min>s.options.filter(o=>o.productId===action.productId&&o.active).length)throw new Error('Limites inválidos: mínimo não pode exceder os adicionais ativos e máximo deve estar entre o mínimo e 99.');s.optionRules[action.productId]={min:action.min,max:action.max};break;
      case 'supplier': { const x = action.supplier; if (x.name.trim().length < 2 || !x.contact.trim()) throw new Error('Informe nome e contato fictício.'); const old = s.suppliers.find(p => p.id === x.id); if (old) Object.assign(old, x); else s.suppliers.push({ ...x, id: code('FOR', s) }); break; }
      case 'purchase': { if (!s.suppliers.find(x => x.id === action.supplierId)?.active || !action.lines.length || action.lines.some(l => !s.ingredients.some(i => i.id === l.ingredientId && i.active) || !Number.isFinite(l.quantity) || l.quantity <= 0 || !Number.isInteger(l.cost) || l.cost < 0)) throw new Error('Revise fornecedor, insumos, quantidades e custos.'); s.purchases.unshift({ id: code('CMP', s), supplierId: action.supplierId, lines: action.lines, status: 'PLANEJADA', reference: action.reference }); break; }
      case 'receive': { const p = s.purchases.find(p => p.id === action.id); if (p?.status !== 'PLANEJADA') throw new Error('Compra não encontrada ou já recebida.'); p.lines.forEach(l => stock(s, l.ingredientId, l.quantity, `Recebimento ${p.id}`)); p.status = 'RECEBIDA'; break; }
      case 'cash-open': if (s.sessions.some(x => x.status === 'ABERTO') || !Number.isInteger(action.initial) || action.initial < 0) throw new Error('Já existe caixa aberto ou o saldo inicial é inválido.'); s.sessions.unshift({ id: code('CX', s), initial: action.initial, status: 'ABERTO' }); break;
      case 'cash-move': { const session = s.sessions.find(x => x.status === 'ABERTO'); if (!session || !Number.isInteger(action.amount) || !action.amount || cashExpected(s) + action.amount < 0 || !action.reason.trim()) throw new Error('Abra o caixa e informe valor e motivo; sangria não pode exceder o dinheiro esperado.'); s.cashMoves.push({ sessionId: session.id, amount: action.amount, reason: action.reason }); break; }
      case 'cash-close': { const session = s.sessions.find(x => x.status === 'ABERTO'); if (!session || !Number.isInteger(action.counted) || action.counted < 0) throw new Error('Caixa ou contagem inválidos.'); session.expected = cashExpected(s); session.counted = action.counted; session.status = 'FECHADO'; break; }
      case 'integration': s.integrations[action.channel] = !s.integrations[action.channel]; break;
      case 'pickup-hours': { const ranges = [{ start: action.start, end: action.end }, ...action.ranges]; if (ranges.some(r => !/^([01]\d|2[0-3]):[0-5]\d$/.test(r.start) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(r.end) || r.start >= r.end) || ranges.some((r,i) => ranges.some((b,j) => j !== i && r.start < b.end && b.start < r.end))) throw new Error('As faixas de retirada precisam ser válidas, sem sobreposição e dentro do mesmo dia neste cenário.'); s.pickup = { paused: action.paused, start: action.start, end: action.end, ranges: action.ranges }; break; }
      case 'option': { const o = action.option; if (!ctx.products.some(p => p.id === o.productId) || !o.name.trim() || !Number.isInteger(o.price) || o.price < 0) throw new Error('Informe produto, nome e preço válidos.'); const old = s.options.find(x => x.id === o.id); if (old) Object.assign(old, o); else s.options.push({ ...o, id: code('OP', s) }); break; }
    }
    const actor = ['cart-add','cart-quantity','checkout','requote'].includes(action.type) || (action.type==='cancel-order' && action.own) ? ctx.profile.name : action.type==='payment-result' ? 'Provedor fictício' : ctx.role;
    const target = 'id' in action ? action.id : 'account' in action ? action.account : 'paymentId' in action ? action.paymentId : 'productId' in action ? action.productId : action.type==='checkout' ? s.lastOrder! : action.type==='send-order' ? s.lastOrder! : action.type==='open-tab' ? s.lastTab! : 'Cenário comercial';
    s.events.unshift({ id: code('EV', s), action: action.type, target, actor, detail: 'Operação local demonstrativa; sem transmissão.', at: scenarioNow });
    s.feedback = { text: 'Alteração registrada na demonstração.', error: false, sequence: ++s.sequence }; return s;
  } catch (error) { return { ...previous, feedback: { error: true, text: error instanceof Error ? error.message : 'Não foi possível concluir.', sequence: previous.sequence + 1 }, sequence: previous.sequence + 1 }; }
}
