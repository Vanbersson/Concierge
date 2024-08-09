import { Component, signal, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router,RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

//PrimeNg
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from "primeng/dropdown";
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


//Service
import { UserService } from '../../../services/user/user.service';
import { UserRoleService } from '../../../services/user-role/user-role.service';
import { LayoutService } from '../../layout/service/layout.service';


@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterLink, ToastModule, ButtonModule, SidebarModule, DialogModule, BadgeModule, AvatarModule, InputMaskModule, ImageModule, InputTextModule, RadioButtonModule, DropdownModule, PasswordModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  providers: [MessageService]
})
export class TopbarComponent implements OnInit {

  /* Menu Bar */

  qtdAlert = signal<number>(0);

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;


  /* Sider Bar */

  @Output() sideBar = new EventEmitter<boolean>();

  visibleSideBarRight: boolean = false;

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  /* Dialog User */

  visibleDialogUser: boolean = false;

  userPhoto!: string;
  userName!: string | null;
  userEmail!: string;
  userRoleDescription!: string;

  userFormView = new FormGroup({
    status: new FormControl<string>({ value: '', disabled: true }),
    name: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    passwordValid: new FormControl<string>('', Validators.required),
    cellphone: new FormControl<string>('', Validators.required),

  });

  userForm = new FormGroup({
    companyId: new FormControl<number>(0, Validators.required),
    resaleId: new FormControl<number>(0, Validators.required),
    id: new FormControl<number>(0, Validators.required),
    status: new FormControl<string>('', Validators.required),
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    cellphone: new FormControl<string>('', Validators.required),
    photo: new FormControl<string | null>(null),
    role: new FormControl<number>(0, Validators.required),
  });

  constructor(public layoutService: LayoutService, private userService: UserService, private userRoleService: UserRoleService, private messageService: MessageService) { 
    layoutService.isLogin();
  }

  ngOnInit(): void {

  }

  closeSession() {

    this.layoutService.closeLogin();

  }

  showSideBarRight() {
    this.visibleSideBarRight = true;

    this.getNameUser();

    this.getPhotoUser();

    this.getRoleUser();
  }

  closeSideBarCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  getNameUser() {
    this.userName = this.layoutService.loginUser.name;
  }

  getPhotoUser() {
    this.userPhoto = this.layoutService.loginUser.photo != "null" ? this.layoutService.loginUser.photo : "";
  }

  getRoleUser() {
    this.userRoleService.getfilterId$(this.layoutService.loginUser.role).subscribe((data) => {

      if (data.status == 200) {
        this.userRoleDescription = data.body.description;
      }

    });
  }

  /* Dialog User */

  showDialogUser() {

    this.visibleDialogUser = true;

    this.dataViewUser();

    this.closeSideBarCallback(new Event('click'));

  }

  hideDialogUser() {
    this.visibleDialogUser = false;
  }

  dataViewUser() {

    this.userEmail = this.layoutService.loginUser.email;

    this.userFormView.patchValue({
      status: this.layoutService.loginUser.status,
      name: this.layoutService.loginUser.name,
      password: '',
      passwordValid: '',
      cellphone: this.layoutService.loginUser.cellphone,
    });

  }

  deleteEntryPhotoDriver() {
    this.userPhoto = "";
    this.userForm.patchValue({ photo: null });
  }

  selectEntryPhotoDriver(event: any) {
    var file = event.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event2: any) => {

        //image byte
        const byteImg = event2.target.result.split('base64,')[1];

        this.userPhoto = byteImg;

        this.userForm.patchValue({ photo: byteImg });
      };
    }
  }

  dataUpdateUser() {
    const { value } = this.userFormView;

    this.userForm.patchValue({
      companyId: this.layoutService.loginUser.companyId,
      resaleId: this.layoutService.loginUser.resaleId,
      id: this.layoutService.loginUser.id,
      status: this.layoutService.loginUser.status,
      name: value.name,
      email: this.layoutService.loginUser.email,
      password: value.password,
      cellphone: value.cellphone,
      photo: this.userPhoto != "" ? this.userPhoto : null,
      role: this.layoutService.loginUser.role,
    });
  }

  validationPass(): boolean {
    const { value, valid } = this.userFormView;
    if (value.password != value.passwordValid) {
      this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Senha não conferir', icon: 'pi pi-times' });
      return false
    }

    if (value.password == '' || value.passwordValid == '') {
      this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Senha não informada', icon: 'pi pi-times' });
      return false
    }

    return true;
  }

  updateUser() {

    this.dataUpdateUser();

    if (this.validationPass()) {

      this.userService.updateUser(this.userForm.value).subscribe((data) => {

        if (data.status == 200) {

          this.showSaveSuccess();

          this.hideDialogUser();

          this.layoutService.login(data.body);
        }

      });

    }

  }

  showSaveSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Usuário', detail: 'Usuário atualizado com sucesso', icon: 'pi pi-user' });
  }

  get nametest(){
    return this.userName.substring(0,1);
  }



}



