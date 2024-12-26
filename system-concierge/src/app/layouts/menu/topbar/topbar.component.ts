import { Component, signal, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class TopbarComponent implements OnInit, OnDestroy {

  /* Menu Bar */

  qtdNotification = signal<number>(0);

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  /* Sider Bar */
  userPhoto: string = "";
  userName: string = "";
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
    this.userName = this.storageService.name;
  }

  getPhotoUser() {
    this.userPhoto = this.storageService.photo;
  }

  getRoleUser() {
    this.userRoleDescription = this.storageService.roleDesc;
  }

  get firstLetter(): string {
    return this.userName.substring(0, 1);
  }


}



