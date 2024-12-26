import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';

import { ClientCompany } from '../../../models/clientcompany/client-company';
import { ClientecompanyService } from '../../../services/clientecompany/clientecompany.service';

@Component({
  selector: 'app-manutencao-cliente',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, TableModule, IconFieldModule, InputIconModule, DialogModule],
  templateUrl: './manutencao-cliente.component.html',
  styleUrl: './manutencao-cliente.component.scss'
})
export default class ManutencaoClienteComponent implements OnInit, OnDestroy {

  clients: ClientCompany[] = [];
  visible: boolean = false;

  constructor(private clienteService: ClientecompanyService) {
    
   }

  ngOnInit(): void {
    this.clienteService.getAll$().subscribe(data =>{
      this.clients = data;
    })
  }
  ngOnDestroy(): void {

  }
  showDialog() {
    this.visible = true;
  }


}
