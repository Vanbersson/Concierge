import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule,ButtonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent {

  constructor(){}

}
