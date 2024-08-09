import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { LayoutService } from './layouts/layout/service/layout.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent {

  constructor(public layoutService: LayoutService, private router: Router) { }

  login() {
    this.router.navigateByUrl('/login');
  }



}
