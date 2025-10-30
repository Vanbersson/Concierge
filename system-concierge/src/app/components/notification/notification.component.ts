import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';

import { NotificationService } from '../../services/notification/notification.service';
import { StorageService } from '../../services/storage/storage.service';
import { MessageResponse } from '../../models/message/message-response';
import { Notification } from '../../models/notification/notification';
import { YesNot } from '../../models/enum/yes-not';
import { VehicleEntry } from '../../models/vehicle/vehicle-entry';
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { BusyService } from '../loading/busy.service';
import { TaskService } from '../../services/task/task.service';
import { PermissionService } from '../../services/permission/permission.service';
import { Router } from '@angular/router';
import { SuccessError } from '../../models/enum/success-error';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, ButtonModule, BadgeModule,ToastModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  providers:[MessageService]
})
export class NotificationComponent implements OnInit, OnDestroy {

  listMessage: Notification[] = [];

  Yes = YesNot.yes;
  Not = YesNot.not;

  constructor(private storageService: StorageService,
    private permissionService: PermissionService,
    private messageService: MessageService,
     private router: Router,
    private taskService: TaskService,
    private busyService: BusyService,
    private notificationService: NotificationService,
    private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.taskService.startTask(() => this.init(), 40000);
    this.init();
  }
  ngOnDestroy(): void {
    this.taskService.stopTask();
  }
  async init() {
    const result = await this.listNotification();
    this.listMessage = result.body.data;
  }
  getTempoDecorrido(dataInicialStr: string): string {
    const dataInicial = new Date(dataInicialStr);
    const agora = new Date();

    const diffMs = agora.getTime() - dataInicial.getTime(); // diferença em ms

    const diffMin = Math.floor(diffMs / 1000 / 60);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    const minutos = diffMin % 60;
    const horas = diffHoras % 24;
    const dias = diffDias;

    let resultado = '';

    if (dias > 0) {
      resultado += `${dias} dia${dias > 1 ? 's' : ''} `;
    }
    if (horas > 0) {
      resultado += `${horas} hora${horas > 1 ? 's' : ''} `;
    }
    if (minutos >= 0) {
      resultado += `${minutos} minuto${minutos > 1 ? 's' : ''}`;
    }

    return resultado.trim();
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
  private async listNotification(): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.notificationService.filterUser(this.storageService.id));
    } catch (error) {
      return error;
    }
  }

  firstName(name: string): string {
    return name.split(" ")[0];
  }

  async editVehicle(id: number) {
    /* PERMISSION - 100 */
    /* EDITAR ENTRADA DO VEÍCULO */
    const permission = await this.searchPermission(100);
    if (!permission) { return; }
    this.router.navigateByUrl('portaria/mannutencao-entrada-veiculo/' + id);
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

  async shareVehicle(vehicleId: number) {
    //Show load
    this.busyService.busy();
    const result = await this.getVehicleEntry(vehicleId);
    if (result.status == 200) {
      this.shareWhatsApp(result.body);
    }
    //Close load
    this.busyService.idle();
  }
  private shareWhatsApp(vehicle: VehicleEntry) {
    const uppercase = new UpperCasePipe();
    const datePipe = new DatePipe('pt-BR');
    //Alterar o fuso horário para o horário local
    vehicle.dateEntry = this.formatDateTime(new Date(vehicle.dateEntry));
    if (vehicle.dateExit)
      vehicle.dateExit = this.formatDateTime(new Date(vehicle.dateExit));
    if (vehicle.dateExitAuth1)
      vehicle.dateExitAuth1 = this.formatDateTime(new Date(vehicle.dateExitAuth1));
    if (vehicle.dateExitAuth2)
      vehicle.dateExitAuth2 = this.formatDateTime(new Date(vehicle.dateExitAuth2));

    const message = encodeURIComponent(`*Dados do Veículo*\n
      Código: ${vehicle.id}
      Placa: ${uppercase.transform(vehicle.placa)}
      Modelo: ${uppercase.transform(vehicle.modelDescription)}
      Empresa Código: ${vehicle.clientCompanyId == 0 ? "" : vehicle.clientCompanyId}
      Empresa Nome: ${vehicle.clientCompanyName}
      Consultor: ${uppercase.transform(vehicle.nameUserAttendant)}
      Consultor Obs.: ${vehicle.information == null ? "" : uppercase.transform(vehicle.information)}
      Data Entrada: ${datePipe.transform(vehicle.dateEntry, "dd/MM/yyyy HH:mm")}
      Data Saída: ${vehicle.dateExit == "" ? "" : datePipe.transform(vehicle.dateExit, "dd/MM/yyyy HH:mm")}
      Porteiro Entrada: ${uppercase.transform(vehicle.nameUserEntry)}
      Porteiro Obs.: ${vehicle.informationConcierge == null ? "" : uppercase.transform(vehicle.informationConcierge)}
      Porteiro Saída: ${vehicle.userNameExit == null ? "" : uppercase.transform(vehicle.userNameExit)}
      Motorista Entrada Código: ${vehicle.driverEntryId}
      Motorista Entrada Nome: ${uppercase.transform(vehicle.driverEntryName)}
      Motorista Saída Código: ${vehicle.driverExitId == 0 ? "" : vehicle.driverExitId}
      Motorista Saída Nome: ${vehicle.driverExitName == null ? "" : uppercase.transform(vehicle.driverExitName)}
      O.S.: ${vehicle.numServiceOrder}
      NFe: ${vehicle.numNfe}
      NFS-e: ${vehicle.numNfse}
      Auto 1ª: ${vehicle.nameUserExitAuth1} ${vehicle.dateExitAuth1 == "" ? "" : datePipe.transform(vehicle.dateExitAuth1, "dd/MM/yyyy HH:mm")}
      Auto 2ª: ${vehicle.nameUserExitAuth2} ${vehicle.dateExitAuth2 == "" ? "" : datePipe.transform(vehicle.dateExitAuth2, "dd/MM/yyyy HH:mm")}
      `);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  }
  private async getVehicleEntry(vehicleId: number): Promise<HttpResponse<VehicleEntry>> {
    try {
      return await lastValueFrom(this.vehicleService.entryFilterId(vehicleId));
    } catch (error) {
      return error;
    }
  }

  /*  "Código: ${vehicle.id}\n"
     "Empresa código: ${vehicle.clientCompanyId}\n"
     "Empresa nome: ${vehicle.clientCompanyName}\n"
     "Modelo: ${vehicle.modelDescription}\nCor: ${vehicle.color} \n"
     "Placa: ${maskPlaca(vehicle.placa!)}\nFrota: ${vehicle.frota}\nKM: ${vehicle.kmEntry}\n"
     "Data entrada: ${formatDate(vehicle.dateEntry!)}\nPorteiro entrada: ${vehicle.nameUserEntry}\n"
     "Data saída: ${vehicle.dateExit == null ? '' : formatDate(vehicle.dateExit!)}\nPorteiro saída: ${vehicle.userNameExit ?? ''}\n"
     "Consultor: ${vehicle.nameUserAttendant ?? ''}\n"
     "O.S.: ${vehicle.numServiceOrder != 0 ? vehicle.numServiceOrder : ''}\n"
     "NFe: ${vehicle.numNfe != 0 ? vehicle.numNfe : ''}\n"
     "NFS-e: ${vehicle.numNfse != 0 ? vehicle.numNfse : ''}\n"
     "Obs Porteiro: ${vehicle.informationConcierge}\n"
     "Obs Consultor: ${vehicle.information}\n", */

}
