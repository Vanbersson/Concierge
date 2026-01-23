import { Component, signal, ViewChild, ElementRef, OnInit, OnDestroy, DoCheck, Input } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

//PrimeNg
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
//Service
import { LayoutService } from '../../layout/service/layout.service';
import { StorageService } from '../../../services/storage/storage.service';
//component
import { UserProfileComponent } from '../../../components/user.profile/user.profile.component';
import { NotificationComponent } from '../../../components/notification/notification.component';
//Class
import { User } from '../../../models/user/user';
import { UserService } from '../../../services/user/user.service';
import { lastValueFrom } from 'rxjs';
import { MessageResponse } from '../../../models/message/message-response';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, UserProfileComponent, NotificationComponent, DialogModule,
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
  showUserPhoto: string = "";
  showUserName: string = "";
  userRoleDescription: string = "";

  visibleSideBarRight: boolean = false;

  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  updateUser = signal<User>(new User());
  dialogVisibleProfileUser: boolean = false;
  @ViewChild('profileUser') profileUser!: UserProfileComponent;

  constructor(
    public layoutService: LayoutService,
    private userService: UserService,
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
      this.showUserPhoto = this.updateUser().photoUrl;
      this.showUserName = this.updateUser().name.split(' ')[0];

      this.storageService.photo = this.updateUser().photoUrl;
      this.storageService.name = this.updateUser().name;
      this.storageService.cellphone = this.updateUser().cellphone;
      //Limpa o usuário
      this.updateUser.set(new User());
    }
 
  }

  async openProfileUser() {
    const result = await this.userFilterEmail(this.storageService.email);
    if (result.status == 200) {
      this.visibleSideBarRight = false;
      this.dialogVisibleProfileUser = true;
      this.profileUser.showUser(result.body.data);
    }
  }

  private async userFilterEmail(email: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.userService.filterEmail(email));
    } catch (error) {
      return error;
    }
  }
  closeSession() {
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



