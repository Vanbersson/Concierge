import { CommonModule } from '@angular/common';
import { Component, DoCheck, OnChanges, signal, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms'

//PrimeNG
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ImageModule } from 'primeng/image';
import { InputMaskModule } from 'primeng/inputmask';

//Class
import { VehicleEntry } from '../../../../models/vehicle/vehicle-entry';
import { ClientCompany } from '../../../../models/clientcompany/client-company';
import { ModelVehicle } from '../../../../models/vehicle-model/model-vehicle';

//Service
import { VehicleService } from '../../../../services/vehicle/vehicle.service';
import { VehicleModelService } from '../../../../services/vehicle-model/vehicle-model.service';

//Components
import { FilterClientComponent } from '../../../../components/filter.client/filter.client.component';



@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FilterClientComponent, ToastModule, ButtonModule, TableModule,
    InputTextModule, IconFieldModule, InputIconModule, TagModule,
    DialogModule, ReactiveFormsModule, FormsModule, InputNumberModule,
    CalendarModule, InputGroupModule, MultiSelectModule, ImageModule,
    InputMaskModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
  providers: [MessageService]
})
export default class VehicleComponent implements DoCheck {

  dialogVisible: boolean = false;
  listVehicleEntry: VehicleEntry[] = [];

  selectClientCompany = signal<ClientCompany>(new ClientCompany());

  vehicleModels$ = this.vehicleModelService.getAllEnabled$();

  formFilter = new FormGroup({
    dateInit: new FormControl<Date | string>('', Validators.required),
    dateFinal: new FormControl<Date | string>('', Validators.required),
    clientCompanyId: new FormControl<number | null>(null),
    clientCompanyName: new FormControl<string>(''),
    modelVehicle: new FormControl<ModelVehicle[]>([]),
    codeId: new FormControl<number | null>(null),
    placa: new FormControl<string>(''),
    frota: new FormControl<string>(''),
  });

  constructor(private vehicleService: VehicleService, private vehicleModelService: VehicleModelService) {
    this.vehicleService.allPendingAuthorization$().subscribe(data => {

      for (let index = 0; index < data.length; index++) {
        data[index] = this.preList(data[index]);
      }
      this.listVehicleEntry = data;
    });



  }
  ngDoCheck(): void {
    this.formFilter.patchValue({
      clientCompanyId: this.selectClientCompany().id,
      clientCompanyName: this.selectClientCompany().name
    });
  }

  private preList(vehicle: VehicleEntry): VehicleEntry {
    if (vehicle.vehicleNew == "yes") {
      vehicle.placa = "NOVO";
    }
    if (vehicle.clientCompanyName == "") {
    } else {
      var nome = vehicle.clientCompanyName.split(' ');
      vehicle.clientCompanyName = nome[0] + " " + nome[1];
    }
    switch (vehicle.budgetStatus) {
      case 'pendenteAprovacao':
        vehicle.budgetStatus = 'Pendente Aprovação';
        break;
      case 'naoEnviado':
        vehicle.budgetStatus = 'Não Enviado';
        break;
      case 'semOrcamento':
        vehicle.budgetStatus = 'Sem Orçamento';
        break;
      case 'Aprovado':
        break;
      case 'naoAprovado':
        vehicle.budgetStatus = 'Não Aprovado';
        break;
    }
    return vehicle;
  }

  public getSeverity(value: string): any {
    switch (value) {
      case 'Pendente Aprovação':
        return 'primary';
      case 'Não Enviado':
        return 'info';
      case 'Sem Orçamento':
        return 'warning';
      case 'Aprovado':
        return 'success';
      case 'Não Aprovado':
        return 'danger';
    }
    return 'warning';
  }

  public cleanform() {
    this.formFilter.patchValue({
      dateInit: '',
      dateFinal: '',
      clientCompanyId: null,
      clientCompanyName: '',
      modelVehicle:[],
      codeId: null,
      placa: '',
      frota: ''
    });

    this.selectClientCompany.set(new ClientCompany());
  }
  public showDialog() {
    this.dialogVisible = true;
  }

  public hideDialog() {
    this.dialogVisible = false;
  }

  filterClient() {
    console.log("Confirme");
    
    console.log(this.formFilter.value);
  }




}
