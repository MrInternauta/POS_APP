import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { BehaviorSubject, Observable } from 'rxjs';

import { StorageService } from '../services/storage.service';

export const LANGUAGES = ['es', 'en', 'pt'] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'es';
export const LANGUAGE_KEY = 'app_language';

function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language);
}

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly languageSubject = new BehaviorSubject<Language>(DEFAULT_LANGUAGE);

  constructor(
    private storage: StorageService,
    private transloco: TranslocoService
  ) {}

  get language(): Language {
    return this.languageSubject.value;
  }

  get language$(): Observable<Language> {
    return this.languageSubject.asObservable();
  }

  /** Called once when the app starts */
  init(): void {
    const stored = this.storage.getLocal(LANGUAGE_KEY);
    this.use(isLanguage(stored) ? stored : this.deviceLanguage());
  }

  use(language: Language): void {
    if (!isLanguage(language)) {
      return;
    }

    this.languageSubject.next(language);
    this.storage.setLocal(LANGUAGE_KEY, language);
    this.transloco.setActiveLang(language);
  }

  /** What the device asks for, es-MX and pt-BR included, falling back to spanish */
  private deviceLanguage(): Language {
    const candidates = [...(navigator?.languages || []), navigator?.language].filter(Boolean);

    for (const candidate of candidates) {
      const base = String(candidate).toLowerCase().split('-')[0];
      if (isLanguage(base)) {
        return base;
      }
    }

    return DEFAULT_LANGUAGE;
  }
}
