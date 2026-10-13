export type ReportPeriod = 'day' | 'week' | 'month';
export type TopProductsBy = 'qty' | 'revenue';

export interface SalesTotals {
  revenue: number;
  profit: number;
  orders: number;
  averageTicket: number;
}

export interface PeriodTotals extends SalesTotals {
  from: string;
  to: string;
}

export interface SummaryResponse {
  summary: {
    period: ReportPeriod;
    //Today/this week/this month so far
    current: PeriodTotals;
    //The same stretch of the previous day/week/month
    previous: PeriodTotals;
  };
}

export interface TopProduct {
  id: number;
  name: string;
  image: string;
  quantity: number;
  revenue: number;
  profit: number;
}

export interface TopProductsResponse {
  products: TopProduct[];
}

export interface MonthTotals extends SalesTotals {
  //YYYY-MM
  month: string;
}

export interface MonthlyResponse {
  months: MonthTotals[];
}
