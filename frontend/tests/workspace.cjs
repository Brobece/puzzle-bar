/* eslint-disable @typescript-eslint/no-require-imports -- Standalone CommonJS runner with a TypeScript transpilation hook. */
// Exercise the shared prototype rules without adding a test dependency.
const fs = require('node:fs');
const ts = require('typescript');
const assert = require('node:assert/strict');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
const { initialState, demoReducer, availableTable, customerId } = require('../src/lib/workspace/model.ts');
let checks = 0;
function test(name, check) { check(); checks++; process.stdout.write(`OK ${name}\n`); }
test('Pending proposals do not allocate; competing approval preserves the loser', () => {
  const initial = initialState();
  assert.equal(initial.reservations[0].tableId, undefined);
  const approved = demoReducer(initial, { type:'reservation', id:'DEMO-001', action:'approve' });
  assert.equal(approved.reservations[0].status, 'CONFIRMED');
  assert.equal(approved.reservations[0].tableId, 'm06');
  const conflict = demoReducer(approved, { type:'reservation', id:'DEMO-008', action:'approve' });
  assert.equal(conflict.feedback.error, true);
  assert.equal(conflict.reservations.find(item => item.id === 'DEMO-008').status, 'PENDING_APPROVAL');
  assert.equal(conflict.audit.length, approved.audit.length);
});
test('Owner-only client cancellation releases allocation and preserves other reservations', () => {
  const approved = demoReducer(initialState(), { type:'reservation', id:'DEMO-001', action:'approve' });
  const denied = demoReducer(approved, { type:'reservation', id:'DEMO-002', action:'cancel', customer:true });
  assert.equal(denied.feedback.error, true);
  const cancelled = demoReducer(approved, { type:'reservation', id:'DEMO-001', action:'cancel', customer:true });
  assert.equal(cancelled.reservations[0].tableId, undefined);
  assert.equal(cancelled.reservations[0].status, 'CANCELLED');
  assert.equal(availableTable(cancelled, { date:'2026-11-05',time:'21:00',partySize:6 }).id, 'm06');
});
test('Refusal needs reason; staff permissions and terminal state are enforced', () => {
  const initial = initialState();
  assert.equal(demoReducer(initial, { type:'reservation', id:'DEMO-001', action:'reject' }).feedback.error, true);
  assert.equal(demoReducer({ ...initial, role:'Atendimento' }, { type:'reservation', id:'DEMO-001', action:'approve' }).feedback.error, true);
  const refused = demoReducer(initial, { type:'reservation', id:'DEMO-001', action:'reject', reason:'Sem capacidade.' });
  assert.equal(refused.reservations[0].status, 'REJECTED');
  assert.equal(demoReducer(refused, { type:'reservation', id:'DEMO-001', action:'approve' }).feedback.error, true);
});
test('Arrival and absence obey the scenario clock and tolerance', () => {
  const initial = initialState();
  assert.equal(demoReducer(initial, { type:'reservation', id:'DEMO-002', action:'no-show' }).feedback.error, true);
  const checkin = demoReducer(initial, { type:'reservation', id:'DEMO-002', action:'checkin' });
  assert.equal(checkin.reservations.find(item => item.id === 'DEMO-002').status, 'CHECK_IN');
  const absence = demoReducer(initial, { type:'reservation', id:'DEMO-003', action:'no-show' });
  assert.equal(absence.reservations.find(item => item.id === 'DEMO-003').status, 'NO_SHOW');
  assert.equal(absence.reservations.find(item => item.id === 'DEMO-003').tableId, undefined);
});
test('Conflicting reschedule preserves original confirmed period and table', () => {
  const initial = demoReducer(initialState(), { type:'reservation', id:'DEMO-001', action:'approve' });
  const before = initial.reservations.find(item => item.id === 'DEMO-005');
  const changed = demoReducer(initial, { type:'reservation', id:'DEMO-005', action:'reschedule', reason:'Teste', visit:{date:'2026-11-05',time:'21:00',partySize:6} });
  assert.equal(changed.feedback.error, true);
  assert.deepEqual(changed.reservations.find(item => item.id === before.id), before);
});
test('New client request is visible in shared state and retains policy snapshot', () => {
  const initial = initialState();
  const created = demoReducer(initial, { type:'create-reservation', customer:true, visit:{date:'2026-11-06',time:'20:00',partySize:4}, notes:'' });
  const request = created.reservations.at(-1);
  assert.equal(created.feedback.error, false);
  assert.equal(request.customerId, customerId);
  assert.equal(request.tableId, undefined);
  const rules = demoReducer(created, { type:'rules', rules:{ ...created.rules, duration:180 } });
  assert.equal(rules.reservations.at(-1).duration, 120);
  assert.equal(rules.rules.version, 2);
});
test('Existing allocations protect tables, environments, blocks and calendar', () => {
  const initial = initialState();
  assert.equal(demoReducer(initial, { type:'table', table:{ ...initial.tables[1], active:false } }).feedback.error, true);
  assert.equal(demoReducer(initial, { type:'room', room:{ ...initial.rooms[0], active:false } }).feedback.error, true);
  assert.equal(demoReducer(initial, { type:'block', block:{ tableId:'m04',date:'2026-11-06',time:'20:00',end:'22:00',reason:'Teste' } }).feedback.error, true);
  assert.equal(demoReducer(initial, { type:'exception', exception:{date:'2026-11-06',closed:true,start:'18:00',end:'00:00',nextDay:true,reason:'Teste'} }).feedback.error, true);
});
test('Catalogue rejects duplicate slugs, invalid prices and contradictory allergens', () => {
  const initial = initialState();
  const original = initial.products[0];
  assert.equal(demoReducer(initial, { type:'product', product:{ ...original, price:'-1.00' } }).feedback.error, true);
  assert.equal(demoReducer(initial, { type:'product', product:{ ...original, id:'new' } }).feedback.error, true);
  assert.equal(demoReducer(initial, { type:'product', product:{ ...original, contains:['a-milk'],mayContain:['a-milk'] } }).feedback.error, true);
});
test('Manager cannot elevate to owner; last active owner cannot be removed', () => {
  const initial = initialState();
  assert.equal(demoReducer(initial, { type:'member', member:{...initial.team[1],role:'Proprietário'} }).feedback.error, true);
  assert.equal(demoReducer({...initial,role:'Proprietário'}, { type:'member',member:{...initial.team[0],active:false} }).feedback.error, true);
});
test('Privacy requests create only a local protocol without deleting records', () => {
  const initial = initialState();
  assert.equal(demoReducer(initial, { type:'privacy',kind:'Correção',detail:'' }).feedback.error, true);
  const requested = demoReducer(initial, { type:'privacy',kind:'Exclusão',detail:'' });
  assert.equal(requested.privacy.length, 1);
  assert.deepEqual(requested.profile, initial.profile);
  assert.deepEqual(requested.reservations, initial.reservations);
});
test('Validation identifies each field and preserves existing records until corrected', () => {
  const initial = initialState();
  const profile = demoReducer(initial, { type:'profile', profile:{ ...initial.profile, phone:'123' } });
  assert.equal(profile.feedback.scope, 'profile');
  assert.deepEqual(Object.keys(profile.feedback.fields), ['phone']);
  assert.deepEqual(profile.profile, initial.profile);
  const original = initial.products[0];
  const product = demoReducer(initial, { type:'product', product:{...original, slug:initial.products[1].slug, alt:'', contains:['a-milk'], mayContain:['a-milk']} });
  assert.equal(product.feedback.scope, `product:${original.id}`);
  assert.deepEqual(Object.keys(product.feedback.fields), ['slug', 'alt', 'contains']);
  assert.deepEqual(product.products, initial.products);
  assert.deepEqual(product.audit, initial.audit);
  const corrected = demoReducer(product, { type:'product', product:original });
  assert.equal(corrected.feedback.error, false);
  assert.equal(corrected.feedback.fields, undefined);
  const category = demoReducer(initial, { type:'category', category:{ ...initial.categories[0], slug:initial.categories[1].slug } });
  assert.deepEqual(Object.keys(category.feedback.fields), ['slug']);
  assert.deepEqual(category.categories, initial.categories);
});
process.stdout.write(`${checks} rule checks passed.\n`);
