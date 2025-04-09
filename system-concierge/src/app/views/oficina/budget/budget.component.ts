import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
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


//Service
import { StorageService } from '../../../services/storage/storage.service';
import { BudgetService } from '../../../services/budget/budget.service';
import { UserService } from '../../../services/user/user.service';

//class
import { BudgetRequisition } from '../../../models/budget/budget-requisition';
import { BudgetServiceItem } from '../../../models/budget/budget-item-service';
import { BudgetItem } from '../../../models/budget/budget-item';
import { lastValueFrom } from 'rxjs';
import { Budget } from '../../../models/budget/budget';
import { ClientecompanyService } from '../../../services/clientecompany/clientecompany.service';
import { PartsService } from '../../../services/parts/parts.service';
import { Part } from '../../../models/parts/Part';
import { HttpResponse } from '@angular/common/http';
import { ClientCompany } from '../../../models/clientcompany/client-company';
import { User } from '../../../models/user/user';
import { BusyService } from '../../../components/loading/busy.service';

export interface IPayment {
  payment: string,
}

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, RouterModule, InputTextModule, ButtonModule, ReactiveFormsModule, InputIconModule, IconFieldModule, InputMaskModule, DialogModule, MultiSelectModule, CalendarModule, InputTextareaModule, ProgressBarModule, ToastModule, InputGroupModule, InputNumberModule, TabViewModule, TableModule, DividerModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.scss',
  providers: [MessageService]
})
export default class BudgetComponent implements OnInit, OnDestroy {

  private budget: Budget;
  vehicleId = signal<number>(0);

  listPayment: IPayment[] = [];

  visibleBudget: boolean = false;
  requisition: BudgetRequisition;
  budgetServiceItem: BudgetServiceItem;
  budgetItem: BudgetItem;

  listBudgetRequisition: BudgetRequisition[] = [];
  listBudgetService: BudgetServiceItem[] = [];

  totalBudgetService = signal<number>(0);
  totalBudgetParts = signal<number>(0);
  totalBudgetDiscountService = signal<number>(0);
  totalBudgetDiscountParts = signal<number>(0);
  limitUserDiscount = signal<number>(0);

  visibleDiscount = false;
  progressDiscount: number = 0;
  progressTotal: number = 0;
  intervalDiscount = null;
  private percentAletDiscount = 60;

  formBudget = new FormGroup({
    dateValidation: new FormControl<Date | null>(null),
    nameResponsible: new FormControl<string>(""),
    typePayment: new FormControl<IPayment[]>([]),
    information: new FormControl<string>(""),
  });

  formBudgetRequisition = new FormGroup({
    id: new FormControl<string>(''),
    budgetId: new FormControl<number>(0),
    ordem: new FormControl<number>(0),
    description: new FormControl<string>('', Validators.required),
  });

  formBudgetService = new FormGroup<any>({
    description: new FormControl<string>('', Validators.required),
    hourService: new FormControl<number>(0.0, Validators.required),
    price: new FormControl<number>(0, Validators.required),
    discount: new FormControl<number>(0),
  });

  formDiscount = new FormGroup({
    servPer: new FormControl(0),
    servVal: new FormControl(0),
    itemPer: new FormControl(0),
    itemVal: new FormControl(0),
  });

  viewBudgetId = signal<number>(0);
  viewBudgetDateGeneration = signal<Date | null>(null);

  viewClientName = signal<string>("");
  viewClientCnpj = signal<string>("");
  viewClientCpf = signal<string>("");
  viewClientPhone = signal<string>("");

  viewAttendantName = signal<string>("");

  viewClientZipCode = signal<string>("");
  viewClientState = signal<string>("");
  viewClientCity = signal<string>("");
  viewClientNeighborhood = signal<string>("");
  viewClientAddress = signal<string>("");
  viewClientAddressNumber = signal<string>("");
  viewClientAddressComplement = signal<string>("");

  viewClientContactName = signal<string>("");
  viewClientContactEmail = signal<string>("");
  viewClientContactCellphone = signal<string>("");
  viewClientContactPhone = signal<string>("");

  viewClientPlaca = signal<string>("");
  viewClientFrota = signal<string>("");
  viewClientModelDescription = signal<string>("");
  viewClientColor = signal<string>("");
  viewClientKmEntry = signal<string>("");

  //Parts
  visibleParts: boolean = false;

  partsDisabledButton = true;
  listParts: Part[] = [];

  listBudgetItem: BudgetItem[] = [];

  selectedParts!: Part;
  formParts = new FormGroup({
    filterCode: new FormControl(''),
    filterDesc: new FormControl(''),
    selecDesc: new FormControl(''),
    selecPrice: new FormControl<number>(0),
    selecDiscount: new FormControl<number>(0),
    selecQtdAvailable: new FormControl<number>(0)
  });


  constructor(
    private userService: UserService,
    private partsService: PartsService,
    private storageService: StorageService,
    private budgetService: BudgetService,
    private serviceClienteCompany: ClientecompanyService,
    private router: Router,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private busyService: BusyService) {
    this.budgetServiceItem = new BudgetServiceItem();
    this.vehicleId.set(Number.parseInt(this.activatedRoute.snapshot.params['vehicleid']));
  }
  ngOnInit(): void {

    this.listPayment = [
      { payment: 'A Vista' },
      { payment: 'Faturado' },
      { payment: 'Cartão Debito' },
      { payment: 'Cartão Credito' },
      { payment: 'Pix' },
    ];

    this.init();

    this.PartsDisable();
  }
  ngOnDestroy(): void {

  }
  private async init() {
    this.busyService.busy();

    //Budget
    const bugetResult = await this.getBudget();

    if (bugetResult.status == 200) {

      //Client
      const clientResult = await this.getClient(bugetResult.body.clientCompanyId);
      if (clientResult.status == 200) {
        const client = clientResult.body;

        this.viewClientName.set(client.name);
        if (client.fisjur == "Juridica") {
          const CNPJ = client.cnpj.substring(0, 2) + "." + client.cnpj.substring(2, 5) + "." + client.cnpj.substring(5, 8) + "/" + client.cnpj.substring(8, 12) + "-" + client.cnpj.substring(12, 14);
          this.viewClientCnpj.set(CNPJ);
        }
        if (client.fisjur == "Fisica") {
          const CPF = client.cpf.substring(0, 3) + "." + client.cpf.substring(3, 6) + "." + client.cpf.substring(6, 9) + "-" + client.cpf.substring(9, 11);
          this.viewClientCpf.set(CPF);
        }
        if (client.dddPhone != "") {
          this.viewClientPhone.set("(" + client.dddPhone + ") " + client.phone);
        }
        this.viewClientZipCode.set(client.zipCode.substring(0, 5) + "-" + client.zipCode.substring(5, 8));
        this.viewClientState.set(client.state);
        this.viewClientCity.set(client.city);
        this.viewClientNeighborhood.set(client.neighborhood);
        this.viewClientAddress.set(client.address);
        this.viewClientAddressNumber.set(client.addressNumber);
        this.viewClientAddressComplement.set(client.addressComplement);
        this.viewClientContactName.set(client.contactName);
        this.viewClientContactEmail.set(client.contactEmail);
        if (client.contactCellphone != "") {
          this.viewClientContactCellphone.set(this.maskCellphone(client.contactDDDCellphone, client.contactCellphone));
        }
        if (client.contactPhone != "") {
          this.viewClientContactPhone.set(this.maskPhone(client.contactDDDPhone, client.contactPhone));
        }
      }

      //User
      this.limitUserDiscount.set(this.storageService.limitDiscount);

      //Attendant
      const userResult = await this.getAttendant(bugetResult.body.idUserAttendant);
      if (userResult.status == 200) {
        this.viewAttendantName.set(userResult.body.name);
      }

      this.budget = bugetResult.body;

      this.viewBudgetId.set(bugetResult.body.id);
      this.viewBudgetDateGeneration.set(new Date(bugetResult.body.dateGeneration));
      if (bugetResult.body.placa) {
        this.viewClientPlaca.set(bugetResult.body.placa.substring(0, 3) + "-" + bugetResult.body.placa.substring(3, 7));
      }

      this.viewClientFrota.set(bugetResult.body.frota);
      this.viewClientModelDescription.set(bugetResult.body.modelDescription);
      this.viewClientColor.set(bugetResult.body.color);
      this.viewClientKmEntry.set(bugetResult.body.kmEntry);

      this.getListBudgetRequisition();
      this.getListBudgetSetvice();
      this.getListBudgetItem();

      this.formBudget.patchValue({
        dateValidation: bugetResult.body.dateValidation != "" ? new Date(bugetResult.body.dateValidation) : null,
        nameResponsible: bugetResult.body.nameResponsible,
        typePayment: bugetResult.body.typePayment != "" ? [{ payment: bugetResult.body.typePayment }] : [],
        information: bugetResult.body.information,
      });

    } else {
      setTimeout(() => {
        this.router.navigateByUrl("/portaria/lista-entrada-veiculo");
      }, 3000);

    }
    this.busyService.idle();

  }
  private async getBudget(): Promise<HttpResponse<Budget>> {
    try {
      return await lastValueFrom(this.budgetService.getBudgetFilterVehicle$(this.vehicleId()));
    } catch (error) {
      if (error.error.message == "Permission not informed.") {
        this.permissionNot();
      }

      return error;
    }
  }
  private async getClient(id: number): Promise<HttpResponse<ClientCompany>> {
    try {
      return await lastValueFrom(this.serviceClienteCompany.getId$(id));
    } catch (error) {
      return error;
    }
  }
  private async getAttendant(id: number): Promise<HttpResponse<User>> {
    try {
      return await lastValueFrom(this.userService.getUserFilterId(id));
    } catch (error) {
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
  saveBudget() {

    const { value } = this.formBudget;

    this.budget.dateValidation = value?.dateValidation == null ? "" : this.formatDateTime(value.dateValidation);
    this.budget.dateGeneration = this.formatDateTime(new Date(this.budget.dateGeneration));
    this.budget.nameResponsible = value.nameResponsible;
    this.budget.typePayment = value.typePayment.at(0)?.payment ?? "";
    this.budget.information = value.information;


    this.budgetService.updateBudget$(this.budget).subscribe(data => {
      if (data.status == 200) {
        this.messageService.add({ severity: 'success', summary: 'Orçamento', detail: 'Atualizado com sucesso', icon: 'pi pi-check' });
      }

    }, error => {

      const DATEVALIDATION = "Date validation not informed.";
      const NAMERESPONSIBLE = "Name responsible not informed.";

      if (error.error.message == "Permission not informed.") {
        this.permissionNot();
      }
      if (error.status == 401) {

        if (error.error.message == DATEVALIDATION) {
          this.messageService.add({ severity: 'error', summary: 'Data Validade', detail: "Não informado", icon: 'pi pi-times' });
        }
        if (error.error.message == NAMERESPONSIBLE) {
          this.messageService.add({ severity: 'error', summary: 'Responsavel', detail: "Não informado", icon: 'pi pi-times' });
        }

      }

    });
  }
  private maskCellphone(dddCellphone: string, cellphone: string): string {
    if (cellphone.length != 9)
      return "";
    if (dddCellphone.length != 2)
      return "";
    var cellphone = "(" + dddCellphone + ") " + cellphone.substring(0, 1) + " " + cellphone.substring(1, 5) + "-" + cellphone.substring(5, 9);
    return cellphone;
  }
  private maskPhone(dddPhone: string, phone: string): string {
    if (phone.length != 8)
      return "";
    if (dddPhone.length != 2)
      return "";
    var phone = "(" + dddPhone + ") " + phone.substring(0, 4) + "-" + phone.substring(4, 8);
    return phone;
  }
  getListBudgetRequisition() {
    this.budgetService.getBudgetRequisition$(this.budget.id).subscribe((data) => {
      this.listBudgetRequisition = data;
    });
  }

  saveBudgetRequisition() {

    const { value, valid } = this.formBudgetRequisition;

    if (valid && value.description!.toString().trim() != "") {
      this.requisition = new BudgetRequisition();
      this.requisition.companyId = this.storageService.companyId;
      this.requisition.resaleId = this.storageService.resaleId;
      this.requisition.budgetId = this.budget.id;
      this.requisition.ordem = this.getSizeListBudgetRequisition() + 1;
      this.requisition.description = value.description;

      this.budgetService.saveBudgetRequisition$(this.requisition).subscribe((data) => {
        if (data.status == 201) {
          this.cleanBudgetRequisition();
          this.getListBudgetRequisition();
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
      this.requisition = new BudgetRequisition();
      this.requisition.companyId = this.storageService.companyId;
      this.requisition.resaleId = this.storageService.resaleId;
      this.requisition.id = value.id;
      this.requisition.budgetId = this.budget.id;
      this.requisition.ordem = value.ordem;
      this.requisition.description = value.description;

      this.budgetService.updateBudgetRequisition$(this.requisition).subscribe((data) => {
        if (data.status == 200) {
          this.cleanBudgetRequisition();
          this.getListBudgetRequisition();
          this.alertShowRequisition2();
        }
      }, (error) => {

      });
    } else {
      this.alertShowRequisition1();
    }
  }

  editarBudgetRequisition(req: BudgetRequisition) {

    this.formBudgetRequisition.patchValue({
      id: req.id,
      budgetId: req.budgetId,
      ordem: req.ordem,
      description: req.description
    });

  }

  removerBudgetRequisition(ordem: number) {

    if (this.listBudgetRequisition.length > 1) {
      var listTemp: BudgetRequisition[] = [];
      for (let index = 0; index < this.listBudgetRequisition.length; index++) {
        const item = this.listBudgetRequisition[index];

        if (ordem == item.ordem) {

          this.requisition = new BudgetRequisition();
          this.requisition.companyId = item.companyId;
          this.requisition.resaleId = item.resaleId;
          this.requisition.id = item.id;
          this.requisition.budgetId = item.budgetId;
          this.requisition.ordem = item.ordem;
          this.requisition.description = item.description;

          this.budgetService.deleteBudgetRequisition$(this.requisition).subscribe();
          this.cleanBudgetRequisition();

        } else {
          listTemp.push(item);
        }

      }
      this.listBudgetRequisition = [];

      for (let index = 0; index < listTemp.length; index++) {
        const item = listTemp[index];
        item.ordem = index + 1;
        this.budgetService.updateBudgetRequisition$(item).subscribe((data) => {
          if (data.status == 200 && (index == (listTemp.length - 1))) {
            this.getListBudgetRequisition();
          }
        });
      }
    } else {
      this.alertShowRequisition3();
    }

  }

  private getSizeListBudgetRequisition(): number {
    return this.listBudgetRequisition.length;
  }

  cleanBudgetRequisition() {
    this.formBudgetRequisition.patchValue({
      id: '',
      budgetId: 0,
      ordem: 0,
      description: ''
    });
  }

  //Service

  private async getListBudgetSetvice(): Promise<boolean> {
    try {
      var data = await lastValueFrom(this.budgetService.getBudgetService$(this.budget.id));

      this.listBudgetService = data;
      this.somaService();
      return true;
    } catch (error) {
      this.getListBudgetSetvice();
    }
    return false;

  }

  public saveBudgetService() {
    if (this.validSaveBudgetService()) {
      const { value } = this.formBudgetService;

      this.budgetServiceItem.companyId = this.storageService.companyId;
      this.budgetServiceItem.resaleId = this.storageService.resaleId;
      this.budgetServiceItem.budgetId = this.budget.id;
      this.budgetServiceItem.status = "NotApproved";

      this.budgetServiceItem.ordem = this.getSizeListBudgetService() + 1;
      this.budgetServiceItem.description = value.description;
      this.budgetServiceItem.hourService = value.hourService;
      this.budgetServiceItem.price = value.price;
      this.budgetServiceItem.discount = value.discount;

      this.budgetService.saveBudgetService$(this.budgetServiceItem).subscribe((data) => {
        if (data.status == 201) {
          this.alertShowService0();
          this.getListBudgetSetvice();
          this.cleanBudgetService();
        }
      });

    }

  }

  public updateBudgetService(service: BudgetServiceItem) {

    if (this.validUpdateBudgetService()) {

      this.budgetServiceItem.description = service.description;
      this.budgetServiceItem.hourService = service.hourService;
      this.budgetServiceItem.price = service.price;
      this.budgetServiceItem.discount = service.discount;

      this.budgetService.updateBudgetService$(this.budgetServiceItem).subscribe((data) => {
        if (data.status == 200) {
          this.alertShowService1();
          this.getListBudgetSetvice();
          this.cleanBudgetService();
        }
      });
    }

  }

  private validSaveBudgetService() {
    const { value, valid } = this.formBudgetService;

    if (!this.validInput()) {
      return false;
    }

    if (value.discount > 0) {
      const newDiscount = this.totalBudgetDiscountService() + value.discount;
      const newTotal = this.totalBudgetService() + (value.price * value.hourService);
      const percent = (newTotal * this.storageService.limitDiscount) / 100;
      if (newDiscount > percent) {
        this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
        return false;
      }
      this.progressTotal = (newDiscount * 100) / percent;
      if (this.progressTotal > this.percentAletDiscount) {
        this.infoPercenDiscount();
      }
    }
    if (!valid) {
      return false;
    }

    return true;
  }

  private validUpdateBudgetService(): boolean {
    const { value, valid } = this.formBudgetService;

    if (!this.validInput()) {
      return false;
    }

    if (value.discount > 0) {
      var newDiscount = value.discount;
      var newTotal = (value.price * value.hourService);

      var tempTotal = 0;
      var tempDiscount = 0;
      for (let index = 0; index < this.listBudgetService.length; index++) {
        const item = this.listBudgetService[index];

        if (item.id != this.budgetServiceItem.id) {
          tempTotal += item.price * item.hourService;
          tempDiscount += item.discount;
        }

      }
      newTotal += tempTotal;
      newDiscount += tempDiscount;
      const percent = (newTotal * this.storageService.limitDiscount) / 100;
      if (newDiscount > percent) {
        this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
        return false;
      }
      this.progressTotal = (newDiscount * 100) / percent;
      if (this.progressTotal > this.percentAletDiscount) {
        this.infoPercenDiscount();
      }
    }
    return true;
  }

  private validInput(): boolean {

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

    this.budgetServiceItem.companyId = service.companyId;
    this.budgetServiceItem.resaleId = service.resaleId;
    this.budgetServiceItem.budgetId = this.budget.id;
    this.budgetServiceItem.id = service.id;
    this.budgetServiceItem.status = service.status;
    this.budgetServiceItem.ordem = service.ordem;

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
    this.budgetServiceItem = new BudgetServiceItem();
  }

  private somaService() {
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

  removerBudgetService(ordem: number) {

    var listTemp: BudgetServiceItem[] = [];

    for (let index = 0; index < this.listBudgetService.length; index++) {

      const item = this.listBudgetService.at(index);

      if (ordem == item.ordem) {

        this.budgetServiceItem.companyId = item.companyId;
        this.budgetServiceItem.resaleId = item.resaleId;
        this.budgetServiceItem.id = item.id;
        this.budgetServiceItem.budgetId = item.budgetId;
        this.budgetServiceItem.status = item.status;
        this.budgetServiceItem.ordem = item.ordem;
        this.budgetServiceItem.description = item.description;
        this.budgetServiceItem.hourService = item.hourService;
        this.budgetServiceItem.price = item.price;
        this.budgetServiceItem.discount = item.discount;

        this.budgetService.deleteBudgetService$(this.budgetServiceItem).subscribe();
        this.cleanBudgetService();

      } else {
        listTemp.push(item);
      }

    }
    this.listBudgetService = [];

    this.totalBudgetService.set(0);
    this.totalBudgetDiscountService.set(0);

    for (let index = 0; index < listTemp.length; index++) {
      const item = listTemp.at(index);

      item.ordem = index + 1;
      this.budgetService.updateBudgetService$(item).subscribe((data) => {
        if (data.status == 200) {
          this.getListBudgetSetvice();
        }
      });
    }

  }

  deleteAllDiscountService() {
    if (this.totalBudgetDiscountService() > 0) {
      this.budgetService.deleteDiscountAllService$(this.listBudgetService[0]).subscribe((data) => {
        if (data.status == 200) {
          this.getListBudgetSetvice();
          this.alertShowDiscount2();
        }
      });
      this.cleanFormDiscount();
    }
  }

  private validDiscountService(): boolean {

    const { value } = this.formDiscount;
    if (value.servVal <= 0 && value.servPer <= 0) { return false; }

    const limit = this.storageService.limitDiscount;
    const valueLimitDisc = (this.totalBudgetService() * limit) / 100;
    const newValueDiscountPerc = ((this.totalBudgetService() * value.servPer) / 100) + this.totalBudgetDiscountService();
    const newValueDiscount = this.totalBudgetDiscountService() + value.servVal;

    if (this.totalBudgetDiscountService() == valueLimitDisc) {
      this.progressTotal = 100;
      this.infoPercenDiscount();
      return false;
    }

    if (newValueDiscount > valueLimitDisc) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
      return false;
    }

    if (newValueDiscountPerc > valueLimitDisc) {
      this.messageService.add({ severity: 'error', summary: 'Desconto', detail: 'Maior que o permitido', icon: 'pi pi-times' });
      return false;
    }

    return true;

  }

  public addDiscountAllService() {

    if (this.validDiscountService()) {

      const { value } = this.formDiscount;

      var discount = 0;
      var discountResto = 0;

      //Desconto serviço percentual
      if (value.servPer > 0) {
        const newDiscount = ((this.totalBudgetService() * value.servPer) / 100) + this.totalBudgetDiscountService();
        discountResto = newDiscount % this.listBudgetService.length;
        discount = (newDiscount - discountResto) / this.listBudgetService.length;
      }

      //Desconto serviço valor
      if (value.servVal > 0) {
        const newDiscount = this.totalBudgetDiscountService() + value.servVal;
        discountResto = newDiscount % this.listBudgetService.length;
        discount = (newDiscount - discountResto) / this.listBudgetService.length;
      }

      for (let index = 0; index < this.listBudgetService.length; index++) {
        var element = this.listBudgetService[index];
        //Last Discount
        if (index == this.listBudgetService.length - 1) {
          element.discount = discount + discountResto;
          this.budgetService.updateBudgetService$(element).subscribe(async (data) => {
            if (data.status == 200) {
              this.messageService.add({ severity: 'success', summary: 'Desconto', detail: 'Aplicado com sucesso', icon: 'pi pi-check' });
              const result = await this.getListBudgetSetvice();

              const percent = (this.totalBudgetService() * this.limitUserDiscount()) / 100;
              this.progressTotal = (this.totalBudgetDiscountService() * 100) / percent;
              if (this.progressTotal > this.percentAletDiscount) {
                this.infoPercenDiscount();
              }
            };
          });

        } else {
          element.discount = discount;
          this.budgetService.updateBudgetService$(element).subscribe();
        }

      }

      this.cleanFormDiscount();
    }

  }

  private cleanFormDiscount() {
    this.formDiscount.patchValue({ servPer: 0, servVal: 0, itemPer: 0, itemVal: 0 });
  }

  onCloseAlertDiscount() {
    this.visibleDiscount = false;
  }

  private infoPercenDiscount() {

    if (!this.visibleDiscount) {
      this.messageService.add({ key: 'toastInfoDiscount', sticky: true, severity: 'custom', summary: 'Você atingiu.' });
      this.visibleDiscount = true;
      this.progressDiscount = 0;

      if (this.intervalDiscount) {
        clearInterval(this.intervalDiscount);
      }

      this.intervalDiscount = setInterval(() => {
        if (this.progressDiscount < this.progressTotal) {
          this.progressDiscount = this.progressDiscount + 2;
        }

        if (this.progressDiscount >= 100) {
          this.progressDiscount = 100;
          clearInterval(this.intervalDiscount);
        }

        this.cdr.markForCheck();
      }, 10);
    }

  }

  //Parts
  private async getListBudgetItem(): Promise<boolean> {
    try {
      var data = await lastValueFrom(this.budgetService.getBudgetItem$(this.budget.id));

      this.listBudgetItem = data;
      this.somaBudgetItem();
      return true;
    } catch (error) {
      this.getListBudgetItem();
    }
    return false;

  }
  private somaBudgetItem() {
    this.totalBudgetParts.set(0);
    var tempTotalParts = 0;

    this.totalBudgetDiscountParts.set(0);
    var tempTotalDiscount = 0;

    for (let index = 0; index < this.listBudgetItem.length; index++) {
      const element = this.listBudgetItem[index];
      tempTotalParts += element.price;
      tempTotalDiscount += element.discount;
    }

    this.totalBudgetParts.set(tempTotalParts);
    this.totalBudgetDiscountParts.set(tempTotalDiscount);
  }
  showDialogParts() {
    this.visibleParts = true;
  }
  hideDialogParts() {
    this.visibleParts = false;
  }
  private PartsDisable() {
    this.formParts.get('selecQtdAvailable').disable();
    this.formParts.get('selecPrice').disable();
    this.formParts.get('selecDiscount').disable();
  }
  private PartsEnable() {
    this.formParts.get('selecQtdAvailable').enable();
    this.formParts.get('selecPrice').enable();
    this.formParts.get('selecDiscount').enable();
  }
  onSelectEventParts(event: any) {
    this.formParts.patchValue({
      selecDesc: this.selectedParts.description,
      selecQtdAvailable: 0,
      selecDiscount: 0,
      selecPrice: this.selectedParts.price,

    });
    this.partsDisabledButton = false;
    this.PartsEnable();
  }
  onUnSelectEventParts(event: any) {
    this.formParts.patchValue({
      selecDesc: "",
      selecQtdAvailable: 0,
      selecPrice: 0,
      selecDiscount: 0
    })
    this.partsDisabledButton = true;


    this.PartsDisable();

  }
  cleanParts() {
    this.formParts.patchValue({
      filterCode: "",
      filterDesc: "",
      selecDesc: "",
      selecQtdAvailable: 0,
      selecPrice: 0,
      selecDiscount: 0
    })
    this.selectedParts = null;
    this.partsDisabledButton = true;
  }
  public async filterParts() {
    this.busyService.busy();

    this.listParts = [];
    const { value } = this.formParts;

    if (value.filterCode != '') {
      const partsResult = await this.getPartsFilterCode(value.filterCode);
      if (partsResult.status == 200) {
        this.listParts = partsResult.body;
      }

    } else if (value.filterDesc != '') {
      const partsResult = await this.getPartsFilterDesc(value.filterDesc);
      if (partsResult.status == 200) {
        this.listParts = partsResult.body;
      }
    }
    this.busyService.idle();
  }
  private async getPartsFilterCode(code: string): Promise<HttpResponse<Part[]>> {
    try {
      return await lastValueFrom(this.partsService.getExternalFilterCode$(code));
    } catch (error) {
      return error;
    }
  }
  private async getPartsFilterDesc(desc: string): Promise<HttpResponse<Part[]>> {
    try {
      return await lastValueFrom(this.partsService.getExternalFilterDesc$(desc));
    } catch (error) {
      return error;
    }
  }
  public async selectPartsConfirme() {
    const { value } = this.formParts;

    if (this.selectedParts == null) {
      this.messageService.add({ severity: 'error', summary: 'Peças', detail: 'Não selecionada', icon: 'pi pi-times' });
    } else if (value.selecQtdAvailable <= 0) {
      this.messageService.add({ severity: 'info', summary: 'Quantidade', detail: 'Não informada' });
    } else if (value.selecPrice <= 0) {
      this.messageService.add({ severity: 'info', summary: 'Preço', detail: 'Não informado' });
    } else if (value.selecDiscount < 0) {
      this.messageService.add({ severity: 'error', summary: 'Disconto', detail: 'Inválido', icon: 'pi pi-times' });
    } else if (value.selecDiscount > (value.selecQtdAvailable * value.selecPrice)) {
      this.messageService.add({ severity: 'error', summary: 'Disconto', detail: 'Inválido', icon: 'pi pi-times' });
    } else {

      this.selectedParts.companyId = this.storageService.companyId;
      this.selectedParts.resaleId = this.storageService.resaleId;
      this.selectedParts.status = "ativo";
      const resultPart = await this.savePart(this.selectedParts);

      this.selectedParts.qtdAvailable = value.selecQtdAvailable;
      this.selectedParts.discount = value.selecDiscount;
      this.selectedParts.price = value.selecPrice;

      var budgetItem: BudgetItem = new BudgetItem();
      budgetItem.companyId = this.selectedParts.companyId;
      budgetItem.resaleId = this.selectedParts.resaleId;
      budgetItem.partId = this.selectedParts.id;
      budgetItem.budgetId = this.budget.id;
      budgetItem.status = "Pending";
      budgetItem.ordem = this.listBudgetItem.length + 1;
      budgetItem.code = this.selectedParts.code;
      budgetItem.description = value.selecDesc;
      budgetItem.quantity = value.selecQtdAvailable;
      budgetItem.discount = value.selecDiscount;
      budgetItem.price = value.selecPrice;

      const resultItem = await this.saveBudgetItem(budgetItem);
      if (resultItem.status == 201) {
        this.hideDialogParts();
        await this.getListBudgetItem();
        this.cleanParts();
      }


    }

  }
  private async savePart(part: Part): Promise<HttpResponse<Part>> {
    try {
      return await lastValueFrom(this.partsService.save(part))
    } catch (error) {
      return error;
    }
  }
  private async saveBudgetItem(item: BudgetItem): Promise<HttpResponse<BudgetServiceItem>> {
    try {
      return await lastValueFrom(this.budgetService.saveBudgetItem(item));
    } catch (error) {
      return error;
    }
  }

 async deleteBudgetItem(item: BudgetItem) {
    const resultItem = await this.deleteItem(item);
    if(resultItem.status == 200){
      this.messageService.add({ severity: 'success', summary: 'Peças', detail: 'Removido com sucesso', icon: 'pi pi-check' });
      this.getListBudgetItem();
    }
  }

  private async deleteItem(item: BudgetItem): Promise<HttpResponse<BudgetServiceItem>> {
    try {
      return await lastValueFrom(this.budgetService.deleteBudgetItem(item))
    } catch (error) {
      return error;
    }
  }

  alertShowDiscount2() {
    this.messageService.add({ severity: 'success', summary: 'Desconto', detail: 'Removido com sucesso', icon: 'pi pi-check' });
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


}
