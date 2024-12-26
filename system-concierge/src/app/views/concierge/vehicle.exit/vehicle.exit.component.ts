import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';


import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { OverlayPanel } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';


import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { VehicleEntry } from '../../../models/vehicle/vehicle-entry';
import { BusyService } from '../../../components/loading/busy.service';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../models/user/user';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-vehicleexit',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, TableModule,
    InputTextModule, IconFieldModule, InputIconModule,
    ConfirmDialogModule, ToastModule, OverlayPanelModule, BadgeModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './vehicle.exit.component.html',
  styleUrl: './vehicle.exit.component.scss'
})
export class VehicleExitComponent implements OnInit, OnDestroy {

  private user: User;
  private intervalVehiclesAuthorized: any;
  listVehicleExit: VehicleEntry[] = [];
  selectedVehicle: VehicleEntry[] = [];

  @ViewChild('overPanel') overPanel: OverlayPanel;
  total = signal<number>(0);

  constructor(private userService: UserService,
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private busyService: BusyService) { }

  ngOnInit(): void {
    this.getUser();
    this.listVehicles();
    this.taskVehiclesAuthorized();
  }
  ngOnDestroy(): void {
    if (this.intervalVehiclesAuthorized) {
      clearInterval(this.intervalVehiclesAuthorized); // Para o setInterval
    }
  }
  getUser() {
    this.userService.getUser$().subscribe(data => {
      this.user = data;
    });
  }
  confirm() {

    this.confirmationService.confirm({
      header: 'Confirmar saída?',
      message: 'Por favor confirme para continuar.',
      accept: () => {
        this.confirmationExit();
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Saída de veículo', detail: 'Cancelado', icon: 'pi pi-times' });
        this.cleanSelectionVehicle();
      }
    });
  }
  private cleanSelectionVehicle() {
    this.selectedVehicle = [];
  }
  showOverPanel(target: any) {
    this.overPanel.toggle(null, target);
  }
  private async confirmationExit() {

    for (let index = 0; index < this.selectedVehicle.length; index++) {
      var element = this.selectedVehicle[index];
      element.userIdExit = this.user.id;
      element.userNameExit = this.user.name;
      element.dateExit = new Date();

      element.budgetStatus = "semOrcamento";
      element.nameUserAttendant = "";
      element.dateEntry = "";

      var result = await this.confirmationExitVehicle(element);
      if (result.status == 200) {
        var upper = new UpperCasePipe();
        this.messageService.add({ severity: 'success', summary: 'Saída de veículo', detail: "Realizada com sucesso " + upper.transform(element.placa) });
        this.cleanSelectionVehicle();
      }

      if (this.selectedVehicle.length == 1) {
        this.selectedVehicle = [];
        this.listVehicles();
      } else if (this.selectedVehicle.length == index + 1) {
        this.selectedVehicle = [];
        this.listVehicles();
      }

    }

  }
  private async confirmationExitVehicle(vehicle: VehicleEntry): Promise<HttpResponse<VehicleEntry>> {
    try {
      return await lastValueFrom(this.vehicleService.entryExit$(vehicle))
    } catch (error) {
      if (error.status == 401) {
        this.messageService.add({ severity: 'error', summary: 'Veículo', detail: "Não autorizado", icon: 'pi pi-times' });
      }
      return error;
    }

  }
  private taskVehiclesAuthorized(): Promise<void> {
    return new Promise(() => {
      this.intervalVehiclesAuthorized = setInterval(() => {
        this.listVehicles();
      }, 30000);
    });
  }
  public listVehicles() {

    this.vehicleService.allAuthorized$().subscribe((data) => {

      for (let index = 0; index < data.length; index++) {

        if (data[index].vehicleNew == "yes") {
          data[index].placa = "NOVO";
        }

        var nome = data[index].clientCompanyName.split(' ');
        data[index].clientCompanyName = nome[0] + " " + nome[1];

      }
      this.listVehicleExit = data;
      this.total.set(data.length);
    }, error => {
      // this.messageService.add({ severity: 'error', summary: 'Servidor', detail: "Não disponível", icon: 'pi pi-times' });
    });
  }

}


