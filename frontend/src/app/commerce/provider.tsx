'use client';
import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { initialCommerce, reduceCommerce } from '../../lib/commerce/model';
import type { Action, Commerce } from '../../lib/commerce/model';
import type { DemoState } from '../../lib/workspace/model';
import { useDemo } from '../workspace/provider';

const Context = createContext<{ state: Commerce; act: (action: Action) => void } | null>(null);
export function CommerceProvider({ children }: { children: ReactNode }) {
  const { state: demo, dispatch: demoDispatch } = useDemo();
  const [state, dispatch] = useReducer((s: Commerce, envelope: { action: Action; demo: DemoState }) => reduceCommerce(s, envelope.action, envelope.demo), undefined, initialCommerce);
  return <Context.Provider value={{ state, act: action => {
    dispatch({ action, demo });
    if (action.type === 'open-tab' || action.type === 'tab-close') {
      const next = reduceCommerce(state, action, demo);
      if (!next.feedback?.error) {
        demoDispatch({ type: 'occupancy', tableIds: next.tabs.filter(t => t.status !== 'FECHADA').map(t => t.tableId) });
        if (action.type === 'tab-close') { const tab = next.tabs.find(t => t.id === action.id); if (tab?.reservationId) demoDispatch({ type: 'complete-visit', id: tab.reservationId }); }
      }
    }
  } }}>{children}</Context.Provider>;
}
export function useCommerce() { const context = useContext(Context); if (!context) throw new Error('CommerceProvider necessário.'); return context; }
