import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ImageModule } from 'primeng/image';
//Service
import { VehicleService } from '../../../services/vehicle/vehicle.service';
import { VehicleEntry } from '../../../models/vehicle/vehicle-entry';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { TaskService } from '../../../services/task/task.service';
import { StorageService } from '../../../services/storage/storage.service';
import { VehicleExit } from '../../../models/vehicle/vehicle-exit';
import { MessageResponse } from '../../../models/message/message-response';
import { SuccessError } from '../../../models/enum/success-error';
import { BusyService } from '../../../components/loading/busy.service';
import { PhotoService } from '../../../services/photo/photo.service';
import { IMAGE_MAX_SIZE_LABEL } from '../../../util/constants';

@Component({
  selector: 'app-vehicleexit',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, TableModule,
    InputTextModule, IconFieldModule, InputIconModule, DividerModule, InputTextareaModule, FormsModule, ImageModule,
    ConfirmDialogModule, ToastModule, BadgeModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './vehicle.exit.component.html',
  styleUrl: './vehicle.exit.component.scss'
})
export default class VehicleExitComponent implements OnInit, OnDestroy {
  //private vehicleExit: VehicleExit;
  listVehicleExit: VehicleEntry[] = [];
  selectedVehicle: VehicleEntry[] = [];

  valueInfoPlaca: string = '';
  valueInfoVehicle: string = '';
  photoVehicle1!: string;
  photoVehicle2!: string;
  photoVehicle3!: string;
  photoVehicle4!: string;


  constructor(
    private busyService: BusyService,
    private vehicleService: VehicleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private taskService: TaskService,
    private storageService: StorageService,
    private photoService: PhotoService) {
  }

  ngOnInit(): void {
    this.init();
    this.taskService.startTask(() => this.initTask(), 120000);
  }
  ngOnDestroy(): void {
    this.taskService.stopTask();
  }

  async init() {
    this.busyService.busy();
    const data = await this.allAuthorized();
    this.busyService.idle();
    if (data.length > 0) {
      const datePipe = new DatePipe('pt-BR');
      for (let index = 0; index < data.length; index++) {
        data[index].dateEntry = datePipe.transform(this.formatDateTime(new Date(data[index].dateEntry)), 'dd/MM/yyyy HH:mm');
        if (data[index].vehicleNew == "yes") {
          data[index].placa = "NOVO";
        }
        var nome = data[index].clientCompanyName.split(' ');
        data[index].clientCompanyName = nome[0] + " " + nome[1];
      }
      this.listVehicleExit = data;
    }
  }
  private async initTask() {
    const data = await this.allAuthorized();
    if (data.length > 0) {
      const datePipe = new DatePipe('pt-BR');
      for (let index = 0; index < data.length; index++) {
        data[index].dateEntry = datePipe.transform(this.formatDateTime(new Date(data[index].dateEntry)), 'dd/MM/yyyy HH:mm');
        if (data[index].vehicleNew == "yes") {
          data[index].placa = "NOVO";
        }
        var nome = data[index].clientCompanyName.split(' ');
        data[index].clientCompanyName = nome[0] + " " + nome[1];
      }
      this.listVehicleExit = data;
    }
  }


  public async photoFile1Vehicle() {
    const photo = await this.photoService.selectPhoto();
    if (photo == "Limit") {
      this.messageService.add({ severity: 'error', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-times', life: 3000 });
    } else if (photo == "Error") {

    } else {
      this.photoVehicle1 = photo;
    }
  }
  public async photoFile2Vehicle() {
    const photo = await this.photoService.selectPhoto();
    if (photo == "Limit") {
      this.messageService.add({ severity: 'error', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-times', life: 3000 });
    } else if (photo == "Error") {

    } else {
      this.photoVehicle2 = photo;
    }
  }
  public async photoFile3Vehicle() {
    const photo = await this.photoService.selectPhoto();
    if (photo == "Limit") {
      this.messageService.add({ severity: 'error', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-times', life: 3000 });
    } else if (photo == "Error") {

    } else {
      this.photoVehicle3 = photo;
    }
  }
  public async photoFile4Vehicle() {
    const photo = await this.photoService.selectPhoto();
    if (photo == "Limit") {
      this.messageService.add({ severity: 'error', summary: 'Imagem', detail: IMAGE_MAX_SIZE_LABEL, icon: 'pi pi-times', life: 3000 });
    } else if (photo == "Error") {

    } else {
      this.photoVehicle4 = photo;
    }
  }
  public deleteFileVehicle1() {
    this.photoVehicle1 = "";
  }
  public deleteFileVehicle2() {
    this.photoVehicle2 = "";
  }
  public deleteFileVehicle3() {
    this.photoVehicle3 = "";
  }
  public deleteFileVehicle4() {
    this.photoVehicle4 = "";
  }
  private cleanSelectionVehicle() {
    this.selectedVehicle = [];
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
  async confirm() {

    for (let index = 0; index < this.selectedVehicle.length; index++) {
      //clear
      this.valueInfoPlaca = "";
      this.photoVehicle1 = "";
      this.photoVehicle2 = "";
      this.photoVehicle3 = "";
      this.photoVehicle4 = "";
      this.valueInfoVehicle = "";

      var element = this.selectedVehicle[index];
      this.valueInfoPlaca = element.placa;

      var vehicleExit: VehicleExit = new VehicleExit();
      vehicleExit.companyId = this.storageService.companyId;
      vehicleExit.resaleId = this.storageService.resaleId;
      vehicleExit.vehicleId = element.id;
      vehicleExit.userId = this.storageService.id;
      vehicleExit.userName = this.storageService.name;
      vehicleExit.dateExit = this.formatDateTime(new Date());


      const resultSave = await this.confirmationExit(vehicleExit);
    }
    this.cleanSelectionVehicle();
    this.init();
  }
  private async confirmationExit(exit: VehicleExit): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.confirmationService.confirm({
        header: 'Confirmar saída?',
        message: 'Por favor confirme para continuar.',
        accept: async () => {
          exit.exitPhoto1 = this.photoVehicle1;
          exit.exitPhoto2 = this.photoVehicle2;
          exit.exitPhoto3 = this.photoVehicle3;
          exit.exitPhoto4 = this.photoVehicle4;
          exit.exitInformation = this.valueInfoVehicle;
          const result = await this.exit(exit);
          setTimeout(() => resolve(result), 300);
        },
        reject: () => {
          resolve(false);
        }
      });
    });
  }

  private async exit(exit: VehicleExit): Promise<boolean> {
    var result = await this.confirmationExitVehicle(exit);
    if (result.status == 200 && result.body.status == SuccessError.succes) {
      var upper = new UpperCasePipe();
      this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message + " " + upper.transform(this.valueInfoPlaca), icon: 'pi pi-check' });
      return true;
    } else if (result.status == 200 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });
    }
    return false;
  }

  private async confirmationExitVehicle(vehicle: VehicleExit): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleService.entryExit(vehicle))
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async allAuthorized(): Promise<VehicleEntry[]> {
    try {
      return await lastValueFrom(this.vehicleService.allAuthorized());
    } catch (error) {
      return [];
    }
  }

}


