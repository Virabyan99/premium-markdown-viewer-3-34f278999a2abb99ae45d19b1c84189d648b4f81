import { franc } from 'franc';

export function detectLang(text: string): 'kr' | 'jp' | 'sc' | 'default' {
  const lang = franc(text);
  if (lang === 'kor') return 'kr';
  if (lang === 'jpn') return 'jp';
  if (lang === 'cmn') return 'sc';
  return 'default';
}