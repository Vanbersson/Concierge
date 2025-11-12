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
import { ClientecompanyService } from '../../../services/clientecompany/clientecompany.service';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITypeClient } from '../../../interfaces/clientcompany/itype-client';
import { HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ClientFisJurEnum } from '../../../models/clientcompany/client-fisjur-enum';
import { MessageResponse } from '../../../models/message/message-response';
import { SuccessError } from '../../../models/enum/success-error';
import { BudgetService } from '../../../services/budget/budget.service';
import { BusyService } from '../../../components/loading/busy.service';

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
export default class ManutencaoClienteComponent implements OnInit, OnDestroy, DoCheck {

  clifor: ITypeClient[] = [];
  fisjur: ITypeClient[] = [];
  clients: ClientCompany[] = [];
  client: ClientCompany;
  isClientNew = true;
  formClient = new FormGroup({
    id: new FormControl<number | null>(null),
    fantasia: new FormControl<string>(""),
    name: new FormControl<string>("", Validators.required),
    clifor: new FormControl<ITypeClient[]>([], Validators.required),
    fisjur: new FormControl<ITypeClient[]>([], Validators.required),
    cnpj: new FormControl<string>(""),
    cpf: new FormControl<string>(""),
    rg: new FormControl<string>(""),
    dddPhone: new FormControl<number | null>(null),
    phone: new FormControl<number | null>(null),
    dddCellphone: new FormControl<number | null>(null),
    cellphone: new FormControl<number | null>(null),
    emailHome: new FormControl<string>(""),
    emailWork: new FormControl<string>(""),
    zipCode: new FormControl<string>("", Validators.required),
    address: new FormControl<string>("", Validators.required),
    addressNumber: new FormControl<number | null>(null),
    state: new FormControl<string>("", Validators.required),
    city: new FormControl<string>("", Validators.required),
    neighborhood: new FormControl<string>("", Validators.required),
    addressComplement: new FormControl<string>(""),
    contactName: new FormControl<string>(""),
    contactEmail: new FormControl<string>(""),
    contactDDDPhone: new FormControl<number | null>(null),
    contactPhone: new FormControl<number | null>(null),
    contactDDDCellphone: new FormControl<number | null>(null),
    contactCellphone: new FormControl<number | null>(null),
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
    private busyService: BusyService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private clienteService: ClientecompanyService) {
  }
  ngDoCheck(): void {
    if (this.formClient.value.fisjur.at(0)) {
      if (this.formClient.value.fisjur.at(0)?.type == "Jurídica") {
        this.showJuridica = true;
        this.showFisica = false;
      } else if (this.formClient.value.fisjur.at(0)?.type == "Física") {
        this.showFisica = true;
        this.showJuridica = false;
      }
    } else {
      this.showJuridica = false;
      this.showFisica = false;
    }
  }
  ngOnInit(): void {
    this.clifor = [{ type: 'Cliente', value: 'Cliente' }, { type: 'Fornecedor', value: 'Fornecedor' }, { type: 'Ambos', value: 'Ambos' }];
    this.fisjur = [{ type: 'Jurídica', value: 'Jurídica' }, { type: 'Física', value: 'Física' }];
    this.init();
  }
  ngOnDestroy(): void {
  }
  async init() {
    //Show load
    this.busyService.busy();
    const result = await this.listAll();
    if (result.status == 200 && result.body.status == SuccessError.succes) {
      this.clients = result.body.data;
    }
    //Close load
    this.busyService.idle();
  }
  private async listAll(): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clienteService.listAll());
    } catch (error) {
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
   // this.editCNPJCPF = true;
  }
  saveClient() {
    if (this.isClientNew) {
      this.saveNewClient();
    } else {
      this.update();
    }
  }

  private async saveNewClient() {

  }

  editClient(cli: ClientCompany) {

    this.disableClientId();
    this.disableClientCnpj();
    this.disableClientCpf();

    this.showDialog();
    this.isClientNew = false;
    this.editCNPJCPF = false;

    this.client = cli;

    this.formClient.patchValue({
      id: cli.id,
      fantasia: cli.fantasia,
      name: cli.name,
      clifor: [{ type: cli.clifor, value: cli.clifor }],
      fisjur: [{ type: cli.fisjur, value: cli.fisjur }],
      cnpj: cli.cnpj,
      cpf: cli.cpf,
      rg: cli.rg,
      dddPhone: cli.dddPhone != "" ? Number.parseInt(cli.dddPhone) : null,
      phone: cli.phone != "" ? Number.parseInt(cli.phone) : null,
      dddCellphone: cli.dddCellphone != "" ? Number.parseInt(cli.dddCellphone) : null,
      cellphone: cli.cellphone != "" ? Number.parseInt(cli.cellphone) : null,
      emailHome: cli.emailHome,
      emailWork: cli.emailWork,
      zipCode: cli.zipCode,
      address: cli.address,
      addressNumber: cli.addressNumber != "" ? Number.parseInt(cli.addressNumber) : null,
      state: cli.state,
      city: cli.city,
      neighborhood: cli.neighborhood,
      addressComplement: cli.addressComplement,
      contactName: cli.contactName,
      contactEmail: cli.contactEmail,
      contactDDDPhone: cli.contactDDDPhone != "" ? Number.parseInt(cli.contactDDDPhone) : null,
      contactPhone: cli.contactPhone != "" ? Number.parseInt(cli.contactPhone) : null,
      contactDDDCellphone: cli.contactDDDCellphone != "" ? Number.parseInt(cli.contactDDDCellphone) : null,
      contactCellphone: cli.contactCellphone != "" ? Number.parseInt(cli.contactCellphone) : null,
    });

    if (this.client.fisjur == ClientFisJurEnum.fisica) {
      this.addValidCPF();
      this.removeValidCNPJ();
    } else {
      this.addValidCNPJ();
      this.removeValidCPF();
    }
  }
  async update() {
    this.enableClientCnpj();
    this.enableClientCpf();

    const { value, valid } = this.formClient;
    if (!valid) {
      this.disableClientCnpj();
      this.disableClientCpf();
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: "Cadastro inválido", icon: 'pi pi-times' });
      return;
    }

    //Show load
    this.busyService.busy();

    this.client.name = value.name;
    this.client.fantasia = value.fantasia;
    this.client.clifor = value.clifor.at(0).value;
    this.client.fisjur = value.fisjur.at(0).value;
    this.client.dddPhone = value.dddPhone != null ? value.dddPhone.toString() : "";
    this.client.phone = value.phone != null ? value.phone.toString() : "";
    this.client.dddCellphone = value.dddCellphone != null ? value.dddCellphone.toString() : "";
    this.client.cellphone = value.cellphone != null ? value.cellphone.toString() : "";
    this.client.emailHome = value.emailHome;
    this.client.emailWork = value.emailWork;
    this.client.zipCode = value.zipCode;
    this.client.address = value.address;
    this.client.addressNumber = value.addressNumber.toString();
    this.client.city = value.city;
    this.client.state = value.state;
    this.client.neighborhood = value.neighborhood;
    this.client.addressComplement = value.addressComplement;
    this.client.cnpj = value.cnpj;
    this.client.cpf = value.cpf;
    this.client.rg = value.rg;
    this.client.contactName = value.contactName;
    this.client.contactEmail = value.contactEmail;
    this.client.contactDDDPhone = value.contactDDDPhone != null ? value.contactDDDPhone.toString() : "";
    this.client.contactPhone = value.contactPhone != null ? value.contactPhone.toString() : "";
    this.client.contactDDDCellphone = value.contactDDDCellphone != null ? value.contactDDDCellphone.toString() : "";
    this.client.contactCellphone = value.contactCellphone != null ? value.contactCellphone.toString() : "";

    const resultClient = await this.updateClient();
    if (resultClient.status == 200 && resultClient.body.status == SuccessError.succes) {
      this.messageService.add({ severity: 'success', summary: resultClient.body.header, detail: resultClient.body.message, icon: 'pi pi-check' });
    } else if (resultClient.status == 200 && resultClient.body.status == SuccessError.error) {
      this.messageService.add({ severity: 'info', summary: resultClient.body.header, detail: resultClient.body.message, icon: 'pi pi-info-circle' });
    }

    this.disableClientCnpj();
    this.disableClientCpf();
    this.editCNPJCPF = false;

    //close load
    this.busyService.idle();
  }
  private async updateClient(): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.clienteService.update(this.client));
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
      clifor: [],
      fisjur: [],
      cnpj: "",
      cpf: "",
      rg: "",
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


}
