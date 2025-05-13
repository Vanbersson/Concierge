import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';

import { ClientCompany } from '../../../models/clientcompany/client-company';
import { ClientecompanyService } from '../../../services/clientecompany/clientecompany.service';
import { ITypeClient } from '../../../interfaces/clientcompany/Itype-client';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-manutencao-cliente',
  standalone: true,
  imports: [CommonModule, TabViewModule, ButtonModule, InputTextModule, TableModule,
    MultiSelectModule, InputNumberModule, IconFieldModule, InputIconModule, DialogModule,
    ReactiveFormsModule],
  templateUrl: './manutencao-cliente.component.html',
  styleUrl: './manutencao-cliente.component.scss'
})
export default class ManutencaoClienteComponent implements OnInit, OnDestroy, DoCheck {

  clifor: ITypeClient[] = [];
  jurfis: ITypeClient[] = [];
  clients: ClientCompany[] = [];

  formClient = new FormGroup({
    id: new FormControl<number | null>(null),
    clifor: new FormControl<ITypeClient[]>([]),
    jurfis: new FormControl<ITypeClient[]>([]),
  });
  //Dialog
  visible: boolean = false;
  showJuridica = false;
  showFisica = false;

  constructor(private clienteService: ClientecompanyService) {

  }
  ngDoCheck(): void {

    if (this.formClient.value.jurfis.at(0)) {
      if (this.formClient.value.jurfis.at(0)?.type == "Jurídica") {
        this.showJuridica = true;
        this.showFisica = false;
      } else if (this.formClient.value.jurfis.at(0)?.type == "Física") {
        this.showFisica = true;
        this.showJuridica = false;
      }
    } else {
      this.showJuridica = false;
      this.showFisica = false;
    }


  }

  ngOnInit(): void {

    this.clifor = [{ type: 'Cliente', value: 'cli' }, { type: 'Fornecedor', value: 'val' }, { type: 'Ambos', value: 'am' }];
    this.jurfis = [{ type: 'Jurídica', value: 'jur' }, { type: 'Física', value: 'fis' }];

    this.clienteService.getAll$().subscribe(data => {
      this.clients = data;
    })
  }
  ngOnDestroy(): void {

  }
  showDialog() {
    this.visible = true;
  }


}
