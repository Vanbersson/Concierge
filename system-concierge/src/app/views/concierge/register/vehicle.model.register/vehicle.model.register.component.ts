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
//Class
import { ModelVehicle } from '../../../../models/vehicle-model/model-vehicle';
//Enum
import { StatusEnabledDisabled } from '../../../../models/enum/status-enabled-disabled';
//Const
import { IMAGE_MAX_SIZE } from '../../../../util/constants';

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

  enabled = StatusEnabledDisabled.enabled;
  disabled = StatusEnabledDisabled.disabled;

  modelVehicles: ModelVehicle[] = [];
  modelVehicle: ModelVehicle;

  dialogVisible: boolean = false;
  photoModel: string = "";

  formModel = new FormGroup({
    description: new FormControl<string>('', Validators.required),
    status: new FormControl<string>('', Validators.required),
    photo: new FormControl<string | null>(null),
  });

  constructor(
    private vehicleModelService: VehicleModelService,
    private storageService: StorageService,
    private messageService: MessageService,
    private ngxImageCompressService: NgxImageCompressService) { }

  ngOnInit(): void {
    this.listaModel();
  }
  private listaModel() {
    this.vehicleModelService.listAll().subscribe((data) => {
      this.modelVehicles = data;
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
      status: this.enabled,
      photo: ""
    });
    this.photoModel = "";
  }
  editModel(mod: ModelVehicle) {
    this.showDialog();
    this.modelVehicle = mod;

    this.formModel.patchValue({
      description: mod.description,
      status: mod.status,
      photo: mod.photo
    });
    this.photoModel = mod.photo;
  }
  public async onSelectFile() {
    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > IMAGE_MAX_SIZE) {
        this.messageService.add({ severity: 'error', summary: 'Imagem', detail: 'Tamanha máximo 3MB', icon: 'pi pi-times', life: 3000 });
      } else {
        this.ngxImageCompressService.compressFile(image, orientation, 50, 40).then((compressedImage) => {

          // Remover o prefixo "data:image/jpeg;base64," se existir
          const base64Data = compressedImage.split(',')[1];
          this.photoModel = base64Data;
          this.formModel.patchValue({ photo: this.photoModel });
        });
      }
    });

  }
  deleteFile() {
    this.formModel.patchValue({ photo: "" });
    this.photoModel = "";
  }
  async saveMod() {
    const { valid, value } = this.formModel;

    if (!valid) {
      return;
    }

    if (this.modelVehicle == null) {
      //Save
      this.modelVehicle = new ModelVehicle();
      this.modelVehicle.companyId = this.storageService.companyId;
      this.modelVehicle.resaleId = this.storageService.resaleId;
      this.modelVehicle.status = value.status;
      this.modelVehicle.description = value.description;
      this.modelVehicle.photo = value.photo;

      const resultSave = await this.saveModel(this.modelVehicle);
      if (resultSave.status == 201) {
        this.modelVehicle.id = resultSave.body.id;
        this.messageService.add({ severity: 'success', summary: 'Modelo', detail: 'Salvo com sucesso', icon: 'pi pi-check' });
        this.listaModel();
      }
    } else {
      //Update
      this.modelVehicle.status = value.status;
      this.modelVehicle.description = value.description;
      this.modelVehicle.photo = value.photo;

      const resultUpdate = await this.updateModel(this.modelVehicle);
      if (resultUpdate.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Modelo', detail: 'Atualizado com sucesso', icon: 'pi pi-check' });
        this.listaModel();
      }
    }
  }
  private async saveModel(mod: ModelVehicle): Promise<HttpResponse<ModelVehicle>> {
    try {
      return await lastValueFrom(this.vehicleModelService.save(mod));
    } catch (error) {
      return error;
    }
  }
  private async updateModel(mod: ModelVehicle): Promise<HttpResponse<ModelVehicle>> {
    try {
      return await lastValueFrom(this.vehicleModelService.update(mod));
    } catch (error) {
      return error;
    }
  }

}
