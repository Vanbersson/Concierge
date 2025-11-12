import { ChangeDetectorRef, Component, DoCheck, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
//PrimeNG
import { PrimeNGConfig } from 'primeng/api';
import { MenuItem, ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputGroupModule } from 'primeng/inputgroup';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StepsModule } from 'primeng/steps';

//Service
import { StorageService } from '../../../../services/storage/storage.service';
import { BudgetService } from '../../../../services/budget/budget.service';
import { TypePaymentService } from '../../../../services/payment/type-payment.service';
import { BusyService } from '../../../../components/loading/busy.service';
import { ClientecompanyService } from '../../../../services/clientecompany/clientecompany.service';
import { VehicleService } from '../../../../services/vehicle/vehicle.service';
import { EmailClientService } from '../../../../services/email/email-client.service';
//class
import { BudgetRequisition } from '../../../../models/budget/budget-requisition';
import { BudgetServiceItem } from '../../../../models/budget/budget-item-service';
import { BudgetItem } from '../../../../models/budget/budget-item';
import { lastValueFrom } from 'rxjs';
import { Budget } from '../../../../models/budget/budget';
import { Part } from '../../../../models/parts/Part';
import { HttpResponse } from '@angular/common/http';
import { ClientCompany } from '../../../../models/clientcompany/client-company';
//Component
import { FilterPartsComponent } from '../../../../components/filter.parts/filter.parts.component';
import { MessageResponse } from '../../../../models/message/message-response';
import { VehicleEntry } from '../../../../models/vehicle/vehicle-entry';
//Print
import { PrintBudgetComponent } from '../../../../components/print.budget/print.budget.component';
//Enum
import { StatusBudgetEnum } from '../../../../models/budget/status-budget-enum';
import { EmailClient } from '../../../../models/email/email-client';
import { ClientFisJurEnum } from '../../../../models/clientcompany/client-fisjur-enum';
import { BudgetToken } from '../../../../models/budget/budget-token';
import { TypePayment } from '../../../../models/payment/type-payment';

export enum StatusBudget {
  open = "Open",
  close = "Close"
}

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, PrintBudgetComponent, FilterPartsComponent, RouterModule, InputTextModule, ButtonModule, ReactiveFormsModule, FormsModule,
    InputIconModule, IconFieldModule, InputMaskModule, DialogModule, MultiSelectModule, ConfirmDialogModule,
    CalendarModule, InputTextareaModule, ProgressBarModule, ToastModule, InputGroupModule,
    InputNumberModule, TabViewModule, TableModule, DividerModule, StepsModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
  providers: [MessageService, ConfirmationService]
})
export default class BudgetComponent implements OnInit, OnDestroy, DoCheck {

  budget: Budget = new Budget();
  clientCompany: ClientCompany = new ClientCompany();
  vehicleEntry: VehicleEntry = new VehicleEntry();

  juridica: string = ClientFisJurEnum.juridica;

  vehicleId = signal<number>(0);
  listPayment: TypePayment[] = [];
  visibleBudget: boolean = false;
  itemsStatus: MenuItem[] | undefined;
  activeIndexStatus: number = 0;
  enabledSendMailButton = false;

  formBudget = new FormGroup({
    dateValidation: new FormControl<Date | null>(null),
    nameResponsible: new FormControl<string>(""),
    typePayment: new FormControl<TypePayment[]>([]),
    information: new FormControl<string>(""),
  });

  // Dialog Budget //
  limitUserDiscount = signal<number>(0);
  enabledOpenBudget = false;
  inputSendEmailId: string = "";

  //Aba Resume
  listBudgetRequisition: BudgetRequisition[] = [];
  formDiscount = new FormGroup({
    discountServPer: new FormControl(0),
    discountServVal: new FormControl(0),
    discountPartPer: new FormControl(0),
    discountPartVal: new FormControl(0)
  });

  //Aba Requisition
  requisition: BudgetRequisition;
  formBudgetRequisition = new FormGroup({
    description: new FormControl<string>('', Validators.required)
  });

  //Aba Service
  totalBudgetService = signal<number>(0);
  totalBudgetDiscountService = signal<number>(0);
  budgetServiceItem: BudgetServiceItem;
  listBudgetService: BudgetServiceItem[] = [];
  formBudgetService = new FormGroup<any>({
    description: new FormControl<string>('', Validators.required),
    hourService: new FormControl<number>(0.0, Validators.required),
    price: new FormControl<number>(0, Validators.required),
    discount: new FormControl<number>(0),
  });

  //Aba Parts
  totalBudgetParts = signal<number>(0);
  totalBudgetDiscountParts = signal<number>(0);
  selectPart = signal<Part>(new Part());
  listBudgetItem: BudgetItem[] = [];
  clonedPartItem: { [s: string]: BudgetItem } = {};

  budgetItem: BudgetItem;

  //Toas info percent discount
  visibleDiscount = false;
  toastProgressDiscount: number = 0;
  toastProgressTotal: number = 0;
  toastIntervalDiscount = null;
  toastTotal = signal<number>(0);
  toastDiscount = signal<number>(0);
  toastDesc = signal<string>("Serviço + Peças");
  private percentAletDiscount = 60;

  //Print
  @ViewChild("printComponent") printComponent!: PrintBudgetComponent;

  constructor(
    private primeNGConfig: PrimeNGConfig,
    private vehicleService: VehicleService,
    private storageService: StorageService,
    private budgetService: BudgetService,
    private serviceClienteCompany: ClientecompanyService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private busyService: BusyService,
    private emailClientService: EmailClientService,
    private typePaymentService: TypePaymentService
  ) {

  }

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

    try {

      this.vehicleId.set(Number.parseInt(this.activatedRoute.snapshot.params['vehicleid']));

      this.itemsStatus = [
        {
          label: 'Aberto',
        },
        {
          label: 'Concluído',
        },
        {
          label: 'Enviado',
        },
        {
          label: 'Aprovado',
        }
      ];

      this.init();

    } catch (error) {
      this.router.navigateByUrl("/portaria/lista-entrada-veiculo");
    }
  }
  ngOnDestroy(): void {
  }
  ngDoCheck(): void {
    if (this.selectPart().code != "") {
      this.savePart(this.selectPart());
      this.selectPart.set(new Part());
    }
  }

  private async init() {
    this.busyService.busy();

    //Budget
    const bugetResult = await this.getBudget();

    if (bugetResult.status == 200) {
      this.budget = bugetResult.body;
      //Type Payment
      this.listPayments();

      //Client
      const clientResult = await this.getClient(this.budget.clientCompanyId);
      if (clientResult.status == 200) {
        this.clientCompany = clientResult.body.data;

        //Emails de clientes
        var arr = [];
        if (this.clientCompany.emailHome)
          arr.push(this.clientCompany.emailHome);
        if (this.clientCompany.emailWork)
          arr.push(this.clientCompany.emailWork);
        if (this.clientCompany.contactEmail)
          arr.push(this.clientCompany.contactEmail);

        for (let i = 0; i < arr.length; i++) {
          if (i == 0) {
            this.inputSendEmailId = arr[i]
          } else {
            this.inputSendEmailId += ";" + arr[i]
          }
        }
      }

      //Vehicle
      const resultVehicle = await this.getVehicleEntry(this.budget.vehicleEntryId);
      if (resultVehicle.status == 200) {
        this.vehicleEntry = resultVehicle.body;
      }

      //Limit discount user 
      this.limitUserDiscount.set(this.storageService.limitDiscount);

      this.listBudgetRequisition = await this.getListBudgetRequisition();

      this.listBudgetService = await this.getListBudgetSetvice();
      this.somaBudgetService();

      this.listBudgetItem = await this.getListBudgetItem();
      this.somaBudgetItem();

      this.formBudget.patchValue({
        dateValidation: this.budget.dateValidation != "" ? new Date(this.budget.dateValidation) : null,
        nameResponsible: this.budget.nameResponsible,
        typePayment: this.budget.typePayment != "" ? [this.getPayment(this.budget.typePayment)] : [],
        information: this.budget.information,
      });

      if (this.budget.status == StatusBudgetEnum.OpenBudget) {
        this.enabledSendMailButton = false;
        this.activeIndexStatus = 0;
      } else if (this.budget.status == StatusBudgetEnum.CompleteBudget) {
        this.enabledSendMailButton = true;
        this.enabledOpenBudget = true;
        this.activeIndexStatus = 1;
      } else if (this.budget.status == StatusBudgetEnum.PendingApproval) {
        this.enabledSendMailButton = true;
        this.enabledOpenBudget = true;
        this.activeIndexStatus = 2;
      } else if (this.budget.status == StatusBudgetEnum.Approved) {
        this.enabledSendMailButton = false;
        this.enabledOpenBudget = true;
        this.activeIndexStatus = 3;
      }

      this.busyService.idle();
    } else {
      this.busyService.idle();
      this.router.navigateByUrl("/portaria/lista-entrada-veiculo");
    }
  }

  private listPayments() {
    this.typePaymentService.listAllEnabled().subscribe(data => {
      this.listPayment = data;
    });
  }
  private getPayment(desc: string): TypePayment {

    for (var pay of this.listPayment) {
      if (desc == pay.description) {
        return pay;
      }
    }
    return null;
  }
  maskCNPJ(cnpj: string): string {
    const CNPJ = cnpj.substring(0, 2) + "." + cnpj.substring(2, 5) + "." + cnpj.substring(5, 8) + "/" + cnpj.substring(8, 12) + "-" + cnpj.substring(12, 14);
    return CNPJ;
  }
  maskCPF(cpf: string): string {
    const CPF = cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-" + cpf.substring(9, 11);
    return CPF;
  }
  maskCellphone(dddCellphone: string, cellphone: string): string {
    if (cellphone.length != 9)
      return "";
    if (dddCellphone.length != 2)
      return "";
    var cellphone = "(" + dddCellphone + ") " + cellphone.substring(0, 1) + " " + cellphone.substring(1, 5) + "-" + cellphone.substring(5, 9);
    return cellphone;
  }
  maskPhone(dddPhone: string, phone: string): string {
    if (phone.length != 8)
      return "";
    if (dddPhone.length != 2)
      return "";
    var phone = "(" + dddPhone + ") " + phone.substring(0, 4) + "-" + phone.substring(4, 8);
    return phone;
  }
  maskZipCode(zipCode: string): string {
    if (zipCode == "") return "";
    return zipCode.substring(0, 5) + "-" + zipCode.substring(5, 8);
  }
  maskPlaca(placa: string): string {
    if (placa == "") return "";
    return placa.substring(0, 3) + "-" + placa.substring(3, 7);
  }
  private async getBudget(): Promise<HttpResponse<Budget>> {
    try {
      return await lastValueFrom(this.budgetService.getBudgetFilterVehicle(this.vehicleId()));
    } catch (error) {
      if (error.error.message == "Permission not informed.") {
        this.permissionNot();
      }

      return error;
    }
  }
  private async getClient(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.filterId(id));
    } catch (error) {
      return error;
    }
  }
  private async getVehicleEntry(id: number): Promise<HttpResponse<VehicleEntry>> {
    try {
      return await lastValueFrom(this.vehicleService.entryFilterId(id));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Vaículo não encontrado", icon: 'pi pi-times' });
      return error;
    }
  }
  showDialogBudget() {
    this.visibleBudget = true;
  }
  closeDialogBudget() {
    this.visibleBudget = false;
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
  checkFinalizeBudget(): boolean {
    const t1 = this.listBudgetRequisition.length;
    const t2 = this.listBudgetService.length;
    const t3 = this.listBudgetItem.length;

    if (t1 == 0) return false;

    if (t2 == 0 && t3 == 0) return false;

    return true;
  }
  confirmOpenBudget() {

    if (this.budget.status == StatusBudgetEnum.PendingApproval) {
      this.confirmationService.confirm({
        key: 'confirmOpenBudgetId',
        header: 'Abrir Orçamento?',
        message: 'Orçamento já enviado para aprovação.',
        accept: () => {
          this.openBudget();
        },
        reject: () => {

        }
      });
    } else if (this.budget.status == StatusBudgetEnum.Approved) {
      this.confirmationService.confirm({
        key: 'confirmOpenBudgetId',
        header: 'Abrir Orçamento?',
        message: 'Orçamento já aprovado.',
        accept: () => {
          this.openBudget();
        },
        reject: () => {

        }
      });
    } else {
      this.openBudget();
    }


  }
  async openBudget() {

    this.budget.status = StatusBudgetEnum.OpenBudget;
    const resultBudget = await this.openStatusBudget(this.budget);

    if (resultBudget.status == 200) {
      this.activeIndexStatus = 0;
      this.enabledSendMailButton = false;
      this.enabledOpenBudget = false;
      this.messageService.add({ severity: 'success', summary: 'Orçamento', detail: 'Aberto com sucesso', icon: 'pi pi-check' });
    }
  }
  async closeBudget() {
    if (!this.checkFinalizeBudget()) {
      this.messageService.add({ severity: 'info', summary: 'Atenção', detail: "Não a serviços ou peças lançada", icon: 'pi pi-info-circle' });
      return;
    }

    this.budget.status = StatusBudgetEnum.CompleteBudget;
    const resultBudget = await this.closeStatusBudget(this.budget);

    if (resultBudget.status == 200) {
      this.activeIndexStatus = 1;
      this.enabledSendMailButton = true;
      this.enabledOpenBudget = true;
      this.messageService.add({ severity: 'success', summary: 'Orçamento', detail: 'Finalizado com sucesso', icon: 'pi pi-check' });
    }
  }
  async saveBudget() {
    const { value } = this.formBudget;

    if (value.dateValidation != null) {
      if (!this.onChangeDateValidation(value.dateValidation)) {
        return;
      }
    }

    this.budget.dateValidation = value?.dateValidation == null ? "" : this.formatDateTime(value.dateValidation);
    this.budget.dateGeneration = this.formatDateTime(new Date(this.budget.dateGeneration));
    this.budget.nameResponsible = value.nameResponsible;
    this.budget.typePayment = value.typePayment.at(0)?.description ?? "";
    this.budget.information = value.information;

    const resultBudget = await this.updateBudget(this.budget);
    if (resultBudget.status == 200) {
      this.messageService.add({ severity: 'success', summary: 'Orçamento', detail: 'Atualizado com sucesso', icon: 'pi pi-check' });
    }
  }
  private async updateBudget(bud: Budget): Promise<HttpResponse<Budget>> {
    try {
      return await lastValueFrom(this.budgetService.updateBudget(bud));
    } catch (error) {
      const NAMERESPONSIBLE = "Name responsible not informed.";

      if (error.error.message == "Permission not informed.") {
        this.permissionNot();
      }
      if (error.error.message == NAMERESPONSIBLE) {
        this.messageService.add({ severity: 'error', summary: 'Responsavel', detail: "Não informado", icon: 'pi pi-times' });
      }
      return error;
    }
  }
  private async openStatusBudget(bud: Budget): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.budgetService.openStatusBudget(bud));
    } catch (error) {
      const NAMERESPONSIBLE = "Name responsible not informed.";

      if (error.error.message == "Permission not informed.") {
        this.permissionNot();
      }
      if (error.error.message == NAMERESPONSIBLE) {
        this.messageService.add({ severity: 'error', summary: 'Responsavel', detail: "Não informado", icon: 'pi pi-times' });
      }
      return error;
    }
  }
  private async closeStatusBudget(bud: Budget): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.budgetService.closeStatusBudget(bud));
    } catch (error) {
      const NAMERESPONSIBLE = "Name responsible not informed.";

      if (error.error.message == "Permission not informed.") {
        this.permissionNot();
      }
      if (error.error.message == NAMERESPONSIBLE) {
        this.messageService.add({ severity: 'error', summary: 'Responsavel', detail: "Não informado", icon: 'pi pi-times' });
      }
      return error;
    }
  }
  isPastDate(date: any): boolean {
    const today = new Date();
    const dateToCheck = new Date(date.year, date.month, date.day);

    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);

    return dateToCheck < today;
  }
  private verifyStatusBudget(): string {
    if (this.budget.status == StatusBudgetEnum.OpenBudget) {
      return StatusBudget.open;
    } else {
      return StatusBudget.close;
    }
  }

  //Resume
  private toastInfoDiscount(total: number, discount: number) {

    this.toastTotal.set(total);
    this.toastDiscount.set(discount);

    if (!this.visibleDiscount) {
      this.messageService.add({ key: 'toastInfoDiscount', sticky: true, severity: 'custom', summary: 'Você atingiu.' });
      this.visibleDiscount = true;
      this.toastProgressDiscount = 0;

      if (this.toastIntervalDiscount) {
        clearInterval(this.toastIntervalDiscount);
      }

      this.toastIntervalDiscount = setInterval(() => {
        if (this.toastProgressDiscount < this.toastProgressTotal) {
          this.toastProgressDiscount = this.toastProgressDiscount + 2;
        }

        if (this.toastProgressDiscount >= 100) {
          this.toastProgressDiscount = 100;
          clearInterval(this.toastIntervalDiscount);
        }

        this.cdr.markForCheck();
      }, 10);
    }
  }
  async addDiscountAllService() {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }
    const { value } = this.formDiscount;
    if (value.discountServPer == 0 && value.discountServVal == 0) return;

    var totalDiscount = this.totalBudgetDiscountService();
    var totalGeral = this.totalBudgetService();
    var totalLimit = 0;

    if (value.discountServPer > 0) {
      totalDiscount += (totalGeral * value.discountServPer) / 100;
    } else if (value.discountServVal > 0) {
      totalDiscount += value.discountServVal;
    }

    totalLimit = (totalGeral * this.storageService.limitDiscount) / 100;
    //Verifica se o desconto e válido
    if (totalDiscount > totalLimit) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
      return;
    }

    //Clean discount
    for (var service of this.listBudgetService) {
      service.discount = 0;
    }
    await this.calcDiscountService(totalDiscount, this.listBudgetService);

    this.toastProgressTotal = (totalDiscount * 100) / totalLimit;
    if (this.toastProgressTotal > this.percentAletDiscount) {
      this.toastDesc.set("em serviços");
      this.toastInfoDiscount(totalGeral, totalDiscount);
    }

  }
  async addDiscountAllPart() {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }
    const { value } = this.formDiscount;
    if (value.discountPartPer == 0 && value.discountPartVal == 0) return;

    var totalDiscount = this.totalBudgetDiscountParts();
    var totalGeral = this.totalBudgetParts();
    var totalLimit = 0;

    //Percentual
    if (value.discountPartPer > 0) {
      totalDiscount += (totalGeral * value.discountPartPer) / 100;
    } else if (value.discountPartVal > 0) {
      totalDiscount += value.discountPartVal;
    }

    totalLimit = (totalGeral * this.storageService.limitDiscount) / 100;
    //Verifica se o desconto e válido
    if (totalDiscount > totalLimit) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
      return;
    }

    //Clean discount
    for (var part of this.listBudgetItem) {
      part.discount = 0;
    }
    await this.calcDiscountPart(totalDiscount, this.listBudgetItem);

    this.toastProgressTotal = (totalDiscount * 100) / totalLimit;
    if (this.toastProgressTotal > this.percentAletDiscount) {
      this.toastDesc.set("em peças");
      this.toastInfoDiscount(totalGeral, totalDiscount);
    }
  }
  async calcDiscountService(valorTotal: number, itens: BudgetServiceItem[]) {

    var discountResto = valorTotal % itens.length;
    var discount = (valorTotal - discountResto) / itens.length;

    //Parts
    for (let index = 0; index < itens.length; index++) {
      var service = itens[index];

      if ((service.discount + discount) <= (service.price * service.hourService)) {
        service.discount += discount;
        valorTotal = (valorTotal - discount);
      }

      if ((service.discount + discountResto) <= (service.price * service.hourService)) {
        service.discount += discountResto;
        valorTotal = (valorTotal - discountResto);
        discountResto = 0;
      }

    }

    if (valorTotal > 0) {
      this.calcDiscountService(valorTotal, itens);
    } else {
      //Save parts
      for (var service of itens) {
        await this.updateService(service);
      }
      this.cleanFormDiscount();
      this.listBudgetService = await this.getListBudgetSetvice();
      this.somaBudgetService();
    }
  }
  async calcDiscountPart(valorTotal: number, itens: BudgetItem[]) {

    var discountResto = valorTotal % itens.length;
    var discount = (valorTotal - discountResto) / itens.length;

    //Parts
    for (let index = 0; index < itens.length; index++) {
      var part = itens[index];

      if ((part.discount + discount) <= (part.price * part.quantity)) {
        part.discount += discount;
        valorTotal = (valorTotal - discount);
      }

      if ((part.discount + discountResto) <= (part.price * part.quantity)) {
        part.discount += discountResto;
        valorTotal = (valorTotal - discountResto);
        discountResto = 0;
      }

    }

    if (valorTotal > 0) {
      this.calcDiscountPart(valorTotal, itens);
    } else {
      //Save parts
      for (var part of itens) {
        await this.updateBudgetItem(part);
      }
      this.cleanFormDiscount();
      this.listBudgetItem = await this.getListBudgetItem();
      this.somaBudgetItem();
    }
  }
  confirmDeleteDiscountService() {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }
    this.confirmationService.confirm({
      header: 'Remover Descontos?',
      message: 'Por favor confirme para remover.',
      accept: async () => {
        this.deleteAllDiscountService();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Você não removeu os descontos', icon: 'pi pi-info-circle' });
      }
    });
  }
  confirmDeleteDiscountPart() {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }

    this.confirmationService.confirm({
      header: 'Remover Descontos?',
      message: 'Por favor confirme para remover.',
      accept: async () => {
        this.deleteAllDiscountPart();
      },
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Cancelado', detail: 'Você não removeu os descontos', icon: 'pi pi-info-circle' });
      }
    });
  }
  deleteAllDiscountService() {
    if (this.totalBudgetDiscountService() > 0) {
      this.budgetService.deleteDiscountAllService(this.listBudgetService[0]).subscribe(async (data) => {
        if (data.status == 200) {
          this.listBudgetService = await this.getListBudgetSetvice();
          this.somaBudgetService();
          this.messageService.add({ severity: 'success', summary: 'Desconto em serviços', detail: 'Removido com sucesso', icon: 'pi pi-check' });
        }
      });
    }

    this.cleanFormDiscount();
  }
  deleteAllDiscountPart() {
    if (this.totalBudgetDiscountParts() > 0) {
      this.budgetService.deleteDiscountAllItem(this.listBudgetItem[0]).subscribe(async data => {
        this.listBudgetItem = await this.getListBudgetItem();
        this.somaBudgetItem();
        this.messageService.add({ severity: 'success', summary: 'Desconto em peças', detail: 'Removido com sucesso', icon: 'pi pi-check' });
      });
    }

    this.cleanFormDiscount();
  }
  private cleanFormDiscount() {
    this.formDiscount.patchValue({ discountServPer: 0, discountServVal: 0, discountPartPer: 0, discountPartVal: 0 });
  }
  onCloseAlertDiscount() {
    this.visibleDiscount = false;
  }

  //Requisition
  async getListBudgetRequisition(): Promise<BudgetRequisition[]> {
    try {
      return await lastValueFrom(this.budgetService.getBudgetRequisition(this.budget.id));
    } catch (error) {
      return [];
    }
  }
  saveBudgetRequisition() {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }

    const { value, valid } = this.formBudgetRequisition;

    if (valid && value.description!.toString().trim() != "") {
      this.requisition = new BudgetRequisition();
      this.requisition.companyId = this.storageService.companyId;
      this.requisition.resaleId = this.storageService.resaleId;
      this.requisition.budgetId = this.budget.id;
      this.requisition.ordem = this.getSizeListBudgetRequisition() + 1;
      this.requisition.description = value.description;

      this.budgetService.saveBudgetRequisition(this.requisition).subscribe(async (data) => {
        if (data.status == 201) {
          this.requisition = null;
          this.cleanBudgetRequisition();
          this.listBudgetRequisition = await this.getListBudgetRequisition();
          this.alertShowRequisition0();
        }
      }, (error) => {

      });
    } else {
      this.alertShowRequisition1();
    }

  }
  updateBudgetRequisition() {
    const { value, valid } = this.formBudgetRequisition;
    if (valid && value.description!.toString().trim() != "") {

      this.requisition.description = value.description;

      this.budgetService.updateBudgetRequisition$(this.requisition).subscribe(async (data) => {
        if (data.status == 200) {
          this.requisition = null;
          this.cleanBudgetRequisition();
          this.listBudgetRequisition = await this.getListBudgetRequisition();
          this.alertShowRequisition2();
        }
      }, (error) => {

      });
    } else {
      this.alertShowRequisition1();
    }
  }
  editarBudgetRequisition(req: BudgetRequisition) {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }

    this.requisition = req;
    this.formBudgetRequisition.patchValue({
      description: req.description
    });

  }
  async removerBudgetRequisition(req: BudgetRequisition) {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }

    if (this.listBudgetRequisition.length == 1) {
      if (this.listBudgetService.length != 0) {
        this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Existe serviços lançados', icon: 'pi pi-info-circle' });
        return;
      }

      if (this.listBudgetItem.length != 0) {
        this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Existe peças lançadas', icon: 'pi pi-info-circle' });
        return;
      }
    }

    const resultDelete = await this.deleteRequisition(req);
    if (resultDelete.status == 200) {
      this.listBudgetRequisition = await this.getListBudgetRequisition();
    }

  }
  private async deleteRequisition(req: BudgetRequisition): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.budgetService.deleteBudgetRequisition(req));
    } catch (error) {
      return error;
    }
  }
  private getSizeListBudgetRequisition(): number {
    return this.listBudgetRequisition.length;
  }
  cleanBudgetRequisition() {
    this.requisition = null;
    this.formBudgetRequisition.patchValue({
      description: ''
    });
  }
  //Service
  private async getListBudgetSetvice(): Promise<BudgetServiceItem[]> {
    try {
      return await lastValueFrom(this.budgetService.getBudgetService(this.budget.id));
    } catch (error) {
      return [];
    }
  }
  async saveBudgetService() {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }

    const { value } = this.formBudgetService;
    this.budgetServiceItem = new BudgetServiceItem();
    this.budgetServiceItem.companyId = this.storageService.companyId;
    this.budgetServiceItem.resaleId = this.storageService.resaleId;
    this.budgetServiceItem.budgetId = this.budget.id;
    this.budgetServiceItem.status = "Pending";

    this.budgetServiceItem.ordem = this.getSizeListBudgetService() + 1;
    this.budgetServiceItem.description = value.description;
    this.budgetServiceItem.hourService = value.hourService;
    this.budgetServiceItem.price = value.price;
    this.budgetServiceItem.discount = value.discount;

    const resultValid = this.validInputService();
    if (resultValid == false) {
      this.budgetServiceItem = null;
      return;
    }

    //Verifica se o desconto é permitido
    if (this.budgetServiceItem.discount > 0) {
      const resultDiscount = this.calcDiscountSaveService(this.budgetServiceItem);
      if (resultDiscount == false) return;
    }

    const resultService = await this.saveService(this.budgetServiceItem);
    if (resultService.status == 201) {
      this.alertShowService0();
      this.cleanBudgetService();
      this.listBudgetService = await this.getListBudgetSetvice();
      this.somaBudgetService();
    }

  }
  private async saveService(service: BudgetServiceItem): Promise<HttpResponse<BudgetServiceItem>> {
    try {
      return await lastValueFrom(this.budgetService.saveBudgetService(service));
    } catch (error) {
      return error;
    }
  }
  async updateBudgetService() {

    const resultValid = this.validInputService();
    if (resultValid == false) return;

    const { value } = this.formBudgetService;
    this.budgetServiceItem.description = value.description;
    this.budgetServiceItem.hourService = value.hourService;
    this.budgetServiceItem.price = value.price;
    this.budgetServiceItem.discount = value.discount;

    //Verifica se o desconto é permitido
    if (this.budgetServiceItem.discount > 0) {
      const resultDiscount = this.calcDiscountUpdateService(this.budgetServiceItem);
      if (resultDiscount == false) return;
    }

    const resultUpdate = await this.updateService(this.budgetServiceItem);
    if (resultUpdate.status == 200) {
      this.alertShowService1();
      this.listBudgetService = await this.getListBudgetSetvice();
      this.somaBudgetService();
      this.cleanBudgetService();
    }
  }
  private async updateService(service: BudgetServiceItem): Promise<HttpResponse<BudgetServiceItem>> {
    try {
      return await lastValueFrom(this.budgetService.updateBudgetService(service));
    } catch (error) {
      return error;
    }
  }
  async removerBudgetService(service: BudgetServiceItem) {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }

    const resultDiscount = this.calcDiscountDeleteService(service);
    if (resultDiscount == false) return;

    const resultService = await this.deleteService(service);
    if (resultService.status == 200) {
      this.listBudgetService = await this.getListBudgetSetvice();
      this.somaBudgetService();
    }
  }
  private async deleteService(service: BudgetServiceItem): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.budgetService.deleteBudgetService(service));
    } catch (error) {
      return error;
    }
  }
  calcDiscountSaveService(service: BudgetServiceItem): boolean {

    var tempTotal = service.price * service.hourService;
    var tempTotalDiscount = service.discount;

    for (var item of this.listBudgetService) {
      tempTotal += item.price * item.hourService;
      tempTotalDiscount += item.discount;
    }

    if (tempTotalDiscount == 0) return true;

    const totalLimit = (tempTotal * this.storageService.limitDiscount) / 100;

    if (tempTotalDiscount > totalLimit) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
      return false;
    }

    this.toastProgressTotal = (tempTotalDiscount * 100) / totalLimit;
    if (this.toastProgressTotal > this.percentAletDiscount) {
      this.toastDesc.set("em serviços");
      this.toastInfoDiscount(tempTotal, tempTotalDiscount);
    }
    return true;
  }
  calcDiscountUpdateService(service: BudgetServiceItem): boolean {
    var tempTotal = service.price * service.hourService;
    var tempTotalDiscount = service.discount;
    for (var item of this.listBudgetService) {
      if (item.id != service.id) {
        tempTotal += item.price * item.hourService;
        tempTotalDiscount += item.discount;
      }
    }
    if (tempTotalDiscount == 0) return true;

    const totalLimit = (tempTotal * this.storageService.limitDiscount) / 100;
    if (tempTotalDiscount > totalLimit) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
      return false;
    }

    this.toastProgressTotal = (tempTotalDiscount * 100) / totalLimit;
    if (this.toastProgressTotal > this.percentAletDiscount) {
      this.toastDesc.set("em serviços");
      this.toastInfoDiscount(tempTotal, tempTotalDiscount);
    }
    return true;
  }
  calcDiscountDeleteService(service: BudgetServiceItem): boolean {

    var tempTotal = 0;
    var tempTotalDiscount = 0;
    for (var item of this.listBudgetService) {
      if (item.id != service.id) {
        tempTotal += item.price * item.hourService;
        tempTotalDiscount += item.discount;
      }
    }

    if (tempTotalDiscount == 0) return true;

    const totalLimit = (tempTotal * this.storageService.limitDiscount) / 100;

    if (tempTotalDiscount > totalLimit) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
      return false;
    }

    this.toastProgressTotal = (tempTotalDiscount * 100) / totalLimit;
    if (this.toastProgressTotal > this.percentAletDiscount) {
      this.toastDesc.set("em serviços");
      this.toastInfoDiscount(tempTotal, tempTotalDiscount);
    }
    return true;
  }
  private validInputService(): boolean {

    const { value } = this.formBudgetService;
    if (this.listBudgetRequisition.length == 0) {
      this.alertShowRequisition1();
      return false;
    } else if (value.description == "") {
      this.messageService.add({ severity: 'error', summary: 'Descrição', detail: 'Não informado', icon: 'pi pi-times' });
      return false;
    } else if (value.hourService <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Tempo Serviço', detail: 'Não informado', icon: 'pi pi-times' });
      return false;
    } else if (value.price <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Valor Hora', detail: 'Não informado', icon: 'pi pi-times' });
      return false;
    } else if (value.discount < 0) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Valor não permitido', icon: 'pi pi-times' });
      return false;
    } else if (value.discount > (value.price * value.hourService)) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o valor do serviço', icon: 'pi pi-times' });
      return false;
    }
    return true;
  }
  editarBudgetService(service: BudgetServiceItem) {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }
    this.budgetServiceItem = service;
    this.formBudgetService.patchValue({
      description: service.description,
      hourService: service.hourService,
      price: service.price,
      discount: service.discount
    });
  }
  getSizeListBudgetService(): number {
    return this.listBudgetService.length;
  }
  cleanBudgetService() {
    this.formBudgetService.patchValue({
      description: "",
      hourService: 0,
      price: 0,
      discount: 0
    });
    this.budgetServiceItem = null;
  }
  private somaBudgetService() {
    this.totalBudgetService.set(0);
    this.totalBudgetDiscountService.set(0);

    var totalTemp = 0;
    var totalDescontoTemp = 0;

    for (let index = 0; index < this.listBudgetService.length; index++) {
      const element = this.listBudgetService[index];
      totalTemp += (element.hourService! * element.price!);
      totalDescontoTemp += element.discount;

    }

    this.totalBudgetService.set(totalTemp);
    this.totalBudgetDiscountService.set(totalDescontoTemp);
  }

  //Parts
  private async getListBudgetItem(): Promise<BudgetItem[]> {
    try {
      return await lastValueFrom(this.budgetService.getBudgetItem(this.budget.id));
    } catch (error) {
      return [];
    }
  }
  private somaBudgetItem() {
    this.totalBudgetParts.set(0);
    var tempTotalParts = 0;
    this.totalBudgetDiscountParts.set(0);
    var tempTotalDiscount = 0;

    for (let index = 0; index < this.listBudgetItem.length; index++) {
      const element = this.listBudgetItem[index];
      tempTotalParts += element.quantity * element.price;
      tempTotalDiscount += element.discount;
    }
    this.totalBudgetParts.set(tempTotalParts);
    this.totalBudgetDiscountParts.set(tempTotalDiscount);
  }
  validSavePart(p: Part): boolean {
    if (this.listBudgetRequisition.length == 0) {
      this.alertShowRequisition1();
      return false;
    }
    if (p.description.trim() == "") {
      this.messageService.add({ severity: 'error', summary: 'Peças', detail: 'Descrição não informada', icon: 'pi pi-times' });
      return false;
    }
    if (p.qtdAvailable <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Peças', detail: 'Quantidade inválida', icon: 'pi pi-times' });
      return false;
    }
    if (p.price <= 0) {
      this.messageService.add({ severity: 'error', summary: 'Peças', detail: 'Preço não informado', icon: 'pi pi-times' });
      return false;
    }
    if (p.discount < 0) {
      this.messageService.add({ severity: 'error', summary: 'Peças', detail: 'Desconto inválido', icon: 'pi pi-times' });
      return false;
    }
    if (p.discount > (p.price * p.qtdAvailable)) {
      this.messageService.add({ severity: 'error', summary: 'Peças', detail: 'Desconto inválido', icon: 'pi pi-times' });
      return false;
    }

    return true;
  }
  public async savePart(p: Part) {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }

    if (this.validSavePart(p)) {
      var budgetItem: BudgetItem = new BudgetItem();
      budgetItem.companyId = p.companyId;
      budgetItem.resaleId = p.resaleId;
      budgetItem.partId = p.id;
      budgetItem.budgetId = this.budget.id;
      budgetItem.status = "Pending";
      budgetItem.ordem = this.listBudgetItem.length + 1;
      budgetItem.code = p.code;
      budgetItem.description = p.description;
      budgetItem.quantity = p.qtdAvailable;
      budgetItem.discount = p.discount;
      budgetItem.price = p.price;

      if (budgetItem.discount > 0) {
        const resultDiscount = this.calcDiscountSaveParts(budgetItem);
        if (resultDiscount) {
          const resultItem = await this.saveBudgetItem(budgetItem);
          if (resultItem.status == 201) {
            this.listBudgetItem = await this.getListBudgetItem();
            this.somaBudgetItem();
          }
        }
      } else {
        const resultItem = await this.saveBudgetItem(budgetItem);
        if (resultItem.status == 201) {
          this.listBudgetItem = await this.getListBudgetItem();
          this.somaBudgetItem();
        }
      }
    }

  }
  private async saveBudgetItem(item: BudgetItem): Promise<HttpResponse<BudgetItem>> {
    try {
      return await lastValueFrom(this.budgetService.saveBudgetItem(item));
    } catch (error) {
      return error;
    }
  }
  calcDiscountSaveParts(part: BudgetItem): boolean {

    var tempTotal = part.price * part.quantity;
    var tempTotalDiscount = part.discount;
    for (var item of this.listBudgetItem) {
      tempTotal += item.price * item.quantity;
      tempTotalDiscount += item.discount;
    }

    if (tempTotalDiscount == 0) return true;

    const totalLimit = (tempTotal * this.storageService.limitDiscount) / 100;

    if (tempTotalDiscount > totalLimit) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
      return false;
    }

    this.toastProgressTotal = (tempTotalDiscount * 100) / totalLimit;
    if (this.toastProgressTotal > this.percentAletDiscount) {
      this.toastDesc.set("em peças");
      this.toastInfoDiscount(tempTotal, tempTotalDiscount);
    }
    return true;
  }
  calcDiscountUpdateParts(part: BudgetItem): boolean {

    if (part.discount > (part.price * part.quantity)) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o valor da peça', icon: 'pi pi-times' });
      return false;
    }

    var tempTotal = part.price * part.quantity;
    var tempTotalDiscount = part.discount;

    for (var item of this.listBudgetItem) {
      if (item.id != part.id) {
        tempTotal += item.price * item.quantity;
        tempTotalDiscount += item.discount;
      }
    }

    if (tempTotalDiscount == 0) return true;

    const totalLimit = (tempTotal * this.storageService.limitDiscount) / 100;

    if (tempTotalDiscount > totalLimit) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
      return false;
    }

    this.toastProgressTotal = (tempTotalDiscount * 100) / totalLimit;
    if (this.toastProgressTotal > this.percentAletDiscount) {
      this.toastDesc.set("em peças");
      this.toastInfoDiscount(tempTotal, tempTotalDiscount);
    }
    return true;
  }
  calcDiscountDeleteParts(part: BudgetItem): boolean {
    var tempTotal = 0;
    var tempTotalDiscount = 0;
    for (var item of this.listBudgetItem) {
      if (item.id != part.id) {
        tempTotal += item.price * item.quantity;
        tempTotalDiscount += item.discount;
      }
    }

    if (tempTotalDiscount == 0) return true;

    const totalLimit = (tempTotal * this.storageService.limitDiscount) / 100;

    if (tempTotalDiscount > totalLimit) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
      return false;
    }

    this.toastProgressTotal = (tempTotalDiscount * 100) / totalLimit;
    if (this.toastProgressTotal > this.percentAletDiscount) {
      this.toastDesc.set("em peças");
      this.toastInfoDiscount(tempTotal, tempTotalDiscount);
    }
    return true;
  }
  private async updateBudgetItem(item: BudgetItem): Promise<HttpResponse<BudgetItem>> {
    try {
      return await lastValueFrom(this.budgetService.updateBudgetItem(item));
    } catch (error) {
      return error;
    }
  }
  async deleteBudgetItem(item: BudgetItem) {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }

    const resultDiscount = this.calcDiscountDeleteParts(item);

    if (resultDiscount) {
      const resultItem = await this.deleteItem(item);
      if (resultItem.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Peças', detail: 'Removido com sucesso', icon: 'pi pi-check' });
        this.listBudgetItem = await this.getListBudgetItem();
        this.somaBudgetItem();
      }
    }
  }
  private async deleteItem(item: BudgetItem): Promise<HttpResponse<BudgetItem>> {
    try {
      return await lastValueFrom(this.budgetService.deleteBudgetItem(item))
    } catch (error) {
      return error;
    }
  }
  onRowEditInit(item: BudgetItem) {
    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      return;
    }
    this.clonedPartItem[item.id as string] = { ...item };
  }
  async onRowEditSave(item: BudgetItem, index: number) {

    if (this.verifyStatusBudget() == StatusBudget.close) {
      this.infoCloseBudget();
      this.onRowEditCancel(item, index);
      return;
    }

    const resultDiscount = this.calcDiscountUpdateParts(item);

    if (resultDiscount) {
      const resultUpdate = await this.updateBudgetItem(item);
      if (resultUpdate.status == 200) {
        delete this.clonedPartItem[item.id as string];
        this.listBudgetItem = await this.getListBudgetItem();
        this.somaBudgetItem();
      }
    } else {
      this.onRowEditCancel(item, index);
    }

  }
  onRowEditCancel(item: BudgetItem, index: number) {
    this.listBudgetItem[index] = this.clonedPartItem[item.id as string];
    delete this.clonedPartItem[item.id as string];
  }
  onChangeDateValidation(date: any): boolean {
    const dtNow: Date = new Date();
    dtNow.setHours(0, 0, 0, 0);

    if (date < dtNow) {
      this.formBudget.patchValue({ dateValidation: null });
      this.messageService.add({ severity: 'info', summary: 'Data de Validade', detail: 'Menor que data atual.', icon: 'pi pi-info-circle' });
      return false;
    }
    return true;
  }

  //Print Budget
  print() {
    try {
      this.printComponent.print(this.budget, this.listBudgetRequisition, this.listBudgetService, this.listBudgetItem, this.clientCompany, this.vehicleEntry);
    } catch (error) {
      console.log(error)
    }
  }

  private validSendEmail(): boolean {

    //Date validation
    var dtvalid = new Date(this.budget.dateValidation);
    dtvalid.setHours(0, 0, 0, 0);
    if (this.budget.dateValidation == "") {
      this.messageService.add({ severity: 'info', summary: 'Data de Validade', detail: 'Não informado.', icon: 'pi pi-info-circle' });
      return false;
    }

    if (this.budget.typePayment == "") {
      this.messageService.add({ severity: 'info', summary: 'Form. Pagamento', detail: 'Não informado.', icon: 'pi pi-info-circle' });
      return false;
    }

    return true;
  }
  //Send Email
  confirmSendEmail() {
    if (!this.validSendEmail()) {
      return;
    }
    this.confirmationService.confirm({
      key: 'confirmEmailId',
      header: 'Enviar orçamento?',
      message: 'Por favor confirme para enviar.',
      accept: () => {
        this.sendEmailClients();
      }
    });
  }
  private async tokenBudget(): Promise<string> {
    var token: string = "";

    var budgetToken: BudgetToken = new BudgetToken();
    budgetToken.companyId = this.storageService.companyId;
    budgetToken.resaleId = this.storageService.resaleId;
    budgetToken.budgetId = this.budget.id;

    if (this.budget.status == StatusBudgetEnum.CompleteBudget) {

      budgetToken.dateValid = this.budget.dateValidation;
      const resultToken = await this.tokenNew(budgetToken);
      if (resultToken.status == 201) {
        token = resultToken.body.id;
      }
    } else {
      const resultToken = await this.tokenFilter(budgetToken);
      if (resultToken.status == 200) {
        token = resultToken.body.id;
      }
    }
    return token;
  }
  async sendEmailClients() {

    this.busyService.busy();
    var token = "?token=";

    const restultTo = await this.tokenBudget();
    if (restultTo == "") {
      this.busyService.idle();
      return;
    } else {
      token += restultTo;
    }

    var emails: EmailClient = new EmailClient();
    emails.from = this.storageService.email;
    emails.to = this.inputSendEmailId.split(";");
    emails.subject = "Orçamento " + this.budget.id + " - Nativa Librelato";
    emails.body = `
      <!DOCTYPE html>
    <html lang="pt-BR">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Orçamento</title>
    </head>

    <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" bgcolor="#f8f8f8"
        style="
        height: 100% !important; 
        width: 100% !important; 
        align-content: center; 
        justify-items: center; 
        -webkit-font-smoothing: antialiased !important; 
        -moz-osx-font-smoothing: grayscale !important;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%; 
        color: #444444; 
        font-family: -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto, arial, sans-serif; 
        font-weight: normal; padding: 0; margin: 0; Margin: 0;
        font-size: 14px; mso-line-height-rule: exactly; line-height: 140%; background-color: #f8f8f8; text-align: center;">


        <table cellSpacing="24">
            <tr>
                <td><span style="font-size: 24px; color: #4b5563; font-weight: 700;">Olá, Cliente</span></td>
            </tr>
            <tr>
                <td>
                    Seu orçamento já esta pronto
                </td>
            </tr>
            <tr>
                <td>
                    Agora você pode aprovar seu orçamento, basta clicar no botão abaixo
                </td>
            </tr>
            <tr style="padding: 0; margin: 0;">
                <td align="center" border="1" style="
                    -ms-word-break: break-word;
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%; 
                    padding: 20px 0px 20px 0px;
                    background-color: #0d6efd;">

                    <a style="                      
                    -ms-text-size-adjust: 100%;
                    -webkit-text-size-adjust: 100%; 
                    -ms-word-break: break-word;
                    padding: 20px 150px 20px 150px;
                    text-align: center;
                    margin: 0;
                    cursor: pointer;
                    color: #fff;
                    font-size: 16px;
                    font-weight: 500; 
                    text-decoration: none;" href="`+ environment.site + `/orcamento/aprovacao` + token + `" target="_blank">
                        VER ORÇAMENTO
                    </a>
                </td>
            </tr>
            <tr>
                <td>
                    A Nativa Máquina agradece, pela sua confiança
                </td>
            </tr>
        </table>

    </body>

    </html>
    `;

    const resultSend = await this.sendEmail(emails);
    this.busyService.idle();
    if (resultSend.status == 200) {
      this.messageService.add({ severity: 'success', summary: 'Email', detail: 'enviado com sucesso', icon: 'pi pi-check' });

      this.budget.status = StatusBudgetEnum.PendingApproval;
      this.activeIndexStatus = 2;
      this.statusUpdateBudget(this.budget);
    } else {
      this.messageService.add({ severity: 'error', summary: 'Email', detail: "Erro no envio dos emails", icon: 'pi pi-times' });
    }

  }
  private async statusUpdateBudget(bud: Budget): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.budgetService.statusUpdateBudget(bud));
    } catch (error) {
      return error;
    }
  }
  private async sendEmail(emails: EmailClient): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.emailClientService.sendEmail(emails));
    } catch (error) {
      return error;
    }
  }
  private async tokenNew(budgetToken: BudgetToken): Promise<HttpResponse<BudgetToken>> {
    try {
      return await lastValueFrom(this.budgetService.tokenNew(budgetToken));
    } catch (error) {
      return error;
    }
  }
  private async tokenFilter(budgetToken: BudgetToken): Promise<HttpResponse<BudgetToken>> {
    try {
      return await lastValueFrom(this.budgetService.tokenFilter(budgetToken));
    } catch (error) {
      return error;
    }
  }

  alertShowRequisition0() {
    this.messageService.add({ severity: 'success', summary: 'Solicitação', detail: 'Adicionada com sucesso', icon: 'pi pi-plus' });
  }
  alertShowRequisition1() {
    this.messageService.add({ severity: 'info', summary: 'Atenção', detail: 'Não a solicitação' });
  }
  alertShowRequisition2() {
    this.messageService.add({ severity: 'success', summary: 'Solicitação', detail: 'Atualizada com sucesso', icon: 'pi pi-check' });
  }
  alertShowRequisition3() {
    this.messageService.add({ severity: 'info', summary: 'Solicitação', detail: 'Não pode ser removida' });
  }
  alertShowService0() {
    this.messageService.add({ severity: 'success', summary: 'Serviço', detail: 'Adicionado com sucesso', icon: 'pi pi-plus' });
  }
  alertShowService1() {
    this.messageService.add({ severity: 'success', summary: 'Serviço', detail: 'Atualizado com sucesso', icon: 'pi pi-check' });
  }

  //Permission Not
  private permissionNot() {
    this.messageService.add({ severity: 'error', summary: 'Permissão', detail: "Você não tem permissão", icon: 'pi pi-times' });
  }

  private infoCloseBudget() {
    this.messageService.add({ severity: 'info', summary: 'Atenção', detail: "Orçamento concluído", icon: 'pi pi-info-circle' });
  }


}
