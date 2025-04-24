import { Component, DoCheck, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

//PrimeNG
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

//Print
import printJS from 'print-js';


//Class
import { PurchaseOrder } from '../../../models/purchase.order/puchase.order';
import { ClientCompany } from '../../../models/clientcompany/client-company';
import { User } from '../../../models/user/user';
import { PurchaseOrderItem } from '../../../models/purchase.order/purchase.order.item';
import { Part } from '../../../models/parts/Part';

//Components
import { FilterClientComponent } from '../../../components/filter.client/filter.client.component';
import { FilterPartsComponent } from '../../../components/filter.parts/filter.parts.component';

//Service
import { UserService } from '../../../services/user/user.service';
import { PurchaseOrderService } from '../../../services/purchase/purchase-order.service';
import { StorageService } from '../../../services/storage/storage.service';
import { BusyService } from '../../../components/loading/busy.service';
import { PurchaseOrderItemService } from '../../../services/purchase/purchase-order-item.service';

@Component({
  selector: 'app-purchase.order',
  standalone: true,
  imports: [CommonModule, FilterClientComponent, FilterPartsComponent, ToastModule, ButtonModule, TableModule,
    InputTextModule, IconFieldModule, InputIconModule, DialogModule,
    ReactiveFormsModule, FormsModule, InputGroupModule, InputNumberModule, MultiSelectModule, InputMaskModule, TagModule, ConfirmDialogModule,
    CalendarModule],
  templateUrl: './purchase.order.component.html',
  styleUrl: './purchase.order.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class PurchaseOrderComponent implements OnInit, DoCheck {

  numPurchaseOrder = signal<number | null>(null);
  purchaseOrders: PurchaseOrder[] = [];
  purchaseOrder: PurchaseOrder;
  printPurchaseOrder = signal<PurchaseOrder>(new PurchaseOrder());

  purcharOrderVisible: boolean = false;
  nfVisible: boolean = false;
  dateCloseVisible: boolean = false;

  selectClientCompany = signal<ClientCompany>(new ClientCompany());
  selectPart = signal<Part>(new Part());

  responsable: User[] = [];

  nfNum = signal<number | null>(null);

  //Items Purchase Order
  totalItemsDiscount = signal<number>(0);
  totalItemsPrice = signal<number>(0);

  purchaseOrderItems: PurchaseOrderItem[] = [];

  printPurchaseOrderItems: PurchaseOrderItem[] = Array(25).fill(new PurchaseOrderItem());

  clonedPurchaseOrderItem: { [s: string]: PurchaseOrderItem } = {};

  formPurchase = new FormGroup({
    dateDelivery: new FormControl<Date | string>("", Validators.required),
    responsible: new FormControl<User[]>([], Validators.required),
    clientCompanyId: new FormControl<number | null>(null),
    clientCompanyName: new FormControl<string>(""),
    attendantName: new FormControl<string>(''),
    attendantEmail: new FormControl<string>(''),
    attendantDddCellphone: new FormControl<number | null>(null),
    attendantCellphone: new FormControl<number | null>(null),
    attendantDddPhone: new FormControl<number | null>(null),
    attendantPhone: new FormControl<number | null>(null),
    paymentType: new FormControl<string>('', Validators.required),
    nfNum: new FormControl<number | null>(null),
    nfNumSerie: new FormControl<string>(""),
    nfDate: new FormControl<Date | string>(""),
    nfKey: new FormControl<string>("")
  });

  formNF = new FormGroup({
    nfNum: new FormControl<number | null>(null, Validators.required),
    nfNumSerie: new FormControl<string>("", Validators.required),
    nfDate: new FormControl<Date | string>("", Validators.required),
    nfKey: new FormControl<string | null>(null)
  });

  formDateClose = new FormGroup({
    dateClose: new FormControl<Date | string>(new Date(), Validators.required)
  });

  constructor(
    private busyService: BusyService,
    private storageService: StorageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseOrderItemService: PurchaseOrderItemService,

  ) { }

  ngOnInit(): void {
    this.listPurchaseOrders();

    this.userService.getUserFilterRoleId$(3).subscribe(data => {
      this.responsable = data;
    });

    this.clientdisable();
  }

  ngDoCheck(): void {
    if (this.selectClientCompany().id != 0) {
      this.formPurchase.patchValue({
        clientCompanyId: this.selectClientCompany().id,
        clientCompanyName: this.selectClientCompany().name
      });
    }

    if (this.selectPart().code != "") {
      //Salvar o item
      this.saveParts(this.selectPart());
      this.selectPart.set(new Part());
    }
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
  showDialogPurchase() {
    this.purcharOrderVisible = true;
  }
  hideDialogPurchase() {
    this.purcharOrderVisible = false;
  }
  showDialogNF() {
    this.nfVisible = true;
  }
  hideDialogNF() {
    this.nfVisible = false;
  }
  showDialogDateclose() {
    this.dateCloseVisible = true;
  }
  hideDialogDateclose() {
    this.dateCloseVisible = false;
  }
  private clientEnable() {
    this.formPurchase.get('clientCompanyId').enable();
    this.formPurchase.get('clientCompanyName').enable();
  }
  private clientdisable() {
    this.formPurchase.get('clientCompanyId').disable();
    this.formPurchase.get('clientCompanyName').disable();

  }
  //Save
  async saveNew() {
    const { value, valid } = this.formPurchase;

    if (valid) {
      this.busyService.busy();

      this.purchaseOrder = new PurchaseOrder();
      this.purchaseOrder.companyId = this.storageService.companyId;
      this.purchaseOrder.resaleId = this.storageService.resaleId;
      this.purchaseOrder.status = "Open_Purchase_Order";
      this.purchaseOrder.dateGeneration = this.formatDateTime(new Date());
      this.purchaseOrder.dateDelivery = this.formatDateTime(new Date(value.dateDelivery));
      this.purchaseOrder.responsibleId = value.responsible.at(0).id;
      this.purchaseOrder.responsibleName = value.responsible.at(0).name;
      this.purchaseOrder.paymentType = value.paymentType;
      this.purchaseOrder.clientCompanyId = this.selectClientCompany().id;
      this.purchaseOrder.clientCompanyName = this.selectClientCompany().name;
      this.purchaseOrder.attendantName = value?.attendantName ?? "";
      this.purchaseOrder.attendantEmail = value?.attendantEmail ?? "";
      this.purchaseOrder.attendantDddCellphone = value.attendantDddCellphone == null ? "" : value.attendantDddCellphone.toString();
      this.purchaseOrder.attendantCellphone = value.attendantCellphone == null ? "" : value.attendantCellphone.toString();
      this.purchaseOrder.attendantDddPhone = value.attendantDddPhone == null ? "" : value.attendantDddPhone.toString();
      this.purchaseOrder.attendantPhone = value.attendantPhone == null ? "" : value.attendantPhone.toString();
      this.purchaseOrder.nfNum = 0;
      this.purchaseOrder.nfSerie = "";
      this.purchaseOrder.nfDate = ""
      this.purchaseOrder.nfKey = "";

      const resultPu = await this.savePurchaseOrder(this.purchaseOrder);
      if (resultPu.status == 201) {
        this.purchaseOrder.id = resultPu.body.id;
        this.numPurchaseOrder.set(this.purchaseOrder.id);
        this.messageService.add({ severity: 'success', summary: 'Pedido de Compra', detail: 'Número gerado com sucesso', icon: 'pi pi-check' });
        this.listPurchaseOrders();
      }
      this.busyService.idle();
    }

  }
  //Update
  async saveUpdate() {
    this.clientEnable();
    const { value, valid } = this.formPurchase;

    const nf = this.formNF.value;

    if (valid) {
      this.busyService.busy();

      this.purchaseOrder.dateGeneration = this.formatDateTime(new Date(this.purchaseOrder.dateGeneration))
      this.purchaseOrder.dateDelivery = this.formatDateTime(new Date(value.dateDelivery));
      this.purchaseOrder.responsibleId = value.responsible.at(0).id;
      this.purchaseOrder.responsibleName = value.responsible.at(0).name;
      this.purchaseOrder.paymentType = value.paymentType;
      this.purchaseOrder.clientCompanyId = value.clientCompanyId;
      this.purchaseOrder.clientCompanyName = value.clientCompanyName;
      this.purchaseOrder.attendantName = value?.attendantName ?? "";
      this.purchaseOrder.attendantEmail = value?.attendantEmail ?? "";
      this.purchaseOrder.attendantDddCellphone = value.attendantDddCellphone == null ? "" : value.attendantDddCellphone.toString();
      this.purchaseOrder.attendantCellphone = value.attendantCellphone == null ? "" : value.attendantCellphone.toString();
      this.purchaseOrder.attendantDddPhone = value.attendantDddPhone == null ? "" : value.attendantDddPhone.toString();
      this.purchaseOrder.attendantPhone = value.attendantPhone == null ? "" : value.attendantPhone.toString();
      this.purchaseOrder.nfNum = nf?.nfNum ?? 0;
      this.purchaseOrder.nfSerie = nf?.nfNumSerie ?? "";
      this.purchaseOrder.nfDate = nf.nfDate != null ? this.formatDateTime(new Date(nf.nfDate)) : "";
      this.purchaseOrder.nfKey = nf?.nfKey ?? "";

      const resultPu = await this.updatePurchaseOrder(this.purchaseOrder);
      if (resultPu.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Pedido de Compra', detail: 'Salvo com sucesso', icon: 'pi pi-check' });
      }

      this.busyService.idle();
    }
    this.clientdisable();
  }
  //Close
  confirmDateClose() {
    const { valid } = this.formDateClose;
    if (valid) {
      this.hideDialogDateclose();
      this.confirmClose();
    }
  }
  confirmClose() {
    this.confirmationService.confirm({
      header: 'Fechar pedido?',
      message: 'Por favor confirme para fechar.',
      accept: async () => {

        this.clientEnable();
        const { value, valid } = this.formPurchase;

        const nf = this.formNF.value;
        const dateReceived = this.formDateClose.value;

        if (valid) {
          this.busyService.busy();

          this.purchaseOrder.status = "Closed_Purchase_Order";
          this.purchaseOrder.dateGeneration = this.formatDateTime(new Date(this.purchaseOrder.dateGeneration))
          this.purchaseOrder.dateDelivery = this.formatDateTime(new Date(value.dateDelivery));
          this.purchaseOrder.dateReceived = this.formatDateTime(new Date(dateReceived.dateClose));
          this.purchaseOrder.responsibleId = value.responsible.at(0).id;
          this.purchaseOrder.responsibleName = value.responsible.at(0).name;
          this.purchaseOrder.paymentType = value.paymentType;
          this.purchaseOrder.clientCompanyId = value.clientCompanyId;
          this.purchaseOrder.clientCompanyName = value.clientCompanyName;
          this.purchaseOrder.attendantName = value?.attendantName ?? "";
          this.purchaseOrder.attendantEmail = value?.attendantEmail ?? "";
          this.purchaseOrder.attendantDddCellphone = value.attendantDddCellphone == null ? "" : value.attendantDddCellphone.toString();
          this.purchaseOrder.attendantCellphone = value.attendantCellphone == null ? "" : value.attendantCellphone.toString();
          this.purchaseOrder.attendantDddPhone = value.attendantDddPhone == null ? "" : value.attendantDddPhone.toString();
          this.purchaseOrder.attendantPhone = value.attendantPhone == null ? "" : value.attendantPhone.toString();
          this.purchaseOrder.nfNum = nf?.nfNum ?? 0;
          this.purchaseOrder.nfSerie = nf?.nfNumSerie ?? "";
          this.purchaseOrder.nfDate = nf.nfDate != null ? this.formatDateTime(new Date(nf.nfDate)) : "";
          this.purchaseOrder.nfKey = nf?.nfKey ?? "";

          const resultPu = await this.updatePurchaseOrder(this.purchaseOrder);
          if (resultPu.status == 200) {
            this.messageService.add({ severity: 'success', summary: 'Pedido', detail: 'Fechado com sucesso', icon: 'pi pi-check' });
            this.hideDialogPurchase();
            this.listPurchaseOrders();
          }

          this.busyService.idle();
        }
        this.clientdisable();

      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Você não fechou o pedido', icon: 'pi pi-times' });
      }
    });
  }
  confirmNF() {
    const { valid, value } = this.formNF;
    if (valid) {
      this.nfNum.set(value.nfNum);
      this.hideDialogNF();
    }
  }
  //Delete
  async delete(item: PurchaseOrderItem) {
    const resultItem = await this.deleteItem(item);
    if (resultItem.status == 200) {
      //List items
      this.purchaseOrderItems = await this.listPurchaseOrderItem(this.purchaseOrder.companyId, this.purchaseOrder.resaleId, this.purchaseOrder.id);
      this.somaItem();
    }

  }
  private async deleteItem(item: PurchaseOrderItem): Promise<HttpResponse<PurchaseOrderItem>> {
    try {
      return await lastValueFrom(this.purchaseOrderItemService.delete(item));
    } catch (error) {
      return error;
    }

  }
  //Print
  async print(id: number) {

    const resultPu = await this.purchaseEdit(id);
    if (resultPu.status == 200) {
      //Dados 
      this.printPurchaseOrder.set(resultPu.body);

      this.printPurchaseOrderItems = Array(25).fill(new PurchaseOrderItem());

      //List items
      this.purchaseOrderItems = await this.listPurchaseOrderItem(this.storageService.companyId, this.storageService.resaleId, id);
      this.somaItem();

      for (let index = 0; index < this.purchaseOrderItems.length; index++) {
        this.printPurchaseOrderItems[index] = this.purchaseOrderItems.at(index);
      }

      setTimeout(() => {
        const print = document.getElementById('print-sectionId');
        print.style.display = 'block';
        printJS({
          printable: 'print-sectionId',
          type: 'html',
          targetStyles: ['*'], // garante que os estilos globais sejam aplicados
          scanStyles: true, // use true se quiser escanear estilos inline também
          documentTitle: 'Pedido de compra'
        });
        print.style.display = 'none';
      }, 200);

    }

  }
  printAbreviaDesc(desc: string) {
    if (desc == '') return desc;
    if (desc.length <= 20) return desc;
    return desc.substring(0, 20);
  }
  //Services
  private async savePurchaseOrder(pu: PurchaseOrder): Promise<HttpResponse<PurchaseOrder>> {
    try {
      return await lastValueFrom(this.purchaseOrderService.save(pu));
    } catch (error) {
      return error;
    }
  }
  private async updatePurchaseOrder(pu: PurchaseOrder): Promise<HttpResponse<PurchaseOrder>> {
    try {
      return await lastValueFrom(this.purchaseOrderService.update(pu));
    } catch (error) {
      return error;
    }
  }

  compararDatas(dateG: Date, dateD: Date): string {
    const diff = dateD.getTime() - dateG.getTime();
    if (diff > 0) return `No prazo`;
    if (diff < 0) return `Atrasado`;
    return 'Hoje';
  }
  newPurchaseOrder() {

    this.cleanForm();

    this.formNF.patchValue({
      nfNum: null,
      nfNumSerie: "",
      nfDate: null,
      nfKey: null
    });

    //Clean list parts
    this.purchaseOrderItems = [];

    //Número NF
    this.nfNum.set(null);

    //Totais
    this.totalItemsDiscount.set(0);
    this.totalItemsPrice.set(0);

    //show dialog
    this.showDialogPurchase();
  }
  cleanForm() {
    this.formPurchase.patchValue({
      dateDelivery: null,
      responsible: [],
      clientCompanyId: null,
      clientCompanyName: "",
      attendantName: "",
      attendantEmail: "",
      attendantDddCellphone: null,
      attendantCellphone: null,
      attendantDddPhone: null,
      attendantPhone: null,
      paymentType: "",
      nfNum: null,
      nfNumSerie: "",
      nfDate: "",
      nfKey: ""
    });
    this.numPurchaseOrder.set(null);
    this.selectClientCompany.set(new ClientCompany());
  }
  formatDateTime(date: Date): string {
    const datePipe = new DatePipe('en-US');

    // Formata a data e adiciona o fuso horário
    return datePipe.transform(date, "yyyy-MM-dd") + "T00:00:00.000-03:00";
  }
  onRowEditInit(item: PurchaseOrderItem) {
    this.clonedPurchaseOrderItem[item.id as string] = { ...item };
  }
  onRowEditSave(item: PurchaseOrderItem) {
    this.updateParts(item);
    delete this.clonedPurchaseOrderItem[item.id as string];
  }
  onRowEditCancel(item: PurchaseOrderItem, index: number) {
    this.purchaseOrderItems[index] = this.clonedPurchaseOrderItem[item.id as string];
    delete this.clonedPurchaseOrderItem[item.id as string];
  }
  async edit(id: number) {
    this.busyService.busy();
    const resultPu = await this.purchaseEdit(id);
    if (resultPu.status == 200) {
      this.showDialogPurchase();

      this.purchaseOrder = resultPu.body;

      this.numPurchaseOrder.set(this.purchaseOrder.id);
      this.nfNum.set(this.purchaseOrder.nfNum);

      for (var user of this.responsable) {
        if (user.id == this.purchaseOrder.responsibleId) {
          this.formPurchase.patchValue({
            responsible: [user]
          });
        }
      }

      this.formPurchase.patchValue({
        paymentType: this.purchaseOrder.paymentType,
        dateDelivery: new Date(this.purchaseOrder.dateDelivery),
        clientCompanyId: this.purchaseOrder.clientCompanyId,
        clientCompanyName: this.purchaseOrder.clientCompanyName,
        attendantName: this.purchaseOrder.attendantName,
        attendantEmail: this.purchaseOrder.attendantEmail,
        attendantDddCellphone: this.purchaseOrder.attendantDddCellphone != "" ? Number.parseInt(this.purchaseOrder.attendantDddCellphone) : null,
        attendantCellphone: this.purchaseOrder.attendantCellphone != "" ? Number.parseInt(this.purchaseOrder.attendantCellphone) : null,
        attendantDddPhone: this.purchaseOrder.attendantDddPhone != "" ? Number.parseInt(this.purchaseOrder.attendantDddPhone) : null,
        attendantPhone: this.purchaseOrder.attendantPhone != "" ? Number.parseInt(this.purchaseOrder.attendantPhone) : null,
        nfNum: this.purchaseOrder.nfNum != 0 ? this.purchaseOrder.nfNum : null,
        nfNumSerie: this.purchaseOrder?.nfSerie ?? "",
        nfDate: this.purchaseOrder.nfDate != "" ? new Date(this.purchaseOrder.nfDate) : null,
        nfKey: this.purchaseOrder.nfKey != "" ? this.purchaseOrder.nfKey : null
      });

      this.formNF.patchValue({
        nfNum: this.purchaseOrder.nfNum != 0 ? this.purchaseOrder.nfNum : null,
        nfNumSerie: this.purchaseOrder.nfSerie,
        nfDate: this.purchaseOrder.nfDate != "" ? new Date(this.purchaseOrder.nfDate) : null,
        nfKey: this.purchaseOrder.nfKey != "" ? this.purchaseOrder.nfKey : null
      });

      //List items
      this.purchaseOrderItems = await this.listPurchaseOrderItem(this.purchaseOrder.companyId, this.purchaseOrder.resaleId, this.purchaseOrder.id);
      this.somaItem();
    }
    this.busyService.idle();
  }
  private async purchaseEdit(id: number): Promise<HttpResponse<PurchaseOrder>> {
    try {
      return await lastValueFrom(this.purchaseOrderService.filterId$(this.storageService.companyId, this.storageService.resaleId, id));
    } catch (error) {
      return error;
    }
  }
  private async updateParts(item: PurchaseOrderItem) {
    const resultItem = await this.updatePurchaseOrderItem(item);
    if (resultItem.status == 200) {
      this.somaItem();
    }

  }
  private async updatePurchaseOrderItem(item: PurchaseOrderItem): Promise<HttpResponse<PurchaseOrderItem>> {
    try {
      return await lastValueFrom(this.purchaseOrderItemService.update(item));
    } catch (error) {
      return error;
    }
  }
  private async saveParts(part: Part) {

    const puItem: PurchaseOrderItem = new PurchaseOrderItem();
    puItem.companyId = part.companyId;
    puItem.resaleId = part.resaleId;
    puItem.purchaseId = this.purchaseOrder.id;
    puItem.partId = part.id;
    puItem.partCode = part.code;
    puItem.partDescription = part.description;
    puItem.quantity = part.qtdAvailable;
    puItem.price = part.price;
    puItem.discount = part.discount;

    const resultItem = await this.savePurchaseOrderItem(puItem);
    if (resultItem.status == 201) {

      this.purchaseOrderItems = await this.listPurchaseOrderItem(this.purchaseOrder.companyId, this.purchaseOrder.resaleId, this.purchaseOrder.id);
      this.somaItem();
    }
  }
  private async savePurchaseOrderItem(item: PurchaseOrderItem): Promise<HttpResponse<PurchaseOrderItem>> {
    try {
      return await lastValueFrom(this.purchaseOrderItemService.save(item));
    } catch (error) {
      return error;
    }
  }
  private async listPurchaseOrderItem(companyId: number, resaleId: number, purchaseId: number): Promise<PurchaseOrderItem[]> {
    try {
      return await lastValueFrom(this.purchaseOrderItemService.filterId(companyId, resaleId, purchaseId));
    } catch (error) {
      return [];
    }
  }
  somaItem() {
    var tempDiscount: number = 0;
    var tempPrice: number = 0;

    for (var item of this.purchaseOrderItems) {
      tempDiscount += item.discount;
      tempPrice += item.price * item.quantity;
    }
    this.totalItemsDiscount.set(tempDiscount);
    this.totalItemsPrice.set(tempPrice);
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

}
