import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/login/auth.service';
import { LayoutService } from '../../layouts/layout/service/layout.service';
import { IUser } from '../../interfaces/user/iuser';
import { StorageService } from '../../services/storage/storage.service';


//Interface
import { IAuth } from '../../interfaces/auth/iauth';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FloatLabelModule, ButtonModule, PasswordModule, InputTextModule, ToastModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent implements OnInit {

  user: IUser = null;
  login: IAuth;
  token: string = "";


  loginForm = this._fb.group<IAuth>({
    email: 'vambersson@gmail.com',
    password: 'VjslM@1236!',
  });

  constructor(
    private auth: AuthService,
    private messageService: MessageService,
    private _fb: FormBuilder,
    private router: Router,
    public layoutService: LayoutService, private storageService: StorageService) {


  }
  ngOnInit(): void {
    this.addValidation();
  }

  addValidation() {
    this.loginForm.controls["email"].addValidators([Validators.email, Validators.required]);
    this.loginForm.controls["email"].updateValueAndValidity();

    this.loginForm.controls["password"].addValidators([Validators.minLength(8)]);
    this.loginForm.controls["password"].updateValueAndValidity();
  }

  onSubmit() {

    //Senha Administrador
    //VjslM@1236!
    const { valid, value } = this.loginForm;

    if (valid) {
      this.login = { email: value.email, password: value.password };

      this.auth.login(this.login).subscribe(
        (data) => {
          
          this.storageService.photo = data.body.photo;
          this.storageService.name = data.body.name;
          this.storageService.roleDesc = data.body.roleDesc;
          this.storageService.token = data.body.token;

          this.showSuccess(data.body.name);

          setTimeout(() => {
            this.router.navigateByUrl('/dashboard');
          }, 2000);

        }, (error) => {
          this.showError();
        }
      );

    }

  }

  showSuccess(nome: string) {
    this.messageService.add({ severity: 'success', summary: 'Bem-vindo', detail: nome, icon: 'pi pi-lock-open', life: 3000 });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login ou senha inválido', icon: 'pi pi-lock' });
  }

  forgetPass() {
    console.log('Forget Password!');
  }

}
