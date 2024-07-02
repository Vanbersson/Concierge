import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//PrimeNg
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { LayoutService } from '../../layouts/layout/layoutService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, CalendarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: []
})
export default class DashboardComponent implements OnInit {


  constructor(private layoutService: LayoutService, private router: Router) { }

  ngOnInit(): void {
    this.validLogin();

  }

  validLogin() {

    if (!this.layoutService.isLogin()) {
      this.router.navigateByUrl('/login');
    }

  }

}
