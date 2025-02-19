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
import { BusyService } from '../../components/loading/busy.service';
import { MenuUserService } from '../../services/menu/menu-user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FloatLabelModule, ButtonModule, PasswordModule, InputTextModule, ToastModule, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent implements OnInit {

  login: IAuth;

  loginForm = this._fb.group<IAuth>({
    email: '',
    password: '',
  });

  constructor(
    private auth: AuthService,
    private messageService: MessageService,
    private _fb: FormBuilder,
    private router: Router,
    public layoutService: LayoutService,
    private storageService: StorageService,
    private busyService: BusyService,
    private menuUserService: MenuUserService
  ) {

  }
  ngOnInit(): void {
    this.addValidation();
  }
  private addValidation() {
    this.loginForm.controls["email"].addValidators([Validators.email, Validators.required]);
    this.loginForm.controls["email"].updateValueAndValidity();

    this.loginForm.controls["password"].addValidators([Validators.minLength(8),Validators.required]);
    this.loginForm.controls["password"].updateValueAndValidity();
  }
  public loginUser() {
    const { valid, value } = this.loginForm;

    if (valid) {
      this.login = { email: value.email, password: value.password };

      this.busyService.busy();

      this.auth.login(this.login).subscribe({
        next: (data) => {
          this.storageService.companyId = data.body.companyId.toString();
          this.storageService.resaleId = data.body.resaleId.toString();
          this.storageService.photo = data.body.photo;
          this.storageService.id = data.body.id.toString();
          this.storageService.name = data.body.name;
          this.storageService.email = this.login.email;
          this.storageService.cellphone = data.body.cellphone;
          this.storageService.roleDesc = data.body.roleDesc;
          this.storageService.limitDiscount = data.body.limitDiscount.toString();
          this.storageService.token = data.body.token;

          this.menusUser();

          this.messageService.add({ severity: 'success', summary: 'Bem-vindo', detail: data.body.name, icon: 'pi pi-lock-open', life: 2000 });

          setTimeout(() => {
            this.router.navigateByUrl('/dashboard');
          }, 2000);
        },
        error: (error) => {
          this.busyService.idle();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login ou senha inválido', icon: 'pi pi-lock', life: 2000 });
        },
        complete: () => {
          this.busyService.idle();
        }
      });

    }

  }
  public forgetPass() {
    console.log('Forget Password!');
  }
  private menusUser() {
    this.menuUserService.getFilterMenuUser$(this.storageService.companyId, this.storageService.resaleId, this.storageService.id).subscribe(data => {
      var keys = "";
      for (let a = 0; a < data.length; a++) {
        const element = data[a];
        keys += element.key + ",";
      }
      this.storageService.menus = keys;
    });
  }

}
