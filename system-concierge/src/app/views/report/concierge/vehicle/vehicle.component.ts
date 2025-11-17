import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { Component, DoCheck, OnInit, Pipe, signal, ViewChild } from '@angular/core';
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
import { MessageService, PrimeNGConfig } from 'primeng/api';
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
import { Router } from '@angular/router';
import ManutencaoComponent from '../../../concierge/manutencao/manutencao.component';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { YesNot } from '../../../../models/enum/yes-not';

interface IFilterVehicles {
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

interface IExportVehicle {
  Empresa: number,
  Revenda: number,
  Codigo: number,

  Ent_Usuario: number,
  Ent_Usuario_Nome: string,
  Ent_Usuario_Data: string,

  Said_Usuario?: string,
  Said_Usuario_Nome?: string,
  Said_Usuario_Data?: string,
  Said_Previsao_Data?: string,

  Placa: string,
  Frota: string,
  Modelo: string,
  Consultor?: string,
  Consultor_Nome?: string,
  Cliente?: string,
  Cliente_Nome?: string,
  Cliente_CNPJ?: string,
  Cliente_Cpf?: string,

  Km_entrada?: string,
  Km_saida?: string,

  Nr_OS:string,
  Nr_NFe:string,
  Nr_NFEs:string,
}

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FilterClientComponent, ToastModule, ButtonModule, TableModule,
    InputTextModule, IconFieldModule, InputIconModule, TagModule,
    DialogModule, ReactiveFormsModule, FormsModule, InputNumberModule,
    CalendarModule, InputGroupModule, MultiSelectModule, ImageModule,
    InputMaskModule, RadioButtonModule, CheckboxModule, ManutencaoComponent],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
  providers: [MessageService]
})
export default class VehicleComponent implements OnInit, DoCheck {
  private upperCasePipe: UpperCasePipe = new UpperCasePipe();
  private datePipeBR: DatePipe = new DatePipe('pt-BR');
  dialogVisible: boolean = false;
  listVehicleEntry: VehicleEntry[] = [];
  selectClientCompany = signal<ClientCompany>(new ClientCompany());
  vehicleModels$ = this.vehicleModelService.getAllEnabled();
  formFilter = new FormGroup({
    type: new FormControl<string>('E'),
    vehicleNew: new FormControl<string | null>(null),
    dateInit: new FormControl<Date | string>(''),
    dateFinal: new FormControl<Date | string>(''),
    clientCompanyId: new FormControl<number>(null),
    clientCompanyName: new FormControl<string>(''),
    modelVehicle: new FormControl<ModelVehicle[]>([]),
    vehicleId: new FormControl<number>(null),
    placa: new FormControl<string>(''),
    frota: new FormControl<number | null>(null)
  });
  //Dialog details vehicles
  dialogVisibleVehicleDetails: boolean = false;
  disabledExport: boolean = true;
  @ViewChild('detailsVehicle') detailsVehicle!: ManutencaoComponent;

  constructor(
    private primeNGConfig: PrimeNGConfig,
    private reportService: VehicleReportService,
    private vehicleModelService: VehicleModelService,
    private busyService: BusyService,
    private storageService: StorageService) {
  }
  ngOnInit(): void {
    this.clientdisable();
    this.primeNGConfig.setTranslation({
      accept: 'Accept',
      reject: 'Cancel',
      firstDayOfWeek: 0,
      dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
      dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
      dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
      monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthNamesShort: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
      today: 'Hoje',
      clear: 'Limpar',
      dateFormat: 'dd/mm/yy',
      weekHeader: 'Sm'
    });
  }
  ngDoCheck(): void {
    if (this.selectClientCompany().id != 0) {
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
  private preList(vehicle: VehicleEntry): VehicleEntry {
    //Format Date
    vehicle.dateEntry = this.datePipeBR.transform(this.formatDateTime(new Date(vehicle.dateEntry)), 'dd/MM/yyyy HH:mm');
    vehicle.dateExit = vehicle.dateExit != "" ? this.datePipeBR.transform(this.formatDateTime(new Date(vehicle.dateExit)), 'dd/MM/yyyy HH:mm') : "";
    vehicle.datePrevisionExit = vehicle.datePrevisionExit != "" ? this.datePipeBR.transform(this.formatDateTime(new Date(vehicle.datePrevisionExit)), 'dd/MM/yyyy HH:mm') : "";

    if (vehicle.vehicleNew == YesNot.yes) {
      vehicle.placa = "NOVO";
    } else {
      vehicle.placa = this.upperCasePipe.transform(vehicle.placa);
      vehicle.placa = vehicle.placa.substring(0, 3) + "-" + vehicle.placa.substring(3, 7);
    }
    //Model
    vehicle.modelDescription = this.upperCasePipe.transform(vehicle.modelDescription);

    if (vehicle.idUserAttendant != 0) {
      vehicle.nameUserAttendant = this.upperCasePipe.transform(vehicle.nameUserAttendant);
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
      case 'PendingApproval':
        vehicle.budgetStatus = 'Pendente Aprovação';
        break;
      case 'OpenBudget':
        vehicle.budgetStatus = 'Não Enviado';
        break;
      case 'CompleteBudget':
        vehicle.budgetStatus = 'Não Enviado';
        break;
      case 'NotSended':
        vehicle.budgetStatus = 'Não Enviado';
        break;
      case 'NotBudget':
        vehicle.budgetStatus = 'Sem Orçamento';
        break;
      case 'Approved':
        vehicle.budgetStatus = 'Aprovado';
        break;
      case 'NotApproved':
        vehicle.budgetStatus = 'Não Aprovado';
        break;
    }
    return vehicle;
  }
  getSeverity(value: string): any {
    switch (value) {
      case 'Pendente Aprovação':
        return 'warning';
      case 'Não Enviado':
        return 'info';
      case 'Sem Orçamento':
        return 'secondary';
      case 'Aprovado':
        return 'success';
      case 'Não Aprovado':
        return 'danger';
    }

    return 'warning';
  }
  public cleanform() {
    this.formFilter.patchValue({
      type: 'E',
      vehicleNew: null,
      dateInit: '',
      dateFinal: '',
      clientCompanyId: null,
      clientCompanyName: '',
      modelVehicle: [],
      vehicleId: null,
      placa: '',
      frota: null
    });

    this.selectClientCompany.set(new ClientCompany());
  }
  public cleanList() {
    this.disabledExport = true;
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
      frota: value.frota == null ? "" : value.frota.toString(),
      vehicleNew: value.vehicleNew?.at(0) ?? "not"
    }
    const resultFilter = await this.filterVehicles(filters);

    if (resultFilter.status == 200) {
      this.disabledExport = false;
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
  showVeiculo(id: number) {
    //Show dialog
    this.dialogVisibleVehicleDetails = true;
    //Details vehicle
    this.detailsVehicle.showDetailsVehicle(id);
  }

  exportExcel() {
    var listExp: IExportVehicle[] = [];
    for (let item of this.listVehicleEntry) {
      listExp.push({
        Empresa: item.companyId,
        Revenda: item.resaleId,
        Codigo: item.id,
        Ent_Usuario: item.idUserEntry,
        Ent_Usuario_Nome: item.nameUserEntry,
        Ent_Usuario_Data: item.dateEntry.toString(),
        Said_Usuario: item.userIdExit == 0 ? "" : item.userIdExit.toString(),
        Said_Usuario_Nome: item.userNameExit,
        Said_Usuario_Data: item.dateExit.toString(),
        Said_Previsao_Data: item.datePrevisionExit.toString(),
        Placa: item.placa,
        Frota: item.frota,
        Modelo: item.modelDescription,
        Consultor: item.idUserAttendant == 0 ? "" : item.idUserAttendant.toString(),
        Consultor_Nome: item.nameUserAttendant,
        Cliente: item.clientCompanyId == 0 ? "" : item.clientCompanyId.toString(),
        Cliente_Nome: item.clientCompanyName,
        Cliente_CNPJ: item.clientCompanyCnpj,
        Cliente_Cpf: item.clientCompanyCpf,
        Km_entrada: item.kmEntry,
        Km_saida: item.kmExit,
        Nr_OS: item.numServiceOrder,
        Nr_NFe:item.numNfe,
        Nr_NFEs: item.numNfse
      });
    }

    // converte JSON → planilha
    const worksheet = XLSX.utils.json_to_sheet(listExp);
    const workbook = { Sheets: { 'Dados': worksheet }, SheetNames: ['Dados'] };

    // cria o arquivo excel em memória
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    // salva arquivo
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'relatorio ' + this.datePipeBR.transform(new Date(), 'dd-MM-yyyy HH:mm') + ".xlsx");
  }


}
