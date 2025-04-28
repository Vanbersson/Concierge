import { Component, DoCheck, EventEmitter, OnInit, Output, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

//PrimeNG
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';

//Class
import { PurchaseOrder } from '../../../../models/purchase.order/puchase.order';

//Service
import { BusyService } from '../../../../components/loading/busy.service';
import { StorageService } from '../../../../services/storage/storage.service';
import { PurchaseOrderService } from '../../../../services/purchase/purchase-order.service';
import { PurchaseReportService } from '../../../../services/reports/parts/purchase-report.service';

//Companent
import { FilterClientComponent } from '../../../../components/filter.client/filter.client.component';

import { ClientCompany } from '../../../../models/clientcompany/client-company';
import { UserService } from '../../../../services/user/user.service';
import { User } from '../../../../models/user/user';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { PurchaseOrderItem } from '../../../../models/purchase.order/purchase.order.item';

//Print
import { PurchaseOrderItemService } from '../../../../services/purchase/purchase-order-item.service';
import { PrintPurchaseComponent } from '../../../../components/print.purchase/print.purchase.component';


export interface IFilterPurchaseOrder {
  companyId: number;
  resaleId: number;
  dateInit?: Date | string;
  dateFinal?: Date | string;
  status: string;
  statusDelivery: string;
  clientCompanyId?: number;
  responsibleId?: number;
  id?: number;
  nfNum?: number;

}

@Component({
  selector: 'app-purchase.order',
  standalone: true,
  imports: [CommonModule, PrintPurchaseComponent, FilterClientComponent, TagModule, ReactiveFormsModule, ToastModule, TableModule, ButtonModule, InputMaskModule,
    InputTextModule, IconFieldModule, InputIconModule, InputNumberModule, MultiSelectModule,
    InputGroupModule, RadioButtonModule, DialogModule,
    CalendarModule],
  templateUrl: './purchase.order.component.html',
  styleUrl: './purchase.order.component.scss',
  providers: [MessageService]
})
export default class PurchaseOrderComponent implements OnInit, DoCheck {
  purchaseOrders: PurchaseOrder[] = [];
  responsable$ = this.userService.getUserFilterRoleId$(3);

  selectClientCompany = signal<ClientCompany>(new ClientCompany());
  dialogVisible: boolean = false;

  formFilter = new FormGroup({
    dateInit: new FormControl<Date | string>(''),
    dateFinal: new FormControl<Date | string>(''),
    type: new FormControl<string>('All'),
    delivery: new FormControl<string>(''),
    clientCompanyId: new FormControl<number | null>(null),
    clientCompanyName: new FormControl<string>(""),
    responsible: new FormControl<User[]>([]),
    purchaseOrderId: new FormControl<number | null>(null),
    nfNum: new FormControl<number | null>(null)
  });

  //Print
  @ViewChild('printComponent') printComponent!: PrintPurchaseComponent;

  constructor(private busyService: BusyService,
    private storageService: StorageService,
    private messageService: MessageService,
    private purchaseReportService: PurchaseReportService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.clientdisable();
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
  compararDatas(dateG: Date, dateD: Date): string {
    const diff = dateD.getTime() - dateG.getTime();
    if (diff > 0) return `No prazo`;
    if (diff < 0) return `Atrasado`;
    return 'Hoje';
  }
  formatDateTime(date: Date): string {
    const datePipe = new DatePipe('en-US');

    // Formata a data e adiciona o fuso horário
    return datePipe.transform(date, "yyyy-MM-dd") + "T00:00:00.000-03:00";
  }
  getStatusDelivery(pu: PurchaseOrder): string {

    if (pu.status == "Open_Purchase_Order") {
      const data1 = this.formatDateTime(new Date());
      const dateDelivery = new Date(pu.dateDelivery);
      return this.compararDatas(new Date(data1), dateDelivery);
    } else {
      var status = "No prazo";

      const dateDelivery = new Date(pu.dateDelivery);
      const dateReceived = new Date(pu.dateReceived);
      const diff = dateDelivery.getTime() - dateReceived.getTime();

      if (diff < 0) status = "Atrasado";

      return status;
    }

  }
  getStatusSeverity(pu: PurchaseOrder): any {

    var status = "";

    if (pu.status == "Open_Purchase_Order") {
      const data1 = this.formatDateTime(new Date());
      const data2 = new Date(pu.dateDelivery);
      status = this.compararDatas(new Date(data1), data2);
    } else {
      const data1 = new Date(pu.dateDelivery);
      const data2 = new Date(pu.dateReceived);

      const diff = data1.getTime() - data2.getTime();

      if (diff > 0) status = "No prazo";
      if (diff < 0) status = "Atrasado";
      if (diff == 0) status = "No prazo";
    }

    switch (status) {
      case 'Hoje':
        return 'warning';
      case 'No prazo':
        return 'success';
      case 'Atrasado':
        return 'danger';
    }
    return "danger";
  }
  abreviaNome(name: string): string {
    if (name.length <= 22) {
      return name;
    }
    return name.substring(0, 22);
  }
  public showDialog() {
    this.dialogVisible = true;
  }
  public hideDialog() {
    this.dialogVisible = false;
  }
  cleanList() {
    this.purchaseOrders = [];
  }
  cleanformFilter() {
    this.clientEnable();
    this.selectClientCompany.set(new ClientCompany());
    this.formFilter.patchValue({
      dateInit: '',
      dateFinal: '',
      type: 'All',
      delivery: '',
      clientCompanyId: null,
      clientCompanyName: '',
      responsible: [],
      purchaseOrderId: null,
      nfNum: null
    });

    this.clientdisable();
  }

  async searchPurchaseOrder() {
    this.busyService.busy();
    this.clientEnable();

    const { value } = this.formFilter;

    var filter: IFilterPurchaseOrder = {
      companyId: this.storageService.companyId,
      resaleId: this.storageService.resaleId,
      dateInit: value.dateInit != '' ? this.formatDateTime(new Date(value.dateInit)) : "",
      dateFinal: value.dateFinal != "" ? this.formatDateTime(new Date(value.dateFinal)) : "",
      status: value.type == "All" ? "" : value.type,
      statusDelivery: value.delivery,
      clientCompanyId: value?.clientCompanyId ?? 0,
      responsibleId: value.responsible.at(0)?.id ?? 0,
      id: value?.purchaseOrderId ?? 0,
      nfNum: value?.nfNum ?? 0
    };

    const resultFilters = await this.filter(filter);
    if (resultFilters.status == 200) {

      if (value.delivery != "") {

      }

      this.purchaseOrders = resultFilters.body;
    }

    this.clientdisable();
    this.busyService.idle();
    this.hideDialog();
  }

  private async filter(filters: IFilterPurchaseOrder): Promise<HttpResponse<PurchaseOrder[]>> {
    try {
      return await lastValueFrom(this.purchaseReportService.filter(filters));
    } catch (error) {
      return error;
    }
  }

  //Print
  print(id: number) {
    if (this.printComponent) {
      this.printComponent.print(id);
    } else {
      console.error('PrintPurchaseComponent não inicializado');
    }
  }

}
