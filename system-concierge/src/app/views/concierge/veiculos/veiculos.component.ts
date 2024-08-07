import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage, UpperCasePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

//Service
import { VehicleEntry } from '../../../models/vehicle/vehicleEntry';
import { LayoutService } from '../../../layouts/layout/layoutService';
import { VehicleService } from '../../../services/vehicle/vehicle.service';

//Constants
import { STATUS_VEHICLE_ENTRY_NOTAUTH, STATUS_VEHICLE_ENTRY_FIRSTAUTH, STATUS_VEHICLE_ENTRY_AUTHORIZED } from '../../../util/constants';


@Component({
  selector: 'app-veiculos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgOptimizedImage, ToastModule, TableModule, DropdownModule, TagModule, ProgressBarModule, SliderModule, MultiSelectModule, CardModule, ButtonModule, InputTextModule],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss',
  providers: [MessageService]
})
export default class VeiculosComponent implements OnInit {

  notAuth = STATUS_VEHICLE_ENTRY_NOTAUTH;
  firstAuth = STATUS_VEHICLE_ENTRY_FIRSTAUTH;
  authorized = STATUS_VEHICLE_ENTRY_AUTHORIZED;

  selectedVeiculo!: { id: number, placa: string, frota: string, modelo: string, dataEntrada: string, porteiro: string, empresa: string, orcamento: string };

  statusOrcamento!: any[];


  statusLiberacao!: any[];

  listVehicleEntry: VehicleEntry[] = [];

  selectedItems: VehicleEntry[] = [];

  formLiberar = new FormGroup({
    companyId: new FormControl<Number>(0),
    resaleId: new FormControl<Number>(0),
    id: new FormControl<Number>(0),
    idUserExitAuth: new FormControl<Number>(0),
    nameUserExitAuth: new FormControl<string>(''),
  });

  constructor(private vehicleService: VehicleService, private layoutService: LayoutService, private router: Router, private messageService: MessageService,) { }

  ngOnInit(): void {

    this.validLogin();

    this.listVehicles();



    this.statusOrcamento = [
      { label: 'Sem Orçamento', value: 'Sem Orçamento' },
      { label: 'Não Enviado', value: 'Não Enviado' },
      { label: 'Pendente Aprovação', value: 'Pendente Aprovação' },
      { label: 'Aprovado', value: 'Aprovado' },
      { label: 'Não Aprovado', value: 'Não Aprovado' }
    ];

    this.statusLiberacao = [
      { label: 'Não Liberado', value: this.notAuth },
      { label: '1ª Liberação', value: this.firstAuth },
      { label: 'Liberado', value: this.authorized }
    ];

  }

  listVehicles() {
    this.vehicleService.entryList$().subscribe((data) => {

      for (let index = 0; index < data.length; index++) {

        switch (data[index].budgetStatus) {
          case 'pendenteAprovacao':
            data[index].budgetStatus = 'Pendente Aprovação';
            break;
          case 'naoEnviado':
            data[index].budgetStatus = 'Não Enviado';
            break;
          case 'semOrcamento':
            data[index].budgetStatus = 'Sem Orçamento';
            break;
          case 'Aprovado':
            break;
          case 'naoAprovado':
            data[index].budgetStatus = 'Não Aprovado';
            break;
        }

        if (data[index].vehicleNew == "yes") {
          data[index].placa = "novo";
        } else {
          var placa = data[index].placa;
          data[index].placa = placa.substring(0, 3) + "-" + placa.substring(3, 7);
        }



        var nome = data[index].clientCompanyName.split(' ');
        data[index].clientCompanyName = nome[0] + " " + nome[1];

      }
      this.listVehicleEntry = data;
    });
  }

  novoAtendimento() {
    this.router.navigateByUrl('v1/portaria/atendimento');
  }

  validLogin() {

    if (!this.layoutService.isLogin()) {
      this.router.navigateByUrl('/login');
    }

  }

  onSelectionChange(event: any) {

    console.log('Itens selecionados:', this.selectedItems.length);
  }

  getPlaca(placa: string) {

  }

  getSeverity(value: string): any {

    switch (value) {
      case 'Pendente Aprovação':
        return 'primary';
      case 'Não Enviado':
        return 'info';
      case 'Sem Orçamento':
        return 'warning';
      case 'Aprovado':
        return 'success';
      case 'Não Aprovado':
        return 'danger';
    }

    return 'warning';
  }

  editVeiculo(id: number) {
    this.router.navigateByUrl('v1/portaria/manutencao/' + id);
  }

  addAuthorizationAll() {
    for (let index = 0; index < this.selectedItems.length; index++) {
      const element = this.selectedItems[index];
      this.addAuthorization(element);
    }
  }

  addAuthorization(vehicle: VehicleEntry) {

    if(vehicle.statusAuthExit != this.authorized){

      this.formLiberar.patchValue({
        companyId: vehicle.companyId,
        resaleId: vehicle.resaleId,
        id: vehicle.id,
        idUserExitAuth: Number.parseInt(sessionStorage.getItem('id')!),
        nameUserExitAuth: sessionStorage.getItem('name'),
      });
  
      this.vehicleService.entryAddAuth(this.formLiberar.value).subscribe((data) => {
        if (data.body == "Success.") {
  
          //Autorização de saída
          if (vehicle.statusAuthExit == this.notAuth) {
            this.showAuthSuccess(vehicle.placa);
          }
  
          //Saída liberada
          if (vehicle.statusAuthExit == this.firstAuth) {
            this.showLiberadoSuccess(vehicle.placa);
          }
  
  
          this.listVehicles();
        } else {
          console.log(data.body);
  
          if (data.body == "UserAttendant") {
            this.showUserAttendant();
          }
          if (data.body == "ClientCompany") {
            this.showClientCompany();
          }
        }
  
      });

    }else{
      this.showInfo();
    }

  }

  showUserAttendant() {
    this.messageService.add({ severity: 'error', summary: 'Consultor', detail: "Consultor não informado", icon: 'pi pi-user', life: 10000 });
  }

  showClientCompany() {
    this.messageService.add({ severity: 'error', summary: 'Empresa', detail: "Empresa não informada", icon: 'pi pi-building', life: 10000 });
  }

  showAuthSuccess(placa: string) {
    const uppercase = new UpperCasePipe();
    this.messageService.add({ severity: 'success', summary: 'Veículo Autorizado', detail: 'Placa ' + uppercase.transform(placa), icon: 'pi pi-car', life: 10000 });
  }

  showLiberadoSuccess(placa: string) {
    const uppercase = new UpperCasePipe();
    this.messageService.add({ severity: 'success', summary: 'Veículo Liberado', detail: 'Placa ' + uppercase.transform(placa), icon: 'pi pi-car', life: 10000 });
  }

  showInfo() {
    this.messageService.add({ severity: 'info', summary: 'Informação', detail: "Veículo já liberado", icon: 'pi pi-car', life: 10000 });
  }



}


