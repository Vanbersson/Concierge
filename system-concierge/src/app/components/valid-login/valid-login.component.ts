import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//Service
import { LayoutService } from '../../layouts/layout/layoutService';

@Component({
  selector: 'app-valid-login',
  standalone: true,
  imports: [],
  templateUrl: './valid-login.component.html',
  styleUrl: './valid-login.component.scss'
})
export default class ValidLoginComponent implements OnInit {

  constructor(private layoutService: LayoutService, private router: Router) { }

  ngOnInit(): void {
    this.validLogin();
  }

  validLogin() {

    if (this.layoutService.isLogin()) {
      this.router.navigateByUrl('dashboard');
    } else {
      this.router.navigateByUrl('login');
    }

  }

}
