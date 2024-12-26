import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

//primeNG
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';

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



@Component({
  selector: 'app-vehicle.model.register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    TableModule, NgOptimizedImage, TagModule,
    ButtonModule, CardModule, DialogModule, InputTextModule,
    RadioButtonModule, DropdownModule],
  providers: [],
  templateUrl: './vehicle.model.register.component.html',
  styleUrl: './vehicle.model.register.component.scss'
})
export default class VehicleModelRegisterComponent implements OnInit, OnDestroy {
  private user: User;
  private modelVehicle: ModelVehicle;
  private modelVehicleStatus: IModelStatus = null;

  dialogVisible: boolean = false;

  statuses!: any[];

  selectedFile: any = null;

  pathFile: string = "assets/layout/images/picture.png";

  modelVehicles: ModelVehicle[] = [];

  selectedItems: ModelVehicle[] = [];

  formModel = new FormGroup({
    id: new FormControl<number>(0),
    description: new FormControl<string>('', Validators.required),
    status: new FormControl<string>('', Validators.required),
    photo: new FormControl<string | null>(null),
  });

  constructor(
    private serviceModel: VehicleModelService,
    public layoutService: LayoutService,
    private storageService: StorageService,
    private router: Router,
    private userService: UserService) { }
  ngOnInit(): void {
    this.userService.getUser$().subscribe(data => {
      this.user = data;
    });
    //  this.modelVehicle = new ModelVehicle();

    this.listaModel();

    this.statuses = [
      { label: 'ativo', value: 'ativo' },
      { label: 'inativo', value: 'inativo' }
    ];
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
      case 'ativo':
        return 'success';
      case 'inativo':
        return 'warning';
    }
    return 'warning';
  }
  hideDialog() {
    this.dialogVisible = false;
  }
  showDialog() {

    this.pathFile = "assets/layout/images/picture.png";
    this.dialogVisible = true;
    this.formModel.patchValue({
      id: null,
      description: '',
      status: 'ativo',
      photo: null
    });
  }
  showDialogEditar(modelo: ModelVehicle) {

    this.formModel.patchValue({
      id: modelo.id,
      description: modelo.description,
      status: modelo.status,
      photo: modelo.photo
    });

    if (modelo.photo) {
      this.pathFile = "data:image/png;base64," + modelo.photo;
    } else {
      this.pathFile = "assets/layout/images/picture.png";
    }

    this.dialogVisible = true;
  }
  onSelectFile(event: any) {
    const file = event.target.files[0];

    if (file) {

      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event: any) => {

        this.pathFile = event.target.result;

        //image byte
        const byteImg = event.target.result.split('base64,')[1];

        this.formModel.patchValue({ photo: byteImg });
      };

      this.selectedFile = file;

    }

  }
  deleteFile() {
    this.pathFile = "assets/layout/images/picture.png";
    this.formModel.patchValue({ photo: null });
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

      if (value.id == null) {
        //Save

        this.modelVehicle.companyId = this.user.companyId;
        this.modelVehicle.resaleId = this.user.resaleId;
        this.modelVehicle.status = value.status;
        this.modelVehicle.description = value.description;
        this.modelVehicle.photo = value.photo;

        this.serviceModel.addModel$(this.modelVehicle).subscribe((data) => {
          if (data.status == 201) {
            this.hideDialog();
            this.formModel.reset;
            this.listaModel();
          }

        }, (error) => {

        });

      } else {
        //Update

        this.modelVehicle.companyId = this.user.companyId;
        this.modelVehicle.resaleId = this.user.resaleId;
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
