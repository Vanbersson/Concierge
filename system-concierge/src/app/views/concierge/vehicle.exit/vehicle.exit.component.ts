import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';

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
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { TaskService } from '../../../services/task/task.service';
import { StorageService } from '../../../services/storage/storage.service';
import { VehicleExit } from '../../../models/vehicle/vehicle-exit';

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

  private vehicleExit: VehicleExit;
  listVehicleExit: VehicleEntry[] = [];
  selectedVehicle: VehicleEntry[] = [];

  @ViewChild('overPanel') overPanel: OverlayPanel;
  total = signal<number>(0);

  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private taskService: TaskService,
    private storageService: StorageService) {

  }

  ngOnInit(): void {
    this.listVehicles();

    this.taskService.startTask(() => this.listVehicles(), 20000);
  }
  ngOnDestroy(): void {
    this.taskService.stopTask();
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

  private async confirmationExit() {
    for (let index = 0; index < this.selectedVehicle.length; index++) {
      var element = this.selectedVehicle[index];
      this.vehicleExit = new VehicleExit();
      this.vehicleExit.companyId = this.storageService.companyId;
      this.vehicleExit.resaleId = this.storageService.resaleId;
      this.vehicleExit.vehicleId = element.id;
      this.vehicleExit.userId = this.storageService.id;
      this.vehicleExit.userName = this.storageService.name;
      this.vehicleExit.dateExit = this.formatDateTime(new Date());

      var result = await this.confirmationExitVehicle(this.vehicleExit);
      if (result.status == 200) {
        var upper = new UpperCasePipe();
        this.messageService.add({ severity: 'success', summary: 'Saída de veículo', detail: "Realizada com sucesso " + upper.transform(element.placa) });
      }

    }
    this.cleanSelectionVehicle();
    this.listVehicles();
  }
  private async confirmationExitVehicle(vehicle: VehicleExit): Promise<HttpResponse<VehicleExit>> {
    try {
      return await lastValueFrom(this.vehicleService.entryExit$(vehicle))
    } catch (error) {
      if (error.error.message == "Permission not informed.") {
        this.messageService.add({ severity: 'error', summary: 'Permissão', detail: "Você não tem permissão", icon: 'pi pi-times' });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Veículo', detail: "Não autorizado", icon: 'pi pi-times' });
      }
      return error;
    }

  }
  public listVehicles() {

    this.vehicleService.allAuthorized$().subscribe({
      next: (data) => {

        for (let index = 0; index < data.length; index++) {

          if (data[index].vehicleNew == "yes") {
            data[index].placa = "NOVO";
          }

          var nome = data[index].clientCompanyName.split(' ');
          data[index].clientCompanyName = nome[0] + " " + nome[1];

        }
        this.listVehicleExit = data;

        this.total.set(data.length);
      },
      error: (error) => {

      },
      complete: () => {

      }
    });

  }

}


