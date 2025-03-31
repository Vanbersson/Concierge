import { Component, EventEmitter, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';

import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { ImageModule } from 'primeng/image';
import { MessageService } from 'primeng/api';

import { StorageService } from '../../services/storage/storage.service';
import { UserService } from '../../services/user/user.service';
import { BusyService } from '../loading/busy.service';
import { User } from '../../models/user/user';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { IMAGE_MAX_SIZE } from '../../util/constants';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    ToastModule, ButtonModule, DialogModule,
    InputMaskModule, InputTextModule, RadioButtonModule,
    PasswordModule, ImageModule],
  templateUrl: './user.profile.component.html',
  styleUrl: './user.profile.component.scss',
  providers: [MessageService],
})
export class UserProfileComponent {
  private user: User;
  @Output() public outputUser = new EventEmitter<User>();


  visibleDialogUser: boolean = false;

  userPhoto!: string;
  userEmail!: string;
  userRoleDescription!: string;
  limitDiscount = signal<number>(0);

  userFormView = new FormGroup({
    status: new FormControl<string>({ value: '', disabled: true }),
    name: new FormControl<string>('', Validators.required),
    password: new FormControl<string>(''),
    passwordValid: new FormControl<string>(''),
    cellphone: new FormControl<string>(''),
  });

  userForm = new FormGroup({
    status: new FormControl<string>('', Validators.required),
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>(''),
    passwordValid: new FormControl<string>(''),
    cellphone: new FormControl<string>(''),
    photo: new FormControl<string | null>(null),
    roleDesc: new FormControl<string>('', Validators.required),
  });

  constructor(
    private storageService: StorageService,
    private messageService: MessageService,
    private userService: UserService,
    private busyService: BusyService,
    private ngxImageCompressService: NgxImageCompressService) { }

  showDialogUser() {
    this.busyService.busy();
    this.searchUser();
  }
  private searchUser() {
    this.userService.getUserFilterEmail$(this.storageService.email).subscribe((data) => {
      this.user = data.body;
      this.busyService.idle();
      this.dataViewUser();
      this.visibleDialogUser = true;
    }, (error) => {
      this.busyService.idle();
    });

  }
  hideDialogUser() {
    this.visibleDialogUser = false;
  }
  dataViewUser() {
    this.userFormView.patchValue({
      status: this.user.status,
      name: this.user.name,
      password: '',
      passwordValid: '',
      cellphone: this.user.cellphone,
    });
    this.userPhoto = this.user.photo;
    this.userEmail = this.user.email;
    this.limitDiscount.set(this.user.limitDiscount);
    this.userRoleDescription = this.user.roleDesc;

  }
  deletePhoto() {
    this.userPhoto = "";
    this.userForm.patchValue({ photo: "" });
  }
  selectPhoto() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.userPhoto = base64Data;
          this.userForm.patchValue({ photo: this.userPhoto });
        });
      }
    });

  }
  dataUpdateUser() {
    const { value } = this.userFormView;
    this.user.name = value.name;
    this.user.cellphone = value.cellphone;
    this.user.photo = this.userPhoto != "" ? this.userPhoto : "";
    this.user.password = value.password;
  }

  private validUser(): boolean {
    const { value } = this.userFormView;
    if (value.name == "") {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Nome não informado', icon: 'pi pi-times' });
      return false;
    }

    return true;
  }
  async updateUser() {
    this.dataUpdateUser();

    if (this.validUser()) {
      const resultUser = await this.saveUser(this.user);

      if (resultUser.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Usuário', detail: 'Atualizado com sucesso', icon: 'pi pi-check' });
        this.outputUser.emit(this.user);
        this.hideDialogUser();
      }
    }



  }

  private async saveUser(user: User): Promise<HttpResponse<User>> {
    try {
      return await lastValueFrom(this.userService.updateUser(user));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não autorizado', icon: 'pi pi-times' });
      return error;
    }
  }

  alertErroPassword() {
    this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Senha não conferir', icon: 'pi pi-times' });
  }

}
