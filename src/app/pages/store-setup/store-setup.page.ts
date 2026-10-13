import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { StoreSummary } from '../../auth/model/store';
import { AuthService } from '../../auth/services/auth.service';
import { selectStore } from '../../auth/state';
import { AppState } from '../../core/state/app.reducer';

/**
 * Where someone without a store lands after signing in: opening one makes them its owner. Also
 * reached from the profile, to open another store.
 */
@Component({
  selector: 'app-store-setup',
  templateUrl: 'store-setup.page.html',
})
export class StoreSetupPage implements OnDestroy {
  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
    phone: ['', [Validators.maxLength(50)]],
    address: ['', [Validators.maxLength(255)]],
  });
  saving = false;
  /** Someone who already works in a store came to open another one, and may go back */
  current$: Observable<StoreSummary | null> = this.store.select(selectStore);
  private subscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  submit(): void {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }
    const { name, phone, address } = this.form.value;
    this.saving = true;
    this.subscription = this.authService
      .createStore({ name: name.trim(), phone: phone?.trim() || undefined, address: address?.trim() || undefined })
      .subscribe({
        next: () => {
          this.saving = false;
          this.form.reset();
          this.router.navigate(['tabs', 'tab2'], { replaceUrl: true });
        },
        //The interceptor already shows what the API said
        error: () => (this.saving = false),
      });
  }

  back(): void {
    this.router.navigate(['tabs', 'tab3'], { replaceUrl: true });
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
