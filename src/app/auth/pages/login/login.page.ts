import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

// import  socialIcons  from './../../../../assets/data/pages/social-items.json';
import { ComponentBase } from '../../../core/base/component.base';
import { ModalInfoService } from '../../../core/services/modal.service';
import { AppState } from '../../../core/state/app.reducer';
import { AuthService } from '../../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage extends ComponentBase implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  isLoading = false;
  error = false;
  passwordVisible = false;
  validateForm!: UntypedFormGroup;
  // socialMediaButtons = socialIcons.socialMediaButtons;
  constructor(
    private _authService: AuthService,
    private _store: Store<AppState>,
    private fb: FormBuilder,
    private router: Router,
    private modalInfoService: ModalInfoService
  ) {
    super();
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: ['admin@admin.com', [Validators.required]],
      password: ['1234567890', [Validators.required, Validators.minLength(5)]],
      remember: [true],
    });
    return;
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this._authService.login(this.validateForm.value, this.validateForm.value.remember).subscribe(
        res => {
          if (!res) {
            this.modalInfoService.error('Something is wrong', '');
            this.validateForm.hasError('Something is wrong');
            return;
          }
          this.router.navigate(['tabs', 'tab2'], { replaceUrl: true });
        },
        login => {
          this.modalInfoService.error('Something is wrong', login || '');
          this.validateForm.hasError('Something is wrong');
        }
      );
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
