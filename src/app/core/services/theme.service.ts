import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { StorageService } from './storage.service';

export const THEME_MODES = ['system', 'light', 'dark'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const THEME_MODE_KEY = 'theme_mode';

const DARK_CLASS = 'dark';

function isThemeMode(value: unknown): value is ThemeMode {
  return THEME_MODES.includes(value as ThemeMode);
}

/**
 * Decides whether the app is painted dark. Tailwind is configured with darkMode 'class' and the
 * ionic variables follow the same class, so the class on the document is the single answer.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  private readonly modeSubject = new BehaviorSubject<ThemeMode>('system');
  private readonly darkSubject = new BehaviorSubject<boolean>(false);

  constructor(private storage: StorageService) {}

  get mode(): ThemeMode {
    return this.modeSubject.value;
  }

  get mode$(): Observable<ThemeMode> {
    return this.modeSubject.asObservable();
  }

  get isDark(): boolean {
    return this.darkSubject.value;
  }

  get isDark$(): Observable<boolean> {
    return this.darkSubject.asObservable();
  }

  /** Called once when the app starts, before anything is painted */
  init(): void {
    const stored = this.storage.getLocal(THEME_MODE_KEY);
    //Nothing chosen yet means following the host, which is the default the app ships with
    this.setMode(isThemeMode(stored) ? stored : 'system');

    //While following the host, changing its setting has to be picked up without a restart
    this.darkQuery?.addEventListener?.('change', () => {
      if (this.mode === 'system') {
        this.apply();
      }
    });
  }

  setMode(mode: ThemeMode): void {
    if (!isThemeMode(mode)) {
      return;
    }

    this.modeSubject.next(mode);
    this.storage.setLocal(THEME_MODE_KEY, mode);
    this.apply();
  }

  private apply(): void {
    const isDark = this.mode === 'system' ? !!this.darkQuery?.matches : this.mode === 'dark';

    document.documentElement?.classList.toggle(DARK_CLASS, isDark);
    document.body?.classList.toggle(DARK_CLASS, isDark);
    this.darkSubject.next(isDark);
  }
}
