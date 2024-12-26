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
import { STATUS_VEHICLE_ENTRY_NOTAUTH, STATUS_VEHICLE_ENTRY_FIRSTAUTH, STATUS_VEHICLE_ENTRY_AUTHORIZED } from '../../../util/constants';
import { StorageService } from '../../../services/storage/storage.service';
import { VehicleEntryAuth } from '../../../models/vehicle/vehicle-entry-auth';
import { User } from '../../../models/user/user';
import { UserService } from '../../../services/user/user.service';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { BusyService } from '../../../components/loading/busy.service';
import { error } from 'console';

@Component({
  selector: 'app-veiculos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ToastModule, DropdownModule, TableModule, InputIconModule, IconFieldModule, TagModule, MultiSelectModule, ButtonModule, InputTextModule],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss',
  providers: [MessageService, DatePipe]
})
export default class VeiculosComponent implements OnInit, OnDestroy {

  private user: User;

  notAuth = STATUS_VEHICLE_ENTRY_NOTAUTH;
  firstAuth = STATUS_VEHICLE_ENTRY_FIRSTAUTH;
  authorized = STATUS_VEHICLE_ENTRY_AUTHORIZED;

  statusOrcamento!: any[];
  statusLiberacao!: any[];
  listVehicleEntry: VehicleEntry[] = [];
  selectedItems: VehicleEntry[] = [];

  private intervalId: any;

  constructor(private userService: UserService,
    private vehicleService: VehicleService,
    public layoutService: LayoutService,
    private storageService: StorageService,
    private router: Router,
    private messageService: MessageService,
    private busyService: BusyService) {


    //get User
    this.userService.getUser$().subscribe(data => {
      this.user = data;
    });
  }
  ngOnInit(): void {

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
    this.taskVehicles();
  }
  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Para o setInterval
    }
  }
  private taskVehicles(): Promise<void> {
    return new Promise(() => {
      this.intervalId = setInterval(() => {
        this.listV();
      }, 20000);
    });

  }

  private listV() {

    this.vehicleService.allPendingAuthorization$().subscribe(data => {
      for (let index = 0; index < data.length; index++) {
        data[index] = this.preListV(data[index]);
      }
      this.listVehicleEntry = data;
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Servidor', detail: "Não disponível", icon: 'pi pi-times' });
    });
  }

  private preListV(vehicle: VehicleEntry): VehicleEntry {

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
        data[index] = this.preListV(data[index]);
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
      this.authorization(element);
    }
  }
  public async authorization(vehicle: VehicleEntry) {
    if (vehicle.statusAuthExit != this.authorized) {
      var result = await this.addAuthorization(vehicle);

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
  private async addAuthorization(vehicle: VehicleEntry): Promise<HttpResponse<VehicleEntryAuth>> {
    var auth = new VehicleEntryAuth();
    auth.idVehicle = vehicle.id;
    auth.idUserExitAuth = this.user.id;
    auth.nameUserExitAuth = this.user.name;

    try {
      return await lastValueFrom(this.vehicleService.entryAddAuth(auth));
    } catch (error) {
      const CLIENTCOMPANY = "ClientCompany not informed.";
      const ATTENDANT = "Attendant not informed.";
      const DRIVEREXIT = "DriverExit not informed.";

      if (error.status == 401) {
        if (error.error.messageError == CLIENTCOMPANY) {
          this.messageService.add({ severity: 'error', summary: 'Empresa', detail: "Não informada", icon: 'pi pi-times' });
        }
        if (error.error.messageError == ATTENDANT) {
          this.messageService.add({ severity: 'error', summary: 'Consultor', detail: "Não informado", icon: 'pi pi-times' });
        }
        if (error.error.messageError == DRIVEREXIT) {
          this.messageService.add({ severity: 'error', summary: 'Motorista Saída', detail: "Não informado", icon: 'pi pi-times' });
        }
      }
      return error;
    }

  }



}


