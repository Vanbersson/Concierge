import { Component, DoCheck, OnInit, signal } from '@angular/core';
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


export interface IFilterPurchaseOrder {
  companyId: number;
  resaleId: number;
  dateInit?: Date | string;
  dateFinal?: Date | string;
  type: string;
  delivery: string;
  clientCompanyId?: number;
  responsableId?: number;
  purchaseOrderId?: number;
  nfNum?: number;

}

@Component({
  selector: 'app-purchase.order',
  standalone: true,
  imports: [CommonModule, FilterClientComponent, ReactiveFormsModule, ToastModule, TableModule, ButtonModule, InputMaskModule,
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
    type: new FormControl<string>('N'),
    delivery: new FormControl<string>('N'),
    clientCompanyId: new FormControl<number | null>(null),
    clientCompanyName: new FormControl<string>(""),
    responsible: new FormControl<User[]>([]),
    purchaseOrderId: new FormControl<number | null>(null),
    nfNum: new FormControl<number | null>(null)
  });

  constructor(private busyService: BusyService,
    private storageService: StorageService,
    private messageService: MessageService,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseReportService: PurchaseReportService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.clientdisable();
    this.listPurchaseOrders();
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

  listPurchaseOrders() {
    this.purchaseOrderService.filterOpen$(this.storageService.companyId, this.storageService.resaleId).subscribe(data => {
      for (var item of data) {
        const data1 = this.formatDateTime(new Date());
        const data2 = new Date(item.dateDelivery);
        item.status = this.compararDatas(new Date(data1), data2);
      }
      this.purchaseOrders = data;
    });
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
  getStatusSeverity(status: string): any {
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

  cleanform() {

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
      type: value.type,
      delivery: value.delivery,
      clientCompanyId: value?.clientCompanyId ?? 0,
      responsableId: value.responsible.at(0)?.id ?? 0,
      purchaseOrderId: value?.purchaseOrderId ?? 0,
      nfNum: value?.nfNum ?? 0
    };


    this.busyService.idle();
    console.log(filter);

  }
}
