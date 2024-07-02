import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/login/auth.service';
import { LayoutService } from '../../layouts/layout/layoutService';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, ToastModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent implements OnInit {

  hide = true;


  loginForm = this.builder.group({
    email: ['vambersson@gmail.com', [Validators.email, Validators.required]],
    password: ['12345', [Validators.required, Validators.maxLength(8)]],
  });

  constructor(
    private auth: AuthService,
    private builder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private layoutService: LayoutService) {

  }

  ngOnInit(): void {
    this.validLogin();
  }

  validLogin() {

    if (this.layoutService.isLogin()) {
      this.router.navigateByUrl('dashboard');
    }

  }

   onSubmit() {

    const { valid, value } = this.loginForm;

    if (valid) {

      this.auth.login(value).subscribe((data) => {

        if (data.status == 200) {
          this.showSuccess(data.body.name);

          sessionStorage.setItem('companyId', data.body.companyId);
          sessionStorage.setItem('resaleId', data.body.resaleId);
          sessionStorage.setItem('id', data.body.id);
          sessionStorage.setItem('name', data.body.name);
          sessionStorage.setItem('email', data.body.email);
          sessionStorage.setItem('cellPhone', data.body.cellphone);

          sessionStorage.setItem('token', 'abc12345');

          setTimeout(() => {
            this.router.navigateByUrl('v1/dashboard');
          }, 2500);

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
