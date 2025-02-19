import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

//PrimeNG
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

//Services
import { AuthService } from '../../services/login/auth.service';
import { LayoutService } from '../../layouts/layout/service/layout.service';
import { StorageService } from '../../services/storage/storage.service';
import { BusyService } from '../../components/loading/busy.service';
import { MenuUserService } from '../../services/menu/menu-user.service';

//Interface
import { IAuth } from '../../interfaces/auth/iauth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FloatLabelModule, ButtonModule, PasswordModule, InputTextModule, ToastModule, ReactiveFormsModule, ConfirmDialogModule],
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
  ) { }

  public loginUser() {
    const { valid, value } = this.loginForm;

    if (valid) {
      const login: IAuth = { email: value.email, password: value.password };

      this.busyService.busy();

      this.auth.login(login).subscribe({
        next: (data) => {
          this.storageService.companyId = data.body.companyId.toString();
          this.storageService.resaleId = data.body.resaleId.toString();
          this.storageService.photo = data.body.photo;
          this.storageService.id = data.body.id.toString();
          this.storageService.name = data.body.name;
          this.storageService.email = login.email;
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

  forgetPass() {
    this.confirmationService.confirm({
      header: 'Você esqueceu a senha?',
      message: 'Entre em contato com administrador.',
      accept: () => {
      }
    });
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
