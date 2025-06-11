import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { NgxImageCompressService } from 'ngx-image-compress';

//primeNG
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';



//Dialog
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';

//Service
import { UserService } from '../../../../services/user/user.service';
import { StorageService } from '../../../../services/storage/storage.service';
import { LayoutService } from '../../../../layouts/layout/service/layout.service';
import { VehicleModelService } from '../../../../services/vehicle-model/vehicle-model.service';

//Class
import { User } from '../../../../models/user/user';
import { ModelVehicle } from '../../../../models/vehicle-model/model-vehicle';
import { IModelStatus } from '../../../../interfaces/vehicle-model/imodel-status';
import { StatusEnabledDisabled } from '../../../../models/enum/status-enabled-disabled';



@Component({
  selector: 'app-vehicle.model.register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, NgOptimizedImage, TagModule,
    ButtonModule, CardModule, DialogModule, InputTextModule,
    RadioButtonModule, DropdownModule, ToastModule, ImageModule],
  providers: [MessageService],
  templateUrl: './vehicle.model.register.component.html',
  styleUrl: './vehicle.model.register.component.scss'
})
export default class VehicleModelRegisterComponent implements OnInit, OnDestroy {

  enabled = StatusEnabledDisabled.enabled;
  disabled = StatusEnabledDisabled.disabled;

  RESPONSE_SUCCESS: string = "Success.";
  IMAGE_MAX_SIZE: number = 4243795;

  private modelVehicle: ModelVehicle;
  private modelVehicleStatus: IModelStatus = null;

  dialogVisible: boolean = false;
  statuses!: any[];
  selectedFile: any = null;
  photoModel!: string;
  modelVehicles: ModelVehicle[] = [];
  selectedItems: ModelVehicle[] = [];

  formModel = new FormGroup({
    companyId: new FormControl<number>(0),
    resaleId: new FormControl<number>(0),
    id: new FormControl<number>(0),
    description: new FormControl<string>('', Validators.required),
    status: new FormControl<string>('', Validators.required),
    photo: new FormControl<string | null>(null),
  });

  constructor(
    private serviceModel: VehicleModelService,
    private storageService: StorageService,
    private messageService: MessageService,
    private ngxImageCompressService: NgxImageCompressService) { }

  ngOnInit(): void {

    this.statuses = [
      { label: this.enabled, value: this.enabled },
      { label: this.disabled, value: this.disabled }
    ];

    this.modelVehicle = new ModelVehicle();
    this.listaModel();
  }
  ngOnDestroy(): void {

  }

  private listaModel() {
    this.serviceModel.getAll$().subscribe((data) => {
      this.modelVehicles = data;
    });
  }
  getSeverity(status: string): any {
    switch (status) {
      case this.enabled:
        return 'success';
      case this.disabled:
        return 'warning';
    }
    return 'warning';
  }
  hideDialog() {
    this.dialogVisible = false;
  }
  showDialog() {
    this.formModel.patchValue({
      companyId: 0,
      resaleId: 0,
      id: 0,
      description: '',
      status: this.enabled,
      photo: ""
    });
    this.photoModel = "";
    this.dialogVisible = true;
  }
  showDialogEditar(modelo: ModelVehicle) {
    this.formModel.patchValue({
      companyId: modelo.companyId,
      resaleId: modelo.resaleId,
      id: modelo.id,
      description: modelo.description,
      status: modelo.status,
      photo: modelo.photo ?? ""
    });
    this.photoModel = modelo.photo ?? "";
    this.dialogVisible = true;
  }
  public async onSelectFile() {

    this.ngxImageCompressService.uploadFile().then(({ image, orientation }) => {
      if (this.ngxImageCompressService.byteCount(image) > this.IMAGE_MAX_SIZE) {
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
  public updateStatus(model: ModelVehicle) {

    this.modelVehicleStatus = { id: model.id };

    this.serviceModel.updateStatus$(this.modelVehicleStatus).subscribe((data) => {
      if (data.status == 200) {
        this.listaModel();
      }
    });

  }
  public updateStatusSelected() {

    for (let index = 0; index < this.selectedItems.length; index++) {

      this.modelVehicleStatus = { id: this.selectedItems[index].id! };
      this.serviceModel.updateStatus$(this.modelVehicleStatus).subscribe((data) => {
        if (data.status == 200) {
          this.listaModel();
        }
      });

    }

    //Clear selection
    this.selectedItems = [];

  }
  onSubmit() {
    const { valid, value } = this.formModel;
    if (valid) {

      if (value.id == 0) {
        //Save
        this.modelVehicle.companyId = this.storageService.companyId;
        this.modelVehicle.resaleId = this.storageService.resaleId;
        this.modelVehicle.status = value.status;
        this.modelVehicle.description = value.description;
        this.modelVehicle.photo = value.photo;

        this.serviceModel.addModel$(this.modelVehicle).subscribe({
          next: (data) => {
            if (data.status == 201) {
              this.hideDialog();
              this.formModel.reset;
              this.listaModel();
            }
          },
          error: (error) => { },
          complete: () => { }
        });

      } else {
        //Update
        this.modelVehicle.companyId = value.companyId;
        this.modelVehicle.resaleId = value.resaleId;
        this.modelVehicle.id = value.id;
        this.modelVehicle.status = value.status;
        this.modelVehicle.description = value.description;
        this.modelVehicle.photo = value.photo;

        this.serviceModel.updateModel$(this.modelVehicle).subscribe((data) => {
          if (data.status == 200) {
            this.hideDialog();
            this.formModel.reset;
            this.listaModel();
          }

        });
      }



    }



  }

}
