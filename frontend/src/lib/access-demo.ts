/** Public fixtures for UI previews, never authentication tokens. */
export const demoLinkCases = ['valido', 'expirado', 'usado', 'invalido'] as const;
export type DemoLinkCase = typeof demoLinkCases[number] | 'ausente';

export function demoLinkCase(value: string | string[] | undefined): DemoLinkCase {
  if (value === undefined) return 'ausente';
  return typeof value === 'string' && demoLinkCases.includes(value as typeof demoLinkCases[number])
    ? value as DemoLinkCase : 'invalido';
}
