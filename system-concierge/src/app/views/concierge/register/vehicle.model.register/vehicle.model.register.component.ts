import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
//primeNG
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { RadioButtonModule } from 'primeng/radiobutton';
//Service
import { StorageService } from '../../../../services/storage/storage.service';
import { VehicleModelService } from '../../../../services/vehicle-model/vehicle-model.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BusyService } from '../../../../components/loading/busy.service';
//Class
import { ModelVehicle } from '../../../../models/vehicle-model/model-vehicle';
//Const
import { IMAGE_MAX_SIZE } from '../../../../util/constants';
import { StatusEnum } from '../../../../models/enum/status-enum';
import { MessageResponse } from '../../../../models/message/message-response';
import { SuccessError } from '../../../../models/enum/success-error';

@Component({
  selector: 'app-vehicle.model.register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, InputIconModule,
    TableModule, TagModule,
    ButtonModule, DialogModule, InputTextModule,
    RadioButtonModule, ToastModule, IconFieldModule],
  templateUrl: './vehicle.model.register.component.html',
  styleUrl: './vehicle.model.register.component.scss',
  providers: [MessageService],
})
export default class VehicleModelRegisterComponent implements OnInit {
  isNewModel: boolean = true;
  enabled = StatusEnum.ENABLED;
  disabled = StatusEnum.DISABLED;
  models: ModelVehicle[] = [];
  model: ModelVehicle;
  dialogVisible: boolean = false;

  formModel = new FormGroup({
    description: new FormControl<string>('', Validators.required),
    status: new FormControl<StatusEnum>(StatusEnum.DISABLED, Validators.required),
  });

  constructor(
    private vehicleModelService: VehicleModelService,
    private storageService: StorageService,
    private messageService: MessageService,
    private ngxImageCompressService: NgxImageCompressService,
    private busyService: BusyService) { }

  ngOnInit(): void {
    this.listaModel();
  }
  private listaModel() {
    //Inicia load
    this.busyService.busy();
    this.vehicleModelService.listAll().subscribe((data) => {
      this.models = data;
      //Fecha load
      this.busyService.idle();
    }, error => {
      //Fecha load
      this.busyService.idle();
    });
  }
  hideDialog() {
    this.dialogVisible = false;
  }
  showDialog() {
    this.cleanForm();
    this.dialogVisible = true;
  }
  cleanForm() {
    this.formModel.patchValue({
      description: "",
      status: this.enabled
    });
  }

  edit(mod: ModelVehicle) {
    this.isNewModel = false;
    this.showDialog();
    this.model = mod;

    this.formModel.patchValue({
      description: mod.description,
      status: mod.status,

    });
  }

  showNewModel() {
    this.isNewModel = true;
    this.model = new ModelVehicle();
    this.showDialog();
  }

  save() {
    if (this.isNewModel) {
      this.saveNewModel();
    } else {
      this.saveUpdateModel();
    }
  }

  private async saveNewModel() {
    const { valid, value } = this.formModel;
    if (!valid) {
      return;
    }

    this.model.companyId = this.storageService.companyId;
    this.model.resaleId = this.storageService.resaleId;
    this.model.status = value.status;
    this.model.description = value.description;
    //Fecha load
    this.busyService.busy();
    const resultSave = await this.saveModel(this.model);
    //Fecha load
    this.busyService.idle();
    if (resultSave.status == 201 && resultSave.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-check' });
      this.model = resultSave.body.data;
      this.isNewModel = false;
      this.listaModel();
    }
    if (resultSave.status == 201 && resultSave.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-info-circle' });
    }

  }
  private async saveUpdateModel() {
    const { valid, value } = this.formModel;
    if (!valid) {
      return;
    }

    this.model.status = value.status;
    this.model.description = value.description;
    //Fecha load
    this.busyService.busy();
    const resultSave = await this.updateModel(this.model);
    //Fecha load
    this.busyService.idle();
    if (resultSave.status == 200 && resultSave.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-check' });
      this.model = resultSave.body.data;
      this.listaModel();
    }
    if (resultSave.status == 200 && resultSave.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: resultSave.body.header, detail: resultSave.body.message, icon: 'pi pi-info-circle' });
    }
  }

  private async saveModel(mod: ModelVehicle): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleModelService.save(mod));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async updateModel(mod: ModelVehicle): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.vehicleModelService.update(mod));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }

}
