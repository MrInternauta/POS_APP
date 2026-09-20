import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

const ERRORS_SCOPE = 'errors';

/**
 * The API answers in english and is not going to change, so its messages are matched against the
 * errors section of the translation files. Anything not listed there is shown as it arrived.
 */
@Injectable({
  providedIn: 'root',
})
export class ApiMessageService {
  constructor(private transloco: TranslocoService) {}

  translate(message?: unknown): string {
    //class-validator answers with a list of problems
    if (Array.isArray(message)) {
      const translated = message
        .map(item => this.translate(item))
        .filter(Boolean)
        .join('\n');

      return translated || this.unknown();
    }

    const raw = typeof message === 'string' ? message.trim() : '';

    if (!raw) {
      return this.unknown();
    }

    const key = `${ERRORS_SCOPE}.${raw}`;
    const translated = this.transloco.translate(key);

    return translated && translated !== key ? translated : raw;
  }

  unknown(): string {
    return this.transloco.translate(`${ERRORS_SCOPE}.unknown`);
  }
}
