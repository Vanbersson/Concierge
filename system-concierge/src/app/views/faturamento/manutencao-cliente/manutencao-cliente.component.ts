import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DividerModule } from 'primeng/divider';


import { ClientCompany } from '../../../models/clientcompany/client-company';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITypeClient } from '../../../interfaces/clientcompany/itype-client';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { MessageResponse } from '../../../models/message/message-response';
import { SuccessError } from '../../../models/enum/success-error';
import { BudgetService } from '../../../services/budget/budget.service';
import { BusyService } from '../../../components/loading/busy.service';
import { FisJurEnum } from '../../../models/clientcompany/fisjur-enum';
import { CliForEnum } from '../../../models/clientcompany/clifor-enum';
import { CEPService } from '../../../services/cep/cep.service';
import { ClientCategoryService } from '../../../services/clientecompany/client-category.service';
import { ClientCategory } from '../../../models/clientcompany/client-category';
import { ClientCompanyService } from '../../../services/clientecompany/client-company.service';
import { StorageService } from '../../../services/storage/storage.service';
import { StatusEnum } from '../../../models/enum/status-enum';

@Component({
  selector: 'app-manutencao-cliente',
  standalone: true,
  imports: [CommonModule, TabViewModule, ButtonModule, InputTextModule, TableModule,
    MultiSelectModule, InputNumberModule, IconFieldModule, InputIconModule, DialogModule, DividerModule,
    InputMaskModule, InputGroupModule, ConfirmDialogModule, ToastModule, RadioButtonModule,
    ReactiveFormsModule],
  templateUrl: './manutencao-cliente.component.html',
  styleUrl: './manutencao-cliente.component.scss',
  providers: [ConfirmationService, MessageService]
})
export default class ManutencaoClienteComponent implements OnInit {

  categories: ClientCategory[] = [];
  clifor: ITypeClient[] = [];
  clients: ClientCompany[] = [];
  client: ClientCompany;
  fisica = FisJurEnum.FISICA;
  juridica = FisJurEnum.JURIDICA;
  outras = FisJurEnum.OUTRAS;
  isClientNew = true;
  formClient = new FormGroup({
    id: new FormControl<number | null>({ value: null, disabled: true }),
    fantasia: new FormControl<string>(""),
    name: new FormControl<string>("", Validators.required),
    category: new FormControl<ClientCategory[]>([], Validators.required),
    clifor: new FormControl<ITypeClient[]>([], Validators.required),
    fisjur: new FormControl<string>(FisJurEnum.FISICA),
    cnpj: new FormControl<string>(""),
    cpf: new FormControl<string>(""),
    rg: new FormControl<string | null>(null),
    ie: new FormControl<string>(""),
    im: new FormControl<string>(""),
    dddPhone: new FormControl<string | null>(null),
    phone: new FormControl<string | null>(null),
    dddCellphone: new FormControl<string | null>(null),
    cellphone: new FormControl<string | null>(null),
    emailHome: new FormControl<string>(""),
    emailWork: new FormControl<string>(""),
    zipCode: new FormControl<string>("", Validators.required),
    address: new FormControl<string>("", Validators.required),
    addressNumber: new FormControl<string | null>(null),
    state: new FormControl<string>("", Validators.required),
    city: new FormControl<string>("", Validators.required),
    neighborhood: new FormControl<string>("", Validators.required),
    addressComplement: new FormControl<string>(""),
    contactName: new FormControl<string>(""),
    contactEmail: new FormControl<string>(""),
    contactDDDPhone: new FormControl<string | null>(null),
    contactPhone: new FormControl<string | null>(null),
    contactDDDCellphone: new FormControl<string | null>(null),
    contactCellphone: new FormControl<string | null>(null),
  });
  formClientFilter = new FormGroup({
    id: new FormControl<number | null>(null),
    fantasia: new FormControl<string>(""),
    name: new FormControl<string>(""),
    cnpj: new FormControl<string>(""),
    cpf: new FormControl<string>(""),
    fisjur: new FormControl<string>(""),
    clifor: new FormControl<string>(""),
  });
  //Dialog edit
  visibleDialog: boolean = false;
  showJuridica = false;
  showFisica = false;
  editCNPJCPF = true;
  //Dialog filter
  visibleDialogFilter: boolean = false;

  constructor(
    private storageService: StorageService,
    private categoryService: ClientCategoryService,
    private cepService: CEPService,
    private busyService: BusyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private clientService: ClientCompanyService) {
  }

  ngOnInit(): void {
    this.clifor = [
      { type: CliForEnum.CLIENTE, value: CliForEnum.CLIENTE },
      { type: CliForEnum.FORNECEDOR, value: CliForEnum.FORNECEDOR },
      { type: CliForEnum.AMBOS, value: CliForEnum.AMBOS }];
    this.init();
  }

  async init() {
    //Show load
    this.busyService.busy();
    const result = await this.listAll();
    if (result.status == 200 && result.body.status == SuccessError.succes) {
      this.clients = result.body.data;
    }

    const resultCate = await this.listAllCategories();
    this.categories = resultCate;
    //Close load
    this.busyService.idle();
  }

  changeType() {
    if (this.formClient.value.fisjur == FisJurEnum.JURIDICA) {
      this.showJuridica = true;
      this.showFisica = false;
      this.addValidCNPJ();
      this.removeValidCPF();
      this.formClient.patchValue({ cnpj: "" });
    } else if (this.formClient.value.fisjur == FisJurEnum.FISICA) {
      this.showFisica = true;
      this.showJuridica = false;
      this.addValidCPF();
      this.removeValidCNPJ();
      this.formClient.patchValue({ cpf: "" });
    } else if (this.formClient.value.fisjur == FisJurEnum.OUTRAS) {
      this.showFisica = true;
      this.showJuridica = false;
      this.removeValidCNPJ();
      this.removeValidCPF();
      this.formClient.patchValue({ cpf: "00000000000" });
    }
  }
  private async listAll(): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.listAll());
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private addValidCNPJ() {
    this.formClient.controls['cnpj'].addValidators(Validators.required);
    this.formClient.controls['cnpj'].updateValueAndValidity();
  }
  private removeValidCNPJ() {
    this.formClient.controls['cnpj'].removeValidators(Validators.required);
    this.formClient.controls['cnpj'].updateValueAndValidity();
  }
  private addValidCPF() {
    this.formClient.controls['cpf'].addValidators(Validators.required);
    this.formClient.controls['cpf'].updateValueAndValidity();
  }
  private removeValidCPF() {
    this.formClient.controls['cpf'].removeValidators(Validators.required);
    this.formClient.controls['cpf'].updateValueAndValidity();
  }
  maskCNPJ(cnpj: string): string {
    if (cnpj == "") return "";
    const CNPJ = cnpj.substring(0, 2) + "." + cnpj.substring(2, 5) + "." + cnpj.substring(5, 8) + "/" + cnpj.substring(8, 12) + "-" + cnpj.substring(12, 14);
    return CNPJ;
  }
  maskCPF(cpf: string): string {
    if (cpf == "") return "";
    const CPF = cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-" + cpf.substring(9, 11);
    return CPF;
  }
  showDialog() {
    this.cleanFormClient();
    this.visibleDialog = true;
  }
  hideDialog() {
    this.visibleDialog = false;
  }
  showDialogFilter() {
    this.visibleDialogFilter = true;
  }
  hideDialogFilter() {
    this.visibleDialogFilter = false;
  }
  newClient() {
    this.showDialog();
    this.enableClientCnpj();
    this.enableClientCpf();
    this.isClientNew = true;
    this.client = new ClientCompany();
    this.editCNPJCPF = true;
    //habilita o tipo de cliente
    this.formClient.get("fisjur").enable();

    //Começa na aba PF
    this.showFisica = true;
    this.showJuridica = false;
    this.addValidCPF();
    this.removeValidCNPJ();
  }
  save() {
    if (this.isClientNew) {
      this.saveNewClient();
    } else {
      this.saveUpdateClient();
    }
  }

  private async saveNewClient() {
    const { value, valid } = this.formClient;
    if (!valid) {
      return;
    }

    this.client.companyId = this.storageService.companyId;
    this.client.resaleId = this.storageService.resaleId;
    this.client.state = StatusEnum.ENABLED;
    this.client.name = value.name;
    this.client.fantasia = value.fantasia;
    this.client.categoryId = value.category.at(0).id;
    this.client.clifor = this.getCliFor(value.clifor.at(0).value);
    this.client.fisjur = this.getFisJur(value.fisjur);
    this.client.dddPhone = value.dddPhone != null ? value.dddPhone : "";
    this.client.phone = value.phone != null ? value.phone : "";
    this.client.dddCellphone = value.dddCellphone != null ? value.dddCellphone : "";
    this.client.cellphone = value.cellphone != null ? value.cellphone : "";
    this.client.emailHome = value.emailHome;
    this.client.emailWork = value.emailWork;
    this.client.zipCode = value.zipCode;
    this.client.address = value.address;
    this.client.addressNumber = value.addressNumber != null ? value.addressNumber : "";
    this.client.city = value.city;
    this.client.state = value.state;
    this.client.neighborhood = value.neighborhood;
    this.client.addressComplement = value.addressComplement;
    this.client.cnpj = value.cnpj;
    this.client.cpf = value.cpf;
    this.client.rg = value.rg;
    this.client.contactName = value.contactName;
    this.client.contactEmail = value.contactEmail;
    this.client.contactDDDPhone = value.contactDDDPhone != null ? value.contactDDDPhone : "";
    this.client.contactPhone = value.contactPhone != null ? value.contactPhone : "";
    this.client.contactDDDCellphone = value.contactDDDCellphone != null ? value.contactDDDCellphone : "";
    this.client.contactCellphone = value.contactCellphone != null ? value.contactCellphone : "";

    const result = await this.saveClient(this.client);
    if (result.status == 201 && result.body.status == SuccessError.succes) {
      this.client.id = result.body.data.id;
      this.formClient.patchValue({ id: result.body.data.id });
      this.messageService.add({ severity: 'success', summary: result.body.header, detail: result.body.message, icon: 'pi pi-check' });
    }
    if (result.status == 201 && result.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: result.body.header, detail: result.body.message, icon: 'pi pi-info-circle' });

    }
  }

  async editClient(cli: ClientCompany) {
    const resultFilter = await this.filterIdClient(cli.id);
    if (resultFilter.status == 200 && resultFilter.body.status == SuccessError.succes) {
      cli = resultFilter.body.data;
      //this.messageService.add({ severity: 'success', summary: resultFilter.body.header, detail: resultFilter.body.message, icon: 'pi pi-check' });
    }
    if (resultFilter.status == 200 && resultFilter.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: resultFilter.body.header, detail: resultFilter.body.message, icon: 'pi pi-info-circle' });
      return;
    }
    this.disableClientId();
    this.disableClientCnpj();
    this.disableClientCpf();

    this.showDialog();
    this.isClientNew = false;
    this.editCNPJCPF = false;

    this.client = cli;
    //desabilita o tipo de cliente
    this.formClient.get("fisjur").disable();

    if (this.client.fisjur == FisJurEnum.JURIDICA) {
      this.showJuridica = true;
      this.showFisica = false;
      this.addValidCNPJ();
      this.removeValidCPF();
    } else if (this.client.fisjur == FisJurEnum.FISICA) {
      this.showFisica = true;
      this.showJuridica = false;
      this.addValidCPF();
      this.removeValidCNPJ();
    } else if (this.client.fisjur == FisJurEnum.OUTRAS) {
      this.showFisica = true;
      this.showJuridica = false;
      this.removeValidCNPJ();
      this.removeValidCPF();
    }

    this.formClient.patchValue({
      id: cli.id,
      fantasia: cli.fantasia,
      name: cli.name,
      category: [this.filterIdCategory(this.client.categoryId)],
      clifor: [{ type: cli.clifor, value: cli.clifor }],
      fisjur: cli.fisjur,
      cnpj: cli.cnpj,
      ie: cli.ie,
      im: cli.im,
      cpf: cli.cpf,
      rg: cli.rg != "" ? cli.rg : null,
      dddPhone: cli.dddPhone != "" ? cli.dddPhone : null,
      phone: cli.phone != "" ? cli.phone : null,
      dddCellphone: cli.dddCellphone != "" ? cli.dddCellphone : null,
      cellphone: cli.cellphone != "" ? cli.cellphone : null,
      emailHome: cli.emailHome,
      emailWork: cli.emailWork,
      zipCode: cli.zipCode,
      address: cli.address,
      addressNumber: cli.addressNumber != "" ? cli.addressNumber : null,
      state: cli.state,
      city: cli.city,
      neighborhood: cli.neighborhood,
      addressComplement: cli.addressComplement,
      contactName: cli.contactName,
      contactEmail: cli.contactEmail,
      contactDDDPhone: cli.contactDDDPhone != "" ? cli.contactDDDPhone : null,
      contactPhone: cli.contactPhone != "" ? cli.contactPhone : null,
      contactDDDCellphone: cli.contactDDDCellphone != "" ? cli.contactDDDCellphone : null,
      contactCellphone: cli.contactCellphone != "" ? cli.contactCellphone : null,
    });

  }
  async saveUpdateClient() {
    this.enableClientCnpj();
    this.enableClientCpf();

    const { value, valid } = this.formClient;
    if (!valid) {
      this.disableClientCnpj();
      this.disableClientCpf();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Cadastro inválido", icon: 'pi pi-times' });
      return;
    }

    this.client.name = value.name;
    this.client.fantasia = value.fantasia;
    this.client.categoryId = value.category.at(0).id;
    this.client.clifor = this.getCliFor(value.clifor.at(0).value);
    this.client.fisjur = this.getFisJur(value.fisjur);
    this.client.dddPhone = value.dddPhone != null ? value.dddPhone : "";
    this.client.phone = value.phone != null ? value.phone : "";
    this.client.dddCellphone = value.dddCellphone != null ? value.dddCellphone : "";
    this.client.cellphone = value.cellphone != null ? value.cellphone : "";
    this.client.emailHome = value.emailHome;
    this.client.emailWork = value.emailWork;
    this.client.zipCode = value.zipCode;
    this.client.address = value.address;
    this.client.addressNumber = value.addressNumber != null ? value.addressNumber : "";;
    this.client.city = value.city;
    this.client.state = value.state;
    this.client.neighborhood = value.neighborhood;
    this.client.addressComplement = value.addressComplement;
    this.client.cnpj = value.cnpj;
    this.client.cpf = value.cpf;
    this.client.rg = value.rg;
    this.client.contactName = value.contactName;
    this.client.contactEmail = value.contactEmail;
    this.client.contactDDDPhone = value.contactDDDPhone != null ? value.contactDDDPhone : "";
    this.client.contactPhone = value.contactPhone != null ? value.contactPhone : "";
    this.client.contactDDDCellphone = value.contactDDDCellphone != null ? value.contactDDDCellphone : "";
    this.client.contactCellphone = value.contactCellphone != null ? value.contactCellphone : "";
    //Show load
    this.busyService.busy();
    const resultClient = await this.updateClient(this.client);
    if (resultClient.status == 200 && resultClient.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: resultClient.body.header, detail: resultClient.body.message, icon: 'pi pi-check' });
    } else if (resultClient.status == 200 && resultClient.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: resultClient.body.header, detail: resultClient.body.message, icon: 'pi pi-info-circle' });
    }
    //close load
    this.busyService.idle();

    this.disableClientCnpj();
    this.disableClientCpf();
    this.editCNPJCPF = false;
  }
  private async saveClient(client: ClientCompany): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.save(client));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async filterIdClient(id: number): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.filterId(id));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  private async updateClient(client: ClientCompany): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clientService.update(client));
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: error.error.message, icon: 'pi pi-times' });
      return error;
    }
  }
  cleanFormClient() {
    this.formClient.patchValue({
      id: null,
      name: "",
      fantasia: "",
      category: [],
      clifor: [],
      fisjur: FisJurEnum.FISICA,
      cnpj: "",
      cpf: "",
      rg: null,
      dddPhone: null,
      phone: null,
      dddCellphone: null,
      cellphone: null,
      emailHome: "",
      emailWork: "",
      zipCode: null,
      address: "",
      addressNumber: null,
      state: "",
      city: "",
      neighborhood: "",
      addressComplement: "",
      contactName: "",
      contactEmail: "",
      contactDDDPhone: null,
      contactPhone: null,
      contactDDDCellphone: null,
      contactCellphone: null,
    });
  }
  cleanFormFilter() {
    this.formClientFilter.patchValue({
      id: null,
      fantasia: "",
      name: "",
      cnpj: "",
      cpf: "",
      fisjur: "",
      clifor: ""
    });
  }
  confirm(value: string) {
    this.confirmationService.confirm({
      header: 'Alterar ' + value + '?',
      message: 'Por favor comfirme para alterar.',
      acceptLabel: 'Comfirmar',
      accept: () => {
        if (value == "CNPJ") {
          this.enableClientCnpj();
        }
        if (value == "CPF") {
          this.enableClientCpf();
        }
        this.editCNPJCPF = true;
      }
    });
  }

  //Aba Dados
  enableClientId() {
    this.formClient.get("id").enable();
  }
  disableClientId() {
    this.formClient.get("id").disable();
  }
  enableClientCnpj() {
    this.formClient.get("cnpj").enable();
  }
  disableClientCnpj() {
    this.formClient.get("cnpj").disable();
  }
  enableClientCpf() {
    this.formClient.get("cpf").enable();
  }
  disableClientCpf() {
    this.formClient.get("cpf").disable();
  }

  public async searchCEP() {
    if (!this.formClient.get('zipCode').value) {
      return;
    }
    const result = await this.cep(this.formClient.get('zipCode').value);

    if (result.status == 200) {
      this.formClient.patchValue({
        address: result.body.logradouro,
        addressComplement: result.body.complemento,
        state: result.body.uf,
        city: result.body.localidade,
        neighborhood: result.body.bairro
      });
    }

  }
  private async cep(cep: string): Promise<HttpResponse<any>> {
    try {
      return await lastValueFrom(this.cepService.search(cep));
    } catch (error) {
      return error;
    }
  }

  private async listAllCategories(): Promise<ClientCategory[]> {
    try {
      return await lastValueFrom(this.categoryService.listAll());
    } catch (error) {
      return []
    }
  }

  private filterIdCategory(id: number): ClientCategory {
    return this.categories.find(c => c.id === id);
  }

  getCliFor(value: string): CliForEnum {
    if (value == CliForEnum.CLIENTE)
      return CliForEnum.CLIENTE;
    if (value == CliForEnum.FORNECEDOR)
      return CliForEnum.FORNECEDOR;

    return CliForEnum.AMBOS;
  }

  getFisJur(value: string): FisJurEnum {
    if (value == FisJurEnum.FISICA)
      return FisJurEnum.FISICA;
    if (value == FisJurEnum.JURIDICA)
      return FisJurEnum.JURIDICA;

    return FisJurEnum.OUTRAS;
  }


}
