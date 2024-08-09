import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';


import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/login/auth.service';
import { LayoutService } from '../../layouts/layout/service/layout.service';
import { IUser } from '../../interfaces/iuser';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FloatLabelModule, ButtonModule, PasswordModule, InputTextModule, ToastModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {

  user: IUser = null;

  loginForm = new FormGroup({
    email: new FormControl('vambersson@gmail.com', [Validators.required, Validators.email]),
    password: new FormControl('12345', [Validators.required, Validators.maxLength(8)]),
  });

  constructor(
    private auth: AuthService,
    private messageService: MessageService,
    private router: Router,
    public layoutService: LayoutService) {

  }

  onSubmit() {

    const { valid, value } = this.loginForm;

    if (valid) {

      this.auth.login(value).subscribe((data) => {

        if (data.status == 200) {
          this.showSuccess(data.body.name);

          this.user = data.body;

          this.layoutService.login(this.user);

          setTimeout(() => {
            this.router.navigateByUrl('/dashboard');
          }, 2000);

        }

      }, (error) => {

        this.showError();

      });


    }

  }

  showSuccess(nome: string) {
    this.messageService.add({ severity: 'success', summary: 'Bem-vindo', detail: nome, icon: 'pi pi-lock-open' });
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login ou senha inválido', icon: 'pi pi-lock' });
  }

  forgetPass() {
    console.log('Forget Password!');
  }

}
