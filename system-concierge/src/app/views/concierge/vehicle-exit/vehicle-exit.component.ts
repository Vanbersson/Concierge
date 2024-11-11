import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { VehicleEntry } from '../../../models/vehicle/vehicle-entry';
import { BusyService } from '../../../components/loading/busy.service';


@Component({
  selector: 'app-vehicle-exit',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, InputTextModule, IconFieldModule, InputIconModule, ConfirmDialogModule, ToastModule],
  templateUrl: './vehicle-exit.component.html',
  styleUrl: './vehicle-exit.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class VehicleExitComponent implements OnInit, OnDestroy {
  private intervalVehiclesAuthorized: any;
  listVehicleExit: VehicleEntry[] = [];
  selectedVehicle: VehicleEntry[] = [];

  constructor(
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private busyService: BusyService) {

  }

  ngOnInit(): void {
    this.listVehicles();

    // this.taskVehiclesAuthorized();
  }
  ngOnDestroy(): void {
    if (this.intervalVehiclesAuthorized) {
      clearInterval(this.intervalVehiclesAuthorized); // Para o setInterval
    }
  }

  confirm() {
   
     this.confirmationService.confirm({
       header: 'Confirmar saída?',
       message: 'Por favor confirme para continuar.',
       accept: () => {
         this.messageService.add({ severity: 'success', summary: 'Saída de veículo', detail: 'Confirmado', life: 3000 });
       },
       reject: () => {
         this.messageService.add({ severity: 'error', summary: 'Saída de veículo', detail: 'Cancelado',icon:'pi pi-times', life: 3000 });
       }
     }); 
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

        if (data[index].nameUserAttendant == "") {
          data[index].nameUserAttendant = "FALTA";
        }

        if (data[index].clientCompanyName == "") {
          data[index].clientCompanyName = "FALTA";
        } else {
          var nome = data[index].clientCompanyName.split(' ');
          data[index].clientCompanyName = nome[0] + " " + nome[1];
        }

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

      }
      this.listVehicleExit = data;
    }, error => {
      // this.messageService.add({ severity: 'error', summary: 'Servidor', detail: "Não disponível", icon: 'pi pi-times' });
    });
  }

}
