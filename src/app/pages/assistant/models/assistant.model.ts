import { ReportPeriod } from '../../reports/models/report.model';

/** Everything the assistant knows how to answer. A real model would map free text to these too */
export type Intent =
  | 'salesDay'
  | 'salesWeek'
  | 'salesMonth'
  | 'topProducts'
  | 'monthly'
  | 'lowStock'
  | 'outOfStock'
  | 'insights'
  | 'pdf'
  | 'help';

/** The options offered as chips, in this order */
export const SUGGESTED: Intent[] = [
  'salesDay',
  'salesMonth',
  'topProducts',
  'monthly',
  'lowStock',
  'outOfStock',
  'insights',
  'pdf',
];

export interface KpiBlock {
  kind: 'kpis';
  items: { label: string; value: string; change: number | null }[];
}

export interface ListBlock {
  kind: 'list';
  title?: string;
  items: { title: string; subtitle?: string; value?: string; tone?: 'good' | 'bad' | 'warn' }[];
  /** "and 12 more" */
  more?: string;
}

export interface PdfBlock {
  kind: 'pdf';
  period: ReportPeriod;
  label: string;
}

export type Block = KpiBlock | ListBlock | PdfBlock;

export interface Reply {
  text: string;
  blocks?: Block[];
  /** What to offer next, related to what was just answered */
  followUps?: Intent[];
}

export interface Message {
  id: number;
  from: 'user' | 'assistant';
  text: string;
  blocks?: Block[];
  followUps?: Intent[];
  /** The bubble shown while the answer is "being written" */
  typing?: boolean;
}

/**
 * Words that point to each intent, already without accents and lowercase. Spanish first, it is
 * how the store talks, with english and portuguese for the other languages of the app. The
 * first intent with a hit wins, so the specific ones come before the general ones.
 */
const KEYWORDS: [Intent, string[]][] = [
  ['pdf', ['pdf', 'descargar', 'download', 'exportar', 'export', 'baixar', 'imprimir', 'print']],
  ['outOfStock', ['agotado', 'agotados', 'sin existencia', 'sin stock', 'out of stock', 'sold out', 'esgotado']],
  [
    'lowStock',
    [
      'poco stock',
      'stock',
      'existencia',
      'existencias',
      'inventario',
      'resurtir',
      'reponer',
      'acabando',
      'se acaban',
      'se acaba',
      'quedan',
      'running out',
      'inventory',
      'estoque',
    ],
  ],
  [
    'insights',
    [
      'mejora',
      'mejoras',
      'mejorar',
      'sugerencia',
      'sugerencias',
      'consejo',
      'consejos',
      'recomienda',
      'recomendaciones',
      'improve',
      'suggestions',
      'tips',
      'melhorar',
      'perdida',
      'perdidas',
    ],
  ],
  [
    'topProducts',
    [
      'mas vendido',
      'mas vendidos',
      'mejor',
      'mejores',
      'top',
      'populares',
      'best',
      'best sellers',
      'popular',
      'mais vendidos',
      'que se vende',
    ],
  ],
  ['monthly', ['por mes', 'meses', 'mensual', 'historico', 'monthly', 'months', 'ano', 'year', 'tendencia', 'trend']],
  ['salesWeek', ['semana', 'week', 'semanal']],
  ['salesMonth', ['mes', 'month', 'mensal']],
  ['salesDay', ['hoy', 'today', 'hoje', 'dia', 'day', 'ventas', 'vendi', 'sales', 'vendas', 'ganancia', 'profit']],
  ['help', ['ayuda', 'help', 'ajuda', 'que puedes', 'opciones', 'options', 'hola', 'hello', 'hi', 'ola']],
];

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[¿?¡!.,;:]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The intent behind a question, or null when nothing in it is recognized */
export function matchIntent(text: string): Intent | null {
  const words = ` ${normalize(text)} `;
  for (const [intent, keywords] of KEYWORDS) {
    //Whole words only: "mes" must not match inside "meses" or "mesa"
    if (keywords.some(keyword => words.includes(` ${keyword} `))) {
      return intent;
    }
  }
  return null;
}

/** The period a PDF request talks about, the month unless it says otherwise */
export function pdfPeriod(text: string): ReportPeriod {
  const words = ` ${normalize(text)} `;
  if ([' hoy ', ' today ', ' hoje ', ' dia ', ' day '].some(word => words.includes(word))) return 'day';
  if ([' semana ', ' week '].some(word => words.includes(word))) return 'week';
  return 'month';
}
