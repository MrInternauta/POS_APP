import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom } from 'rxjs';

import { WorkoutService } from '../../products/services/workout.service';
import { ReportPeriod, SalesTotals } from '../../reports/models/report.model';
import { ReportsService } from '../../reports/services/reports.service';
import { Block, Intent, ListBlock, Reply, SUGGESTED, matchIntent, pdfPeriod } from '../models/assistant.model';

/** At or below this stock a product counts as low, the same line the PDF draws */
const LOW_STOCK = 5;
/** How many rows an answer lists before saying "and N more" */
const LIST_LIMIT = 8;
/** Suggestions come in four groups, a few each keeps the answer readable in a chat */
const INSIGHT_LIMIT = 4;

const PERIOD_OF: Partial<Record<Intent, ReportPeriod>> = { salesDay: 'day', salesWeek: 'week', salesMonth: 'month' };

/**
 * Answers questions about the store as if it understood them. For now it finds the intent with
 * keywords and builds the answer from the API; `ask` is the one place a real model would plug in,
 * the page only ever sees a Reply.
 */
@Injectable({
  providedIn: 'root',
})
export class AssistantService {
  constructor(
    private reportsService: ReportsService,
    private productsService: WorkoutService,
    private transloco: TranslocoService
  ) {}

  /** A chip carries its intent, typed text is matched first */
  async ask(question: { intent: Intent } | { text: string }): Promise<Reply> {
    const intent = 'intent' in question ? question.intent : matchIntent(question.text);
    if (!intent) {
      return { text: this.t('notUnderstood'), followUps: SUGGESTED };
    }

    try {
      return await this.answer(intent, 'text' in question ? question.text : '');
    } catch {
      //The interceptor already showed what the API said, the chat only needs to move on
      return { text: this.t('error'), followUps: SUGGESTED };
    }
  }

  private answer(intent: Intent, text: string): Promise<Reply> {
    switch (intent) {
      case 'salesDay':
      case 'salesWeek':
      case 'salesMonth':
        return this.sales(PERIOD_OF[intent] as ReportPeriod);
      case 'topProducts':
        return this.topProducts();
      case 'monthly':
        return this.monthly();
      case 'lowStock':
        return this.stock(LOW_STOCK);
      case 'outOfStock':
        return this.stock(0);
      case 'insights':
        return this.insights();
      case 'pdf':
        return Promise.resolve(this.pdf(pdfPeriod(text)));
      case 'help':
      default:
        return Promise.resolve({ text: this.t('help'), followUps: SUGGESTED });
    }
  }

  private async sales(period: ReportPeriod): Promise<Reply> {
    const { summary } = await firstValueFrom(this.reportsService.getSummary(period));
    const { current, previous } = summary;
    const when = this.t(`when.${period}`);
    const followUps: Intent[] = ['topProducts', period === 'month' ? 'monthly' : 'salesMonth', 'pdf'];

    if (!current.orders) {
      return { text: this.t('sales.none', { when }), followUps };
    }

    const change = percent(current.revenue, previous.revenue);
    const compared = this.t(`compared.${period}`);
    const trend =
      change === null
        ? ''
        : change === 0
          ? this.t('sales.same', { compared })
          : this.t(change > 0 ? 'sales.up' : 'sales.down', { pct: Math.abs(change), compared });

    const kpi = (key: keyof SalesTotals, money: boolean) => ({
      label: this.transloco.translate(`reports.${key}`),
      value: money ? this.money(current[key]) : this.number(current[key]),
      change: percent(current[key], previous[key]),
    });

    return {
      text: `${this.t('sales.total', { when, revenue: this.money(current.revenue), orders: this.count('orders', current.orders) })} ${trend}`.trim(),
      blocks: [
        {
          kind: 'kpis',
          items: [kpi('revenue', true), kpi('profit', true), kpi('orders', false), kpi('averageTicket', true)],
        },
      ],
      followUps,
    };
  }

  private async topProducts(): Promise<Reply> {
    const { products } = await firstValueFrom(this.reportsService.getTopProducts('revenue', LIST_LIMIT));
    const followUps: Intent[] = ['salesMonth', 'insights', 'pdf'];
    if (!products?.length) {
      return { text: this.t('top.none'), followUps };
    }

    return {
      text: this.t('top.intro', { name: products[0].name }),
      blocks: [
        {
          kind: 'list',
          items: products.map((product, index) => ({
            title: `${index + 1}. ${product.name}`,
            subtitle: this.count('units', product.quantity),
            value: this.money(product.revenue),
            tone: product.profit < 0 ? 'bad' : undefined,
          })),
        },
      ],
      followUps,
    };
  }

  private async monthly(): Promise<Reply> {
    const { months } = await firstValueFrom(this.reportsService.getMonthly(12));
    const followUps: Intent[] = ['salesMonth', 'topProducts', 'pdf'];
    const total = months.reduce((sum, month) => sum + month.revenue, 0);
    if (!total) {
      return { text: this.t('monthly.none'), followUps };
    }

    const best = months.reduce((top, month) => (month.revenue > top.revenue ? month : top));
    return {
      text: this.t('monthly.intro', {
        total: this.money(total),
        best: this.monthName(best.month),
        bestRevenue: this.money(best.revenue),
      }),
      blocks: [
        {
          kind: 'list',
          //The latest month first, it is the one people ask about
          items: [...months].reverse().map(month => ({
            title: this.monthName(month.month),
            subtitle: this.count('orders', month.orders),
            value: this.money(month.revenue),
          })),
        },
      ],
      followUps,
    };
  }

  private async stock(maxStock: number): Promise<Reply> {
    const response = await firstValueFrom(
      this.productsService.getProducts({ limit: LIST_LIMIT, offset: 0, maxStock, orderBy: 'stock', order: 'ASC' })
    );
    const products = response?.products ?? [];
    const total = response?.total ?? products.length;
    const soldOut = maxStock === 0;
    const followUps: Intent[] = [soldOut ? 'lowStock' : 'outOfStock', 'insights', 'pdf'];

    if (!total) {
      return { text: this.t(soldOut ? 'stock.noneOut' : 'stock.noneLow', { threshold: maxStock }), followUps };
    }

    return {
      text: this.t(soldOut ? 'stock.out' : 'stock.low', { count: total, threshold: maxStock }),
      blocks: [
        {
          kind: 'list',
          items: products.map(product => {
            const stock = Number(product.stock);
            return {
              title: product.name,
              subtitle: product.code,
              value: stock <= 0 ? this.t('stock.soldOut') : this.count('units', stock),
              tone: stock <= 0 ? 'bad' : 'warn',
            };
          }),
          more: this.more(total, products.length),
        },
      ],
      followUps,
    };
  }

  private async insights(): Promise<Reply> {
    const { insights } = await firstValueFrom(this.reportsService.getProductInsights());
    const followUps: Intent[] = ['lowStock', 'topProducts', 'pdf'];
    const blocks: ListBlock[] = [];

    if (insights.belowCost.total) {
      blocks.push({
        kind: 'list',
        title: this.t('insights.belowCost', { count: insights.belowCost.total }),
        items: insights.belowCost.items.slice(0, INSIGHT_LIMIT).map(item => ({
          title: item.name,
          subtitle: this.t('insights.prices', { cost: this.money(item.price), price: this.money(item.priceSell) }),
          value: this.money(item.margin),
          tone: 'bad',
        })),
        more: this.more(insights.belowCost.total, Math.min(insights.belowCost.items.length, INSIGHT_LIMIT)),
      });
    }

    if (insights.runningOut.total) {
      blocks.push({
        kind: 'list',
        title: this.t('insights.runningOut', { count: insights.runningOut.total, days: insights.runningOutDays }),
        items: insights.runningOut.items.slice(0, INSIGHT_LIMIT).map(item => ({
          title: item.name,
          subtitle: this.t('insights.sold', { sold: this.number(item.sold), days: insights.windowDays }),
          value: this.t('insights.daysLeft', { days: this.number(item.daysLeft) }),
          tone: 'warn',
        })),
        more: this.more(insights.runningOut.total, Math.min(insights.runningOut.items.length, INSIGHT_LIMIT)),
      });
    }

    if (insights.noRecentSales.total) {
      blocks.push({
        kind: 'list',
        title: this.t('insights.noRecentSales', { count: insights.noRecentSales.total, days: insights.windowDays }),
        items: insights.noRecentSales.items.slice(0, INSIGHT_LIMIT).map(item => ({
          title: item.name,
          subtitle: this.count('units', item.stock),
          value: this.money(item.stockValue),
        })),
        more: this.more(insights.noRecentSales.total, Math.min(insights.noRecentSales.items.length, INSIGHT_LIMIT)),
      });
    }

    if (insights.incomplete.total) {
      blocks.push({
        kind: 'list',
        title: this.t('insights.incomplete', { count: insights.incomplete.total }),
        items: insights.incomplete.items.slice(0, INSIGHT_LIMIT).map(item => ({
          title: item.name,
          subtitle: item.missing.map(field => this.t(`missing.${field}`)).join(', '),
        })),
        more: this.more(insights.incomplete.total, Math.min(insights.incomplete.items.length, INSIGHT_LIMIT)),
      });
    }

    if (!blocks.length) {
      return { text: this.t('insights.none'), followUps };
    }

    return { text: this.t('insights.intro'), blocks, followUps };
  }

  private pdf(period: ReportPeriod): Reply {
    const block: Block = { kind: 'pdf', period, label: this.t('pdf.button') };
    return {
      text: this.t('pdf.ready', { report: this.t(`pdf.${period}`) }),
      blocks: [block],
      followUps: ['salesDay', 'salesWeek', 'salesMonth'],
    };
  }

  private t(key: string, params?: Record<string, unknown>): string {
    return this.transloco.translate(`assistant.${key}`, params);
  }

  /** "1 order" and "3 orders": each key has a `.one` and an `.other` form */
  private count(key: 'units' | 'orders', value: number): string {
    return this.t(`${key}.${Number(value) === 1 ? 'one' : 'other'}`, { count: this.number(value) });
  }

  private more(total: number, shown: number): string | undefined {
    return total > shown ? this.t('more', { count: this.number(total - shown) }) : undefined;
  }

  private money(value: number): string {
    const sign = value < 0 ? '-' : '';
    return `${sign}$${this.number(Math.abs(value))}`;
  }

  private number(value: number): string {
    return Math.round(Number(value) * 10) / 10 === Math.round(Number(value))
      ? Math.round(Number(value)).toLocaleString(this.transloco.getActiveLang())
      : Number(value).toLocaleString(this.transloco.getActiveLang(), { maximumFractionDigits: 1 });
  }

  /** 2026-10 as "octubre 2026", read in UTC so it never shifts a month */
  private monthName(month: string): string {
    return new Intl.DateTimeFormat(this.transloco.getActiveLang(), {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${month}-01T12:00:00Z`));
  }
}

/** Percent change, null when there is nothing to compare with */
function percent(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}
