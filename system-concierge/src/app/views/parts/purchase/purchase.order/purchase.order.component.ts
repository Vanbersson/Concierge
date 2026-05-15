import { Component, DoCheck, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

//PrimeNG
import { PrimeNGConfig } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputMaskModule } from 'primeng/inputmask';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';

//Class
import { PurchaseOrder } from '../../../../models/purchase.order/purchase.order';
import { ClientCompany } from '../../../../models/clientcompany/client-company';
import { PurchaseOrderItem } from '../../../../models/purchase.order/item/purchase.order.item';
import { Part } from '../../../../models/parts/Part';

//Components
import { FilterClientComponent } from '../../../../components/filter.client/filter.client.component';
import { FilterPartsComponent } from '../../../../components/filter.parts/filter.parts.component';
import { PrintPurchaseComponent } from '../../../../components/print.purchase/print.purchase.component';

//Service
import { PurchaseOrderService } from '../../../../services/purchase/purchase-order.service';
import { StorageService } from '../../../../services/storage/storage.service';
import { BusyService } from '../../../../components/loading/busy.service';
import { PurchaseOrderItemService } from '../../../../services/purchase/purchase-order-item.service';
import { StatusPurchaseOrder } from '../../../../models/purchase.order/enums/status.purchase.order';
import { MessageResponse } from '../../../../models/message/message-response';
import { User } from '../../../../models/user/user';
import { UserService } from '../../../../services/user/user.service';
import { TypePayment } from '../../../../models/payment/type-payment';
import { TypePaymentService } from '../../../../services/payment/type-payment.service';
import { TypePurchaseOrder } from '../../../../models/purchase.order/enums/type.purchase.order';
import { SuccessError } from '../../../../models/enum/success-error';
import { StatusDelivery } from '../../../../models/purchase.order/enums/status.delivery';
import { IPartFilter } from '../../../../interfaces/part/ipart.filter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase.order',
  standalone: true,
  imports: [CommonModule, PrintPurchaseComponent, FilterClientComponent, FilterPartsComponent, InputTextareaModule,
    ToastModule, ButtonModule, TableModule, InputTextModule, IconFieldModule, RadioButtonModule,
    InputIconModule, DialogModule, DividerModule, DropdownModule,
    ReactiveFormsModule, FormsModule, InputGroupModule, InputNumberModule,
    MultiSelectModule, InputMaskModule, TagModule, ConfirmDialogModule,
    CalendarModule],
  templateUrl: './purchase.order.component.html',
  styleUrl: './purchase.order.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class PurchaseOrderComponent implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  listResponsibles: User[] = [];
  listPayments: TypePayment[] = [];
  //Print
  @ViewChild('printComponent') printComponent!: PrintPurchaseComponent;

  constructor(
    private router: Router,
    private primeNGConfig: PrimeNGConfig,
    private userService: UserService,
    private messageService: MessageService,
    private purchaseOrderService: PurchaseOrderService,
    private paymentService: TypePaymentService,
    private busyService: BusyService,

  ) { }

  ngOnInit(): void {
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
    this.init();
  }

  private async init() {
    this.busyService.busy();
    this.listOpenPurchaseorder();
    const resultUserRole = await this.filterUserRoleId(3);
    if (resultUserRole.status == 200 && resultUserRole.body.status == SuccessError.succes) {
      this.listResponsibles = resultUserRole.body.data;
    }
    this.listPayments = await this.listAllEnabledTypePayment();
    this.busyService.idle();
  }

  //Save new
  newPurchaseOrder() {
    this.router.navigateByUrl('pecas/compras/pedido/pedido/0');
  }

  edit(id: number) {
    this.router.navigateByUrl(`pecas/compras/pedido/pedido/${id}`);
  }

  private async listOpenPurchaseorder() {
    const listOpen = await this.filterOpenPurchaseOrder();
    const dataNow = new Date();
    dataNow.setHours(0, 0, 0, 0);
    this.purchaseOrders = [];
    for (let i of listOpen) {
      i.statusDelivery = this.compararDatas(dataNow, new Date(i.dateDelivery));
      this.purchaseOrders.push(i);
    }
  }

  private compararDatas(dateNow: Date, dateDelivery: Date): StatusDelivery {
    const diff = dateDelivery.getTime() - dateNow.getTime();
    if (diff > 0) return StatusDelivery.NOPRAZO;
    if (diff < 0) return StatusDelivery.ATRASADO;
    return StatusDelivery.HOJE;
  }

  abreviaNome(name: string): string {
    if (name.length <= 22) {
      return name;
    }
    return name.substring(0, 22);
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

  private async filterUserRoleId(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.userService.filterRoleId(id));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }

  private async filterOpenPurchaseOrder(): Promise<PurchaseOrder[]> {
    try {
      return await lastValueFrom(this.purchaseOrderService.filterOpen());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return [];
    }
  }

  private async listAllEnabledTypePayment(): Promise<TypePayment[]> {
    try {
      return await lastValueFrom(this.paymentService.listAllEnabled());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }




}
