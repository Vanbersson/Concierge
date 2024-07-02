import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

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
import { VehicleModel } from '../../../models/vehicle/vehicleModel';
import { InterfaceUpdateStatus } from '../../../interfaces/Interface-update-status';
import { VehicleModelService } from '../../../services/concierge/vehicle-model/vehicle-model.service';
import { LayoutService } from '../../../layouts/layout/layoutService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modelo-veiculo',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TableModule, NgOptimizedImage, TagModule, ButtonModule, CardModule, DialogModule, InputTextModule, RadioButtonModule, DropdownModule],
  templateUrl: './modelo-veiculo.component.html',
  styleUrl: './modelo-veiculo.component.scss',
  providers: []
})
export default class ModeloVeiculoComponent implements OnInit {


  dialogVisible: boolean = false;

  statuses!: any[];

  selectedFile: any = null;

  pathFile: string = "assets/layout/images/picture.png";

  vehicleModels$ = this.serviceModel.getAll$();

  selectedItems: VehicleModel[] = [];

  vehicleStatus: InterfaceUpdateStatus = { companyId: 0, resaleId: 0, id: 0, status: '' };

  profileForm = this._fb.group({
    companyId: [''],
    resaleId: [''],
    id: [''],
    description: ['', Validators.required],
    status: ['ativo', Validators.required],
    image: ['']
  });

  constructor(private serviceModel: VehicleModelService, private _fb: FormBuilder,
    private layoutService: LayoutService, private router: Router) { }


  ngOnInit(): void {

    this.validLogin();

    this.statuses = [
      { label: 'ativo', value: 'ativo' },
      { label: 'inativo', value: 'inativo' }

    ];

  }

  validLogin() {

    if (!this.layoutService.isLogin()) {
      this.router.navigateByUrl('/login');
    }

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

    this.profileForm.patchValue({
      id: "",
      description: "",
      status: "ativo",
      image: ""

    });

    this.pathFile = "assets/layout/images/picture.png";

    this.dialogVisible = true;
  }

  showDialogEditar(modelo: VehicleModel) {

    this.profileForm.patchValue({
      id: modelo.id!.toString(),
      description: modelo.description,
      status: modelo.status,
      image: modelo.image
    });

    if (modelo.image) {
      this.pathFile = "data:image/png;base64," + modelo.image;
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

        this.profileForm.patchValue({ image: byteImg });
      };

      this.selectedFile = file;

    }

  }

  updateStatus(model: VehicleModel) {

    if (model.status == 'ativo') {
      model.status = 'inativo';
    } else {
      model.status = 'ativo';
    }

    this.vehicleStatus.companyId = model.companyId;
    this.vehicleStatus.resaleId = model.resaleId;
    this.vehicleStatus.id = model.id!;
    this.vehicleStatus.status = model.status;

    this.serviceModel.updateStatus$(this.vehicleStatus).subscribe((data) => {

      if (data.status == 200) {

        this.vehicleModels$ = this.serviceModel.getAll$();

      }

    });


  }

  async updateStatusSelected() {

    if (this.selectedItems[0].status == "ativo") {

      for (let index = 0; index < this.selectedItems.length; index++) {

        this.selectedItems[index].status = "inativo";

        this.vehicleStatus.companyId = this.selectedItems[index].companyId;
        this.vehicleStatus.resaleId = this.selectedItems[index].resaleId;
        this.vehicleStatus.id = this.selectedItems[index].id!;
        this.vehicleStatus.status = this.selectedItems[index].status;

        this.serviceModel.updateStatus$(this.vehicleStatus).subscribe();

      }

    } else {

      for (let index = 0; index < this.selectedItems.length; index++) {

        this.selectedItems[index].status = "ativo";

        this.vehicleStatus.companyId = this.selectedItems[index].companyId;
        this.vehicleStatus.resaleId = this.selectedItems[index].resaleId;
        this.vehicleStatus.id = this.selectedItems[index].id!;
        this.vehicleStatus.status = this.selectedItems[index].status;

        this.serviceModel.updateStatus$(this.vehicleStatus).subscribe();

      }

    }

    //Clear selection
    this.selectedItems = [];

  }

  onSubmit() {

    this.profileForm.patchValue({
      companyId: sessionStorage.getItem('companyId'),
      resaleId: sessionStorage.getItem('resaleId')
    });

    const { valid, value } = this.profileForm;

    if (valid) {

      if (value.id == '') {
        //Save

        this.serviceModel.addModel$(value).subscribe((data) => {

          if (data.status == 201) {

            this.hideDialog();

            this.vehicleModels$ = this.serviceModel.getAll$();

          }

        });

      } else {
        //Update

        this.serviceModel.updateModel$(value).subscribe((data) => {

          if (data.status == 200) {

            this.hideDialog();

            this.vehicleModels$ = this.serviceModel.getAll$();

          }

        });
      }



    }



  }




}
