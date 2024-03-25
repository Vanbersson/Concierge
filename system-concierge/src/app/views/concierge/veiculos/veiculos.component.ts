import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

//PrimeNG
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { SliderModule } from 'primeng/slider';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-veiculos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgOptimizedImage,TableModule, DropdownModule, TagModule, ProgressBarModule, SliderModule, MultiSelectModule, CardModule, ButtonModule, InputTextModule],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss'
})
export default class VeiculosComponent implements OnInit {

  selectedVeiculo!: { id: number, placa: string, frota: string, modelo: string, dataEntrada: string, porteiro: string, empresa: string, orcamento: string };

  statuses!: any[];

  veiculos: Array<{ id: number, placa: string, frota: string, modelo: string, dataEntrada: string, porteiro: string, empresa: string, orcamento: string }> = [];

  selectedItems: Array<{ id: number, placa: string, frota: string, modelo: string, dataEntrada: string, porteiro: string, empresa: string, orcamento: string }> = [];

  constructor() { }

  ngOnInit(): void {

    this.veiculos = [
      { id: 100, placa: 'PBD-0102', frota: '1020', modelo: 'Graneleiro', dataEntrada: '23/02/2024 09:28', porteiro: 'Antonio', empresa: 'Polimix', orcamento: 'Sem Orçamento' },
      { id: 101, placa: 'PBD-0102', frota: '1030', modelo: 'Graneleiro', dataEntrada: '24/02/2024 09:28', porteiro: 'Antonio', empresa: 'Polimix', orcamento: 'Sem Orçamento' },
      { id: 102, placa: 'PBD-0102', frota: '1040', modelo: 'Graneleiro', dataEntrada: '24/02/2024 09:28', porteiro: 'Marcelo', empresa: 'BBM Transporte', orcamento: 'Enviado' },
      { id: 103, placa: 'PBD-0102', frota: '1050', modelo: 'Graneleiro', dataEntrada: '23/02/2024 09:28', porteiro: 'Antonio', empresa: 'Polimix', orcamento: 'Não Enviado' },
      { id: 104, placa: 'PBD-0102', frota: '1060', modelo: 'Graneleiro', dataEntrada: '23/02/2024 09:28', porteiro: 'Marcelo', empresa: 'BBM Transporte', orcamento: 'Aprovado' },
      { id: 105, placa: 'PBD-0103', frota: '1070', modelo: 'Side', dataEntrada: '23/02/2024 09:28', porteiro: 'Antonio', empresa: 'Gafor', orcamento: 'Não Enviado' },
      { id: 106, placa: 'PBD-0104', frota: '1080', modelo: 'Graneleiro', dataEntrada: '23/02/2024 09:28', porteiro: 'Marcelo', empresa: 'BBM Transporte', orcamento: 'Aprovado' },
      { id: 107, placa: 'PBD-0105', frota: '1090', modelo: 'Graneleiro', dataEntrada: '23/02/2024 09:28', porteiro: 'Antonio', empresa: 'Gafor', orcamento: 'Não Enviado' },
      { id: 108, placa: 'PBD-0106', frota: '1010', modelo: 'Graneleiro', dataEntrada: '23/02/2024 09:28', porteiro: 'Marcelo', empresa: 'BBM Transporte', orcamento: 'Aprovado' },
      { id: 109, placa: 'PBD-0107', frota: '1011', modelo: 'Bau Aluminio', dataEntrada: '03/02/2024 09:28', porteiro: 'Antonio', empresa: 'Gafor', orcamento: 'Não Enviado' },
      { id: 1010, placa: 'PBD-0108', frota: '1012', modelo: 'Graneleiro', dataEntrada: '23/02/2024 09:28', porteiro: 'Marcelo', empresa: 'BBM Transporte', orcamento: 'Aprovado' },
      { id: 1011, placa: 'PBD-0109', frota: '1013', modelo: 'Graneleiro', dataEntrada: '29/02/2024 09:28', porteiro: 'Antonio', empresa: 'Gafor', orcamento: 'Não Enviado' },
      { id: 1012, placa: 'PBD-0202', frota: '1014', modelo: 'Graneleiro', dataEntrada: '23/02/2024 09:28', porteiro: 'Marcelo', empresa: 'BBM Transporte', orcamento: 'Aprovado' },
      { id: 1013, placa: 'PBD-0402', frota: '1015', modelo: 'Graneleiro', dataEntrada: '23/02/2024 09:28', porteiro: 'Antonio', empresa: 'Gafor', orcamento: 'Não Enviado' },
      { id: 1014, placa: 'PBD-0302', frota: '1016', modelo: 'Graneleiro', dataEntrada: '15/02/2024 09:28', porteiro: 'Marcelo', empresa: 'BBM Transporte', orcamento: 'Aprovado' },
      { id: 1015, placa: 'PBD-0002', frota: '1017', modelo: 'Graneleiro', dataEntrada: '01/02/2024 09:28', porteiro: 'Antonio', empresa: 'Gafor', orcamento: 'Não Enviado' },
      { id: 1016, placa: 'PBD-7702', frota: '1018', modelo: 'Graneleiro', dataEntrada: '02/01/2024 09:28', porteiro: 'Marcelo', empresa: 'Bauminas', orcamento: 'Não Aprovado' }
    ];

    this.statuses = [
      { label: 'Sem Orçamento', value: 'Sem Orçamento' },
      { label: 'Não Enviado', value: 'Não Enviado' },
      { label: 'Enviado', value: 'Enviado' },
      { label: 'Aprovado', value: 'Aprovado' },
      { label: 'Não Aprovado', value: 'Não Aprovado' }
    ];



  }

  onSelectionChange(event:any) {
   
    console.log('Itens selecionados:', this.selectedItems.length);
  } 

  getSeverity(status: string): string {
    switch (status) {

      case 'Sem Orçamento':
        return 'Primary';
      case 'Não Enviado':
        return 'info';
      case 'Enviado':
        return 'warning';
      case 'Aprovado':
        return 'success';
      case 'Não Aprovado':
        return 'danger';
    }

    return 'Primary';
  }

  editVeiculo() {

  }



}


