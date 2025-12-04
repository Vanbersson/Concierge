import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
//PrimeNG
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
//Service
import { NotificationService } from '../../services/notification/notification.service';
import { StorageService } from '../../services/storage/storage.service';
import { MessageResponse } from '../../models/message/message-response';
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { BusyService } from '../loading/busy.service';
import { TaskService } from '../../services/task/task.service';
import { PermissionService } from '../../services/permission/permission.service';
//Class
import { Notification } from '../../models/notification/notification';
import { YesNot } from '../../models/enum/yes-not';
import { VehicleEntry } from '../../models/vehicle/vehicle-entry';
import { SuccessError } from '../../models/enum/success-error';
import { ShareWhatsAppService } from '../../services/share/share-whatsapp.service';
import { NotificationUser } from '../../models/notification/notification-user';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, ButtonModule, BadgeModule, ToastModule, TableModule, ConfirmDialogModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class NotificationComponent implements OnInit, OnDestroy {
  @ViewChild('op') overlayPanel!: OverlayPanel;
  listMessage: Notification[] = [];
  Yes:string = YesNot.yes;
  Not:string = YesNot.not;
  btnSync: boolean = false;

  constructor(
     private busyService: BusyService,
    private confirmationService: ConfirmationService,
    private shareWhatsAppService: ShareWhatsAppService,
    private storageService: StorageService,
    private permissionService: PermissionService,
    private messageService: MessageService,
    private router: Router,
    private taskService: TaskService,
    private notificationService: NotificationService,
    private vehicleService: VehicleService) { }

  ngOnInit(): void {
    this.taskService.startTask(() => this.init(false), 40000);
    this.init(false);
  }
  ngOnDestroy(): void {
    this.taskService.stopTask();
  }
  async init(click: boolean) {
    this.btnSync = click;
    const result = await this.listNotification();
    this.btnSync = false;
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
  firstName(name: string): string {
    return name.split(" ")[0];
  }
  async editVehicle(id: number) {
    /* PERMISSION - 100 */
    /* EDITAR ENTRADA DO VEÍCULO */
    const permission = await this.searchPermission(100);
    if (!permission) { return; }
    this.overlayPanel.hide();
    this.router.navigate(['portaria', 'mannutencao-entrada-veiculo', id]);


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
      this.shareNotification(result.body);
    }
    //Close load
    this.busyService.idle();
  }
  /* Share vehicle data via WhatsApp */
  private shareNotification(vehicle: VehicleEntry) {
    this.shareWhatsAppService.shareVehicle(vehicle);
  }
  /* delete notification   */
  async deleteMessage(no: Notification) {
    const result = await this.deleteNotitication(no);
    if (result.status == 200 && result.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
      this.init(false);
    } else if (result.status == 200 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
    }
  }
  /* delete All notification   */
  async deleteAllMessage() {
    var no: NotificationUser = new NotificationUser();
    no.companyId = this.storageService.companyId;
    no.resaleId = this.storageService.resaleId;
    no.userId = this.storageService.id;

    const result = await this.deleteAllNotitication(no);
    if (result.status == 200 && result.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
      this.init(false);
    } else if (result.status == 200 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
    }
  }
  private async getVehicleEntry(vehicleId: number): Promise<HttpResponse<VehicleEntry>> {
    try {
      return await lastValueFrom(this.vehicleService.entryFilterId(vehicleId));
    } catch (error) {
      return error;
    }
  }
  private async listNotification(): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.notificationService.filterUser(this.storageService.id));
    } catch (error) {
      return error;
    }
  }
  private async deleteNotitication(no: Notification): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.notificationService.deleteNotification(no));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async deleteAllNotitication(no: NotificationUser): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.notificationService.deleteAllNotification(no));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }

  confirm() {
    this.confirmationService.confirm({
      header: 'Apagar notificações?',
      message: 'Confirme para apagar todas as notificações.',
      accept: () => {
        this.deleteAllMessage();
      }
    });
  }

}
