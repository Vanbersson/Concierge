import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { Parts } from '../../../models/parts/Parts';

@Component({
  selector: 'app-parts',
  standalone: true,
  imports: [CommonModule, InputTextModule, ButtonModule, TableModule, IconFieldModule, InputIconModule, DialogModule],
  templateUrl: './parts.component.html',
  styleUrl: './parts.component.scss'
})
export default class PartsComponent implements OnInit, OnDestroy {

  parts: Parts[] = [];

  constructor() { }

  ngOnInit(): void {
   
  }
  ngOnDestroy(): void {
    
  }

}
