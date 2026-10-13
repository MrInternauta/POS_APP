import { Component, OnDestroy } from '@angular/core';
import { RefresherCustomEvent } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { ApexOptions } from 'ng-apexcharts';
import { Subscription, combineLatest, finalize, forkJoin } from 'rxjs';

import { ThemeService } from '../../core/services/theme.service';
import { MonthTotals, PeriodTotals, ReportPeriod, SalesTotals, TopProduct, TopProductsBy } from './models/report.model';
import { ReportsService } from './services/reports.service';

export interface Kpi {
  key: keyof SalesTotals;
  value: number;
  //Percentage against the same stretch of the previous period; null when there is nothing to compare with
  change: number | null;
  money: boolean;
}

const KPI_KEYS: { key: keyof SalesTotals; money: boolean }[] = [
  { key: 'revenue', money: true },
  { key: 'profit', money: true },
  { key: 'orders', money: false },
  { key: 'averageTicket', money: true },
];

export type BarChart = Required<
  Pick<
    ApexOptions,
    | 'series'
    | 'chart'
    | 'colors'
    | 'theme'
    | 'plotOptions'
    | 'dataLabels'
    | 'legend'
    | 'grid'
    | 'xaxis'
    | 'yaxis'
    | 'tooltip'
  >
>;

//The brand purple from tailwind.config.js, and a green that reads on both themes
const REVENUE_COLOR = '#8231D3';
const PROFIT_COLOR = '#16a34a';

@Component({
  selector: 'app-reports',
  templateUrl: 'reports.page.html',
  styleUrls: ['reports.page.scss'],
})
export class ReportsPage implements OnDestroy {
  public period: ReportPeriod = 'day';
  public topBy: TopProductsBy = 'qty';

  public kpis: Kpi[] = [];
  public topProducts: TopProduct[] = [];
  public months: MonthTotals[] = [];
  public chart: BarChart | null = null;
  public loading = false;

  private subscriptions = new Subscription();
  private summarySub?: Subscription;
  private topSub?: Subscription;

  constructor(
    private reportsService: ReportsService,
    private themeService: ThemeService,
    private transloco: TranslocoService
  ) {
    //The chart's labels and colors follow the language and the theme without a reload
    this.subscriptions.add(
      combineLatest([this.themeService.isDark$, this.transloco.langChanges$]).subscribe(() => this.buildChart())
    );
  }

  /** Ionic keeps the page alive between visits: every entry brings the sales made since */
  ionViewWillEnter(): void {
    this.loadAll();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.summarySub?.unsubscribe();
    this.topSub?.unsubscribe();
  }

  refresh(event: RefresherCustomEvent): void {
    this.loadAll(() => event.target.complete());
  }

  changePeriod(event: CustomEvent): void {
    this.period = event.detail.value as ReportPeriod;
    this.loadSummary();
  }

  changeTopBy(event: CustomEvent): void {
    this.topBy = event.detail.value as TopProductsBy;
    this.loadTopProducts();
  }

  trackByKpi(_index: number, kpi: Kpi) {
    return kpi.key;
  }

  trackByProduct(_index: number, product: TopProduct) {
    return product.id;
  }

  private loadAll(onDone?: () => void): void {
    this.loading = true;
    this.summarySub?.unsubscribe();
    this.topSub?.unsubscribe();
    this.subscriptions.add(
      forkJoin({
        summary: this.reportsService.getSummary(this.period),
        top: this.reportsService.getTopProducts(this.topBy),
        monthly: this.reportsService.getMonthly(12),
      })
        .pipe(
          finalize(() => {
            this.loading = false;
            onDone?.();
          })
        )
        .subscribe(({ summary, top, monthly }) => {
          this.kpis = this.toKpis(summary.summary.current, summary.summary.previous);
          this.topProducts = top.products ?? [];
          this.months = monthly.months ?? [];
          this.buildChart();
        })
    );
  }

  private loadSummary(): void {
    this.summarySub?.unsubscribe();
    this.summarySub = this.reportsService
      .getSummary(this.period)
      .subscribe(({ summary }) => (this.kpis = this.toKpis(summary.current, summary.previous)));
  }

  private loadTopProducts(): void {
    this.topSub?.unsubscribe();
    this.topSub = this.reportsService
      .getTopProducts(this.topBy)
      .subscribe(({ products }) => (this.topProducts = products ?? []));
  }

  private toKpis(current: PeriodTotals, previous: PeriodTotals): Kpi[] {
    return KPI_KEYS.map(({ key, money }) => ({
      key,
      money,
      value: current[key],
      change: previous[key] ? Math.round(((current[key] - previous[key]) / Math.abs(previous[key])) * 100) : null,
    }));
  }

  private buildChart(): void {
    if (!this.months.length) {
      this.chart = null;
      return;
    }
    const dark = this.themeService.isDark;
    const monthName = new Intl.DateTimeFormat(this.transloco.getActiveLang(), { month: 'short', timeZone: 'UTC' });
    //'2026-10' is read as the 1st at UTC midnight, so the month name is formatted in UTC as well
    const labels = this.months.map(({ month }) => monthName.format(new Date(`${month}-01T00:00:00Z`)));
    const money = (value: number) => `$${Math.round(value).toLocaleString(this.transloco.getActiveLang())}`;

    this.chart = {
      series: [
        { name: this.transloco.translate('reports.revenue'), data: this.months.map(month => month.revenue) },
        { name: this.transloco.translate('reports.profit'), data: this.months.map(month => month.profit) },
      ],
      chart: {
        type: 'bar',
        height: 260,
        toolbar: { show: false },
        background: 'transparent',
        fontFamily: 'inherit',
        animations: { enabled: false },
      },
      colors: [REVENUE_COLOR, PROFIT_COLOR],
      theme: { mode: dark ? 'dark' : 'light' },
      plotOptions: { bar: { columnWidth: '60%', borderRadius: 3 } },
      dataLabels: { enabled: false },
      legend: { position: 'top', horizontalAlign: 'left' },
      grid: { borderColor: dark ? '#374151' : '#e5e7eb', strokeDashArray: 3 },
      xaxis: { categories: labels, axisTicks: { show: false } },
      yaxis: { labels: { formatter: money } },
      tooltip: { theme: dark ? 'dark' : 'light', y: { formatter: money } },
    };
  }
}
