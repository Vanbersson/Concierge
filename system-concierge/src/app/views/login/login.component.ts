import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

//PrimeNG
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService, ConfirmationService, TreeNode } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

//Services
import { AuthService } from '../../services/login/auth.service';
import { LayoutService } from '../../layouts/layout/service/layout.service';
import { StorageService } from '../../services/storage/storage.service';
import { BusyService } from '../../components/loading/busy.service';
import { MenuUserService } from '../../services/menu/menu-user.service';
import { PermissionService } from '../../services/permission/permission.service';

//Interface
import { IAuth } from '../../interfaces/auth/iauth';
import { IAuthResponse } from '../../interfaces/auth/iauthresponse';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonModule, PasswordModule, InputTextModule, ToastModule, ReactiveFormsModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export default class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(8), Validators.required]),
  });

  constructor(
    private auth: AuthService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    public layoutService: LayoutService,
    private storageService: StorageService,
    private busyService: BusyService,
    private menuUserService: MenuUserService
  ) {
    this.storageService.deleteStorage();
  }

  async loginUser() {
    const { valid, value } = this.loginForm;

    if (valid) {
      const login: IAuth = { email: value.email, password: value.password };

      this.busyService.busy();

      const resultLogin = await this.login(login);
      if (resultLogin.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Bem-vindo', detail: resultLogin.body.name, icon: 'pi pi-lock-open', life: 3000 });
        this.storageService.companyId = resultLogin.body.companyId.toString();
        this.storageService.resaleId = resultLogin.body.resaleId.toString();
        this.storageService.photo = resultLogin.body.photo;
        this.storageService.id = resultLogin.body.id.toString();
        this.storageService.name = resultLogin.body.name;
        this.storageService.email = login.email;
        this.storageService.cellphone = resultLogin.body.cellphone;
        this.storageService.roleDesc = resultLogin.body.roleDesc;
        this.storageService.limitDiscount = resultLogin.body.limitDiscount.toString();
        this.storageService.token = resultLogin.body.token;

        const resultMenus = await this.menusUser(resultLogin.body.companyId, resultLogin.body.resaleId, resultLogin.body.id);
        var keys = "";
        for (let a = 0; a < resultMenus.length; a++) {
          const element = resultMenus[a];
          keys += element.key + ",";
        }
        this.storageService.menus = keys;
        setTimeout(() => {
          this.router.navigateByUrl('/dashboard');
        }, 1000);
      }
      this.busyService.idle();
    }
  }
  forgetPass() {
    this.confirmationService.confirm({
      header: 'Você esqueceu a senha?',
      message: 'Entre em contato com administrador.',
      accept: () => {
      }
    });
  }
  private async login(login: IAuth): Promise<HttpResponse<IAuthResponse>> {
    try {
      return await lastValueFrom(this.auth.login(login));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login ou senha inválido', icon: 'pi pi-lock', life: 3000 });
      return error;
    }
  }
  private async menusUser(compamyId: number, resaleId: number, userId: number): Promise<TreeNode[]> {
    try {
      return await lastValueFrom(this.menuUserService.getFilterMenuUser(compamyId, resaleId, userId));
    } catch (error) {
      return [];
    }
  }
}
