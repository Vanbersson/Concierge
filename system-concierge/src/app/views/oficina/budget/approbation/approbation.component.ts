import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'

//PrimeNG
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';


import { ActivatedRoute, Router } from '@angular/router';
import { EmailClientService } from '../../../../services/email/email-client.service';
import { lastValueFrom } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { MessageResponse } from '../../../../models/message/message-response';
import { BusyService } from '../../../../components/loading/busy.service';
import { Budget } from '../../../../models/budget/budget';
import { BudgetRequisition } from '../../../../models/budget/budget-requisition';
import { BudgetServiceItem } from '../../../../models/budget/budget-item-service';
import { BudgetItem } from '../../../../models/budget/budget-item';
import { ClientCompany } from '../../../../models/clientcompany/client-company';
import { VehicleEntry } from '../../../../models/vehicle/vehicle-entry';
import { PrintBudgetComponent } from '../../../../components/print.budget/print.budget.component';

@Component({
  selector: 'app-approbation',
  standalone: true,
  imports: [CommonModule, ButtonModule, ToastModule,PrintBudgetComponent],
  templateUrl: './approbation.component.html',
  styleUrl: './approbation.component.scss',
  providers: [MessageService]
})
export default class ApprobationComponent implements OnInit {
  private token: string = "";
  enabledSendApprobation = false;
  dateApprobation: Date = new Date();

  budget: Budget = new Budget();
  listBudgetRequisition: BudgetRequisition[] = [];
  listBudgetServiceItem: BudgetServiceItem[] = [];
  listBudgetItem: BudgetItem[] = [];
  clientCompany: ClientCompany = new ClientCompany();
  vehicleEntry: VehicleEntry = new VehicleEntry();

  totalService: number;
  totalServiceDiscount: number;
  totalPart: number;
  totalPartDiscount: number;
  totalGeral: number;

  //Print
  @ViewChild("printComponent") printComponent!: PrintBudgetComponent;

  constructor(private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private busyService: BusyService,
    private emailClientService: EmailClientService) { }
  ngOnInit(): void {
    console.log()

    this.valid();
  }
  formatNumberBudget(id: number): string {

    var code = "";

    if (id.toString().length == 1) {
      code = "00000" + id;
    } else if (id.toString().length == 2) {
      code = "0000" + id;
    } else if (id.toString().length == 3) {
      code = "000" + id;
    } else if (id.toString().length == 4) {
      code = "00" + id;
    } else if (id.toString().length == 5) {
      code = "0" + id;
    } else if (id.toString().length >= 6) {
      code = id.toString();
    }

    return code;
  }
  maskPlaca(placa: string): string {
    if (placa == "") return "";
    return placa.substring(0, 3) + "-" + placa.substring(3, 7);
  }
  maskCNPJ(cnpj: string): string {
    const CNPJ = cnpj.substring(0, 2) + "." + cnpj.substring(2, 5) + "." + cnpj.substring(5, 8) + "/" + cnpj.substring(8, 12) + "-" + cnpj.substring(12, 14);
    return CNPJ;
  }
  maskCPF(cpf: string): string {
    const CPF = cpf.substring(0, 3) + "." + cpf.substring(3, 6) + "." + cpf.substring(6, 9) + "-" + cpf.substring(9, 11);
    return CPF;
  }

  async valid() {
    this.busyService.busy();
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
    const resultValid = await this.validTokenEmail(this.token);
    if (resultValid.status == 200) {
      this.busyService.idle();

      this.budget = resultValid.body['Budget'];

      this.listBudgetRequisition = resultValid.body['BudgetItemRequisition'];

      this.listBudgetServiceItem = resultValid.body['BudgetItemService'];

      this.listBudgetItem = resultValid.body['BudgetItemPart'];

      this.clientCompany = resultValid.body['Client'];

      this.vehicleEntry = resultValid.body['Vehicle'];


      this.totalService = 0;
      this.totalServiceDiscount = 0;
      this.totalPart = 0;
      this.totalPartDiscount = 0;
      this.totalGeral = 0;

      for (var service of this.listBudgetServiceItem) {
        this.totalService += service.price * service.hourService;
        this.totalServiceDiscount += service.discount;
      }

      for (var part of this.listBudgetItem) {
        this.totalPart += part.price * part.quantity;
        this.totalPartDiscount += part.discount;
      }

      if ((this.totalPart - this.totalPartDiscount) >= (this.totalService - this.totalServiceDiscount)) {
        this.totalGeral = (this.totalPart - this.totalPartDiscount) + (this.totalService - this.totalServiceDiscount);
      } else {
        this.totalGeral = (this.totalService - this.totalServiceDiscount) + (this.totalPart - this.totalPartDiscount);
      }

    } else {
      this.busyService.idle();
      this.router.navigateByUrl("/not-found");
    }
  }


  private async validTokenEmail(token: string): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.emailClientService.validTokenEmail(token));
    } catch (error) {
      return error;
    }
  }

  async approbation() {
    const resultApprobation = await this.statusUpdateBudget();
    if (resultApprobation.status == 200) {
      this.messageService.add({ severity: 'success', summary: 'Aprovação', detail: 'Orçamento aprovado com sucesso', icon: 'pi pi-check', life: 3000 });
      this.enabledSendApprobation = true;
    } else {

    }


  }

  private async statusUpdateBudget(): Promise<HttpResponse<MessageResponse>> {
    try {
      return await lastValueFrom(this.emailClientService.statusUpdateBudget(this.token));
    } catch (error) {
      return error;
    }
  }
  //Print Budget
  print() {
    try {
      this.printComponent.print(this.budget, this.listBudgetRequisition, this.listBudgetServiceItem, this.listBudgetItem, this.clientCompany, this.vehicleEntry);
    } catch (error) {
      console.log(error)
    }
  }
}
