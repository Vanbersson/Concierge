import { Component, signal, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { VehicleExitComponent } from '../../../views/concierge/vehicle-exit/vehicle-exit.component';

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
import { OverlayPanelModule } from 'primeng/overlaypanel';


//Service
import { UserService } from '../../../services/user/user.service';
import { UserRoleService } from '../../../services/user-role/user-role.service';
import { LayoutService } from '../../layout/service/layout.service';
import { IUser } from '../../../interfaces/user/iuser';
import { StorageService } from '../../../services/storage/storage.service';



@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule,VehicleExitComponent, FormsModule, ReactiveFormsModule, RouterLink,OverlayPanelModule, ToastModule, ButtonModule, SidebarModule, DialogModule, BadgeModule, AvatarModule, InputMaskModule, ImageModule, InputTextModule, RadioButtonModule, DropdownModule, PasswordModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  providers: [MessageService]
})
export class TopbarComponent {

  private user: IUser = null;


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
  userName!: string;
  userPhoto!: string;
  userEmail!: string;
  userRoleDescription!: string;
  limitDiscount = signal<number>(0);

  userFormView = new FormGroup({
    status: new FormControl<string>({ value: '', disabled: true }),
    name: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    passwordValid: new FormControl<string>('', Validators.required),
    cellphone: new FormControl<string>('', Validators.required),

  });

  userForm = new FormGroup({
    status: new FormControl<string>('', Validators.required),
    name: new FormControl<string>('', Validators.required),
    email: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    passwordValid: new FormControl<string>('', Validators.required),
    cellphone: new FormControl<string>('', Validators.required),
    photo: new FormControl<string | null>(null),
    roleDesc: new FormControl<string>('', Validators.required),
  });

  constructor(public layoutService: LayoutService, private storageService: StorageService,
    private router: Router,
    private userService: UserService,
    private userRoleService: UserRoleService,
    private messageService: MessageService) {

  }

  closeSession() {
    this.storageService.deleteStorage();
    this.navigatorLogin();
  }

  private navigatorLogin() {
    this.router.navigateByUrl("/login");
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
    this.userName = this.storageService.name;
  }

  getPhotoUser() {
   this.userPhoto = this.storageService.photo;
  }

  getRoleUser() {
    this.userRoleDescription = this.storageService.roleDesc;
  }

  /* Dialog User */

  showDialogUser() {
    this.searchUser();
    this.closeSideBarCallback(new Event('click'));
  }

  private searchUser() {
    this.userService.getUser$().subscribe((data) => {
      this.user = data;
      this.visibleDialogUser = true;
      this.dataViewUser();
    },(error)=>{

    });
  }

  hideDialogUser() {
    this.visibleDialogUser = false;
  }

  dataViewUser() {

    this.userEmail = this.user.email;
    this.limitDiscount.set(this.user.limitDiscount);
    this.userFormView.patchValue({
      status: this.user.status,
      name: this.user.name,
      password: '',
      passwordValid: '',
      cellphone: this.user.cellphone,
    });

  }

  deleteEntryPhotoDriver() {
    this.userPhoto = "";
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

  validationPass(): boolean {
    const { value } = this.userFormView;

    if (value.name == '' || value.cellphone == '') {
      this.messageService.add({ severity: 'error', summary: 'Campo', detail: 'Campo inválido', icon: 'pi pi-times' });
      return false
    }

    if (value.password != value.passwordValid) {
      this.alertErroPassword();
      return false
    }

    if (value.password == '' || value.passwordValid == '') {
      this.alertErroPassword();
      return false
    }
    return true;
  }

  dataUpdateUser() {
    const { value } = this.userFormView;
    this.user.name = value.name;
    this.user.cellphone = value.cellphone;
    this.user.photo = this.userPhoto != "" ? this.userPhoto : null;
    this.user.password = value.password;
  }

  updateUser() {

    if (this.validationPass()) {

      this.dataUpdateUser();
      this.userService.updateUser(this.user).subscribe((data) => {
        if (data.status == 200) {
          this.showSaveSuccess();
          this.saveStorage(this.user);
          this.hideDialogUser();
        }
      }, (error) => {
        if (error.status == 401) {
          this.alertErroPassword();
        }
      });

    }

  }

  private saveStorage(user: IUser) {
    this.storageService.photo = user.photo;
    this.storageService.name = user.name;
  }

  showSaveSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Usuário', detail: 'Usuário atualizado com sucesso', icon: 'pi pi-user' });
  }

  alertErroPassword() {
    this.messageService.add({ severity: 'error', summary: 'Senha', detail: 'Senha não conferir', icon: 'pi pi-times' });
  }

  get firstLetter(): string {
    return this.userName.substring(0, 1);
  }



}



