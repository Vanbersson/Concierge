import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

//PrimeNg
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { LayoutService } from '../../layouts/layout/service/layout.service';
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


  constructor(public layoutService: LayoutService, private router: Router) {
    this.layoutService.isLogin();
  }

  ngOnInit(): void {
    
  }


}
