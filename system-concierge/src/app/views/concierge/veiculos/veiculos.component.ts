import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

//Service
import { VehicleEntry } from '../../../models/vehicle/vehicle-entry';
import { LayoutService } from '../../../layouts/layout/service/layout.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';

//Constants
import { STATUS_VEHICLE_ENTRY_NOTAUTH, STATUS_VEHICLE_ENTRY_FIRSTAUTH, STATUS_VEHICLE_ENTRY_AUTHORIZED, MESSAGE_RESPONSE_NOT_CLIENT, MESSAGE_RESPONSE_NOT_ATTENDANT, MESSAGE_RESPONSE_NOT_DRIVEREXIT } from '../../../util/constants';
import { StorageService } from '../../../services/storage/storage.service';
import { VehicleEntryAuth } from '../../../models/vehicle/vehicle-entry-auth';

import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { BusyService } from '../../../components/loading/busy.service';
import { TaskService } from '../../../services/task/task.service';

@Component({
  selector: 'app-veiculos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastModule, DropdownModule, TableModule, InputIconModule, IconFieldModule, TagModule, MultiSelectModule, ButtonModule, InputTextModule],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss',
  providers: [MessageService, DatePipe]
})
export default class VeiculosComponent implements OnInit, OnDestroy {

  notAuth = STATUS_VEHICLE_ENTRY_NOTAUTH;
  firstAuth = STATUS_VEHICLE_ENTRY_FIRSTAUTH;
  authorized = STATUS_VEHICLE_ENTRY_AUTHORIZED;

  statusOrcamento!: any[];
  statusLiberacao!: any[];
  listVehicleEntry: VehicleEntry[] = [];
  selectedItems: VehicleEntry[] = [];

  constructor(
    private vehicleService: VehicleService,
    public layoutService: LayoutService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private busyService: BusyService,
    private taskService: TaskService) { }

  ngOnInit(): void {

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

    this.listVehicles();
    this.taskService.startTask(() => this.listTaskVehicle(), 20000);
  }
  ngOnDestroy(): void {
    this.taskService.stopTask();
  }

  private listTaskVehicle() {
    this.vehicleService.allPendingAuthorization$().subscribe({
      next: (data) => {
        for (let index = 0; index < data.length; index++) {
          data[index] = this.preList(data[index]);
        }
        this.listVehicleEntry = data;
      },
      error: (data) => { },
      complete: () => { }
    });

  }

  private preList(vehicle: VehicleEntry): VehicleEntry {

    if (vehicle.vehicleNew == "yes") {
      vehicle.placa = "NOVO";
    }

    if (vehicle.nameUserAttendant == "") {
      vehicle.nameUserAttendant = "FALTA";
    }

    if (vehicle.clientCompanyName == "") {
      vehicle.clientCompanyName = "FALTA";
    } else {
      var nome = vehicle.clientCompanyName.split(' ');
      vehicle.clientCompanyName = nome[0] + " " + nome[1];
    }

    switch (vehicle.budgetStatus) {
      case 'pendenteAprovacao':
        vehicle.budgetStatus = 'Pendente Aprovação';
        break;
      case 'naoEnviado':
        vehicle.budgetStatus = 'Não Enviado';
        break;
      case 'semOrcamento':
        vehicle.budgetStatus = 'Sem Orçamento';
        break;
      case 'Aprovado':
        break;
      case 'naoAprovado':
        vehicle.budgetStatus = 'Não Aprovado';
        break;
    }

    return vehicle;

  }

  public listVehicles() {
    this.busyService.busy();
    this.vehicleService.allPendingAuthorization$().subscribe((data) => {

      for (let index = 0; index < data.length; index++) {
        data[index] = this.preList(data[index]);
      }
      this.listVehicleEntry = data;
      this.busyService.idle();
    }, error => {
      this.busyService.idle();
      this.messageService.add({ severity: 'error', summary: 'Servidor', detail: "Não disponível", icon: 'pi pi-times' });
    });
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
    this.router.navigateByUrl('portaria/mannutencao-entrada-veiculo/' + id);
  }
  //Authorization exit
  public addAuthorizationAll() {
    for (let index = 0; index < this.selectedItems.length; index++) {
      const element = this.selectedItems[index];
      this.authExit(element);
    }
  }
  public async authExit(vehicle: VehicleEntry) {

    if (vehicle.statusAuthExit != this.authorized) {
      var result = await this.addAuthExit(vehicle);

      if (result.status == 200) {
        if (vehicle.statusAuthExit == this.notAuth) {
          vehicle.statusAuthExit = this.firstAuth;
        } else if (vehicle.statusAuthExit == this.firstAuth) {
          vehicle.statusAuthExit = this.authorized;
        }

        if (vehicle.vehicleNew == 'yes') {
          //Autorização de saída
          if (vehicle.statusAuthExit == this.firstAuth) {
            this.messageService.add({ severity: 'success', summary: 'Veículo Autorizado', detail: 'Veículo NOVO', icon: 'pi pi-check-circle' });
          }
          //Saída liberada
          if (vehicle.statusAuthExit == this.authorized) {
            this.messageService.add({ severity: 'success', summary: 'Veículo Liberado', detail: 'Veículo NOVO', icon: 'pi pi-thumbs-up-fill' });
          }

        } else {
          const uppercase = new UpperCasePipe();
          //Autorização de saída
          if (vehicle.statusAuthExit == this.firstAuth) {
            this.messageService.add({ severity: 'success', summary: 'Veículo Autorizado', detail: 'Placa ' + uppercase.transform(vehicle.placa), icon: 'pi pi-check-circle' });
          }

          //Saída liberada
          if (vehicle.statusAuthExit == this.authorized) {
            this.messageService.add({ severity: 'success', summary: 'Veículo Liberado', detail: 'Placa ' + uppercase.transform(vehicle.placa), icon: 'pi pi-thumbs-up-fill' });
          }

        }

      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Veículo', detail: "Já liberado" });
    }
  }
  private async addAuthExit(vehicle: VehicleEntry): Promise<HttpResponse<VehicleEntryAuth>> {
    var auth = new VehicleEntryAuth();
    auth.idVehicle = vehicle.id;
    auth.idUserExitAuth = this.storageService.id;
    auth.nameUserExitAuth = this.storageService.name;

    try {
      return await lastValueFrom(this.vehicleService.entryAddAuth(auth));
    } catch (error) {
     
      if (error.error.message == MESSAGE_RESPONSE_NOT_CLIENT) {
        this.messageService.add({ severity: 'error', summary: 'Empresa', detail: "Não informada", icon: 'pi pi-times' });
      } else if (error.error.message == MESSAGE_RESPONSE_NOT_ATTENDANT) {
        this.messageService.add({ severity: 'error', summary: 'Consultor', detail: "Não informado", icon: 'pi pi-times' });
      } else if (error.error.message == MESSAGE_RESPONSE_NOT_DRIVEREXIT) {
        this.messageService.add({ severity: 'error', summary: 'Motorista Saída', detail: "Não informado", icon: 'pi pi-times' });
      } else if (error.error.message == "Permission not informed.") {
        this.permissionNot();
      }else{
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Não autorizado", icon: 'pi pi-times' });
      }

      return error;
    }

  }

   //Permission Not
   private permissionNot() {
    this.messageService.add({ severity: 'error', summary: 'Permissão', detail: "Você não tem permissão", icon: 'pi pi-times' });
  }



}


