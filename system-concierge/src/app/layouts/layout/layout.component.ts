import { Component, OnInit, ViewChild, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar/sidebar.component';
import { TopbarComponent } from '../menu/topbar/topbar.component';



@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export default class LayoutComponent implements OnInit {



  @ViewChild(SidebarComponent) appSidebar!: SidebarComponent;

  @ViewChild(TopbarComponent) appTopbar!: TopbarComponent;

  visibleSidebar = signal(true);

  sideBarWidth = computed(() => (this.visibleSidebar() ? '300px' : '0px'));

  sideBarMarginLeft = computed(() => (this.visibleSidebar() ? '300px' : '-2rem'));

  constructor() { }

  ngOnInit(): void {

  }










}
