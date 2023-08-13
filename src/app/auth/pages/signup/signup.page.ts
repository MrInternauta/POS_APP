import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/state/app.reducer';
import { Router } from '@angular/router';
import { ComponentBase } from '../../../core/base/component.base';
import { isEmail } from '../../../core/util/validator.helper';
import { Auth, CreateUser } from '../../../core/models/usuario.model';
import { FormControl, FormGroup } from '@angular/forms';
import { UsuarioRoles } from '../../../core/models/usuario.rols.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage extends ComponentBase implements OnInit {
  public hasError: {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    password2: string;
    general: string;
  } = {
    name: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    password2: '',
    general: '',
  };
  public values: {
    name: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    password2: string;
  } = {
    name: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    password2: '',
  };
  constructor(
    private _authService: AuthService,
    private _store: Store<AppState>,
    public router: Router,
    private alertController: AlertController
  ) {
    super();
    this.resetAll();
  }

  ngOnInit() {
    return;
  }
  handleName(value: string) {
    this.values.name = value;
  }
  handleLastname(value: string) {
    this.values.lastName = value;
  }
  handleEmail(value: string) {
    this.values.email = value;
  }
  handlePhone(value: string) {
    this.values.phone = value;
  }
  handlePassword(value: string) {
    this.values.password = value;
  }
  handlePassword2(value: string) {
    this.values.password2 = value;
  }
  onSubmit() {
    this.hasError = {
      name: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      password2: '',
      general: '',
    };
    //TODO: Valid phone
    if (!this.values.name) {
      this.hasError.name = 'The name is needed';
      return;
    }
    if (!this.values.lastName) {
      this.hasError.lastName = 'The last name is needed';
      return;
    }
    if (!this.values.phone) {
      this.hasError.phone = 'Phone number is needed';
      return;
    }

    if (!this.values.email) {
      this.hasError.email = 'Email address is needed';
      return;
    }

    if (!isEmail(this.values.email)) {
      this.hasError.email = 'Wrong email address format';
      return;
    }

    if (!this.values.password) {
      this.hasError.password = 'Password is needed';
      return;
    }

    if (this.values.password.length < 8) {
      this.hasError.password = 'Password too short (minimum 8 letters)';
      return;
    }

    if (!this.values.password2) {
      this.hasError.password2 = 'Password confirmation is needed';
      return;
    }

    if (this.values.password !== this.values.password2) {
      this.hasError.password2 = 'Password not match';
      return;
    }

    const auth: CreateUser = {
      name: this.values.name,
      lastName: this.values.lastName,
      email: this.values.email,
      password: this.values.password,
      phone: this.values.phone,
      role: UsuarioRoles.CUSTOMER,
    };

    this._authService.signUp(auth).subscribe(
      () => {
        this.showAlert(
          'Account created!',
          'The account was created succefully'
        );
        this.resetAll();
        this.router.navigate(['login'], { replaceUrl: true });
      },
      (general) => {
        this.hasError.general = general;
      }
    );
  }

  resetAll() {
    this.hasError = {
      name: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      password2: '',
      general: '',
    };
    this.values = {
      name: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      password2: '',
    };
  }

  async showAlert(header = '', message = '') {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }

  loginRedirect() {
    this.router.navigate(['login'], { replaceUrl: true });
  }
}
