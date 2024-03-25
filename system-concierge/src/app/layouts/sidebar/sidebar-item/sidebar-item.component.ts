import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { SideBarMenuItem } from '../../../interfaces/sidebar-menu-item';


@Component({
  selector: 'app-sidebar-item',
  standalone: true,
  imports: [CommonModule,RouterModule,MatListModule],
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.scss'
})
export class SidebarItemComponent implements OnInit{
  

  @Input() item!: SideBarMenuItem;

  @Input() index!: number;

  constructor(){}

  ngOnInit(): void {
    
  }

}
