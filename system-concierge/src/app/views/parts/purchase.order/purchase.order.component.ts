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
import { PurchaseOrder } from '../../../models/purchase.order/purchase.order';
import { ClientCompany } from '../../../models/clientcompany/client-company';
import { PurchaseOrderItem } from '../../../models/purchase.order/purchase.order.item';
import { Part } from '../../../models/parts/Part';

//Components
import { FilterClientComponent } from '../../../components/filter.client/filter.client.component';
import { FilterPartsComponent } from '../../../components/filter.parts/filter.parts.component';
import { PrintPurchaseComponent } from '../../../components/print.purchase/print.purchase.component';

//Service
import { PurchaseOrderService } from '../../../services/purchase/purchase-order.service';
import { StorageService } from '../../../services/storage/storage.service';
import { BusyService } from '../../../components/loading/busy.service';
import { PurchaseOrderItemService } from '../../../services/purchase/purchase-order-item.service';
import { StatusPurchaseOrder } from '../../../models/purchase.order/enums/status.purchase.order';
import { MessageResponse } from '../../../models/message/message-response';
import { User } from '../../../models/user/user';
import { UserService } from '../../../services/user/user.service';
import { TypePayment } from '../../../models/payment/type-payment';
import { TypePaymentService } from '../../../services/payment/type-payment.service';
import { TypePurchaseOrder } from '../../../models/purchase.order/enums/type.purchase.order';
import { SuccessError } from '../../../models/enum/success-error';
import { StatusDelivery } from '../../../models/purchase.order/enums/status.delivery';

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
export default class PurchaseOrderComponent implements OnInit, DoCheck {
  private purchaseOrder: PurchaseOrder;
  private isNewPurchaseOrder: boolean = false;

  numPurchaseOrder = signal<number | null>(null);
  generationDate = signal<Date>(null);
  generationUserName = signal<string>('');

  purchaseOrders: PurchaseOrder[] = [];
  listResponsibles: User[] = [];
  listPayments: TypePayment[] = [];
  //Prin
  printPurchaseOrder = signal<PurchaseOrder>(new PurchaseOrder());

  purcharOrderVisible: boolean = false;
  nfVisible: boolean = false;
  //dateCloseVisible: boolean = false;

  selectClientCompany = signal<ClientCompany>(new ClientCompany());
  private clientCompany: ClientCompany;

  selectPart = signal<Part>(new Part());

  //Items Purchase Order
  totalItemsDiscount = signal<number>(0);
  totalItemsPrice = signal<number>(0);
  estoque = TypePurchaseOrder.ESTOQUE;
  consumo = TypePurchaseOrder.CONSUMO;

  //Estoque
  purchaseOrderItems: PurchaseOrderItem[] = [];
  printPurchaseOrderItems: PurchaseOrderItem[] = Array(25).fill(new PurchaseOrderItem());
  clonedPurchaseOrderItem: { [s: string]: PurchaseOrderItem } = {};

  formPurchase = new FormGroup({
    type: new FormControl<TypePurchaseOrder>(TypePurchaseOrder.ESTOQUE),
    responsible: new FormControl<User | null>(null, Validators.required),
    typePayment: new FormControl<TypePayment | null>(null, Validators.required),
    dateDelivery: new FormControl<Date | string>("", Validators.required),
    dateReceived: new FormControl<Date | string>(""),
    clientCompanyId: new FormControl<number | null>({ value: null, disabled: true }),
    clientCompanyName: new FormControl<string>({ value: '', disabled: true }),
    attendantName: new FormControl<string>(''),
    attendantEmail: new FormControl<string>(''),
    attendantDddCellphone: new FormControl<number | null>(null),
    attendantCellphone: new FormControl<number | null>(null),
    attendantDddPhone: new FormControl<number | null>(null),
    attendantPhone: new FormControl<number | null>(null),
    nfNum: new FormControl<number | null>(null),
    nfNumSerie: new FormControl<string>(""),
    nfDate: new FormControl<Date | string>(""),
    nfKey: new FormControl<string>(""),
    information: new FormControl<string>("")
  });
  isNfValid: boolean = false;
  //Print
  @ViewChild('printComponent') printComponent!: PrintPurchaseComponent;

  constructor(
    private primeNGConfig: PrimeNGConfig,
    private userService: UserService,
    private paymentService: TypePaymentService,
    private busyService: BusyService,
    private storageService: StorageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private purchaseOrderService: PurchaseOrderService,
    private purchaseOrderItemService: PurchaseOrderItemService
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
  ngDoCheck(): void {
    if (this.selectClientCompany().id != null) {
      this.clientCompany = this.selectClientCompany();
      this.formPurchase.patchValue({
        clientCompanyId: this.selectClientCompany().id,
        clientCompanyName: this.selectClientCompany().name
      });
      this.selectClientCompany.set(new ClientCompany());
    }

    if (this.selectPart().id != null) {
      //Salvar o item
      this.saveParts(this.selectPart());
      this.selectPart.set(new Part());
    }
  }
  private async init() {
    this.listOpenPurchaseorder();
    const resultUserRole = await this.filterUserRoleId(3);
    if (resultUserRole.status == 200 && resultUserRole.body.status == SuccessError.succes) {
      this.listResponsibles = resultUserRole.body.data;
    }
    this.listPayments = await this.listAllEnabledTypePayment();
  }
  applyDateMask(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (value.length > 5) {
      value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }

    event.target.value = value;
  }
  private async listOpenPurchaseorder() {
    const listOpen = await this.filterOpenPurchaseOrder();
    const dataNow = new Date();
    dataNow.setHours(0, 0, 0, 0);
    this.purchaseOrders = [];
    for (let i of listOpen) {
      i.statusDelivery = this.compararDatas(dataNow, new Date(i.dateDelivery))
      this.purchaseOrders.push(i);
    }
  }
  private compararDatas(dateNow: Date, dateDelivery: Date): StatusDelivery {
    const diff = dateDelivery.getTime() - dateNow.getTime();
    if (diff > 0) return StatusDelivery.NOPRAZO;
    if (diff < 0) return StatusDelivery.ATRASADO;
    return StatusDelivery.HOJE;
  }
  private cleanForm() {
    this.formPurchase.patchValue({
      type: TypePurchaseOrder.ESTOQUE,
      responsible: null,
      typePayment: null,
      dateDelivery: null,
      dateReceived: null,
      clientCompanyId: null,
      clientCompanyName: "",
      attendantName: "",
      attendantEmail: "",
      attendantDddCellphone: null,
      attendantCellphone: null,
      attendantDddPhone: null,
      attendantPhone: null,
      nfNum: null,
      nfNumSerie: "",
      nfDate: null,
      nfKey: "",
      information: ""
    });
    this.numPurchaseOrder.set(null);
    this.selectClientCompany.set(new ClientCompany());
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
  formatDateTime(date: Date): string {
    const datePipe = new DatePipe('en-US');
    // Formata a data e adiciona o fuso horário
    return datePipe.transform(date, "yyyy-MM-dd") + "T00:00:00.000-03:00";
  }

  private showDialogPurchase() {
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

  private validNf() {
    this.isNfValid = false;
    if (this.purchaseOrder.nfNum != null && this.purchaseOrder.nfSerie != "" && this.purchaseOrder.nfDate != null && this.purchaseOrder.nfKey.length == 44) {
      this.isNfValid = true;
    }
  }

  //Save new
  newPurchaseOrder() {
    this.cleanForm();
    this.isNewPurchaseOrder = true;
    this.purchaseOrder = new PurchaseOrder();
    this.formPurchase.get('type').enable();
    this.showDialogPurchase();
  }

  save() {
    if (this.isNewPurchaseOrder) {
      this.saveNewPurchaseOrder();
    } else {
      this.saveUpdatePurchaseOrder();
    }
  }
  private async saveNewPurchaseOrder() {
    const { value, valid } = this.formPurchase;
    if (!valid || this.clientCompany == null) {
      return;
    }
    this.purchaseOrder.companyId = this.storageService.companyId;
    this.purchaseOrder.resaleId = this.storageService.resaleId;
    this.purchaseOrder.status = StatusPurchaseOrder.OPEN;
    this.purchaseOrder.type = value.type;
    this.purchaseOrder.dateDelivery = value.dateDelivery;
    this.purchaseOrder.dateReceived = value?.dateReceived ?? null;
    this.purchaseOrder.responsibleUserId = value.responsible.id
    this.purchaseOrder.responsibleUserName = value.responsible.name;
    this.purchaseOrder.generationUserId = this.storageService.id;
    this.purchaseOrder.generationUserName = this.storageService.name;
    this.purchaseOrder.paymentTypeId = value.typePayment.id;
    this.purchaseOrder.paymentTypeDesc = value.typePayment.description;
    this.purchaseOrder.clientCompanyId = this.clientCompany.id;
    this.purchaseOrder.clientCompanyName = this.clientCompany.name;
    this.purchaseOrder.attendantName = value?.attendantName ?? "";
    this.purchaseOrder.attendantEmail = value?.attendantEmail ?? "";
    this.purchaseOrder.attendantDddCellphone = value.attendantDddCellphone == null ? "" : value.attendantDddCellphone.toString();
    this.purchaseOrder.attendantCellphone = value.attendantCellphone == null ? "" : value.attendantCellphone.toString();
    this.purchaseOrder.attendantDddPhone = value.attendantDddPhone == null ? "" : value.attendantDddPhone.toString();
    this.purchaseOrder.attendantPhone = value.attendantPhone == null ? "" : value.attendantPhone.toString();
    this.purchaseOrder.information = value.information;
    this.busyService.busy();
    const resultPu = await this.saveNewPu(this.purchaseOrder);
    this.busyService.idle();

    if (resultPu.status == 201 && resultPu.body.status == SuccessError.succes) {
      this.purchaseOrder.id = resultPu.body.data.id;
      this.messageService.add({ severity: 'success', summary: resultPu.body.header, detail: resultPu.body.message, icon: 'pi pi-check' });
      //Habilita o atualizar
      this.isNewPurchaseOrder = false;
      //Número do pedido
      this.numPurchaseOrder.set(this.purchaseOrder.id);
      //Data geração
      this.generationDate.set(new Date(this.purchaseOrder.generationDate));
      //Nome de quem gerou o pedido
      this.generationUserName.set(this.purchaseOrder.generationUserName);
      //Desabilita
      this.formPurchase.get('type').disable();
      //List
      this.listOpenPurchaseorder();
    }
    if (resultPu.status == 201 && resultPu.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: resultPu.body.header, detail: resultPu.body.message, icon: 'pi pi-info-circle' });
    }
  }
  private async saveUpdatePurchaseOrder() {
    const { value, valid } = this.formPurchase;
    if (!valid || this.clientCompany == null) {
      return;
    }
    this.purchaseOrder.dateDelivery = value.dateDelivery;
    this.purchaseOrder.dateReceived = value?.dateReceived ?? null;
    this.purchaseOrder.responsibleUserId = value.responsible.id
    this.purchaseOrder.responsibleUserName = value.responsible.name;
    this.purchaseOrder.paymentTypeId = value.typePayment.id;
    this.purchaseOrder.paymentTypeDesc = value.typePayment.description;
    this.purchaseOrder.clientCompanyId = this.clientCompany.id;
    this.purchaseOrder.clientCompanyName = this.clientCompany.name;
    this.purchaseOrder.attendantName = value?.attendantName ?? "";
    this.purchaseOrder.attendantEmail = value?.attendantEmail ?? "";
    this.purchaseOrder.attendantDddCellphone = value.attendantDddCellphone == null ? "" : value.attendantDddCellphone.toString();
    this.purchaseOrder.attendantCellphone = value.attendantCellphone == null ? "" : value.attendantCellphone.toString();
    this.purchaseOrder.attendantDddPhone = value.attendantDddPhone == null ? "" : value.attendantDddPhone.toString();
    this.purchaseOrder.attendantPhone = value.attendantPhone == null ? "" : value.attendantPhone.toString();
    this.purchaseOrder.information = value.information;
    this.purchaseOrder.nfNum = value.nfNum;
    this.purchaseOrder.nfSerie = value.nfNumSerie;
    this.purchaseOrder.nfDate = value.nfDate;
    this.purchaseOrder.nfKey = value.nfKey;

    this.busyService.busy();
    const resultPu = await this.saveUpdatePu(this.purchaseOrder);
    this.busyService.idle();
    if (resultPu.status == 200 && resultPu.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: resultPu.body.header, detail: resultPu.body.message, icon: 'pi pi-check' });
      //Valid NF
      this.validNf();
      //List
      this.listOpenPurchaseorder();
    }
    if (resultPu.status == 200 && resultPu.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: resultPu.body.header, detail: resultPu.body.message, icon: 'pi pi-info-circle' });
    }
  }
  async edit(id: number) {
    this.busyService.busy();
    const resultPu = await this.purchaseEdit(id);
    this.busyService.idle();
    if (resultPu.status == 200 && resultPu.body.status == SuccessError.succes) {
      this.isNewPurchaseOrder = false;
      this.cleanForm();
      this.purchaseOrder = resultPu.body.data;
      //Client
      this.clientCompany = new ClientCompany();
      this.clientCompany.id = this.purchaseOrder.clientCompanyId;
      this.clientCompany.name = this.purchaseOrder.clientCompanyName;
      //Número do pedido
      this.numPurchaseOrder.set(this.purchaseOrder.id);
      //Data geração
      this.generationDate.set(new Date(this.purchaseOrder.generationDate));
      //Nome de quem gerou o pedido
      this.generationUserName.set(this.purchaseOrder.generationUserName);
      //Valid NF

      this.validNf();
      this.formPurchase.patchValue({
        type: this.purchaseOrder.type,
        responsible: this.listResponsibles.find(r => r.id == this.purchaseOrder.responsibleUserId),
        typePayment: this.listPayments.find(p => p.id == this.purchaseOrder.paymentTypeId),
        dateDelivery: new Date(this.purchaseOrder.dateDelivery),
        dateReceived: this.purchaseOrder.dateReceived != null ? new Date(this.purchaseOrder.dateReceived) : null,
        clientCompanyId: this.purchaseOrder.clientCompanyId,
        clientCompanyName: this.purchaseOrder.clientCompanyName,
        attendantName: this.purchaseOrder.attendantName,
        attendantEmail: this.purchaseOrder.attendantEmail,
        attendantDddCellphone: this.purchaseOrder.attendantDddCellphone != "" ? Number.parseInt(this.purchaseOrder.attendantDddCellphone) : null,
        attendantCellphone: this.purchaseOrder.attendantCellphone != "" ? Number.parseInt(this.purchaseOrder.attendantCellphone) : null,
        attendantDddPhone: this.purchaseOrder.attendantDddPhone != "" ? Number.parseInt(this.purchaseOrder.attendantDddPhone) : null,
        attendantPhone: this.purchaseOrder.attendantPhone != "" ? Number.parseInt(this.purchaseOrder.attendantPhone) : null,
        nfNum: this.purchaseOrder.nfNum != null ? this.purchaseOrder.nfNum : null,
        nfNumSerie: this.purchaseOrder.nfSerie,
        nfDate: this.purchaseOrder.nfDate != null ? new Date(this.purchaseOrder.nfDate) : null,
        nfKey: this.purchaseOrder.nfKey,
        information: this.purchaseOrder.information
      });
      this.formPurchase.get('type').disable();
      this.showDialogPurchase();

      //List items
      //this.purchaseOrderItems = await this.listPurchaseOrderItem(this.purchaseOrder.companyId, this.purchaseOrder.resaleId, this.purchaseOrder.id);
      // this.somaItem();
    }

  }
  //Close
  confirmClose() {
    this.confirmationService.confirm({
      header: 'Fechar pedido?',
      message: 'Por favor confirme para fechar.',
      accept: async () => {

      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Cancelado', detail: 'Você não fechou o pedido', icon: 'pi pi-times' });
      }
    });
  }


  //Delete
  async deletePart(item: PurchaseOrderItem) {
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
  print(id: number) {
    if (this.printComponent) {
      this.printComponent.print(id);
    } else {
      console.error('PrintPurchaseComponent não inicializado');
    }
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





  private async saveNewPu(pu: PurchaseOrder): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.purchaseOrderService.save(pu));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async saveUpdatePu(pu: PurchaseOrder): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.purchaseOrderService.update(pu));
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





  private async filterUserRoleId(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.userService.filterRoleId(id));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
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
  private async purchaseEdit(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.purchaseOrderService.filterId(id));
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
    /*     puItem.quantity = part.qtdAvailable;
        puItem.price = part.price;
        puItem.discount = part.discount;
     */
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
      return await lastValueFrom(this.purchaseOrderItemService.filterId(purchaseId));
    } catch (error) {
      return [];
    }
  }




}
