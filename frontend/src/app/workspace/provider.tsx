"use client";
import { createContext, useContext, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import { demoReducer, initialState } from '../../lib/workspace/model';
import type { Command, DemoState } from '../../lib/workspace/model';

const DemoContext = createContext<{ state: DemoState; dispatch: Dispatch<Command> } | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, initialState);
  return <DemoContext.Provider value={{ state, dispatch }}>{children}</DemoContext.Provider>;
}
export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('DemoProvider necessário.');
  return context;
}
