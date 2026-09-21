import { Direction, Directionality } from '@angular/cdk/bidi';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from '../../../core/services/theme.service';
import { ThemeConstantService } from '../../services/theme-constant.service';

@Component({
  selector: 'app-quick-view',
  templateUrl: './quick-view.component.html',
  styles: [
    `
      :host ::ng-deep .theme-config nz-switch .ant-switch {
        @apply bg-deep dark:bg-white/10 h-[25px] min-w-[50px];
      }
      :host ::ng-deep .theme-config nz-switch .ant-switch.ant-switch-checked {
        @apply bg-primary;
      }
      :host ::ng-deep .theme-config nz-switch .ant-switch.ant-switch-checked .ant-switch-handle {
        left: calc(100% - 21px);
      }
      :host ::ng-deep .theme-config nz-switch .ant-switch .ant-switch-handle {
        @apply top-[3px] left-[3px] w-[18px] h-[18px];
      }
    `,
  ],
})
export class QuickViewComponent implements OnInit, OnDestroy {
  direction: 'ltr' | 'rtl' = 'ltr';
  isFolded!: boolean;
  isFoldedTop!: boolean;
  isDarkMode: boolean;
  isRTL: boolean;
  isCustomClassEnabled = false;
  private destroy$ = new Subject<void>();

  constructor(
    private themeService: ThemeConstantService,
    private appTheme: ThemeService,
    private cdr: ChangeDetectorRef,
    @Optional() private directionality: Directionality
  ) {
    this.isDarkMode = this.appTheme.isDark;
    this.isRTL = JSON.parse(localStorage.getItem('isRTL') || 'false');
  }

  ngOnInit(): void {
    this.themeService.isMenuFoldedChanges.subscribe(isFolded => (this.isFolded = isFolded));

    if (this.directionality) {
      this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
        this.direction = direction;
        this.cdr.detectChanges();
      });

      this.direction = this.isRTL ? 'rtl' : 'ltr';
      this.updateDirection();
    }

    const isListClassEnabled = localStorage.getItem('listClassEnabled');

    //The ThemeService already decided whether the app is dark, the logo follows it
    if (this.appTheme.isDark) {
      const logoImg = document.getElementById('logo-img') as HTMLImageElement;
      const logoFoldImg = document.getElementById('logo-fold-img') as HTMLImageElement;
      if (logoImg) logoImg.src = 'assets/images/logo/logo-white.png';
      if (logoFoldImg) logoFoldImg.src = 'assets/images/logo/logo-fold.png';
    }

    if (isListClassEnabled === 'true') {
      this.isCustomClassEnabled = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDarkMode() {
    //The ThemeService owns the class and what is remembered, this only flips it
    this.appTheme.setMode(this.appTheme.isDark ? 'light' : 'dark');

    const isDarkModeEnabled = this.appTheme.isDark;

    const logoImg = document.getElementById('logo-img') as HTMLImageElement;
    const logoFoldImg = document.getElementById('logo-fold-img') as HTMLImageElement;

    if (logoImg) {
      logoImg.src = isDarkModeEnabled ? 'assets/images/logo/logo-white.png' : 'assets/images/logo/logo-dark.png';
    }

    if (logoFoldImg) {
      logoFoldImg.src = 'assets/images/logo/logo-fold.png';
    }

    this.isDarkMode = isDarkModeEnabled;
  }

  toggleListClass() {
    const list = document.querySelector('#my-list');
    if (!list) {
      return;
    }

    list.classList.toggle('custom-class');

    const isListClassEnabled = list.classList.contains('custom-class');
    localStorage.setItem('listClassEnabled', isListClassEnabled.toString());
    this.isCustomClassEnabled = isListClassEnabled;
  }

  toggleDirection() {
    this.direction = this.direction === 'ltr' ? 'rtl' : 'ltr';
    this.isRTL = this.direction === 'rtl';

    localStorage.setItem('isRTL', JSON.stringify(this.isRTL));
    this.updateDirection();
  }

  updateDirection() {
    localStorage.setItem('direction', this.direction);
    document.documentElement.dir = this.direction;
  }

  toggleFold() {
    this.themeService.toggleFold(this.isFolded);
    localStorage.setItem('isFolded', this.isFolded.toString());
  }

  toggleTop() {
    const toggleBtn = document.querySelector('.desktop-toggle') as HTMLElement;
    const sidebar = document.querySelector('.page-container');
    const body = document.querySelector('.hexadash-top-menu');
    const button = document.querySelector('.custom-scrollbar') as HTMLElement;
    if (!body) {
      return;
    }
    if (!sidebar) {
      return;
    }
    if (window.innerWidth >= 991) {
      if (this.isFoldedTop) {
        body.classList.add('topMenu-active');
        button.style.display = 'none';
        sidebar.classList.add('left-space-zero');
        toggleBtn.style.display = 'none';
      } else {
        body.classList.remove('topMenu-active');
        button.style.display = 'block';
        sidebar.classList.remove('left-space-zero');
        toggleBtn.style.display = 'block';
      }
    }
  }
}
