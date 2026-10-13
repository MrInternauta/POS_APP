import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from 'src/app/core/constants';

import { environment } from '../../../../environments/environment';
import { ReportPeriod } from '../models/report.model';

const API_URL = `${environment.url}${API_PREFIX}reports/pdf`;

/**
 * Brings the sales report the API draws as a PDF and puts it in the user's hands: a download in
 * a browser, the share sheet on a phone (WhatsApp, Drive, email), since an app has no downloads bar.
 */
@Injectable({
  providedIn: 'root',
})
export class ReportPdfService {
  constructor(private http: HttpClient) {}

  /** Resolves once the file was handed over; the interceptor already shows a failed request */
  async export(period: ReportPeriod, shareTitle: string): Promise<void> {
    const file = await firstValueFrom(this.http.get(API_URL, { params: { period }, responseType: 'blob' }));
    const name = fileName(period);

    if (Capacitor.isNativePlatform()) {
      await this.share(file, name, shareTitle);
      return;
    }

    this.download(file, name);
  }

  private download(file: Blob, name: string) {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    //The click starts the download synchronously, the url can go right after
    setTimeout(() => URL.revokeObjectURL(url));
  }

  private async share(file: Blob, name: string, title: string) {
    //The cache is what the FileProvider exposes, and the system can clear it whenever it likes
    const { uri } = await Filesystem.writeFile({
      path: name,
      data: await toBase64(file),
      directory: Directory.Cache,
    });

    try {
      await Share.share({ title, files: [uri], dialogTitle: title });
    } catch (error) {
      //Closing the share sheet is a choice, not a failure
      if (
        !String((error as Error)?.message || error)
          .toLowerCase()
          .includes('cancel')
      ) {
        throw error;
      }
    }
  }
}

/** reporte-month-2026-10-13.pdf, the date as the phone sees it */
export function fileName(period: ReportPeriod, today = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  const day = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  return `reporte-${period}-${day}.pdf`;
}

/** Filesystem takes base64 without the data: prefix */
function toBase64(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
