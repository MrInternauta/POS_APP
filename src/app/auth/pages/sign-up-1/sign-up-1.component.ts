import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDto } from '@gymTrack/auth/model/user.dto';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { ModalInfoService } from '../../../core/services/modal.service';
import { AppState } from '../../../core/state/app.reducer';
import { AuthService } from '../../services';

/** The API only accepts mexican numbers, with or without the 52 and the separators */
const MX_PHONE_PATTERN = /^(\+?52[\s-]?)?(\d[\s-]?){10}$/;

/** The login form asks for at least this many characters, a shorter password could never be used */
const MIN_PASSWORD_LENGTH = 5;

@Component({
  templateUrl: './sign-up-1.component.html',
})
export class SignUp1Component implements OnInit, OnDestroy {
  // socialMediaButtons = socialIcons.socialMediaButtons;
  signUpForm!: FormGroup;
  isLoading = false;
  error = false;
  passwordVisible = false;
  password?: string;
  private passwordSubscription$?: Subscription;
  private signUpSubscription$?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _store: Store<AppState>,
    private modalInfoService: ModalInfoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      //The API refuses to create a user without a valid phone
      phone: [null, [Validators.required, Validators.pattern(MX_PHONE_PATTERN)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      agree: [false],
    });

    //Typing the password again has to check the confirmation once more
    this.passwordSubscription$ = this.signUpForm.controls['password'].valueChanges.subscribe(() =>
      this.signUpForm.controls['checkPassword'].updateValueAndValidity()
    );
  }

  ngOnDestroy(): void {
    this.passwordSubscription$?.unsubscribe();
    this.signUpSubscription$?.unsubscribe();
  }

  submitForm(): void {
    if (!this.signUpForm.valid) {
      Object.values(this.signUpForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    const signup: UserDto = {
      name: this.signUpForm.value.name,
      lastName: this.signUpForm.value.lastName,
      phone: this.signUpForm.value.phone,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,
    };

    this.signUpSubscription$ = this.authService.signUp(signup).subscribe(
      () => {
        this.isLoading = false;
        //Signing up gives no token back, the new user still has to log in
        this.modalInfoService.success('User created', 'Sign in with your new account', () =>
          this.router.navigate(['authentication', 'login-1'], { replaceUrl: true })
        );
      },
      () => {
        //The interceptor already shows what the API answered
        this.isLoading = false;
      }
    );
  }

  confirmationValidator = (control: FormControl): any => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signUpForm?.controls['password']?.value) {
      return { confirm: true, error: true };
    }

    return null;
  };
}
