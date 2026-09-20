import { Component } from '@angular/core';

import { LanguageService } from './core/i18n/language.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService
  ) {
    this.themeService.init();
    this.languageService.init();
  }
}
