import { Component, signal, ViewChild, ElementRef, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

//PrimeNg
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { ImageModule } from 'primeng/image';

//Service
import { LayoutService } from '../../layout/service/layout.service';
import { StorageService } from '../../../services/storage/storage.service';

//component
import { VehicleExitComponent } from '../../../views/concierge/vehicle.exit/vehicle.exit.component';
import { UserProfileComponent } from '../../../components/user.profile/user.profile.component';
import { User } from '../../../models/user/user';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, VehicleExitComponent, UserProfileComponent,
    RouterLink, SidebarModule, AvatarModule,
    ImageModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  providers: []
})
export class TopbarComponent implements OnInit, OnDestroy, DoCheck {

  /* Menu Bar */

  qtdNotification = signal<number>(0);

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  /* Sider Bar */
  updateUser = signal<User>(new User());
  showUserPhoto: string = "";
  showUserName: string = "";
  userRoleDescription: string = "";

  visibleSideBarRight: boolean = false;

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  constructor(
    public layoutService: LayoutService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPhotoUser();
    this.getNameUser();
    this.getRoleUser();
  }
  ngOnDestroy(): void {

  }
  ngDoCheck(): void {

    if (this.updateUser().id != 0) {
      this.showUserPhoto = this.updateUser().photo;
      this.showUserName = this.updateUser().name.split(' ')[0];

      this.storageService.photo = this.updateUser().photo;
      this.storageService.name = this.updateUser().name;
      this.storageService.cellphone = this.updateUser().cellphone;
      //Limpa o usuário
      this.updateUser.set(new User());
    }

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
  }

  closeSideBarCallback(e: any): void {
    this.sidebarRef.close(e);
  }

  getNameUser() {
    this.showUserName = this.storageService.name.split(' ')[0];
  }

  getPhotoUser() {
    this.showUserPhoto = this.storageService.photo;
  }

  getRoleUser() {
    this.userRoleDescription = this.storageService.roleDesc;
  }

  get firstLetter(): string {
    let pipe = new UpperCasePipe();
    var iniciais = "";
    var names = this.storageService.name.split(' ');
    try {
      iniciais = names.at(0).substring(0, 1);
      iniciais = iniciais + "" + names.at(1).substring(0, 1);
      return pipe.transform(iniciais);
    } catch {
      iniciais = names.at(0).substring(0, 1);
      return pipe.transform(iniciais);;
    }
  }


}



