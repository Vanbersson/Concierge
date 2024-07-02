import { Component, signal, ViewChild, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

//PrimeNg
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';

//Angular Material
import { MatDialog, MatDialogModule, MatDialogTitle, MatDialogContent, MatDialogClose, MatDialogConfig } from '@angular/material/dialog';


@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, ButtonModule, SidebarModule, BadgeModule, AvatarModule, MatDialogModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  providers: []
})
export class TopbarComponent implements OnInit {

  qtdAlert = signal('2');

  visible: boolean = false;

  @ViewChild('menuButton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  visibleSideBar = signal(false);

  @Output() sideBar = new EventEmitter<boolean>();

  visibleSideBarRight: boolean = false;

  nameUser!: string | null;

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(private dialogUser: MatDialog) { }

  ngOnInit(): void {
    this.dataUser();

  }

  dataUser() {
    this.nameUser = sessionStorage.getItem('name');

  }

  setSideBar(val: boolean) {
    this.sideBar.emit(val);
    this.visibleSideBar.set(!val);
  }

  showSideBarRight() {
    this.visibleSideBarRight = true;
  }

  closeSideBarCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  openDialog() {

    const dialogRef = this.dialogUser.open(DialogPerfilUser);

    this.closeSideBarCallback(null);

    /*  dialogRef.afterClosed().subscribe(result => {
       console.log(`Dialog result: ${result}`);
     }); */
  }

}

@Component({
  selector: 'dialog-perfil-user',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatDialogModule, MatDialogTitle, MatDialogContent,CardModule,ScrollPanelModule, MatDialogClose, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, RadioButtonModule, DropdownModule, AvatarModule, InputMaskModule, PasswordModule],
  templateUrl: '../../../views/menus/config/perfil-user/dialog-perfil-user.html',
  styleUrl: '../../../views/menus/config/perfil-user/dialog-perfil-user.scss'
})
export class DialogPerfilUser implements OnInit {

  imageUser = 'assets/layout/images/picture.png';

  userForm = this._fb.group({
    companyId: [''],
    resaleId: [''],
    id: [''],
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    passwordValid: ['', Validators.required],
    cellPhone: [''],
    roleId: ['', Validators.required],
    status: ['ativo', Validators.required]

  });

  dropdownItems = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' },
    { name: 'Option 3', code: 'Option 3' },
    { name: 'Option 3', code: 'Option 3' },
    { name: 'Option 3', code: 'Option 3' },
    { name: 'Option 7 sdsdsds sd', code: 'Option 7' }
  ];


  constructor(private _fb: FormBuilder) { }


  ngOnInit(): void {
    this.dataUser();
  }

  onSubmit() {

  }

  onSelectFile(event: any) {
    const file = event.target.files[0];

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event: any) => {

        this.imageUser = event.target.result;

      };
    }
  }

  dataUser() {
    this.userForm.patchValue({
      companyId: sessionStorage.getItem('companyId'),
      resaleId: sessionStorage.getItem('resaleId'),
      name: sessionStorage.getItem('name'),
      email: sessionStorage.getItem('email'),
      cellPhone: sessionStorage.getItem('cellPhone'),
      status: 'ativo'

    });




  }


}
