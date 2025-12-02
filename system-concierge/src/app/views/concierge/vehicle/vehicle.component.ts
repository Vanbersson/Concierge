import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { VehicleEntry } from '../../../models/vehicle/vehicle-entry';
import { LayoutService } from '../../../layouts/layout/service/layout.service';
import { VehicleService } from '../../../services/vehicle/vehicle.service';

//Constants
import { STATUS_VEHICLE_ENTRY_NOTAUTH, STATUS_VEHICLE_ENTRY_FIRSTAUTH, STATUS_VEHICLE_ENTRY_AUTHORIZED } from '../../../util/constants';
import { StorageService } from '../../../services/storage/storage.service';
import { VehicleEntryAuth } from '../../../models/vehicle/vehicle-entry-auth';

import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { BusyService } from '../../../components/loading/busy.service';
import { TaskService } from '../../../services/task/task.service';
import { MessageResponse } from '../../../models/message/message-response';
import { SuccessError } from '../../../models/enum/success-error';
import { PermissionService } from '../../../services/permission/permission.service';

@Component({
  selector: 'app-veiculos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastModule, DropdownModule, TableModule, InputIconModule, IconFieldModule, 
    TagModule, MultiSelectModule, ButtonModule, InputTextModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
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
    private permissionService: PermissionService,
    private primeNGConfig: PrimeNGConfig,
    private vehicleService: VehicleService,
    public layoutService: LayoutService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private busyService: BusyService,
    private taskService: TaskService) { }

  ngOnInit(): void {
    this.primeNGConfig.setTranslation({
      startsWith: 'Inicia',
      contains: 'Contém ',
      notContains: 'Não Contém',
      endsWith: 'Termina',
      equals: 'É igual a',
      notEquals: 'Não igual a',
      noFilter: 'Sem filtro'
    });
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
    this.taskService.startTask(() => this.listTaskVehicle(), 120000);
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
    //Format Date
    const datePipe = new DatePipe('pt-BR');
    vehicle.dateEntry = datePipe.transform(this.formatDateTime(new Date(vehicle.dateEntry)), 'dd/MM/yyyy HH:mm');
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
      case 'PendingApproval':
        vehicle.budgetStatus = 'Pendente Aprovação';
        break;
      case 'OpenBudget':
        vehicle.budgetStatus = 'Não Enviado';
        break;
      case 'CompleteBudget':
        vehicle.budgetStatus = 'Não Enviado';
        break;
      case 'NotSended':
        vehicle.budgetStatus = 'Não Enviado';
        break;
      case 'NotBudget':
        vehicle.budgetStatus = 'Sem Orçamento';
        break;
      case 'Approved':
        vehicle.budgetStatus = 'Aprovado';
        break;
      case 'NotApproved':
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
        return 'warning';
      case 'Não Enviado':
        return 'info';
      case 'Sem Orçamento':
        return 'secondary';
      case 'Aprovado':
        return 'success';
      case 'Não Aprovado':
        return 'danger';
    }
    return 'warning';
  }
  async editVeiculo(id: number) {
    /* PERMISSION - 100 */
    /* EDITAR ENTRADA DO VEÍCULO */
    const permission = await this.searchPermission(100);
    if (!permission) { return; }
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
      const result = await this.addAuthExit(vehicle);
      if (result.status == 200 && result.body.status == SuccessError.succes) {
        if (vehicle.statusAuthExit == this.notAuth) {
          vehicle.statusAuthExit = this.firstAuth;
        } else if (vehicle.statusAuthExit == this.firstAuth) {
          vehicle.statusAuthExit = this.authorized;
        }
        //Autorização de saída
        if (vehicle.statusAuthExit == this.firstAuth) {
          this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check-circle' });
        }
        //Saída liberada
        if (vehicle.statusAuthExit == this.authorized) {
          this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-thumbs-up-fill' });
        }
      } else if (result.status == 200 && result.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
      }
    } else {
      this.messageService.add({ severity: 'info', summary: 'Veículo', detail: "Já liberado", icon: 'pi pi-info-circle' });
    }
  }
  formatDateTime(date: Date): string {
    const datePipe = new DatePipe('en-US');

    // Obtém o fuso horário local no formato ±hh:mm
    const tzOffset = -date.getTimezoneOffset();
    const sign = tzOffset >= 0 ? '+' : '-';
    const hours = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
    const minutes = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');
    const timezone = `${sign}${hours}:${minutes}`;

    // Formata a data e adiciona o fuso horário
    return datePipe.transform(date, "yyyy-MM-dd'T'HH:mm:ss.SSS") + timezone;
  }
  private async addAuthExit(vehicle: VehicleEntry): Promise<HttpResponse<MessageResponse>> {
    var auth = new VehicleEntryAuth();
    auth.companyId = this.storageService.companyId;
    auth.resaleId = this.storageService.resaleId;
    auth.vehicleId = vehicle.id;
    auth.userId = this.storageService.id;
    auth.userName = this.storageService.name;
    auth.dateAuth = this.formatDateTime(new Date());
    try {
      return await lastValueFrom(this.vehicleService.entryAddAuth(auth));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Não catalogado.", icon: 'pi pi-times' });
      return error;
    }
  }
  private async searchPermission(permission: number): Promise<boolean> {
    try {
      var result = await lastValueFrom(this.permissionService.filterUserPermission(this.storageService.companyId, this.storageService.resaleId, this.storageService.id, permission));
      if (result.status == 200 && result.body.status == SuccessError.succes) {
        return true;
      } else if (result.status == 200 && result.body.status == SuccessError.error) {
        this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
      }
      return false;
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return false;
    }
  }
}


