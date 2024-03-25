import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ToastModule } from 'primeng/toast';

import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/login/auth.service';



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

  constructor(
  
    private auth: AuthService,
    private builder: FormBuilder,
    private messageService: MessageService,) {

  }

  ngOnInit(): void {

  }

  loginForm = this.builder.group({
    login: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.maxLength(8)]],
  });


  onSubmit() {

    if(this.loginForm.valid){
      
      //this.user.login = this.loginForm.value!;
    
      this.loginForm.get('password');
  
      //this.auth.authLogin(this.user);
    }

    

  }

  forgetPass() {
    console.log('Forget Password!');
  }

}
