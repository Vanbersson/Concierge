import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

//PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

//Service
import { StorageService } from '../../../services/storage/storage.service';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule],
  templateUrl: './driver.component.html',
  styleUrl: './driver.component.scss',
  providers: [MessageService]
})
export default class DriverComponent implements OnInit {

  constructor(private storageService: StorageService, private messageService: MessageService,) { }

  ngOnInit(): void {

  }

}
