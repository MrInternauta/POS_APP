import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';

import { AuthService } from '../../services';

import { AppState } from '../../../core/state/app.reducer';
import { UserDto } from '@gymTrack/auth/model/user.dto';
import { ModalInfoService } from '../../../core/services/modal.service';

@Component({
  templateUrl: './sign-up-1.component.html',
})
export class SignUp1Component implements OnInit {
  // socialMediaButtons = socialIcons.socialMediaButtons;
  signUpForm!: FormGroup;
  isLoading = false;
  error = false;
  passwordVisible = false;
  password?: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private _store: Store<AppState>,
    private modalInfoService: ModalInfoService
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phone: [null, []],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      agree: [false],
    });
  }

  submitForm(): void {
    for (const i in this.signUpForm.controls) {
      this.signUpForm.controls[i].markAsDirty();
      this.signUpForm.controls[i].updateValueAndValidity();
    }
    const signup: UserDto = {
      name: this.signUpForm.value.name,
      lastName: this.signUpForm.value.lastName,
      phone: this.signUpForm.value.phone,
      email: this.signUpForm.value.email,
      password: this.signUpForm.value.password,

    }
    this.authService.signUp(signup).subscribe((value)=>{
      this.modalInfoService.success('User created', '');
      this.signUpForm.hasError('Something is wrong');
    }, error => {
      this.modalInfoService.error('Something is wrong', error || '');
      this.signUpForm.hasError('Something is wrong');
    });
  }

  // updateConfirmValidator(): void {
  //     Promise.resolve().then(() => this.signUpForm.controls.checkPassword.updateValueAndValidity());
  // }

  confirmationValidator = (control: FormControl): any => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signUpForm.controls['password'].value) {
      return { confirm: true, error: true };
    }
  };
}
