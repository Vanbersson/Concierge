import { CommonModule } from '@angular/common';
import { Component, DoCheck, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms'
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

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
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';

//Class
import { VehicleEntry } from '../../../../models/vehicle/vehicle-entry';
import { ClientCompany } from '../../../../models/clientcompany/client-company';
import { ModelVehicle } from '../../../../models/vehicle-model/model-vehicle';

//Service
import { VehicleReportService } from '../../../../services/reports/concierge/vehicle-report.service';
import { VehicleModelService } from '../../../../services/vehicle-model/vehicle-model.service';

//Components
import { FilterClientComponent } from '../../../../components/filter.client/filter.client.component';
import { BusyService } from '../../../../components/loading/busy.service';
import { StorageService } from '../../../../services/storage/storage.service';

export interface IFilterVehicles {
  type: string;
  vehicleNew?: string;
  companyId: number;
  resaleId: number;
  dateInit: Date | string;
  dateFinal: Date | string;
  clientId?: number;
  modelId?: number;
  vehicleId?: number;
  placa?: string;
  frota?: string;
}

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FilterClientComponent, ToastModule, ButtonModule, TableModule,
    InputTextModule, IconFieldModule, InputIconModule, TagModule,
    DialogModule, ReactiveFormsModule, FormsModule, InputNumberModule,
    CalendarModule, InputGroupModule, MultiSelectModule, ImageModule,
    InputMaskModule,RadioButtonModule, CheckboxModule],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
  providers: [MessageService]
})
export default class VehicleComponent implements OnInit,DoCheck {

  dialogVisible: boolean = false;
  listVehicleEntry: VehicleEntry[] = [];

  selectClientCompany = signal<ClientCompany>(new ClientCompany());

  vehicleModels$ = this.vehicleModelService.getAllEnabled$();

  formFilter = new FormGroup({
    type: new FormControl<string>('E'),
    vehicleNew: new FormControl<string | null>(null),
    dateInit: new FormControl<Date | string>('', Validators.required),
    dateFinal: new FormControl<Date | string>('', Validators.required),
    clientCompanyId: new FormControl<number>(null),
    clientCompanyName: new FormControl<string>(''),
    modelVehicle: new FormControl<ModelVehicle[]>([]),
    vehicleId: new FormControl<number>(null),
    placa: new FormControl<string>(''),
    frota: new FormControl<string>('')
  });

  constructor(private reportService: VehicleReportService,
    private vehicleModelService: VehicleModelService,
    private busyService: BusyService,
    private storageService: StorageService) {
  }
  ngOnInit(): void {
    this.clientdisable();
  }
  ngDoCheck(): void {
    if(this.selectClientCompany().id != 0){
      this.formFilter.patchValue({
        clientCompanyId: this.selectClientCompany().id,
        clientCompanyName: this.selectClientCompany().name
      });
    }
    
  }
  private clientEnable() {
    this.formFilter.get('clientCompanyId').enable();
    this.formFilter.get('clientCompanyName').enable();
  }
  private clientdisable() {
    this.formFilter.get('clientCompanyId').disable();
    this.formFilter.get('clientCompanyName').disable();

  }
  private preList(vehicle: VehicleEntry): VehicleEntry {
    if (vehicle.vehicleNew == "yes") {
      vehicle.placa = "NOVO";
    }
    if (vehicle.clientCompanyName != "") {
      var names = vehicle.clientCompanyName.split(' ');
      if (names.length >= 2) {
        vehicle.clientCompanyName = names[0] + " " + names[1];
      } else {
        vehicle.clientCompanyName = names[0];
      }

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
      type:'E',
      vehicleNew:null,
      dateInit: '',
      dateFinal: '',
      clientCompanyId: null,
      clientCompanyName: '',
      modelVehicle: [],
      vehicleId: null,
      placa: '',
      frota: ''
    });

    this.selectClientCompany.set(new ClientCompany());
  }
  public cleanList() {
    this.listVehicleEntry = [];
    this.cleanform();
  }
  public showDialog() {
    this.dialogVisible = true;
  }
  public hideDialog() {
    this.dialogVisible = false;
  }
  public async searchFilter() {
    this.hideDialog();

    this.busyService.busy();
    this.clientEnable();

    const { value, valid } = this.formFilter;

    const filters: IFilterVehicles = {
      type: value.type,
      companyId: this.storageService.companyId,
      resaleId: this.storageService.resaleId,
      dateInit: value.dateInit,
      dateFinal: value.dateFinal,
      clientId: value?.clientCompanyId ?? 0,
      modelId: value.modelVehicle.at(0)?.id ?? 0,
      vehicleId: value?.vehicleId ?? 0,
      placa: value.placa,
      frota:value.frota,
      vehicleNew: value.vehicleNew?.at(0) ?? "not"       
    }
    const resultFilter = await this.filterVehicles(filters);

    if (resultFilter.status == 200) {
      for (let index = 0; index < resultFilter.body.length; index++) {
        const element = resultFilter.body[index];
        resultFilter.body[index] = this.preList(element);
      }
      this.listVehicleEntry = resultFilter.body;
    }

    this.clientdisable();
    this.busyService.idle();
  }
  private async filterVehicles(filters: any): Promise<HttpResponse<VehicleEntry[]>> {
    try {
      return await lastValueFrom(this.reportService.filterVehicle(filters));
    } catch (error) {
      return error;
    }
  }

}
