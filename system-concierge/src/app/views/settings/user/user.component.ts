import { Component, OnInit } from '@angular/core';
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
import { MessageService, TreeNode } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { AvatarModule } from 'primeng/avatar';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'primeng/tree';

//Service
import { UserService } from '../../../services/user/user.service';
import { UserRoleService } from '../../../services/user-role/user-role.service';

//Class
import { User } from '../../../models/user/user';
import { UserRole } from '../../../models/user-role/user-role';
import { Permission } from '../../../models/permission/permission';
import { PermissionService } from '../../../services/permission/permission.service';
import { PermissionUser } from '../../../models/permission/permission-user';
import { MenuUserService } from '../../../services/menu/menu-user.service';
import { lastValueFrom } from 'rxjs';
import { MenuUser } from '../../../models/menu/menu-user';
import { HttpResponse } from '@angular/common/http';
import { MessageResponse } from '../../../models/message/message-response';
import { IMAGE_MAX_SIZE, MESSAGE_RESPONSE_SUCCESS } from '../../../util/constants';
import { NgxImageCompressService } from 'ngx-image-compress';
import { StorageService } from '../../../services/storage/storage.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TableModule, InputTextModule, TreeModule, InputNumberModule, InputMaskModule, MultiSelectModule, ToastModule, DialogModule, PasswordModule, ImageModule, ButtonModule, AvatarModule, RadioButtonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  providers: [MessageService]
})
export default class UserComponent implements OnInit {


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
    password: new FormControl<string>(''),
    passwordValid: new FormControl<string>(''),
    cellphone: new FormControl<string>(''),
    roleDesc: new FormControl<UserRole[] | null>([], Validators.required),
    roleFunc: new FormControl<string>('USER', Validators.required),
    limitDiscount: new FormControl<number>(0),
  });

  //Dialog Func
  visibleDialogFunc: boolean = false;
  permissions: Permission[] = [];
  permissionsSelect: Permission[] = [];
  permissionUser: Permission[] = [];

  //Dialog Menus
  visibleDialogMenu: boolean = false;
  menus: TreeNode[] = [];
  menuSelect: TreeNode[] = [];


  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private userRoleService: UserRoleService,
    private permissionService: PermissionService,
    private menuUserService: MenuUserService,
    private messageService: MessageService,
    private ngxImageCompressService: NgxImageCompressService) { }

  ngOnInit(): void {
    this.menus = [
      { key: '0_0', label: 'Dashboard', icon: 'pi pi-home' },
      {
        key: '1_0', label: 'Portaria', children: [
          { key: '1_1', label: 'Atendimento', },
          { key: '1_2', label: 'Veículos' },
          { key: '1_3', label: 'Manutenção' },
          {
            key: '1_4', label: 'Cadastros', children: [
              { key: '1_4_0', label: 'Modelo' },
              { key: '1_4_1', label: 'Veículo' },
            ]
          },
        ]
      },
      {
        key: '2_0', label: 'Peças', children: [
          { key: '2_1', label: 'Consulta peças' },
        ]
      },
      {
        key: '4_0', label: 'Faturamento', children: [
          { key: '4_1', label: 'Manutenção Clientes' },
        ]
      },
      {
        key: '100_0', label: 'Relatório', children: [
          {
            key: '100_1', label: 'Portaria', children: [
              { key: '100_1_0', label: 'Veículos', icon: 'pi pi-car' },
            ]
          },
        ]
      },
      {
        key: '999_0', label: 'Configurações', children: [
          { key: '999_1', label: 'Empresa', icon: 'pi pi-building' },
          { key: '999_2', label: 'Cadastro Usuários', icon: 'pi pi-users' },
        ]
      },

    ];

    this.getUsers();
    this.getRoles();
    this.getPermissions();
  }
  //Password
  private addRequirePass() {
    this.formUser.controls['password'].addValidators([Validators.minLength(8), Validators.required]);
    this.formUser.controls['password'].updateValueAndValidity();
  }
  private deleteRequirePass() {
    this.formUser.controls['password'].removeValidators([Validators.minLength(8), Validators.required]);
    this.formUser.controls['password'].updateValueAndValidity();
  }
  //Password Valid
  private addRequirePassValid() {
    this.formUser.controls['passwordValid'].addValidators([Validators.minLength(8), Validators.required]);
    this.formUser.controls['passwordValid'].updateValueAndValidity();
  }
  private deleteRequirePassValid() {
    this.formUser.controls['passwordValid'].removeValidators([Validators.minLength(8), Validators.required]);
    this.formUser.controls['passwordValid'].updateValueAndValidity();
  }
  private getUsers() {
    this.userService.getAll$().subscribe(data => {
      this.users = data;
    });
  }
  private getRoles() {
    this.userRoleService.getAllEnabled$().subscribe(data => {
      this.roles = data;
    })
  }
  public firstLetter(user: User): string {
    return user.name.substring(0, 1);
  }
  public showDialogSave() {
    this.formUser.controls.id.disable();
    this.userSelect = null;
    this.cleanForm();
    this.visibleDialogUser = true;
    this.menuSelect = [];
    this.addRequirePass();
    this.addRequirePassValid();
  }
  public showDialogEdit(user: User) {

    this.deleteRequirePass();
    this.deleteRequirePassValid();

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

    //Menus
    this.getMenusUser();
    //Functions
    this.getPermissionUser();

  }

  private getPermissionUser() {
    this.permissionsSelect = [];

    //Permission user selected
    this.permissionService.getAllUser(this.userSelect.companyId, this.userSelect.resaleId, this.userSelect.id).subscribe(data => {

      if (data.length > 0) {
        var perTemp: Permission[] = [];

        for (var item of data) {
          for (var per of this.permissions) {

            if (item.permissionId == per.id) {
              perTemp.push(per);
            }

          }
        }
        this.permissionsSelect = perTemp;
      }
    });
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
      limitDiscount: 0,
      password: '',
      passwordValid: '',
      roleDesc: null,
      roleFunc: 'USER',
      status: 'ativo'
    });
  }
  public async selectPhoto() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {

      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.userPhoto = base64Data;

        });
      }
    });
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
    if (value.email.trim() == '') {
      this.messageService.add({ severity: 'error', summary: 'Email', detail: 'Campo inválido', icon: 'pi pi-times' });
      return false
    }
    if (value.password.trim() != value.passwordValid.trim()) {
      this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Campo inválido', icon: 'pi pi-times' });
      return false
    }
    if (value.roleDesc == null) {
      this.messageService.add({ severity: 'error', summary: 'Cargo', detail: 'Não selecionado', icon: 'pi pi-times' });
      return false
    }
    return true;
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
  private saveUser() {

    const { value } = this.formUser;
    var userNew = new User();

    userNew.photo = this.userPhoto;
    userNew.companyId = this.storageService.companyId;
    userNew.resaleId = this.storageService.resaleId;
    userNew.name = value.name;
    userNew.email = value.email;
    userNew.cellphone = value.cellphone ?? "";
    userNew.limitDiscount = value.limitDiscount ?? 0;
    userNew.password = value.password;
    userNew.roleId = value.roleDesc.at(0).id;
    userNew.roleDesc = value.roleDesc.at(0).description;
    userNew.roleFunc = value.roleFunc;
    userNew.status = value.status;

    this.userService.saveUser(userNew).subscribe(data => {

      if (data.status == 201) {
        this.getUsers();
        this.alertUserSave();
        this.visibleDialogUser = false;
      }

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
      this.userSelect.password = "";
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
  private getPermissions() {
    this.permissionService.getAll$().subscribe(data => {
      this.permissions = data;
    });
  }
  public async savePermissions() {
    var pUser = new PermissionUser();
    pUser.companyId = this.userSelect.companyId;
    pUser.resaleId = this.userSelect.resaleId;
    pUser.userId = this.userSelect.id;

    var responseDelete = await this.deletePermissionUser(pUser);
    if (responseDelete.body.message == MESSAGE_RESPONSE_SUCCESS) {

      for (let i = 0; i < this.permissionsSelect.length; i++) {
        const per = this.permissionsSelect[i];

        pUser.permissionId = per.id;

        const responseSave = await this.savePermission(pUser);

        if (responseSave.status == 201) {
          if (i == (this.permissionsSelect.length - 1)) {
            this.alertPermisionSave();
            this.hideDialogFunc();
          }
        }

      }

    }

  }

  private async savePermission(per: PermissionUser): Promise<HttpResponse<PermissionUser>> {
    try {
      return lastValueFrom(this.permissionService.saveUser(per));
    } catch (error) {
      return error;
    }
  }

  private async deletePermissionUser(permissionUser: PermissionUser): Promise<HttpResponse<MessageResponse>> {
    try {
      return lastValueFrom(this.permissionService.deleteUser(permissionUser));
    } catch (error) {
      return error;
    }
  }

  //Dialog Menu
  public showDialogMenu() {
    if (this.userSelect) {
      this.visibleDialogMenu = true;

    } else {
      this.messageService.add({ severity: 'info', summary: 'Seleção', detail: 'Selecione um usuário', icon: 'pi pi-info-circle' });
    }
  }
  private getMenusUser() {
    this.menuSelect = [];
    this.menuUserService.getFilterMenuUser(this.userSelect.companyId, this.userSelect.resaleId, this.userSelect.id).subscribe(data => {
      this.menuSelect = data;
    });
  }
  public hideDialogMenu() {
    this.visibleDialogMenu = false;
  }
  public async saveMenus() {

    var menu: MenuUser = new MenuUser();
    menu.companyId = this.userSelect.companyId;
    menu.resaleId = this.userSelect.resaleId;
    menu.userId = this.userSelect.id;

    const responseDelete = await this.deleteMenus(menu);
    if (responseDelete.body.message == MESSAGE_RESPONSE_SUCCESS) {

      for (let index = 0; index < this.menuSelect.length; index++) {
        const menu = this.menuSelect[index];
        const responseSave = await this.saveMenu(menu.key!);
        if (responseSave.status == 201) {
          if (index == this.menuSelect.length - 1) {
            this.alertMenusSave();
          }
        }
      }

      //Close Dialog
      this.visibleDialogMenu = false;

    } else {
      this.messageService.add({ severity: 'error', summary: 'Menu', detail: 'Erro na atualização dos menus.', icon: 'pi pi-times' });
    }

  }
  private async saveMenu(key: string): Promise<HttpResponse<MessageResponse>> {

    try {
      var menu: MenuUser = new MenuUser();
      menu.companyId = this.userSelect.companyId;
      menu.resaleId = this.userSelect.resaleId;
      menu.userId = this.userSelect.id;
      menu.menuId = key;

      return await lastValueFrom(this.menuUserService.saveMenu(menu));
    } catch (error) {
      return error;
    }

  }
  private async deleteMenus(menu: MenuUser): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.menuUserService.deleteMenu(menu));
    } catch (error) {
      return error;
    }
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
  private alertMenusSave() {
    this.messageService.add({ severity: 'success', summary: 'Menus', detail: 'Salvo com sucesso', icon: 'pi pi-check', life: 3000 });
  }




}
