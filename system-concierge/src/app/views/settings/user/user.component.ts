import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';


//PrimeNG
import { TableModule } from 'primeng/table'
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { AvatarModule } from 'primeng/avatar';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';


//Service
import { UserService } from '../../../services/user/user.service';
import { UserRoleService } from '../../../services/user-role/user-role.service';

//Class
import { User } from '../../../models/user/user';
import { UserRole } from '../../../models/user-role/user-role';
import { error } from 'console';
import { Permission } from '../../../models/permission/permission';
import { PermissionService } from '../../../services/permission/permission.service';
import { PermissionUser } from '../../../models/permission/permission-user';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TableModule, InputTextModule, InputNumberModule, InputMaskModule, MultiSelectModule, ToastModule, DialogModule, PasswordModule, ImageModule, ButtonModule, AvatarModule, RadioButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [MessageService]
})
export default class UserComponent {

  private user: User;
  private userSelect: User;
  users: User[] = [];
  roles: UserRole[] = [];

  //Dialog
  visibleDialogUser: boolean = false;
  userName!: string;
  userPhoto!: string;
  userEmail!: string;
  userRoleDescription!: string;

  formUser = new FormGroup({
    id: new FormControl<number | null>(null),
    status: new FormControl<string>({ value: 'ativo', disabled: false }),
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    passwordValid: new FormControl<string>('', Validators.required),
    cellphone: new FormControl<string>('', Validators.required),
    roleDesc: new FormControl<UserRole[] | null>([], Validators.required),
    roleFunc: new FormControl<string>('USER', Validators.required),
    limitDiscount: new FormControl<number | null>(null),
  });

  //Dialog Func
  visibleDialogFunc: boolean = false;
  permissions: Permission[] = [];
  permissionsSelect: Permission[] = [];
  permissionUser: Permission[] = [];

  constructor(
    private userService: UserService,
    private userRoleService: UserRoleService,
    private permissionService: PermissionService,
    private messageService: MessageService) {
    this.userService.getUser$().subscribe(data => {
      this.user = data;
      this.getUsers();
      this.getRoles();
      this.getPermissions();
    });

  }
  public getUsers() {
    this.userService.getAll$().subscribe(data => {
      this.users = data;
    });
  }
  private getRoles() {
    this.userRoleService.getAllEnabled$().subscribe(data => {
      this.roles = data;
    })
  }

  private getPermissions() {
    this.permissionService.getAll$().subscribe(data => {
      this.permissions = data;
    });
  }
  public firstLetter(user: User): string {
    return user.name.substring(0, 1);
  }
  public showDialogUser() {
    this.formUser.controls.id.disable();
    this.userSelect = null;
    this.cleanForm();
    this.visibleDialogUser = true;
  }
  public hideDialogUser() {
    this.visibleDialogUser = false;
  }
  private cleanForm() {
    this.userPhoto = '';
    this.formUser.patchValue({
      id: null,
      name: '',
      email: '',
      cellphone: '',
      limitDiscount: null,
      password: '',
      passwordValid: '',
      roleDesc: null,
      roleFunc: 'USER',
      status: 'ativo'
    });
  }
  public selectPhoto(event: any) {
    var file = event.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {

        //image byte
        const byteImg = event2.target.result.split('base64,')[1];
        this.userPhoto = byteImg;

      };
    }
  }
  public deletePhoto() {
    this.userPhoto = "";
  }
  private validationForm(): boolean {
    const { value } = this.formUser;

    if (value.name.trim() == '') {
      this.messageService.add({ severity: 'error', summary: 'Nome', detail: 'Campo inválido', icon: 'pi pi-times' });
      return false
    }
    if (value.cellphone.trim() == '') {
      this.messageService.add({ severity: 'error', summary: 'Celular', detail: 'Campo inválido', icon: 'pi pi-times' });
      return false
    }
    if (value.email.trim() == '') {
      this.messageService.add({ severity: 'error', summary: 'Email', detail: 'Campo inválido', icon: 'pi pi-times' });
      return false
    }

    if (value.password.trim() != value.passwordValid.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Campo inválido', icon: 'pi pi-times' });
      return false
    }

    if (value.password == '' || value.passwordValid == '') {
      this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Campo obrigatório', icon: 'pi pi-times' });
      return false
    }

    if (value.roleDesc.at(0) == null) {
      this.messageService.add({ severity: 'error', summary: 'Cargo', detail: 'Não selecionado', icon: 'pi pi-times' });
      return false
    }
    return true;
  }
  public editUser(user: User) {

    this.visibleDialogUser = true;
    this.formUser.controls.id.enable();
    this.userSelect = user;
    var roleSelect: UserRole;
    this.userPhoto = user.photo;

    for (var role of this.roles) {
      if (role.id == user.roleId) {
        roleSelect = role;
      }
    }

    this.formUser.patchValue({
      id: user.id,
      name: user.name,
      email: user.email,
      cellphone: user.cellphone,
      limitDiscount: user.limitDiscount,
      roleDesc: [roleSelect],
      roleFunc: user.roleFunc,
      status: user.status
    });

    this.permissionsSelect = [];

    this.permissionService.getAllUser$(user.id).subscribe(data => {

      if (data.length > 0) {
        var perTemp: Permission[] = [];
        for (var item of data) {
          for (var permission of this.permissions) {
            if (item.permissionId == permission.id) {
              perTemp.push(permission);
            }
          }
        }
        this.permissionsSelect = perTemp;
      }
    });
  }

  private saveUser() {

    const { value } = this.formUser;
    var userNew = new User();

    userNew.photo = this.userPhoto;
    userNew.companyId = this.user.companyId;
    userNew.resaleId = this.user.resaleId;
    userNew.name = value.name;
    userNew.email = value.email;
    userNew.cellphone = value.cellphone;
    userNew.limitDiscount = value.limitDiscount;
    userNew.password = value.password;
    userNew.roleId = value.roleDesc.at(0).id;
    userNew.roleDesc = value.roleDesc.at(0).description;
    userNew.roleFunc = value.roleFunc;
    userNew.status = value.status;

    this.userService.saveUser(userNew).subscribe(data => {

      if (data.status == 201) {
        this.getUsers();
        this.alertUserSave();
      }

    }, error => {

    });

  }
  private updateUser() {

    if (this.validationForm()) {

      const { value } = this.formUser;

      this.userSelect.photo = this.userPhoto;
      this.userSelect.name = value.name;
      this.userSelect.email = value.email;
      this.userSelect.cellphone = value.cellphone;
      this.userSelect.limitDiscount = value.limitDiscount;
      this.userSelect.password = value.password;
      this.userSelect.roleId = value.roleDesc.at(0).id;
      this.userSelect.roleDesc = value.roleDesc.at(0).description;
      this.userSelect.roleFunc = value.roleFunc;
      this.userSelect.status = value.status;

      this.userService.updateUser(this.userSelect).subscribe((data) => {
        if (data.status == 200) {
          this.alertUserUpdate();
        }
      }, (error) => {
        if (error.status == 401) {
          this.alertPasswordError();
        }
      });
    }
  }
  public save() {

    if (this.validationForm()) {
      if (this.formUser.controls.id.disabled) {
        this.saveUser();
      } else {
        this.updateUser();
      }
    }

  }

  //Dialog Func
  public showDialogFunc() {
    if (this.userSelect) {
      this.visibleDialogFunc = true;
    } else {
      this.messageService.add({ severity: 'info', summary: 'Seleção', detail: 'Selecione um usuário', icon: 'pi pi-info-circle' });
    }
  }
  public hideDialogFunc() {
    this.visibleDialogFunc = false;
  }
  public savePermission() {
    var pUser = new PermissionUser();
    pUser.companyId = this.userSelect.companyId;
    pUser.resaleId = this.userSelect.resaleId;
    pUser.userId = this.userSelect.id;
    pUser.permissionId = 100;

    if (this.permissionsSelect.length == 0) {
      this.deletePermissionUser(pUser);
    } else {

      for (let i = 0; i < this.permissionsSelect.length; i++) {
        const per = this.permissionsSelect[i];

        pUser.permissionId = per.id;

        this.permissionService.saveUser(pUser).subscribe(data => {
          if (i == (this.permissionsSelect.length - 1)) {
            this.alertPermisionSave();
            this.hideDialogFunc();
          }

        }, error => {

        });
      }
    }


  }
  private deletePermissionUser(user: PermissionUser) {
    this.permissionService.deleteUser(user).subscribe(data => {
      this.alertPermisionSave();
      this.hideDialogFunc();
    }, error => {

    });
  }

  //Alert
  private alertUserSave() {
    this.messageService.add({ severity: 'success', summary: 'Usuário', detail: 'Salvo com sucesso', icon: 'pi pi-check', life: 3000 });
  }
  private alertUserUpdate() {
    this.messageService.add({ severity: 'success', summary: 'Usuário', detail: 'Atualizado com sucesso', icon: 'pi pi-check', life: 3000 });
  }
  private alertPasswordError() {
    this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Senha não conferir', icon: 'pi pi-times' });
  }
  private alertPermisionSave() {
    this.messageService.add({ severity: 'success', summary: 'Permissões', detail: 'Salvo com sucesso', icon: 'pi pi-check', life: 3000 });
  }




}
